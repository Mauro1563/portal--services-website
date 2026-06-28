import Link from 'next/link';
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Users,
  Wallet,
} from 'lucide-react';
import { ZapliNavbar } from '@/components/nav/ZapliNavbar';
import { requireOwner } from '@/lib/auth';

export const metadata = {
  title: 'Dashboard · Zapli',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

type DashboardData = {
  weekRevenuePence: number;
  activeCleaners: number;
  tasksToday: number;
  pendingPayments: number;
  recentCompleted: Array<{
    id: string;
    completed_at: string | null;
    scheduled_for: string | null;
    price_pence: number | null;
    property_name: string | null;
    client_name: string | null;
    cleaner_name: string | null;
  }>;
  unavailable: boolean;
};

function startOfWeekIso(d: Date): string {
  const day = d.getUTCDay(); // 0=Sun..6=Sat
  // Treat Monday as the first day of the week, since the rest of the
  // product assumes that (operative week, owner calendar).
  const diff = (day + 6) % 7;
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() - diff);
  return monday.toISOString().split('T')[0];
}

function todayIso(d: Date): string {
  return d.toISOString().split('T')[0];
}

function formatGBP(pence: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(pence / 100);
}

async function loadDashboardData(): Promise<DashboardData> {
  const empty: DashboardData = {
    weekRevenuePence: 0,
    activeCleaners: 0,
    tasksToday: 0,
    pendingPayments: 0,
    recentCompleted: [],
    unavailable: false,
  };

  try {
    const { supabase, user } = await requireOwner();

    const now = new Date();
    const today = todayIso(now);
    const weekStart = startOfWeekIso(now);

    // Run independent queries in parallel. Each one is individually wrapped
    // so a single missing table won't fail the whole bundle.
    const [
      weekTasksRes,
      cleanersRes,
      todayTasksRes,
      pendingPaymentsRes,
      recentRes,
    ] = await Promise.all([
      supabase
        .from('tasks')
        .select('price_pence, properties!inner(owner_id)')
        .eq('properties.owner_id', user.id)
        .eq('status', 'completed')
        .gte('scheduled_for', weekStart),
      supabase
        .from('cleaners')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', user.id),
      supabase
        .from('tasks')
        .select('id, properties!inner(owner_id)', { count: 'exact', head: true })
        .eq('properties.owner_id', user.id)
        .eq('scheduled_for', today),
      supabase
        .from('tasks')
        .select('id, properties!inner(owner_id)', { count: 'exact', head: true })
        .eq('properties.owner_id', user.id)
        .eq('status', 'completed')
        .is('paid_at', null),
      supabase
        .from('tasks')
        .select(
          'id, scheduled_for, completed_at, price_pence, property:properties!inner(name, owner_id), client:clients(name), cleaner:cleaners(name)',
        )
        .eq('properties.owner_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false, nullsFirst: false })
        .limit(5),
    ]);

    // If any of the core tables errored hard (table missing), bail to the
    // unavailable hint instead of silently zeroing every tile.
    const coreError =
      weekTasksRes.error?.code === '42P01' ||
      cleanersRes.error?.code === '42P01';
    if (coreError) {
      return { ...empty, unavailable: true };
    }

    const weekRevenuePence = ((weekTasksRes.data ?? []) as Array<{
      price_pence?: number | null;
    }>).reduce((sum, row) => sum + (row.price_pence ?? 0), 0);

    type RawRecent = {
      id: string;
      scheduled_for: string | null;
      completed_at: string | null;
      price_pence: number | null;
      property?: { name?: string | null } | { name?: string | null }[] | null;
      client?: { name?: string | null } | { name?: string | null }[] | null;
      cleaner?: { name?: string | null } | { name?: string | null }[] | null;
    };
    const recentRaw = (recentRes.data ?? []) as unknown as RawRecent[];
    const flat = <T extends { name?: string | null }>(
      v: T | T[] | null | undefined,
    ): T | null => (Array.isArray(v) ? (v[0] ?? null) : (v ?? null));

    const recentCompleted = recentRaw.map((row) => {
      const prop = flat(row.property);
      const client = flat(row.client);
      const cleaner = flat(row.cleaner);
      return {
        id: row.id,
        scheduled_for: row.scheduled_for,
        completed_at: row.completed_at,
        price_pence: row.price_pence,
        property_name: prop?.name ?? null,
        client_name: client?.name ?? null,
        cleaner_name: cleaner?.name ?? null,
      };
    });

    return {
      weekRevenuePence,
      activeCleaners: cleanersRes.count ?? 0,
      tasksToday: todayTasksRes.count ?? 0,
      pendingPayments: pendingPaymentsRes.count ?? 0,
      recentCompleted,
      unavailable: false,
    };
  } catch {
    return { ...empty, unavailable: true };
  }
}

function StatTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  label: string;
  value: string;
  tone: 'cyan' | 'emerald' | 'amber' | 'rose';
}) {
  const tones = {
    cyan: 'bg-cyan-50 text-cyan-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    rose: 'bg-rose-50 text-rose-700',
  } as const;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </span>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${tones[tone]}`}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default async function DashboardPage() {
  const data = await loadDashboardData();

  return (
    <div className="min-h-screen bg-slate-50">
      <ZapliNavbar active="dashboard" signedIn />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Resumen de la operación de esta semana.
            </p>
          </div>
          <Link
            href="/scheduling"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            <Calendar className="h-4 w-4" aria-hidden />
            Programar semana
          </Link>
        </div>

        {data.unavailable ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            Aplica la migration 0037 en Supabase para activar este módulo.
          </div>
        ) : null}

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile
            icon={Wallet}
            label="Ingresos esta semana"
            value={formatGBP(data.weekRevenuePence)}
            tone="emerald"
          />
          <StatTile
            icon={Users}
            label="Cleaners activos"
            value={String(data.activeCleaners)}
            tone="cyan"
          />
          <StatTile
            icon={Clock}
            label="Tareas hoy"
            value={String(data.tasksToday)}
            tone="amber"
          />
          <StatTile
            icon={CreditCard}
            label="Pagos pendientes"
            value={String(data.pendingPayments)}
            tone="rose"
          />
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden />
              <h2 className="text-sm font-semibold text-slate-900">
                Últimas tareas completadas
              </h2>
            </div>
            <Link
              href="/owner/calendar"
              className="text-xs font-medium text-cyan-600 hover:text-cyan-700"
            >
              Ver todo
            </Link>
          </div>
          {data.recentCompleted.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">
              Aún no hay tareas completadas.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {data.recentCompleted.map((t) => {
                const when = t.completed_at ?? t.scheduled_for;
                const whenLabel = when
                  ? new Date(when).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '—';
                return (
                  <li
                    key={t.id}
                    className="flex items-center justify-between gap-4 px-5 py-3.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {t.property_name ?? t.client_name ?? 'Tarea'}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {t.cleaner_name ? `${t.cleaner_name} · ` : ''}
                        {whenLabel}
                      </p>
                    </div>
                    {t.price_pence != null ? (
                      <span className="shrink-0 text-sm font-semibold text-slate-900">
                        {formatGBP(t.price_pence)}
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
