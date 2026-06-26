-- For house-cleaning owners, each client IS one house: same person, one
-- address, one set of instructions. Adds the missing house-side fields
-- so the cleaner can GPS to the right place and the owner can record
-- the keys / wifi without burying it in the notes blob.
--
-- All nullable + additive, safe on existing data.

alter table public.clients
  add column if not exists postcode  text,
  add column if not exists key_info  text,
  add column if not exists wifi_info text;

comment on column public.clients.postcode  is 'Postcode for GPS / route planning to the cleaner';
comment on column public.clients.key_info  is 'Where the keys are / lockbox code / front-door instructions';
comment on column public.clients.wifi_info is 'Wifi network + password the cleaner can use while on site';
