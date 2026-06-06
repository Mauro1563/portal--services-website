import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { createClient } from '@/lib/supabase/server';
import { updateCleaner } from '../actions';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditCleanerPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const { data: cleaner } = await supabase
    .from('cleaners')
    .select('id, name, phone, email')
    .eq('id', id)
    .maybeSingle();

  if (!cleaner) notFound();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <header className="border-b border-white/[0.06] bg-ink-0/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Logo size="sm" />
          <Link
            href={`/owner/cleaners/${id}`}
            className="text-xs text-slate-400 hover:text-white"
          >
            ← Cancel
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
          Edit cleaner
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold">{cleaner.name}</h1>

        {error && (
          <p className="mt-6 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
            {error}
          </p>
        )}

        <form action={updateCleaner} className="mt-8 space-y-4">
          <input type="hidden" name="cleaner_id" value={cleaner.id} />

          <label className="block text-sm text-slate-300">
            Full name <span className="text-rose-400">*</span>
            <input
              name="name"
              required
              defaultValue={cleaner.name}
              className="mt-1.5 block w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            />
          </label>

          <label className="block text-sm text-slate-300">
            Phone
            <input
              name="phone"
              type="tel"
              defaultValue={cleaner.phone ?? ''}
              placeholder="+44 7700 900000"
              className="mt-1.5 block w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            />
          </label>

          <label className="block text-sm text-slate-300">
            Email
            <input
              name="email"
              type="email"
              defaultValue={cleaner.email ?? ''}
              placeholder="maria@example.com"
              className="mt-1.5 block w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            />
          </label>

          <p className="text-xs text-slate-500">
            The PIN doesn't change here. Regenerate it from the cleaner detail page if you
            need a new one.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-6 text-sm font-medium text-white shadow-lg hover:brightness-110"
            >
              Save changes
            </button>
            <Link
              href={`/owner/cleaners/${id}`}
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
