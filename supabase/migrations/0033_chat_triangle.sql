-- Migration 0033 — unified multi-party "triangle" chat.
--
-- ADDITIVE: leaves client_messages (0019) and cleaner_messages (0032) intact
-- for back-compat. This pair (chat_threads + chat_messages) handles all
-- new conversations: owner ↔ client, owner ↔ cleaner, and the per-task
-- owner ↔ client ↔ cleaner "triangle" anchored on a tasks row.
--
-- Auth model:
--   • owner   → Supabase JWT (auth.uid() = owner_id) — real RLS policy.
--   • client  → magic-link token, validated server-side via
--               getClientByToken(); reads/writes go through
--               createAdminClient() (same pattern as client_messages).
--   • cleaner → cookie session (cookies.cleaner_session), validated in
--               server actions; reads/writes go through createAdminClient()
--               (same pattern as cleaner_messages / operative/chat/actions.ts).
--
-- Only the owner path gets a Postgres policy; the client and cleaner paths
-- are app-enforced via the admin client + their respective auth helpers.
-- DO NOT expose these tables to anon/authed clients without those helpers.

create extension if not exists pgcrypto;

-- ============================================================================
-- chat_threads — one row per conversation. Participants are encoded by
-- which of client_id / cleaner_id is non-null; owner_id is always set.
-- task_id is set only for the triangle (kind = 'client_cleaner' scoped to a
-- specific booking).
-- ============================================================================
do $$
begin
  if not exists (select 1 from pg_type where typname = 'chat_thread_kind') then
    create type chat_thread_kind as enum (
      'client_owner',   -- owner ↔ client direct
      'owner_cleaner',  -- owner ↔ cleaner direct
      'client_cleaner'  -- 3-party (when task_id is set) or client↔cleaner direct
    );
  end if;
end $$;

create table if not exists public.chat_threads (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references auth.users(id) on delete cascade,
  kind            chat_thread_kind not null,
  task_id         uuid references public.tasks(id) on delete cascade,
  client_id       uuid references public.clients(id) on delete cascade,
  cleaner_id      uuid references public.cleaners(id) on delete cascade,
  title           text,
  last_message_at timestamptz,
  created_at      timestamptz not null default now(),
  -- Each kind must carry exactly the right participants.
  constraint chat_threads_shape check (
    (kind = 'client_owner'   and client_id  is not null and cleaner_id is null) or
    (kind = 'owner_cleaner'  and cleaner_id is not null and client_id  is null) or
    (kind = 'client_cleaner' and client_id  is not null and cleaner_id is not null)
  )
);

-- One triangle thread per task — UPSERT target for the "Open task chat" button.
create unique index if not exists uq_chat_threads_task
  on public.chat_threads (task_id)
  where task_id is not null;

-- One direct thread per (owner, client) and (owner, cleaner) pair.
create unique index if not exists uq_chat_threads_client_owner
  on public.chat_threads (owner_id, client_id)
  where kind = 'client_owner';
create unique index if not exists uq_chat_threads_owner_cleaner
  on public.chat_threads (owner_id, cleaner_id)
  where kind = 'owner_cleaner';

-- Inbox lookups: most recent thread first per portal.
create index if not exists idx_chat_threads_owner_last
  on public.chat_threads (owner_id, last_message_at desc nulls last);
create index if not exists idx_chat_threads_client_last
  on public.chat_threads (client_id, last_message_at desc nulls last)
  where client_id is not null;
create index if not exists idx_chat_threads_cleaner_last
  on public.chat_threads (cleaner_id, last_message_at desc nulls last)
  where cleaner_id is not null;

-- ============================================================================
-- chat_messages
-- ============================================================================
do $$
begin
  if not exists (select 1 from pg_type where typname = 'chat_sender_role') then
    create type chat_sender_role as enum ('owner', 'client', 'cleaner');
  end if;
end $$;

create table if not exists public.chat_messages (
  id          uuid primary key default gen_random_uuid(),
  thread_id   uuid not null references public.chat_threads(id) on delete cascade,
  sender_role chat_sender_role not null,
  -- Polymorphic sender — references auth.users for owners, clients or
  -- cleaners for the magic-link / cookie surfaces. Stored as a plain uuid
  -- (no FK) because it points at different tables depending on role; the
  -- sender_role + thread participants are the integrity check.
  sender_id   uuid not null,
  body        text not null check (char_length(body) between 1 and 4000),
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);

-- Fast scroll: most-recent-first within a thread.
create index if not exists idx_chat_messages_thread_created
  on public.chat_messages (thread_id, created_at desc);

-- Unread badge lookup per thread.
create index if not exists idx_chat_messages_thread_unread
  on public.chat_messages (thread_id, read_at)
  where read_at is null;

-- Bump the parent thread's last_message_at on every insert so inbox
-- ordering stays O(1) without an aggregate.
create or replace function public.chat_threads_touch_last_message()
returns trigger
language plpgsql
as $$
begin
  update public.chat_threads
     set last_message_at = new.created_at
   where id = new.thread_id;
  return new;
end
$$;

drop trigger if exists trg_chat_messages_touch on public.chat_messages;
create trigger trg_chat_messages_touch
  after insert on public.chat_messages
  for each row execute function public.chat_threads_touch_last_message();

-- ============================================================================
-- RLS
-- ============================================================================
alter table public.chat_threads  enable row level security;
alter table public.chat_messages enable row level security;

-- Owner — full access to their own threads.
drop policy if exists "owner reads own chat threads" on public.chat_threads;
create policy "owner reads own chat threads"
  on public.chat_threads for select
  using (auth.uid() = owner_id);

drop policy if exists "owner writes own chat threads" on public.chat_threads;
create policy "owner writes own chat threads"
  on public.chat_threads for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Owner — full access to messages in their own threads.
drop policy if exists "owner reads own chat messages" on public.chat_messages;
create policy "owner reads own chat messages"
  on public.chat_messages for select
  using (exists (
    select 1 from public.chat_threads t
     where t.id = chat_messages.thread_id
       and t.owner_id = auth.uid()
  ));

drop policy if exists "owner writes own chat messages" on public.chat_messages;
create policy "owner writes own chat messages"
  on public.chat_messages for all
  using (exists (
    select 1 from public.chat_threads t
     where t.id = chat_messages.thread_id
       and t.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.chat_threads t
     where t.id = chat_messages.thread_id
       and t.owner_id = auth.uid()
  ));

-- Clients (magic-link) and cleaners (cookie session) authenticate outside
-- Supabase, so their reads/writes go through createAdminClient() in a
-- server action that first validates the token / cookie. No anon policy
-- is granted here on purpose — see 0019 and 0032 for the precedent.

-- ============================================================================
-- Realtime — owner & operative surfaces subscribe and refresh on INSERT.
-- The trigger above keeps chat_threads.last_message_at fresh, so adding
-- chat_threads to the publication lets the inbox re-sort live too.
-- ============================================================================
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
     where pubname    = 'supabase_realtime'
       and schemaname = 'public'
       and tablename  = 'chat_messages'
  ) then
    alter publication supabase_realtime add table public.chat_messages;
  end if;

  if not exists (
    select 1 from pg_publication_tables
     where pubname    = 'supabase_realtime'
       and schemaname = 'public'
       and tablename  = 'chat_threads'
  ) then
    alter publication supabase_realtime add table public.chat_threads;
  end if;
end $$;
