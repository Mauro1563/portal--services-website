-- Migration 0002 — add personal Gmail to the HQ admin allowlist.
-- Run this once in the Supabase SQL editor (or via supabase db push).
-- After running, mauro541423@gmail.com can log into /hq/login via magic link.

insert into public.marketing_admins (email, name)
values ('mauro541423@gmail.com', 'Mauricio')
on conflict (email) do nothing;
