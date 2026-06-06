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
