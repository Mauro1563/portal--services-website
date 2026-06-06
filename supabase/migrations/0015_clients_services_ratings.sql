-- Migration 0005 — clients, services, ratings (marketplace foundation)
-- Run in Supabase → SQL Editor.

-- ============================================================================
-- CLIENTS: end-customers whose properties get cleaned. Owner-scoped.
-- ============================================================================
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  address text,
  notes text,
  -- Token used in magic-link login. Owner regenerates if compromised.
  access_token text unique default encode(gen_random_bytes(24), 'base64'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_clients_owner on public.clients (owner_id);
create index if not exists idx_clients_token on public.clients (access_token);

alter table public.clients enable row level security;
drop policy if exists "owner reads own clients" on public.clients;
create policy "owner reads own clients" on public.clients for select
  using (auth.uid() = owner_id);
drop policy if exists "owner writes own clients" on public.clients;
create policy "owner writes own clients" on public.clients for all
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- ============================================================================
-- SERVICE TYPES: owner's catalogue (Regular, Deep, Move-out, etc.)
-- Prices in pence to avoid float issues. Duration in minutes.
-- ============================================================================
create table if not exists public.service_types (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  default_duration_min int,
  -- Either a fixed price (price_pence) OR an hourly rate (hourly_rate_pence)
  price_pence int,
  hourly_rate_pence int,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_services_owner on public.service_types (owner_id);

alter table public.service_types enable row level security;
drop policy if exists "owner reads own services" on public.service_types;
create policy "owner reads own services" on public.service_types for select
  using (auth.uid() = owner_id);
drop policy if exists "owner writes own services" on public.service_types;
create policy "owner writes own services" on public.service_types for all
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- ============================================================================
-- TASKS: extend with client_id, service_type_id, price snapshot
-- ============================================================================
alter table public.tasks
  add column if not exists client_id uuid references public.clients(id) on delete set null,
  add column if not exists service_type_id uuid references public.service_types(id) on delete set null,
  add column if not exists service_name text,           -- snapshot at scheduling time
  add column if not exists price_pence int;             -- snapshot at scheduling time

create index if not exists idx_tasks_client on public.tasks (client_id);

-- ============================================================================
-- TASK RATINGS: clients rate completed cleanings (cleaner + overall)
-- ============================================================================
create table if not exists public.task_ratings (
  task_id uuid primary key references public.tasks(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  cleaner_id uuid references public.cleaners(id) on delete set null,
  stars int not null check (stars between 1 and 5),
  comment text,
  -- Public flag — owner can make this a public testimonial
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_ratings_owner on public.task_ratings (owner_id);
create index if not exists idx_ratings_cleaner on public.task_ratings (cleaner_id);
create index if not exists idx_ratings_client on public.task_ratings (client_id);

alter table public.task_ratings enable row level security;
-- Owner reads ratings for tasks they own
drop policy if exists "owner reads own ratings" on public.task_ratings;
create policy "owner reads own ratings" on public.task_ratings for select
  using (auth.uid() = owner_id);
-- Owner can mark ratings public (testimonials)
drop policy if exists "owner updates own ratings" on public.task_ratings;
create policy "owner updates own ratings" on public.task_ratings for update
  using (auth.uid() = owner_id);
-- Service role (used by client-side magic-link flow) handles inserts
-- via admin client (bypasses RLS).
