-- Migration 0008 — business_type on owner_profiles
-- Run in Supabase → SQL Editor.

alter table public.owner_profiles
  add column if not exists business_type text
    check (business_type in ('airbnb', 'house_cleaning', 'hybrid'))
    default 'hybrid';

-- Existing accounts keep "hybrid" (= everything visible) so nothing regresses.
