-- Migration 0001 (marketing) — admin panel for portalservices.digital
-- Run this in the SAME Supabase project as the home-cleaner-services app.

-- ============================================================================
-- MARKETING_CONTENT: every editable marketing-page section as a single JSONB
-- blob keyed by section. Lets us evolve the shape per-section without schema
-- migrations every time we add a field.
-- ============================================================================
create table if not exists public.marketing_content (
  section text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.marketing_content enable row level security;

-- Public read: the live site reads via service-role on the server, but we also
-- allow anon read so we could use it from client components if we want.
drop policy if exists "public read marketing content" on public.marketing_content;
create policy "public read marketing content" on public.marketing_content
  for select to anon, authenticated using (true);

-- ============================================================================
-- MARKETING_ADMINS: allowlist of emails that can log into /hq.
-- Anyone authenticating with Supabase but not in this table is rejected.
-- ============================================================================
create table if not exists public.marketing_admins (
  email text primary key,
  name text,
  created_at timestamptz not null default now()
);

alter table public.marketing_admins enable row level security;
-- Only service-role can read this table (server checks happen there)
drop policy if exists "admins self read" on public.marketing_admins;
create policy "admins self read" on public.marketing_admins for select
  using (auth.jwt() ->> 'email' = email);

-- Seed your own email here so you can log in. REPLACE before running:
insert into public.marketing_admins (email, name)
values ('portalservicesdigital@gmail.com', 'Mauricio')
on conflict (email) do nothing;

-- ============================================================================
-- MARKETING_LEADS: capture demo / contact-form submissions from the public site
-- ============================================================================
create table if not exists public.marketing_leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  phone text,
  company text,
  interest text,
  message text,
  source text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  -- new = unread, contacted = reached out, qualified = sales-ready, archived
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'archived')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_marketing_leads_status_created
  on public.marketing_leads (status, created_at desc);

alter table public.marketing_leads enable row level security;
-- Public inserts (the demo form posts as anon). Reads are server-only.
drop policy if exists "anyone can submit a lead" on public.marketing_leads;
create policy "anyone can submit a lead" on public.marketing_leads for insert
  to anon, authenticated with check (true);
