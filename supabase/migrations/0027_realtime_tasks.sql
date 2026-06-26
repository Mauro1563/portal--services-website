-- Enable Supabase Realtime on the tasks table so the owner dashboard
-- and the tasks list reflect cleaner check-ins / completions / payment
-- updates without a manual refresh. Idempotent (publication check).

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'tasks'
  ) then
    alter publication supabase_realtime add table public.tasks;
  end if;
end $$;
