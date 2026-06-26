-- Allow tasks without a property at creation time so the client-side
-- booking flow (status='requested') can insert rows the owner later
-- enriches with property + cleaner assignment.
--
-- house_cleaning tenants often don't model properties at all (they
-- think in clients), so an enforced NOT NULL property_id never made
-- sense for that segment either. Safe to relax.

alter table public.tasks
  alter column property_id drop not null;
