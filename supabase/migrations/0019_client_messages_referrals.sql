-- Migration 0009 — client messages, testimonials feed, referrals with codes
-- Run in Supabase → SQL Editor.

-- ============================================================================
-- CLIENT_MESSAGES: in-portal chat between client and owner
-- ============================================================================
create table if not exists public.client_messages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  -- 'client' = sent by the client through the magic-link portal
  -- 'owner'  = sent by the cleaning-business owner from their dashboard
  sender text not null check (sender in ('client', 'owner')),
  body text not null check (char_length(body) between 1 and 4000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_client_messages_client
  on public.client_messages (client_id, created_at desc);
create index if not exists idx_client_messages_owner_unread
  on public.client_messages (owner_id, read_at)
  where sender = 'client' and read_at is null;

alter table public.client_messages enable row level security;
drop policy if exists "owner reads own client messages" on public.client_messages;
create policy "owner reads own client messages" on public.client_messages for select
  using (auth.uid() = owner_id);
drop policy if exists "owner writes own client messages" on public.client_messages;
create policy "owner writes own client messages" on public.client_messages for all
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
-- Client inserts/reads happen via service-role admin client (magic-link flow)

-- ============================================================================
-- REFERRALS: trackable share codes per client
-- ============================================================================
alter table public.clients
  add column if not exists referral_code text unique,
  add column if not exists referred_by_client_id uuid references public.clients(id) on delete set null;

-- Backfill referral_code for existing rows
update public.clients
   set referral_code = lower(substr(encode(gen_random_bytes(6), 'hex'), 1, 10))
 where referral_code is null;

-- Going forward, default new rows to a generated code
alter table public.clients
  alter column referral_code set default lower(substr(encode(gen_random_bytes(6), 'hex'), 1, 10));

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  referrer_client_id uuid not null references public.clients(id) on delete cascade,
  -- The code that was used (denormalised so analytics survive code rotation)
  code text not null,
  recipient_name text,
  recipient_contact text,
  -- pending = link opened, no booking yet
  -- booked  = recipient became a client
  -- rewarded = referrer received their reward
  status text not null default 'pending' check (status in ('pending', 'booked', 'rewarded')),
  created_at timestamptz not null default now()
);

create index if not exists idx_referrals_owner on public.referrals (owner_id);
create index if not exists idx_referrals_referrer on public.referrals (referrer_client_id);
create index if not exists idx_referrals_code on public.referrals (code);

alter table public.referrals enable row level security;
drop policy if exists "owner reads own referrals" on public.referrals;
create policy "owner reads own referrals" on public.referrals for select
  using (auth.uid() = owner_id);
drop policy if exists "owner writes own referrals" on public.referrals;
create policy "owner writes own referrals" on public.referrals for all
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
