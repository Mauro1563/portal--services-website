-- 0035_tips_and_rates.sql
--
-- Adds tip + per-task / per-property / per-cleaner rate fields to support
-- a split economic model between owner (business) and cleaner.
--
-- Rate-split model:
--   Cleaner earns:
--     actual_hours
--       * COALESCE(tasks.cleaner_pay_rate_pence, cleaners.default_hourly_pay_pence)
--       + tasks.tip_pence
--
--   Owner revenue (what the client is billed):
--     actual_hours
--       * COALESCE(tasks.charge_rate_pence, properties.default_charge_rate_pence)
--
--   Owner profit:
--     revenue - (actual_hours * pay_rate)
--     -- Tips go straight to the cleaner; the owner does NOT take a cut of tips.
--
-- All monetary values are stored in integer pence (>= 0).
-- actual_hours is cleaner-reported and stored as NUMERIC(4,2) (e.g. 2.75).

-- ---------------------------------------------------------------------------
-- tasks: per-task overrides and tip
-- ---------------------------------------------------------------------------

ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS tip_pence INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS charge_rate_pence INTEGER NULL,
  ADD COLUMN IF NOT EXISTS cleaner_pay_rate_pence INTEGER NULL,
  ADD COLUMN IF NOT EXISTS actual_hours NUMERIC(4,2) NULL;

ALTER TABLE tasks
  ADD CONSTRAINT tasks_tip_pence_nonneg
    CHECK (tip_pence >= 0);

ALTER TABLE tasks
  ADD CONSTRAINT tasks_charge_rate_pence_nonneg
    CHECK (charge_rate_pence IS NULL OR charge_rate_pence >= 0);

ALTER TABLE tasks
  ADD CONSTRAINT tasks_cleaner_pay_rate_pence_nonneg
    CHECK (cleaner_pay_rate_pence IS NULL OR cleaner_pay_rate_pence >= 0);

ALTER TABLE tasks
  ADD CONSTRAINT tasks_actual_hours_nonneg
    CHECK (actual_hours IS NULL OR actual_hours >= 0);

COMMENT ON COLUMN tasks.tip_pence IS
  'Client tip for this task, in pence. Paid 100% to the cleaner; the owner does not take a cut.';

COMMENT ON COLUMN tasks.charge_rate_pence IS
  'Per-task override of the hourly rate the client is charged, in pence. '
  'When NULL, falls back to properties.default_charge_rate_pence. '
  'Owner revenue = actual_hours * COALESCE(tasks.charge_rate_pence, properties.default_charge_rate_pence).';

COMMENT ON COLUMN tasks.cleaner_pay_rate_pence IS
  'Per-task override of the hourly rate the cleaner is paid for THIS task, in pence. '
  'When NULL, falls back to cleaners.default_hourly_pay_pence. '
  'Cleaner pay = actual_hours * COALESCE(tasks.cleaner_pay_rate_pence, cleaners.default_hourly_pay_pence) + tasks.tip_pence.';

COMMENT ON COLUMN tasks.actual_hours IS
  'Cleaner-reported hours worked on this task (NUMERIC(4,2)). Drives both cleaner pay and owner revenue.';

-- ---------------------------------------------------------------------------
-- cleaners: default hourly pay rate
-- ---------------------------------------------------------------------------

ALTER TABLE cleaners
  ADD COLUMN IF NOT EXISTS default_hourly_pay_pence INTEGER NOT NULL DEFAULT 0;

ALTER TABLE cleaners
  ADD CONSTRAINT cleaners_default_hourly_pay_pence_nonneg
    CHECK (default_hourly_pay_pence >= 0);

COMMENT ON COLUMN cleaners.default_hourly_pay_pence IS
  'Default hourly rate (in pence) the owner pays this cleaner. '
  'Used as the fallback when tasks.cleaner_pay_rate_pence is NULL.';

-- ---------------------------------------------------------------------------
-- properties: default hourly charge rate
-- ---------------------------------------------------------------------------

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS default_charge_rate_pence INTEGER NOT NULL DEFAULT 0;

ALTER TABLE properties
  ADD CONSTRAINT properties_default_charge_rate_pence_nonneg
    CHECK (default_charge_rate_pence >= 0);

COMMENT ON COLUMN properties.default_charge_rate_pence IS
  'Default hourly rate (in pence) the owner charges the client for work at this property. '
  'Used as the fallback when tasks.charge_rate_pence is NULL.';
