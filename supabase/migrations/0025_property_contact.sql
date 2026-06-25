-- Phase: simpler property form.
-- Adds homeowner contact fields directly on properties so the owner can
-- capture the person to contact for that house (dueña, conserje, gestor
-- de Airbnb) without having to spin up a separate clients record first.
-- All additive, all nullable, all back-compatible.

alter table public.properties
  add column if not exists contact_name  text,
  add column if not exists contact_phone text,
  add column if not exists contact_email text;

comment on column public.properties.contact_name  is 'Homeowner / on-site contact person displayed on the property';
comment on column public.properties.contact_phone is 'Phone / WhatsApp for the on-site contact';
comment on column public.properties.contact_email is 'Email for the on-site contact';
