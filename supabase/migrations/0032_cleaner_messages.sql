-- Migration 0032 — cleaner ↔ owner in-portal chat.
-- Mirrors the client_messages table shape so the UX feels identical
-- on both sides: same schema, same RLS model, same realtime channel.

create table if not exists public.cleaner_messages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  cleaner_id uuid not null references public.cleaners(id) on delete cascade,
  -- 'cleaner' = sent from the operative portal (cookie-auth)
  -- 'owner'   = sent from the owner dashboard
  sender text not null check (sender in ('cleaner', 'owner')),
  body text not null check (char_length(body) between 1 and 4000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_cleaner_messages_cleaner
  on public.cleaner_messages (cleaner_id, created_at desc);
create index if not exists idx_cleaner_messages_owner_unread
  on public.cleaner_messages (owner_id, read_at)
  where sender = 'cleaner' and read_at is null;

alter table public.cleaner_messages enable row level security;

drop policy if exists "owner reads own cleaner messages" on public.cleaner_messages;
create policy "owner reads own cleaner messages" on public.cleaner_messages for select
  using (auth.uid() = owner_id);

drop policy if exists "owner writes own cleaner messages" on public.cleaner_messages;
create policy "owner writes own cleaner messages" on public.cleaner_messages for all
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Cleaners authenticate via cookie (no Supabase JWT) so their inserts /
-- selects go through the service-role admin client — same pattern as the
-- magic-link client portal. RLS still protects every other consumer.

-- Realtime: tap into the same publication used by client_messages so the
-- chat updates live on both sides without a poll.
alter publication supabase_realtime add table public.cleaner_messages;
