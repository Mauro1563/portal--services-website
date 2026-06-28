-- Migration 0037 — Zapli unified schema
-- Supports BOTH residential home cleaning AND Airbnb short-term-rental flows
-- in the same database, with a strict role enum and per-row RLS.
--
-- Apply via: Supabase Dashboard → SQL Editor → paste & run.

-- ---------------------------------------------------------------------------
-- 1. Role enum + user_profiles table
-- ---------------------------------------------------------------------------
-- Supabase auth.users is the source of truth for identity, so we keep roles
-- on a public.user_profiles row keyed by auth.users.id. This avoids touching
-- the auth schema while still giving us a typed `role` column.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('host', 'cleaner', 'admin', 'supervisor');
  end if;
end$$;

create table if not exists public.user_profiles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  role       public.user_role not null default 'host',
  full_name  text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_user_profiles_role on public.user_profiles (role);

alter table public.user_profiles enable row level security;

drop policy if exists "Users can read own profile" on public.user_profiles;
create policy "Users can read own profile"
  on public.user_profiles for select
  using (auth.uid() = user_id);

drop policy if exists "Users can upsert own profile" on public.user_profiles;
create policy "Users can upsert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own profile" on public.user_profiles;
create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = user_id);

drop policy if exists "Admins can read all profiles" on public.user_profiles;
create policy "Admins can read all profiles"
  on public.user_profiles for select
  using (
    exists (
      select 1 from public.user_profiles p
      where p.user_id = auth.uid() and p.role = 'admin'
    )
  );

-- Helper: current user's role (security definer so it can read its own table
-- without recursing through RLS).
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.user_profiles where user_id = auth.uid();
$$;

comment on type  public.user_role is 'Zapli account role: host (property owner), cleaner (operative), admin, supervisor';
comment on table public.user_profiles is 'Per-user app metadata linked to auth.users; carries role + display name';

-- ---------------------------------------------------------------------------
-- 2. properties — residential vs Airbnb + iCal feed
-- ---------------------------------------------------------------------------
-- The existing `platform` column tracks the listing source ('airbnb',
-- 'booking', 'direct', 'other'). The new `property_type` is the flow toggle
-- — residential homes use the legacy cleaning UI, airbnb_rental properties
-- unlock iCal sync, photo enforcement, and turnover scheduling.

alter table public.properties
  add column if not exists property_type      text not null default 'residential_home',
  add column if not exists ical_url           text,
  add column if not exists ical_last_sync_at  timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'properties_property_type_chk'
  ) then
    alter table public.properties
      add constraint properties_property_type_chk
      check (property_type in ('residential_home', 'airbnb_rental'));
  end if;
end$$;

create index if not exists idx_properties_property_type
  on public.properties (property_type);

comment on column public.properties.property_type     is 'Flow toggle: residential_home | airbnb_rental';
comment on column public.properties.ical_url          is 'Airbnb (or other STR) iCal feed URL; NULL for residential homes';
comment on column public.properties.ical_last_sync_at is 'Last successful iCal pull timestamp';

-- ---------------------------------------------------------------------------
-- 3. tasks — checklist + required photo count
-- ---------------------------------------------------------------------------
-- checklist holds an ordered array of items:
--   [{ "key": "kitchen",   "label": "Kitchen cleaned",
--      "done": true,       "doneAt": "2026-06-28T10:21:00Z",
--      "doneByUserId": "uuid-of-cleaner" }, ...]
-- required_photos is enforced in the app layer before a task can transition
-- to 'done' (Airbnb turnovers typically require 4 photos minimum).

alter table public.tasks
  add column if not exists checklist        jsonb   not null default '[]'::jsonb,
  add column if not exists required_photos  integer not null default 0;

create index if not exists idx_tasks_checklist_gin
  on public.tasks using gin (checklist);

comment on column public.tasks.checklist       is 'Array of {key,label,done,doneAt?,doneByUserId?} items the cleaner ticks off';
comment on column public.tasks.required_photos is 'Minimum number of task_photos required before completion (Airbnb=4, residential typically 0)';

-- ---------------------------------------------------------------------------
-- 4. RLS — role-aware policies on properties and tasks
-- ---------------------------------------------------------------------------
-- Rules:
--   admin     → full read across both tables
--   host      → their own properties (owner_id = auth.uid()) and tasks
--               attached to those properties
--   cleaner   → only tasks where tasks.cleaner_id maps to their own
--               public.cleaners row (cleaners.user_id = auth.uid()); read
--               access to the parent property is granted via the same join
--   supervisor→ same as host for now (extend later)
--
-- We DROP-then-CREATE so re-running the migration is safe.

alter table public.properties enable row level security;
alter table public.tasks      enable row level security;

-- ---- properties ------------------------------------------------------------
drop policy if exists "properties owner read"      on public.properties;
drop policy if exists "properties owner write"     on public.properties;
drop policy if exists "properties admin read"      on public.properties;
drop policy if exists "properties cleaner read"    on public.properties;

create policy "properties owner read"
  on public.properties for select
  using (auth.uid() = owner_id);

create policy "properties owner write"
  on public.properties for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "properties admin read"
  on public.properties for select
  using (public.current_user_role() = 'admin');

-- Cleaner can read any property they currently have a task on.
create policy "properties cleaner read"
  on public.properties for select
  using (
    exists (
      select 1
      from public.tasks t
      join public.cleaners c on c.id = t.cleaner_id
      where t.property_id = public.properties.id
        and c.user_id = auth.uid()
    )
  );

-- ---- tasks -----------------------------------------------------------------
drop policy if exists "tasks owner read"   on public.tasks;
drop policy if exists "tasks owner write"  on public.tasks;
drop policy if exists "tasks admin read"   on public.tasks;
drop policy if exists "tasks cleaner read" on public.tasks;
drop policy if exists "tasks cleaner update" on public.tasks;

-- Host sees / mutates tasks on properties they own.
create policy "tasks owner read"
  on public.tasks for select
  using (
    exists (
      select 1 from public.properties p
      where p.id = public.tasks.property_id
        and p.owner_id = auth.uid()
    )
  );

create policy "tasks owner write"
  on public.tasks for all
  using (
    exists (
      select 1 from public.properties p
      where p.id = public.tasks.property_id
        and p.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.properties p
      where p.id = public.tasks.property_id
        and p.owner_id = auth.uid()
    )
  );

-- Admin sees everything.
create policy "tasks admin read"
  on public.tasks for select
  using (public.current_user_role() = 'admin');

-- Cleaner only sees tasks assigned to them.
create policy "tasks cleaner read"
  on public.tasks for select
  using (
    exists (
      select 1 from public.cleaners c
      where c.id = public.tasks.cleaner_id
        and c.user_id = auth.uid()
    )
  );

-- Cleaner can update their own task (e.g. tick checklist, mark done) but
-- cannot reassign it to someone else — the cleaner_id must stay theirs.
create policy "tasks cleaner update"
  on public.tasks for update
  using (
    exists (
      select 1 from public.cleaners c
      where c.id = public.tasks.cleaner_id
        and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.cleaners c
      where c.id = public.tasks.cleaner_id
        and c.user_id = auth.uid()
    )
  );
