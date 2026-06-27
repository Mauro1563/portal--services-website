-- 0036_owner_profile_default_charge_rate.sql
--
-- Adds an organization-level fallback charge rate to owner_profiles.
--
-- Resolution order for the rate the client is charged on a task:
--   1. tasks.charge_rate_pence            (per-task override)
--   2. properties.default_charge_rate_pence (per-property default)
--   3. owner_profiles.default_charge_rate_pence (org-wide fallback)
--
-- All monetary values are stored as integer pence (>= 0).

ALTER TABLE public.owner_profiles
  ADD COLUMN IF NOT EXISTS default_charge_rate_pence INTEGER NULL;

ALTER TABLE public.owner_profiles
  ADD CONSTRAINT owner_profiles_default_charge_rate_pence_nonneg
    CHECK (default_charge_rate_pence IS NULL OR default_charge_rate_pence >= 0);

COMMENT ON COLUMN public.owner_profiles.default_charge_rate_pence IS
  'Org-wide default hourly rate (in pence) the owner charges clients. '
  'Used as the fallback when both tasks.charge_rate_pence and '
  'properties.default_charge_rate_pence are NULL/0.';
