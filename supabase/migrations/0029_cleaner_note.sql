-- The cleaner's note back to the owner on a task. The existing
-- `tasks.notes` column is owner→cleaner (instructions); this is the
-- reverse — short observations or asks ("found a leak", "client wants
-- extra towels next time", "no llave en la caja").

alter table public.tasks
  add column if not exists cleaner_note text;

comment on column public.tasks.cleaner_note is 'Free-text note from the cleaner back to the owner about this specific task';
