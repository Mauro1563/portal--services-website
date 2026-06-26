-- Link properties to clients (1 client : N properties).
-- Resolves the hybrid-mode duplication: until now, properties carried
-- their own contact_name/phone/email (PR #13) AND clients carried
-- address/postcode/keys/wifi (PR #36) — two ways to represent the same
-- relationship. With this FK, properties point at the canonical client
-- record and the UIs surface the client's data on the property page
-- instead of duplicating fields.
--
-- Nullable on purpose:
--  - airbnb-only owners often don't track clients at all
--  - existing properties from before this migration won't have a
--    client_id and the legacy contact_* columns keep working
--
-- On client delete: set null instead of cascade so we never lose a
-- property by accident.

alter table public.properties
  add column if not exists client_id uuid
    references public.clients(id) on delete set null;

create index if not exists idx_properties_client on public.properties(client_id);

comment on column public.properties.client_id is
  'Optional FK to the client who owns this property. When set, the client''s contact + address data becomes the canonical source for cleaner-facing surfaces and the legacy property.contact_* fields are ignored.';
