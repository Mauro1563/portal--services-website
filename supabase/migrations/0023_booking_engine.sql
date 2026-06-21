-- Phase 1 — Portal Home consumer booking engine.
-- Adds the catalog (booking_services, booking_extras), the pricing
-- config singleton, the per-user address book, the professional roster,
-- and the central bookings table. All ADDITIVE; no existing table is
-- touched. Uses `booking_` prefix on catalog tables to avoid colliding
-- with the multi-tenant `service_types` table from migration 0015.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------
-- Catalog: services (5 fixed product types)
-- ---------------------------------------------------------------
create table if not exists public.booking_services (
  id              uuid primary key default gen_random_uuid(),
  key             text not null unique,
  name_i18n       jsonb not null,
  description_i18n jsonb not null,
  base_price      numeric(10,2) not null,
  active          boolean not null default true,
  sort            integer not null default 0,
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- Catalog: extras (add-ons selectable per booking)
-- ---------------------------------------------------------------
create table if not exists public.booking_extras (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique,
  label_i18n  jsonb not null,
  price       numeric(10,2) not null,
  active      boolean not null default true,
  sort        integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- Singleton: global pricing config (size add-on, bath rate, freq discounts)
-- ---------------------------------------------------------------
create table if not exists public.booking_pricing_config (
  id              uuid primary key default gen_random_uuid(),
  size_add        jsonb not null,
  bath_rate       numeric(10,2) not null,
  freq_discounts  jsonb not null,
  updated_at      timestamptz not null default now()
);

-- Enforce singleton row at the DB layer (only one row ever).
create unique index if not exists booking_pricing_config_singleton
  on public.booking_pricing_config ((true));

-- ---------------------------------------------------------------
-- User address book
-- ---------------------------------------------------------------
create table if not exists public.booking_addresses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  label       text,
  line        text not null,
  lat         numeric(9,6),
  lng         numeric(9,6),
  created_at  timestamptz not null default now()
);
create index if not exists idx_booking_addresses_user on public.booking_addresses(user_id);

-- ---------------------------------------------------------------
-- Professional roster
-- ---------------------------------------------------------------
create table if not exists public.booking_professionals (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  rating      numeric(3,2) not null default 0,
  jobs        integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- Bookings (central table)
-- ---------------------------------------------------------------
create table if not exists public.bookings (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null references auth.users(id) on delete cascade,
  service_id               uuid not null references public.booking_services(id),
  size                     text not null,
  baths                    integer not null,
  extras                   jsonb not null default '[]',
  frequency                text not null,
  date                     date,
  slot                     text,
  address_id               uuid references public.booking_addresses(id),
  price_total              numeric(10,2) not null,
  currency                 text not null default 'EUR',
  status                   text not null default 'pending',
  professional_id          uuid references public.booking_professionals(id),
  stripe_payment_intent    text,
  created_at               timestamptz not null default now()
);
create index if not exists idx_bookings_user on public.bookings(user_id);
create index if not exists idx_bookings_status on public.bookings(status);
create index if not exists idx_bookings_date on public.bookings(date);

-- ---------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------

-- Catalog tables: public read, service_role write (writes implicit via service_role bypass).
alter table public.booking_services enable row level security;
create policy "booking_services read" on public.booking_services
  for select using (true);

alter table public.booking_extras enable row level security;
create policy "booking_extras read" on public.booking_extras
  for select using (true);

alter table public.booking_pricing_config enable row level security;
create policy "booking_pricing_config read" on public.booking_pricing_config
  for select using (true);

alter table public.booking_professionals enable row level security;
create policy "booking_professionals read" on public.booking_professionals
  for select using (true);

-- Per-user tables: only owner sees / writes own rows.
alter table public.booking_addresses enable row level security;
create policy "booking_addresses own" on public.booking_addresses
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table public.bookings enable row level security;
create policy "bookings own" on public.bookings
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
