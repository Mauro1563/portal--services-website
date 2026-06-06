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
