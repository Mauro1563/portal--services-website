-- ============================================================================
-- Portal Services Digital · combined migrations bundle
-- ============================================================================
-- Pegar en Supabase → SQL Editor → New query → Run.
-- Todas las sentencias son idempotentes (create if not exists, drop if exists),
-- así que puedes ejecutar este bloque entero sin miedo a duplicar.
-- Si alguna tabla/columna ya existe en tu base, simplemente se salta.
-- ============================================================================



-- ============================================================================
-- 0001_marketing_admin.sql
-- ============================================================================
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


-- ============================================================================
-- 0002_add_admin_mauro541423.sql
-- ============================================================================
-- Migration 0002 — add personal Gmail to the HQ admin allowlist.
-- Run this once in the Supabase SQL editor (or via supabase db push).
-- After running, mauro541423@gmail.com can log into /hq/login via magic link.

insert into public.marketing_admins (email, name)
values ('mauro541423@gmail.com', 'Mauricio')
on conflict (email) do nothing;


-- ============================================================================
-- 0013_property_and_task_metadata.sql
-- ============================================================================
-- Migration 0003 — extra metadata for the redesigned UI
-- Run this in Supabase → SQL Editor

-- Properties: platform, guest count, floor area
alter table public.properties
  add column if not exists platform text check (platform in ('airbnb','booking','direct','other')),
  add column if not exists guests int,
  add column if not exists floor_area_sqm int;

-- Tasks: estimated duration (minutes), so the operative knows how long the
-- job is supposed to take before they start.
alter table public.tasks
  add column if not exists estimated_duration_min int;

comment on column public.properties.platform is 'Listing platform: airbnb | booking | direct | other';
comment on column public.properties.guests is 'Max guest capacity, displayed on property detail';
comment on column public.properties.floor_area_sqm is 'Floor area in square metres';
comment on column public.tasks.estimated_duration_min is 'Manager-set estimate of how long the cleaning should take';


-- ============================================================================
-- 0014_owner_profile.sql
-- ============================================================================
-- Migration 0004 — owner profile (business name + logo)
-- Run in Supabase → SQL Editor.

create table if not exists public.owner_profiles (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  business_name text,
  business_logo_url text,
  updated_at timestamptz not null default now()
);

alter table public.owner_profiles enable row level security;

drop policy if exists "Owners can read own profile" on public.owner_profiles;
create policy "Owners can read own profile"
  on public.owner_profiles for select
  using (auth.uid() = owner_id);

drop policy if exists "Owners can upsert own profile" on public.owner_profiles;
create policy "Owners can upsert own profile"
  on public.owner_profiles for insert
  with check (auth.uid() = owner_id);

drop policy if exists "Owners can update own profile" on public.owner_profiles;
create policy "Owners can update own profile"
  on public.owner_profiles for update
  using (auth.uid() = owner_id);

-- Storage bucket for business logos (public read)
insert into storage.buckets (id, name, public)
values ('business-logos', 'business-logos', true)
on conflict (id) do nothing;

-- Anyone can read logos (they're displayed in the public splash and dashboard)
drop policy if exists "Public read business logos" on storage.objects;
create policy "Public read business logos"
  on storage.objects for select
  using (bucket_id = 'business-logos');

-- Owners can upload only into their own folder (owner_id/)
drop policy if exists "Owners can upload own logo" on storage.objects;
create policy "Owners can upload own logo"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'business-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Owners can update own logo" on storage.objects;
create policy "Owners can update own logo"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'business-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Owners can delete own logo" on storage.objects;
create policy "Owners can delete own logo"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'business-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );


-- ============================================================================
-- 0015_clients_services_ratings.sql
-- ============================================================================
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


-- ============================================================================
-- 0016_task_photos.sql
-- ============================================================================
-- Migration 0006 — multi-photo per task
-- Run in Supabase → SQL Editor.

create table if not exists public.task_photos (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  cleaner_id uuid references public.cleaners(id) on delete set null,
  url text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_task_photos_task on public.task_photos (task_id);
create index if not exists idx_task_photos_owner on public.task_photos (owner_id);

alter table public.task_photos enable row level security;

-- Owner can read photos of their tasks
drop policy if exists "owner reads own task photos" on public.task_photos;
create policy "owner reads own task photos" on public.task_photos for select
  using (auth.uid() = owner_id);

-- Cleaners insert via admin client (service role bypasses RLS)
-- No write policy needed for authenticated owners — they don't upload, the
-- cleaner does via the operative app.


-- ============================================================================
-- 0017_public_business_profile.sql
-- ============================================================================
-- Migration 0007 — public business profile + photo portfolio
-- Run in Supabase → SQL Editor.

-- Extend owner_profiles with everything needed to render a public landing
-- page for the business.
alter table public.owner_profiles
  add column if not exists slug text unique,
  add column if not exists tagline text,
  add column if not exists about text,
  add column if not exists service_area text,
  add column if not exists phone text,
  add column if not exists website text,
  add column if not exists instagram text,
  add column if not exists hero_color text default '#0F1729',
  add column if not exists is_public_profile boolean not null default false;

create index if not exists idx_owner_profiles_slug on public.owner_profiles (slug)
  where slug is not null;

-- Allow ANYONE (even anon visitors) to read profiles flagged public.
drop policy if exists "public read public profiles" on public.owner_profiles;
create policy "public read public profiles" on public.owner_profiles for select
  to anon, authenticated
  using (is_public_profile = true);

-- Flag photos that can be used in the public portfolio
alter table public.task_photos
  add column if not exists is_public_portfolio boolean not null default false;

-- Anyone can read photos flagged as portfolio
drop policy if exists "public read portfolio photos" on public.task_photos;
create policy "public read portfolio photos" on public.task_photos for select
  to anon, authenticated
  using (is_public_portfolio = true);

-- Anyone can read ratings flagged is_public (testimonials)
drop policy if exists "public read public ratings" on public.task_ratings;
create policy "public read public ratings" on public.task_ratings for select
  to anon, authenticated
  using (is_public = true);

-- Anyone can read service catalogue items belonging to owners with a public
-- profile (services aren't sensitive — only structure)
drop policy if exists "public read services of public owners" on public.service_types;
create policy "public read services of public owners" on public.service_types for select
  to anon, authenticated
  using (
    is_active = true
    and exists (
      select 1 from public.owner_profiles op
      where op.owner_id = service_types.owner_id and op.is_public_profile = true
    )
  );


-- ============================================================================
-- 0018_business_type.sql
-- ============================================================================
-- Migration 0008 — business_type on owner_profiles
-- Run in Supabase → SQL Editor.

alter table public.owner_profiles
  add column if not exists business_type text
    check (business_type in ('airbnb', 'house_cleaning', 'hybrid'))
    default 'hybrid';

-- Existing accounts keep "hybrid" (= everything visible) so nothing regresses.


-- ============================================================================
-- 0019_client_messages_referrals.sql
-- ============================================================================
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


-- ============================================================================
-- 0020_task_time_payment.sql
-- ============================================================================
-- Migration 0010 — task scheduling time + payment block

-- Hora de inicio del turno (opcional). Si null, la tarea es "todo el día".
alter table public.tasks
  add column if not exists start_time time without time zone;

-- Estado y detalles de pago
alter table public.tasks
  add column if not exists payment_status text
    not null default 'pending'
    check (payment_status in ('pending', 'paid', 'partial', 'waived'));

alter table public.tasks
  add column if not exists payment_method text;
-- payment_method libre (efectivo, tarjeta, transferencia, bacs, etc.)
-- así no tenemos que migrar el enum cuando el dueño quiera añadir un nuevo método.

alter table public.tasks
  add column if not exists paid_at timestamptz;

alter table public.tasks
  add column if not exists paid_amount_pence int;
-- Permite registrar pagos parciales: si paid_amount_pence < price_pence,
-- el dueño puede dejar payment_status = 'partial'.

create index if not exists idx_tasks_payment_status
  on public.tasks (payment_status)
  where payment_status != 'paid';


-- ============================================================================
-- 0021_referral_rewards.sql
-- ============================================================================
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


-- ============================================================================
-- 0022_marketing_branding_logo.sql
-- ============================================================================
-- Storage bucket for the marketing site's main logo (uploaded from /hq/branding).
-- Public read so the logo can be served without auth.
insert into storage.buckets (id, name, public)
values ('marketing-assets', 'marketing-assets', true)
on conflict (id) do nothing;

drop policy if exists "public read marketing-assets" on storage.objects;
create policy "public read marketing-assets" on storage.objects
  for select using (bucket_id = 'marketing-assets');

drop policy if exists "marketing admins upload" on storage.objects;
create policy "marketing admins upload" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'marketing-assets'
    and exists (
      select 1 from public.marketing_admins ma
      where ma.email = auth.jwt() ->> 'email'
    )
  );

drop policy if exists "marketing admins update" on storage.objects;
create policy "marketing admins update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'marketing-assets'
    and exists (
      select 1 from public.marketing_admins ma
      where ma.email = auth.jwt() ->> 'email'
    )
  );
