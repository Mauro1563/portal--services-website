-- Phase 3 — Stripe payment fields on bookings.
-- The migration is additive: only adds nullable columns.

alter table public.bookings
  add column if not exists stripe_checkout_session_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists paid_at timestamptz;

create index if not exists idx_bookings_stripe_session
  on public.bookings(stripe_checkout_session_id);
create index if not exists idx_bookings_stripe_subscription
  on public.bookings(stripe_subscription_id);
