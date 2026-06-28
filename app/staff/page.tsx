import Link from 'next/link';
import { KeyRound, Plus, Star, UserPlus } from 'lucide-react';
import { ZapliNavbar } from '@/components/nav/ZapliNavbar';
import { requireOwner } from '@/lib/auth';

export const metadata = {
  title: 'Staff · Zapli',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

type CleanerCard = {
  id: string;
  name: string;
  pin: string | null;
  rating: number | null;
  ratingCount: number;
  tasksThisMonth: number;
};

type LoadResult = {
  cleaners: CleanerCard[];
  unavailable: boolean;
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function startOfMonthIso(d: Date): string {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
    .toISOString()
    .split('T')[0];
}

async function loadCleaners(): Promise<LoadResult> {
  try {
    const { supabase, user } = await requireOwner();

    const { data: cleaners, error } = await supabase
      .from('cleaners')
      .select('id, name, pin, created_at')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error?.code === '42P01') {
      return { cleaners: [], unavailable: true };
    }
    if (error || !cleaners) {
      return { cleaners: [], unavailable: false };
    }

    const ids = cleaners.map((c) => c.id);
    const safeIds = ids.length
      ? ids
      : ['00000000-0000-0000-0000-000000000000'];
    const monthStart = startOfMonthIso(new Date());

    const [ratingsRes, tasksRes] = await Promise.all([
      supabase
        .from('task_ratings')
        .select('cleaner_id, stars')
        .in('cleaner_id', safeIds),
      supabase
        .from('tasks')
        .select('cleaner_id, scheduled_for')
        .in('cleaner_id', safeIds)
        .gte('scheduled_for', monthStart),
    ]);

    const ratingAgg = new Map<string, { sum: number; count: number }>();
    for (const r of (ratingsRes.data ?? []) as Array<{
      cleaner_id: string | null;
      stars: number | null;
    }>) {
      if (!r.cleaner_id || r.stars == null) continue;
      const cur = ratingAgg.get(r.cleaner_id) ?? { sum: 0, count: 0 };
      cur.sum += r.stars;
      cur.count += 1;
      ratingAgg.set(r.cleaner_id, cur);
    }

    const taskCount = new Map<string, number>();
    for (const t of (tasksRes.data ?? []) as Array<{
      cleaner_id: string | null;
    }>) {
      if (!t.cleaner_id) continue;
      taskCount.set(t.cleaner_id, (taskCount.get(t.cleaner_id) ?? 0) + 1);
    }

    return {
      cleaners: cleaners.map((c) => {
        const agg = ratingAgg.get(c.id);
        return {
          id: c.id,
          name: c.name,
          pin: c.pin ?? null,
          rating: agg && agg.count > 0 ? agg.sum / agg.count : null,
          ratingCount: agg?.count ?? 0,
          tasksThisMonth: taskCount.get(c.id) ?? 0,
        };
      }),
      unavailable: false,
    };
  } catch {
    return { cleaners: [], unavailable: true };
  }
}

export default async function StaffPage() {
  const { cleaners, unavailable } = await loadCleaners();

  return (
    <div className="min-h-screen bg-slate-50">
      <ZapliNavbar active="staff" signedIn />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Staff
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Tu equipo de cleaners y su actividad reciente.
            </p>
          </div>
          <Link
            href="/owner/cleaners/new"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Invitar cleaner
          </Link>
        </div>

        {unavailable ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            Aplica la migration 0037 en Supabase para activar este módulo.
          </div>
        ) : cleaners.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
            <UserPlus className="h-8 w-8 text-slate-400" aria-hidden />
            <div>
              <p className="text-base font-medium text-slate-800">
                Aún no hay cleaners
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Invita a tu primer cleaner para asignarle tareas.
              </p>
            </div>
            <Link
              href="/owner/cleaners/new"
              className="mt-2 inline-flex h-10 items-center gap-2 rounded-full bg-cyan-500 px-4 text-sm font-semibold text-white hover:bg-cyan-600"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Invitar cleaner
            </Link>
          </div>
        ) : (
          <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cleaners.map((c) => (
              <Link
                key={c.id}
                href={`/owner/cleaners/${c.id}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-cyan-300 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-sm font-semibold text-cyan-700">
                    {initials(c.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold text-slate-900 group-hover:text-cyan-700">
                      {c.name}
                    </p>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-500">
                      <KeyRound className="h-3 w-3" aria-hidden />
                      <span className="font-mono tracking-[0.18em]">
                        {c.pin ?? '— — —'}
                      </span>
                    </p>
                  </div>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-slate-50 px-3 py-2">
                    <dt className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                      Rating
                    </dt>
                    <dd className="mt-0.5 flex items-center gap-1 font-semibold text-slate-900">
                      {c.rating != null ? (
                        <>
                          <Star
                            className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                            aria-hidden
                          />
                          {c.rating.toFixed(1)}
                          <span className="text-xs font-normal text-slate-500">
                            ({c.ratingCount})
                          </span>
                        </>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-slate-50 px-3 py-2">
                    <dt className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                      Tareas mes
                    </dt>
                    <dd className="mt-0.5 font-semibold tabular-nums text-slate-900">
                      {c.tasksThisMonth}
                    </dd>
                  </div>
                </dl>
              </Link>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
