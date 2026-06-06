import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { createClient } from '@/lib/supabase/server';
import { updateTask } from '../actions';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditTaskPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const [taskRes, propertiesRes, cleanersRes] = await Promise.all([
    supabase
      .from('tasks')
      .select('id, property_id, cleaner_id, scheduled_for, notes')
      .eq('id', id)
      .maybeSingle(),
    supabase.from('properties').select('id, name').order('name'),
    supabase.from('cleaners').select('id, name').order('name'),
  ]);

  if (!taskRes.data) notFound();
  const task = taskRes.data;

  const properties = propertiesRes.data ?? [];
  const cleaners = cleanersRes.data ?? [];

  return (
    <main className="relative min-h-screen overflow-hidden">
      <header className="border-b border-white/[0.06] bg-ink-0/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Logo size="sm" />
          <Link
            href={`/owner/tasks/${id}`}
            className="text-xs text-slate-400 hover:text-white"
          >
            ← Cancel
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
          Edit cleaning
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold">Update this cleaning</h1>
        <p className="mt-1 text-sm text-slate-400">
          Reschedule, reassign, or update the notes.
        </p>

        {error && (
          <p className="mt-6 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
            {error}
          </p>
        )}

        <form action={updateTask} className="mt-8 space-y-4">
          <input type="hidden" name="task_id" value={task.id} />

          <label className="block text-sm text-slate-300">
            Property <span className="text-rose-400">*</span>
            <select
              name="property_id"
              required
              defaultValue={task.property_id}
              className="mt-1.5 block w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id} className="bg-ink-1">
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-slate-300">
            Cleaner
            <select
              name="cleaner_id"
              defaultValue={task.cleaner_id ?? ''}
              className="mt-1.5 block w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            >
              <option value="">Unassigned</option>
              {cleaners.map((c) => (
                <option key={c.id} value={c.id} className="bg-ink-1">
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-slate-300">
            Date <span className="text-rose-400">*</span>
            <input
              type="date"
              name="scheduled_for"
              required
              defaultValue={task.scheduled_for}
              className="mt-1.5 block w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            />
          </label>

          <label className="block text-sm text-slate-300">
            Notes
            <textarea
              name="notes"
              rows={3}
              defaultValue={task.notes ?? ''}
              placeholder="Guest checkout 11:00, next guest 15:00. Wifi code in drawer."
              className="mt-1.5 block w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            />
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-6 text-sm font-medium text-white shadow-lg hover:brightness-110"
            >
              Save changes
            </button>
            <Link
              href={`/owner/tasks/${id}`}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-medium text-white hover:bg-white/[0.08]"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
