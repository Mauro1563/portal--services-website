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
