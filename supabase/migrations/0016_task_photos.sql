-- Migration 0006 — multi-photo per task
-- Run in Supabase → SQL Editor.

create table if not exists public.task_photos (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  cleaner_id uuid references public.cleaners(id) on delete set null,
  url text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_task_photos_task on public.task_photos (task_id);
create index if not exists idx_task_photos_owner on public.task_photos (owner_id);

alter table public.task_photos enable row level security;

-- Owner can read photos of their tasks
drop policy if exists "owner reads own task photos" on public.task_photos;
create policy "owner reads own task photos" on public.task_photos for select
  using (auth.uid() = owner_id);

-- Cleaners insert via admin client (service role bypasses RLS)
-- No write policy needed for authenticated owners — they don't upload, the
-- cleaner does via the operative app.
