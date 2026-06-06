-- Storage bucket for the marketing site's main logo (uploaded from /hq/branding).
-- Public read so the logo can be served without auth.
insert into storage.buckets (id, name, public)
values ('marketing-assets', 'marketing-assets', true)
on conflict (id) do nothing;

drop policy if exists "public read marketing-assets" on storage.objects;
create policy "public read marketing-assets" on storage.objects
  for select using (bucket_id = 'marketing-assets');

drop policy if exists "marketing admins upload" on storage.objects;
create policy "marketing admins upload" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'marketing-assets'
    and exists (
      select 1 from public.marketing_admins ma
      where ma.email = auth.jwt() ->> 'email'
    )
  );

drop policy if exists "marketing admins update" on storage.objects;
create policy "marketing admins update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'marketing-assets'
    and exists (
      select 1 from public.marketing_admins ma
      where ma.email = auth.jwt() ->> 'email'
    )
  );
