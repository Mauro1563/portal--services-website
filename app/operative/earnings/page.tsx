import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Coins,
  Gift,
  PoundSterling,
  TrendingUp,
} from 'lucide-react';
import { ZapliLogo } from '@/components/brand/ZapliLogo';
import { createAdminClient } from '@/lib/supabase/admin';
import { BottomTabBar } from '@/components/operative/BottomTabBar';
import {
  formatPenceMoney,
  sumEarningsPence,
  sumTipsPence,
  taskEarningsPence,
  taskLabourPence,
} from '@/lib/cleaner-earnings';

/**
 * Cleaner earnings breakdown for the current week — answers the
 * "where did that £X figure come from" question that the EarningsStrip
 * on /operative invites.
 *
 * Two sections:
 *   1. Tasks list: for each task, shows hours × rate = labour, plus the
 *      tip on its own row if there was one, plus the per-task total.
 *      Tasks missing actual_hours show "Sin horas registradas" with a
 *      CTA back to the task detail so the cleaner can fix it.
 *   2. Propinas recibidas: a flat list of every tip this week — the
 *      receipt format ("£3 — Tuesday — Apartment X") that cleaners
 *      asked for so they can verify owners are passing tips through.
 */

type Task = {
  id: string;
  scheduled_for: string;
  start_time: string | null;
  status: string;
  actual_hours: number | string | null;
  cleaner_pay_rate_pence: number | null;
  tip_pence: number | null;
  property: { name: string | null } | null;
  client: { name: string | null } | null;
};

function startOfWeek(d = new Date()): Date {
  const day = d.getUTCDay();
  const diff = (day + 6) % 7;
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - diff),
  );
}

function toIso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function hoursDisplay(actual: number | string | null): string {
  if (actual == null) return '—';
  const n = typeof actual === 'string' ? Number(actual) : actual;
  if (!Number.isFinite(n) || n <= 0) return '—';
  return `${n.toFixed(2)} h`;
}

function dayLabel(iso: string): string {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}

function taskHeadline(t: Task): string {
  return t.client?.name ?? t.property?.name ?? 'Tarea';
}

export default async function OperativeEarningsPage() {
  const cookieStore = await cookies();
  const cleanerId = cookieStore.get('cleaner_session')?.value;
  if (!cleanerId) redirect('/operative/login');

  const admin = createAdminClient();

  const [{ data: cleaner }, { data: rawTasks }] = await Promise.all([
    admin
      .from('cleaners')
      .select('id, name, default_hourly_pay_pence')
      .eq('id', cleanerId)
      .maybeSingle(),
    (async () => {
      const weekStart = startOfWeek(new Date());
      const weekEnd = new Date(
        weekStart.getTime() + 6 * 24 * 60 * 60 * 1000,
      );
      return admin
        .from('tasks')
        .select(
          'id, scheduled_for, start_time, status, actual_hours, cleaner_pay_rate_pence, tip_pence, property:properties (name), client:clients (name)',
        )
        .eq('cleaner_id', cleanerId)
        .gte('scheduled_for', toIso(weekStart))
        .lte('scheduled_for', toIso(weekEnd))
        .order('scheduled_for', { ascending: true })
        .order('start_time', { ascending: true, nullsFirst: false });
    })(),
  ]);

  if (!cleaner) redirect('/operative/login');

  const defaultRate =
    (cleaner as { default_hourly_pay_pence?: number }).default_hourly_pay_pence ??
    0;
  const tasks = (rawTasks ?? []) as unknown as Task[];

  const weekStart = startOfWeek(new Date());
  const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);

  // Totals
  const labourTotal = tasks.reduce(
    (s, t) => s + taskLabourPence(t, defaultRate),
    0,
  );
  const tipsTotal = sumTipsPence(tasks);
  const grandTotal = sumEarningsPence(tasks, defaultRate);

  // Group tasks by day for the breakdown
  const byDay = new Map<string, Task[]>();
  for (const t of tasks) {
    const arr = byDay.get(t.scheduled_for) ?? [];
    arr.push(t);
    byDay.set(t.scheduled_for, arr);
  }
  const days = Array.from(byDay.keys()).sort();

  // Tip receipts — flat, only tasks with tip > 0
  const tipReceipts = tasks
    .filter((t) => (t.tip_pence ?? 0) > 0)
    .sort((a, b) => a.scheduled_for.localeCompare(b.scheduled_for));

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
          <ZapliLogo size="sm" />
          <span className="-mr-2 flex h-9 w-9" aria-hidden />
        </div>
      </header>

      <div className="mx-auto max-w-md px-4 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Ganancias de la semana
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-graphite-1">
          {weekStart.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
          })}{' '}
          –{' '}
          {weekEnd.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
          })}
        </h1>

        {/* Totals card */}
        <section className="mt-4 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600 text-white shadow-[0_8px_20px_-8px_rgba(5,150,105,0.6)]">
              <Coins className="h-5 w-5" />
            </span>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                Total semana
              </p>
              <p className="mt-0.5 font-display text-3xl font-bold tabular-nums text-graphite-1">
                {formatPenceMoney(grandTotal)}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-emerald-200/60 pt-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-3">
                <PoundSterling className="mr-1 inline h-3 w-3" /> Horas
              </p>
              <p className="mt-0.5 font-display text-base font-bold tabular-nums text-graphite-1">
                {formatPenceMoney(labourTotal)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-3">
                <Gift className="mr-1 inline h-3 w-3" /> Propinas
              </p>
              <p className="mt-0.5 font-display text-base font-bold tabular-nums text-graphite-1">
                {formatPenceMoney(tipsTotal)}
              </p>
            </div>
          </div>
        </section>

        {/* Tasks breakdown by day */}
        <section className="mt-6">
          <h2 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
            <TrendingUp className="h-3 w-3" /> Desglose por tarea
          </h2>

          {days.length === 0 ? (
            <p className="mt-3 rounded-xl border border-dashed border-surface-2 bg-surface-0 px-4 py-8 text-center text-xs text-text-3">
              Aún no hay tareas esta semana.
            </p>
          ) : (
            <div className="mt-3 space-y-4">
              {days.map((iso) => {
                const dayTasks = byDay.get(iso) ?? [];
                const dayTotal = sumEarningsPence(dayTasks, defaultRate);
                return (
                  <div key={iso}>
                    <div className="flex items-baseline justify-between">
                      <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-graphite-3">
                        <Calendar className="h-3 w-3" />
                        {dayLabel(iso)}
                      </h3>
                      <span className="font-display text-xs font-bold tabular-nums text-graphite-1">
                        {formatPenceMoney(dayTotal)}
                      </span>
                    </div>
                    <ul className="mt-2 space-y-2">
                      {dayTasks.map((t) => {
                        const rate =
                          t.cleaner_pay_rate_pence ?? defaultRate;
                        const labour = taskLabourPence(t, defaultRate);
                        const tip = t.tip_pence ?? 0;
                        const total = taskEarningsPence(t, defaultRate);
                        const hasHours =
                          t.actual_hours != null &&
                          Number(t.actual_hours) > 0;
                        return (
                          <li key={t.id}>
                            <Link
                              href={`/operative/tasks/${t.id}`}
                              className="block rounded-2xl border border-line bg-paper p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-emerald-300 hover:shadow-md"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <p className="truncate font-display text-sm font-semibold text-graphite-1">
                                    {taskHeadline(t)}
                                  </p>
                                  <p className="mt-0.5 text-[11px] text-graphite-3 tabular-nums">
                                    {hasHours ? (
                                      <>
                                        {hoursDisplay(t.actual_hours)} × £
                                        {(rate / 100).toFixed(2)}/h
                                      </>
                                    ) : (
                                      <span className="text-amber-700">
                                        Sin horas registradas — toca para
                                        añadir
                                      </span>
                                    )}
                                  </p>
                                  {tip > 0 ? (
                                    <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                                      <Gift className="h-3 w-3" />
                                      Propina £{(tip / 100).toFixed(2)}
                                    </p>
                                  ) : null}
                                </div>
                                <div className="text-right">
                                  <p className="font-display text-sm font-bold tabular-nums text-emerald-700">
                                    {formatPenceMoney(total)}
                                  </p>
                                  {tip > 0 && labour > 0 ? (
                                    <p className="mt-0.5 text-[10px] text-graphite-3 tabular-nums">
                                      £{(labour / 100).toFixed(2)} + £
                                      {(tip / 100).toFixed(2)}
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Tip receipts */}
        <section className="mt-8">
          <h2 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
            <Gift className="h-3 w-3" /> Propinas recibidas
          </h2>
          {tipReceipts.length === 0 ? (
            <p className="mt-3 rounded-xl border border-dashed border-surface-2 bg-surface-0 px-4 py-6 text-center text-xs text-text-3">
              Sin propinas esta semana. Las propinas aparecen aquí en cuanto
              el cliente las añade.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-surface-2 overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              {tipReceipts.map((t) => {
                const tip = t.tip_pence ?? 0;
                return (
                  <li key={t.id}>
                    <Link
                      href={`/operative/tasks/${t.id}`}
                      className="flex items-center gap-3 px-4 py-3 transition hover:bg-amber-50/40"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700">
                        <Gift className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-graphite-1">
                          {taskHeadline(t)}
                        </p>
                        <p className="mt-0.5 text-[11px] text-graphite-3">
                          {dayLabel(t.scheduled_for)}
                          {t.start_time
                            ? ` · ${t.start_time.slice(0, 5)}`
                            : ''}
                        </p>
                      </div>
                      <p className="font-display text-base font-bold tabular-nums text-amber-700">
                        £{(tip / 100).toFixed(2)}
                      </p>
                    </Link>
                  </li>
                );
              })}
              <li className="flex items-center justify-between bg-amber-50/60 px-4 py-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
                  Total propinas
                </span>
                <span className="font-display text-sm font-bold tabular-nums text-amber-800">
                  £{(tipsTotal / 100).toFixed(2)}
                </span>
              </li>
            </ul>
          )}
        </section>
      </div>
      <BottomTabBar active="agenda" />
    </main>
  );
}
