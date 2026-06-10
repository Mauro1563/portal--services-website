import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  BarChart3,
  BadgePoundSterling,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import { getT } from '@/lib/i18n';

type TaskAnalytics = {
  id: string;
  scheduled_for: string;
  status: string;
  checked_in_at: string | null;
  completed_at: string | null;
  property_id: string | null;
  cleaner_id: string | null;
  price_pence: number | null;
  paid_amount_pence: number | null;
  payment_status: string;
  property: { name: string } | null;
  cleaner: { name: string } | null;
};

function pence(n: number) {
  return `£${(n / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function startOfMonth(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}
function startOfPrevMonth(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - 1, 1));
}
function endOfPrevMonth(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 0));
}
function toIso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function trendChip(curr: number, prev: number) {
  if (prev === 0 && curr === 0) return { text: '—', tone: 'neutral' as const };
  if (prev === 0) return { text: '+new', tone: 'up' as const };
  const pct = Math.round(((curr - prev) / prev) * 100);
  if (pct === 0) return { text: 'flat', tone: 'neutral' as const };
  return {
    text: (pct > 0 ? '+' : '') + pct + '%',
    tone: pct > 0 ? ('up' as const) : ('down' as const),
  };
}

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const t = await getT();
  const now = new Date();
  const thisMonth = startOfMonth(now);
  const prevMonth = startOfPrevMonth(now);
  const prevMonthEnd = endOfPrevMonth(now);
  const ninety = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  const { data: raw } = await supabase
    .from('tasks')
    .select(
      'id, scheduled_for, status, checked_in_at, completed_at, property_id, cleaner_id, price_pence, paid_amount_pence, payment_status, property:properties (name), cleaner:cleaners (name)',
    )
    .gte('scheduled_for', toIso(ninety))
    .order('scheduled_for', { ascending: true });

  const tasks = (raw ?? []) as unknown as TaskAnalytics[];

  const inMonth = tasks.filter(
    (x) => x.scheduled_for >= toIso(thisMonth) && x.scheduled_for <= toIso(now),
  );
  const inPrev = tasks.filter(
    (x) =>
      x.scheduled_for >= toIso(prevMonth) && x.scheduled_for <= toIso(prevMonthEnd),
  );

  const totalThis = inMonth.length;
  const totalPrev = inPrev.length;
  const completedThis = inMonth.filter((x) => x.status === 'completed').length;
  const completedPrev = inPrev.filter((x) => x.status === 'completed').length;
  const cancelledThis = inMonth.filter((x) => x.status === 'cancelled').length;
  const rateThis =
    totalThis === 0 ? 0 : Math.round((completedThis / totalThis) * 100);
  const ratePrev =
    totalPrev === 0 ? 0 : Math.round((completedPrev / totalPrev) * 100);

  const withDuration = tasks.filter(
    (x) => x.status === 'completed' && x.checked_in_at && x.completed_at,
  );
  const avgMinutes =
    withDuration.length === 0
      ? null
      : Math.round(
          withDuration.reduce((sum, x) => {
            const start = new Date(x.checked_in_at!).getTime();
            const end = new Date(x.completed_at!).getTime();
            return sum + Math.max(0, (end - start) / 60000);
          }, 0) / withDuration.length,
        );

  // Money: revenue is what got billed for jobs this month (uses price_pence;
  // we exclude cancelled so a phantom-priced cancellation doesn't inflate it).
  // Outstanding sums pending + the unpaid remainder of partial across the
  // whole 90-day window, not just this month — owners want to chase old debt.
  const billable = (x: TaskAnalytics) =>
    x.status !== 'cancelled' && (x.price_pence ?? 0) > 0;
  const revenueThis = inMonth
    .filter(billable)
    .reduce((s, x) => s + (x.price_pence ?? 0), 0);
  const revenuePrev = inPrev
    .filter(billable)
    .reduce((s, x) => s + (x.price_pence ?? 0), 0);

  const paidThis = inMonth
    .filter((x) => billable(x) && x.payment_status === 'paid')
    .reduce((s, x) => s + (x.price_pence ?? 0), 0);
  const paidRate =
    revenueThis === 0 ? 0 : Math.round((paidThis / revenueThis) * 100);

  let outstanding = 0;
  for (const x of tasks) {
    if (!billable(x)) continue;
    if (x.payment_status === 'paid' || x.payment_status === 'waived') continue;
    const price = x.price_pence ?? 0;
    const paid = x.paid_amount_pence ?? 0;
    outstanding += Math.max(0, price - paid);
  }

  const billedThis = inMonth.filter(billable);
  const avgTicket =
    billedThis.length === 0
      ? 0
      : Math.round(
          billedThis.reduce((s, x) => s + (x.price_pence ?? 0), 0) /
            billedThis.length,
        );

  const completed90 = tasks.filter((x) => x.status === 'completed');

  const propCount = new Map<string, { name: string; count: number }>();
  for (const x of completed90) {
    if (!x.property_id) continue;
    const cur = propCount.get(x.property_id) ?? { name: x.property?.name ?? 'Property', count: 0 };
    cur.count += 1;
    propCount.set(x.property_id, cur);
  }
  const topProps = [...propCount.values()].sort((a, b) => b.count - a.count).slice(0, 5);

  const cleanerCount = new Map<string, { name: string; count: number }>();
  for (const x of completed90) {
    if (!x.cleaner_id) continue;
    const cur = cleanerCount.get(x.cleaner_id) ?? { name: x.cleaner?.name ?? 'Cleaner', count: 0 };
    cur.count += 1;
    cleanerCount.set(x.cleaner_id, cur);
  }
  const topCleaners = [...cleanerCount.values()].sort((a, b) => b.count - a.count).slice(0, 5);

  const days: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const iso = toIso(d);
    const count = tasks.filter((x) => x.scheduled_for === iso && x.status === 'completed').length;
    days.push({ date: iso, count });
  }
  const maxDaily = Math.max(1, ...days.map((d) => d.count));

  return (
    <LightLayout activeTab="more" title={t('analytics.title')} showBack backHref="/owner/more">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
        {t('analytics.eyebrow')}
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-text-1">
        {t('analytics.title')}
      </h1>
      <p className="mt-1 text-xs text-text-2">{t('analytics.subtitle')}</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Kpi
          icon={<Calendar className="h-4 w-4 text-brand-600" />}
          label={t('analytics.kpiTotal')}
          value={String(totalThis)}
          trend={trendChip(totalThis, totalPrev)}
          sub={t('analytics.kpiTotalSub').replace('{n}', String(totalPrev))}
        />
        <Kpi
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
          label={t('analytics.kpiCompleted')}
          value={String(completedThis)}
          trend={trendChip(completedThis, completedPrev)}
          sub={t('analytics.kpiCompletedSub').replace('{n}', String(cancelledThis))}
        />
        <Kpi
          icon={<TrendingUp className="h-4 w-4 text-brand-600" />}
          label={t('analytics.kpiCompletionRate')}
          value={rateThis + '%'}
          trend={trendChip(rateThis, ratePrev)}
          sub={t('analytics.kpiCompletionSub').replace('{n}', String(ratePrev))}
        />
        <Kpi
          icon={<Clock className="h-4 w-4 text-amber-500" />}
          label={t('analytics.kpiAvgTime')}
          value={avgMinutes === null ? '—' : avgMinutes + ' min'}
          trend={{ text: t('analytics.kpiAvgTimeChip'), tone: 'neutral' }}
          sub={t('analytics.kpiAvgTimeSub').replace('{n}', String(withDuration.length))}
        />
      </div>

      {/* Revenue — current month, last 90d outstanding */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-surface-2 bg-surface-0 shadow-card">
        <div className="bg-gradient-to-br from-emerald-500/[0.04] via-brand-600/[0.04] to-amber-500/[0.04] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-3">
                Este mes
              </p>
              <p className="mt-1 font-display text-3xl font-bold tabular-nums text-text-1">
                {pence(revenueThis)}
              </p>
              <p className="mt-1 text-[11px] text-text-2">
                facturado · {pence(revenuePrev)} mes anterior
              </p>
            </div>
            <BadgePoundSterling className="h-6 w-6 text-emerald-600" />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-surface-2 pt-4">
            <MoneyCell
              label="Cobrado"
              value={pence(paidThis)}
              sub={`${paidRate}% del facturado`}
              tone="emerald"
            />
            <MoneyCell
              label="Pendiente"
              value={pence(outstanding)}
              sub="últimos 90 días"
              tone="amber"
            />
            <MoneyCell
              label="Ticket promedio"
              value={pence(avgTicket)}
              sub={`${billedThis.length} servicios`}
              tone="brand"
            />
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-text-1">
              {t('analytics.chartTitle')}
            </h2>
            <p className="text-[11px] text-text-3">
              {t('analytics.chartPeak').replace('{n}', String(maxDaily))}
            </p>
          </div>
          <BarChart3 className="h-5 w-5 text-brand-600" />
        </div>
        <div className="mt-4 flex h-28 items-end gap-1">
          {days.map((d) => {
            const h = d.count === 0 ? 4 : 8 + Math.round((d.count / maxDaily) * 100);
            const isToday = d.date === toIso(now);
            return (
              <div
                key={d.date}
                title={`${d.date} · ${d.count}`}
                className={
                  isToday
                    ? 'flex-1 rounded-t-sm bg-brand-600'
                    : d.count === 0
                    ? 'flex-1 rounded-t-sm bg-surface-2'
                    : 'flex-1 rounded-t-sm bg-gradient-to-t from-brand-600 to-brand-400'
                }
                style={{ height: `${h}%` }}
              />
            );
          })}
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="inline-flex items-center gap-2 font-display text-base font-semibold text-text-1">
            <Building2 className="h-4 w-4 text-brand-600" />
            {t('analytics.topProperties')}
          </h2>
        </div>
        {topProps.length === 0 ? (
          <p className="mt-3 text-sm text-text-3">{t('analytics.topEmpty')}</p>
        ) : (
          <TopList items={topProps} />
        )}
      </section>

      <section className="mt-5 mb-4 rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="inline-flex items-center gap-2 font-display text-base font-semibold text-text-1">
            <Users className="h-4 w-4 text-brand-600" />
            {t('analytics.topCleaners')}
          </h2>
        </div>
        {topCleaners.length === 0 ? (
          <p className="mt-3 text-sm text-text-3">{t('analytics.topEmpty')}</p>
        ) : (
          <TopList items={topCleaners} />
        )}
      </section>
    </LightLayout>
  );
}

function Kpi({
  icon,
  label,
  value,
  trend,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: { text: string; tone: 'up' | 'down' | 'neutral' };
  sub?: string;
}) {
  const toneClass =
    trend.tone === 'up'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      : trend.tone === 'down'
      ? 'bg-rose-50 text-rose-700 ring-rose-200'
      : 'bg-surface-1 text-text-3 ring-surface-2';
  return (
    <div className="rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-wider text-text-3">{label}</p>
        {icon}
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="font-display text-2xl font-bold text-text-1 tabular-nums">{value}</p>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${toneClass}`}
        >
          {trend.text}
        </span>
      </div>
      {sub ? <p className="mt-1 text-[10px] text-text-3">{sub}</p> : null}
    </div>
  );
}

function MoneyCell({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone: 'emerald' | 'amber' | 'brand';
}) {
  const accent =
    tone === 'emerald'
      ? 'text-emerald-700'
      : tone === 'amber'
      ? 'text-amber-700'
      : 'text-brand-700';
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-text-3">
        {label}
      </p>
      <p className={`mt-1 font-display text-base font-bold tabular-nums ${accent}`}>
        {value}
      </p>
      <p className="mt-0.5 text-[10px] text-text-3">{sub}</p>
    </div>
  );
}

function TopList({ items }: { items: { name: string; count: number }[] }) {
  const max = Math.max(1, ...items.map((x) => x.count));
  return (
    <ul className="mt-3 space-y-3">
      {items.map((it) => (
        <li key={it.name}>
          <div className="flex items-center justify-between text-sm">
            <span className="truncate text-text-1">{it.name}</span>
            <span className="text-text-2">{it.count}</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
              style={{ width: `${Math.round((it.count / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
