import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  PoundSterling,
  Star,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { createAdminClient } from '@/lib/supabase/admin';
import { BottomTabBar } from '@/components/operative/BottomTabBar';

type WeekTask = {
  id: string;
  scheduled_for: string;
  status: string;
  checked_in_at: string | null;
  completed_at: string | null;
  service_name: string | null;
  price_pence: number | null;
  estimated_duration_min: number | null;
  property: { name: string | null; address: string | null } | null;
};

function startOfWeek(d = new Date()): Date {
  const day = d.getUTCDay(); // 0=Sun … 6=Sat. Treat Mon as start.
  const diff = (day + 6) % 7;
  const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - diff));
  return monday;
}

function toIso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function formatMoney(pence: number | null): string {
  return pence ? `£${(pence / 100).toFixed(2)}` : '—';
}

function formatHours(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${minutes}m`;
}

export default async function OperativeWeekPage() {
  const cookieStore = await cookies();
  const cleanerId = cookieStore.get('cleaner_session')?.value;
  if (!cleanerId) redirect('/operative/login');

  const admin = createAdminClient();

  const { data: cleaner } = await admin
    .from('cleaners')
    .select('id, name')
    .eq('id', cleanerId)
    .maybeSingle();
  if (!cleaner) redirect('/operative/login');

  const weekStart = startOfWeek(new Date());
  const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
  const startIso = toIso(weekStart);
  const endIso = toIso(weekEnd);

  const { data: raw } = await admin
    .from('tasks')
    .select(
      'id, scheduled_for, status, checked_in_at, completed_at, service_name, price_pence, estimated_duration_min, property:properties (name, address)',
    )
    .eq('cleaner_id', cleanerId)
    .gte('scheduled_for', startIso)
    .lte('scheduled_for', endIso)
    .order('scheduled_for', { ascending: true });

  const tasks = (raw ?? []) as unknown as WeekTask[];

  // Group by day
  const days: Array<{ iso: string; tasks: WeekTask[] }> = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000);
    const iso = toIso(d);
    days.push({ iso, tasks: tasks.filter((t) => t.scheduled_for === iso) });
  }

  // KPIs: completed minutes worked + estimated earnings
  const completed = tasks.filter((t) => t.status === 'completed');
  const minutesWorked = completed.reduce((sum, t) => {
    if (t.checked_in_at && t.completed_at) {
      const ms = new Date(t.completed_at).getTime() - new Date(t.checked_in_at).getTime();
      return sum + Math.max(0, Math.round(ms / 60000));
    }
    return sum + (t.estimated_duration_min ?? 0);
  }, 0);
  const earningsPence = completed.reduce((sum, t) => sum + (t.price_pence ?? 0), 0);

  // Rating average from ratings on those completed tasks
  const completedIds = completed.map((t) => t.id);
  let avgStars: number | null = null;
  let ratingCount = 0;
  if (completedIds.length > 0) {
    const { data: ratings } = await admin
      .from('task_ratings')
      .select('stars')
      .in('task_id', completedIds);
    if (ratings && ratings.length > 0) {
      avgStars = ratings.reduce((s, r) => s + r.stars, 0) / ratings.length;
      ratingCount = ratings.length;
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-canvas pb-24">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-md items-center justify-between gap-2 px-4">
          <Link
            href="/operative"
            aria-label="Back"
            className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-graphite-1 hover:bg-surface-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Logo size="sm" />
          <span className="-mr-2 flex h-9 w-9" aria-hidden />
        </div>
      </header>

      <div className="mx-auto max-w-md px-4 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-500">
          This week
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-graphite-1">
          {weekStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}{' '}
          – {weekEnd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </h1>

        {/* KPIs */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Kpi
            icon={<Clock className="h-3.5 w-3.5 text-brand-500" />}
            label="Worked"
            value={formatHours(minutesWorked)}
          />
          <Kpi
            icon={<PoundSterling className="h-3.5 w-3.5 text-emerald-600" />}
            label="Earnings"
            value={formatMoney(earningsPence)}
          />
          <Kpi
            icon={<Star className="h-3.5 w-3.5 text-amber-500" />}
            label={`Rating (${ratingCount})`}
            value={avgStars == null ? '—' : avgStars.toFixed(1)}
          />
        </div>

        {/* Route — day by day */}
        <section className="mt-6 space-y-4">
          {days.map(({ iso, tasks: dayTasks }) => {
            const d = new Date(iso + 'T00:00:00Z');
            const isToday = iso === toIso(new Date());
            return (
              <div key={iso}>
                <h2
                  className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${
                    isToday ? 'text-brand-600' : 'text-graphite-3'
                  }`}
                >
                  <Calendar className="h-3 w-3" />
                  {d.toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short',
                    timeZone: 'UTC',
                  })}
                  {isToday ? ' · TODAY' : ''}
                </h2>
                {dayTasks.length === 0 ? (
                  <p className="mt-1 ml-5 text-[11px] text-graphite-3">No cleanings</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {dayTasks.map((t, idx) => (
                      <li key={t.id}>
                        <Link
                          href={`/operative/tasks/${t.id}`}
                          className="flex items-start gap-3 rounded-2xl border border-line bg-paper p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-brand-400 hover:shadow-[0_4px_12px_-4px_rgba(37,99,235,0.18)]"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[11px] font-semibold text-brand-700">
                            {idx + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-display text-sm font-semibold text-graphite-1">
                              {t.property?.name ?? 'Property'}
                            </p>
                            {t.property?.address ? (
                              <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(t.property.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-brand-600 hover:text-brand-700"
                              >
                                <MapPin className="h-3 w-3" /> {t.property.address}
                              </a>
                            ) : null}
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-[10px] text-graphite-3">
                              {t.service_name ? (
                                <span>{t.service_name}</span>
                              ) : null}
                              {t.estimated_duration_min ? (
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatHours(t.estimated_duration_min)}
                                </span>
                              ) : null}
                              {t.price_pence ? (
                                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                                  <PoundSterling className="h-3 w-3" />
                                  {formatMoney(t.price_pence)}
                                </span>
                              ) : null}
                            </div>
                          </div>
                          {t.status === 'completed' ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </section>
      </div>
      <BottomTabBar active="tareas" />
    </main>
  );
}

function Kpi({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-paper p-3 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex justify-center">{icon}</div>
      <p className="mt-1.5 font-display text-base font-bold text-graphite-1 tabular-nums">
        {value}
      </p>
      <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-graphite-3">
        {label}
      </p>
    </div>
  );
}
