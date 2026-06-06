-- Migration 0011 — referral rewards the owner can define & edit
-- Run in Supabase → SQL Editor.

-- ============================================================================
-- REFERRAL_REWARDS: the menu of rewards each owner offers for referrals.
-- The client portal shows the active ones; the owner manages them from
-- /owner/referrals.
-- ============================================================================
create table if not exists public.referral_rewards (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  description text,
  -- free_cleaning   = a free visit
  -- percent_discount = a % off the next cleaning (uses `percent`)
  -- custom          = free-text reward defined by the owner
  kind text not null default 'custom'
    check (kind in ('free_cleaning', 'percent_discount', 'custom')),
  percent int check (percent is null or (percent between 1 and 100)),
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_referral_rewards_owner
  on public.referral_rewards (owner_id, sort_order);

alter table public.referral_rewards enable row level security;

drop policy if exists "owner manages own referral rewards" on public.referral_rewards;
create policy "owner manages own referral rewards" on public.referral_rewards
  for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);
-- The client portal reads active rewards via the service-role admin client.

-- ============================================================================
-- REFERRALS: link each recorded referral to the reward that was granted.
-- (referrals table itself was created in migration 0009.)
-- ============================================================================
alter table public.referrals
  add column if not exists reward_id uuid
    references public.referral_rewards(id) on delete set null;
