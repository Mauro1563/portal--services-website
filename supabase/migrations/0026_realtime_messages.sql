-- Enable Supabase Realtime for the chat tables so client + owner UIs
-- get instant updates instead of polling. Idempotent: each `alter
-- publication ... add table` is wrapped so re-running the bundle on a
-- project that already has these in the publication doesn't error.

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'client_messages'
  ) then
    alter publication supabase_realtime add table public.client_messages;
  end if;
end $$;
