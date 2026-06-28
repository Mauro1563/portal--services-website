# Zapli unified DB migration — 0037_zapli_unified_schema.sql

This migration extends the existing portal/services schema so the same DB can
serve **residential home cleaning** and **Airbnb short-term-rental turnovers**
side-by-side, behind a strict role-based access model.

## What each section does

### 1. Role enum + `user_profiles`
- Creates the enum `public.user_role` with values `host`, `cleaner`, `admin`,
  `supervisor`.
- Creates `public.user_profiles (user_id, role, full_name, …)` keyed to
  `auth.users(id)` (Supabase auth is the source of truth for identity, so we
  keep app metadata in a parallel table instead of touching the `auth` schema).
- Adds RLS so users can read/write their own profile and admins can read all
  profiles.
- Adds the helper `public.current_user_role()` (SECURITY DEFINER) used by the
  admin policies on `properties` and `tasks`.

### 2. `properties` extension
- `property_type text` (`residential_home` | `airbnb_rental`) with CHECK
  constraint and `'residential_home'` default — picks which flow the property
  uses while the existing `platform` column keeps tracking the listing source.
- `ical_url text` for the Airbnb (or other STR) calendar feed.
- `ical_last_sync_at timestamptz` for sync bookkeeping.
- B-tree index on `property_type` for fast flow filtering.

### 3. `tasks` extension
- `checklist jsonb default '[]'` — ordered array of
  `{key, label, done, doneAt?, doneByUserId?}` items the cleaner ticks off.
- `required_photos integer default 0` — minimum `task_photos` count enforced
  in the app before a task can transition to `done` (Airbnb turnovers: 4).
- GIN index on `checklist` for jsonb membership / key queries.

### 4. RLS — role-aware policies
Both `properties` and `tasks` get fresh DROP-then-CREATE policies:

| Role        | properties                                  | tasks                                              |
|-------------|---------------------------------------------|----------------------------------------------------|
| `admin`     | read all                                    | read all                                           |
| `host`      | read/write where `owner_id = auth.uid()`    | read/write tasks on their own properties           |
| `cleaner`   | read properties they have a task on         | read + update tasks where `cleaner_id` is theirs   |
| `supervisor`| (host policies apply; tighten later)        | (host policies apply; tighten later)               |

Cleaner mapping uses the existing `public.cleaners.user_id` link to
`auth.users`.

## How to apply

1. Open the Supabase Dashboard → **SQL Editor** for the Zapli project.
2. Paste the entire contents of
   `supabase/migrations/0037_zapli_unified_schema.sql` into a new query and
   run it. The script is idempotent (`if not exists` / `drop policy if exists`)
   so re-running is safe.
3. Verify in **Database → Tables**:
   - `user_profiles` exists with the `role` column typed as `user_role`.
   - `properties` shows `property_type`, `ical_url`, `ical_last_sync_at`.
   - `tasks` shows `checklist` (jsonb) and `required_photos` (int).
   - Under **Policies**, `properties` and `tasks` list the four new
     role-scoped policies each.
