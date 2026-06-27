-- Migration 0034 — owner branding (primary + secondary colors + dedicated logo bucket)
-- Adds two color columns on owner_profiles for the white-label branding page
-- (/owner/branding) and provisions an `owner-logos` storage bucket so the
-- new uploader has somewhere to live independently of the older
-- `business-logos` bucket from migration 0014. The defaults are the Portal
-- Home cyan + blue used throughout the marketing site.

alter table public.owner_profiles
  add column if not exists brand_primary_color text default '#22d3ee',
  add column if not exists brand_secondary_color text default '#2563eb';

-- New dedicated bucket for branding logos uploaded from /owner/branding.
-- Public-read so the logo can be rendered for clients without an auth round-trip.
insert into storage.buckets (id, name, public)
values ('owner-logos', 'owner-logos', true)
on conflict (id) do nothing;

-- Anyone can read owner logos (they appear in the client portal header)
drop policy if exists "Public read owner logos" on storage.objects;
create policy "Public read owner logos"
  on storage.objects for select
  using (bucket_id = 'owner-logos');

-- Owners can upload/update/delete only inside their own folder (owner_id/...)
drop policy if exists "Owners can upload own owner-logo" on storage.objects;
create policy "Owners can upload own owner-logo"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'owner-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Owners can update own owner-logo" on storage.objects;
create policy "Owners can update own owner-logo"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'owner-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Owners can delete own owner-logo" on storage.objects;
create policy "Owners can delete own owner-logo"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'owner-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
