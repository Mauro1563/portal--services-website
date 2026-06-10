import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronLeft, ChevronRight, List, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import { getT } from '@/lib/i18n';

type SearchParams = Promise<{ month?: string; property?: string }>;

type TaskRow = {
  id: string;
  scheduled_for: string;
  status: string;
  property: { name: string } | null;
  cleaner: { name: string } | null;
};

const STATUS_TONE: Record<string, string> = {
  scheduled: 'bg-amber-100 text-amber-700 ring-amber-200',
  in_progress: 'bg-sky-100 text-sky-700 ring-sky-200',
  completed: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  cancelled: 'bg-rose-100 text-rose-700 ring-rose-200',
};

function parseMonth(raw: string | undefined): { year: number; month: number } {
  const m = (raw ?? '').match(/^(\d{4})-(\d{1,2})$/);
  if (m) {
    return {
      year: Number(m[1]),
      month: Math.min(12, Math.max(1, Number(m[2]))),
    };
  }
  const now = new Date();
  return { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 };
}

function fmtMonthParam(year: number, month: number) {
  return `${year}-${String(month).padStart(2, '0')}`;
}

function shiftMonth(year: number, month: number, delta: number) {
  let m = month + delta;
  let y = year;
  while (m < 1) {
    m += 12;
    y -= 1;
  }
  while (m > 12) {
    m -= 12;
    y += 1;
  }
  return { year: y, month: m };
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const t = await getT();
  const { month: monthParam, property: propertyId } = await searchParams;
  const { year, month } = parseMonth(monthParam);

  // The form below posts back to this page (GET), so the property filter
  // and the month are both reflected in the URL — back/forward + share work.
  const { data: propertiesList } = await supabase
    .from('properties')
    .select('id, name')
    .order('name');

  const firstOfMonth = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const startWeekday = firstOfMonth.getUTCDay();

  const monthStart = `${fmtMonthParam(year, month)}-01`;
  const monthEnd = `${fmtMonthParam(year, month)}-${String(daysInMonth).padStart(2, '0')}`;

  let q = supabase
    .from('tasks')
    .select(
      'id, scheduled_for, status, property:properties (name), cleaner:cleaners (name)',
    )
    .gte('scheduled_for', monthStart)
    .lte('scheduled_for', monthEnd)
    .order('scheduled_for', { ascending: true });
  if (propertyId) q = q.eq('property_id', propertyId);

  const { data } = await q;
  const tasks = (data ?? []) as unknown as TaskRow[];

  const byDate = new Map<string, TaskRow[]>();
  for (const x of tasks) {
    const key = x.scheduled_for.slice(0, 10);
    const arr = byDate.get(key) ?? [];
    arr.push(x);
    byDate.set(key, arr);
  }

  const prev = shiftMonth(year, month, -1);
  const next = shiftMonth(year, month, 1);
  const todayIso = new Date().toISOString().slice(0, 10);

  const cells: { iso: string | null; day: number | null }[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push({ iso: null, day: null });
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      iso: `${fmtMonthParam(year, month)}-${String(d).padStart(2, '0')}`,
      day: d,
    });
  }
  while (cells.length % 7 !== 0) cells.push({ iso: null, day: null });

  const monthLabel = firstOfMonth.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const weekdayShort = t('calendar.weekdayShort').split(',');

  // Helper: build a deep-link that preserves the active property filter so
  // clicking a day cell doesn't lose context.
  const dayLink = (iso: string, hasTasks: boolean) => {
    const qs = new URLSearchParams();
    if (hasTasks) {
      qs.set('from', iso);
      qs.set('to', iso);
      if (propertyId) qs.set('property', propertyId);
      return `/owner/tasks?${qs.toString()}`;
    }
    qs.set('date', iso);
    if (propertyId) qs.set('property', propertyId);
    return `/owner/tasks/new?${qs.toString()}`;
  };

  const monthLinkPreserving = (y: number, m: number) => {
    const qs = new URLSearchParams({ month: fmtMonthParam(y, m) });
    if (propertyId) qs.set('property', propertyId);
    return `/owner/calendar?${qs.toString()}`;
  };

  return (
    <LightLayout activeTab="tasks" title={t('calendar.title')} showBack backHref="/owner/tasks">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold text-text-1">{monthLabel}</h1>
          <p className="mt-1 text-xs text-text-2">
            {(tasks.length === 1
              ? t('calendar.subtitleCount')
              : t('calendar.subtitleCountPlural')
            ).replace('{n}', String(tasks.length))}
          </p>
        </div>
        <Link
          href="/owner/tasks"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-surface-2 bg-surface-0 px-3 text-xs font-medium text-text-1 hover:bg-surface-1"
        >
          <List className="h-3.5 w-3.5" /> {t('calendar.listView')}
        </Link>
      </div>

      <nav className="mt-5 flex items-center justify-between gap-3">
        <Link
          href={monthLinkPreserving(prev.year, prev.month)}
          className="inline-flex h-9 items-center gap-1 rounded-xl border border-surface-2 bg-surface-0 px-3 text-xs font-medium text-text-1 hover:bg-surface-1"
        >
          <ChevronLeft className="h-3.5 w-3.5" />{' '}
          {new Date(Date.UTC(prev.year, prev.month - 1, 1)).toLocaleDateString('en-GB', {
            month: 'short',
            timeZone: 'UTC',
          })}
        </Link>
        <Link
          href={propertyId ? `/owner/calendar?property=${propertyId}` : '/owner/calendar'}
          className="text-xs font-medium text-brand-600 hover:text-brand-700"
        >
          {t('calendar.todayBtn')}
        </Link>
        <Link
          href={monthLinkPreserving(next.year, next.month)}
          className="inline-flex h-9 items-center gap-1 rounded-xl border border-surface-2 bg-surface-0 px-3 text-xs font-medium text-text-1 hover:bg-surface-1"
        >
          {new Date(Date.UTC(next.year, next.month - 1, 1)).toLocaleDateString('en-GB', {
            month: 'short',
            timeZone: 'UTC',
          })}{' '}
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </nav>

      {/* Property filter — GET form so the choice round-trips through the URL. */}
      <form
        method="get"
        className="mt-3 flex items-center gap-2 rounded-xl border border-surface-2 bg-surface-0 px-3 py-2 shadow-card"
      >
        <input type="hidden" name="month" value={fmtMonthParam(year, month)} />
        <label className="text-[11px] font-medium text-text-3">
          {t('tasks.allProperties').replace('All ', '').replace('Todas las ', '')}
        </label>
        <select
          name="property"
          defaultValue={propertyId ?? ''}
          className="h-8 flex-1 rounded-lg border border-surface-2 bg-surface-0 px-2 text-xs text-text-1 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        >
          <option value="">{t('tasks.allProperties')}</option>
          {(propertiesList ?? []).map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="inline-flex h-8 items-center rounded-full bg-brand-600/10 px-3 text-[11px] font-medium text-brand-700 ring-1 ring-inset ring-brand-600/30 hover:bg-brand-600/15"
        >
          {t('common.apply')}
        </button>
      </form>

      <div className="mt-5 grid grid-cols-7 gap-1 text-[10px] font-semibold uppercase tracking-wider text-text-3">
        {weekdayShort.map((d) => (
          <div key={d} className="px-1 text-center">
            {d}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((c, i) => {
          if (!c.iso) {
            return (
              <div
                key={`blank-${i}`}
                className="min-h-[70px] rounded-lg border border-surface-2/50 bg-surface-0/50"
              />
            );
          }
          const items = byDate.get(c.iso) ?? [];
          const isToday = c.iso === todayIso;
          const cellHref = dayLink(c.iso, items.length > 0);
          return (
            <Link
              key={c.iso}
              href={cellHref}
              className={`group block min-h-[70px] rounded-lg border bg-surface-0 p-1 transition hover:border-brand-600/40 hover:shadow-card ${
                isToday
                  ? 'border-brand-600 ring-1 ring-inset ring-brand-600/30'
                  : 'border-surface-2'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-semibold ${
                    isToday ? 'text-brand-600' : 'text-text-2'
                  }`}
                >
                  {c.day}
                </span>
                {items.length > 0 ? (
                  <span className="text-[9px] text-text-3">{items.length}</span>
                ) : (
                  <span className="text-[10px] leading-none text-text-3 opacity-0 transition group-hover:opacity-100">
                    +
                  </span>
                )}
              </div>
              <ul className="mt-1 space-y-0.5">
                {items.slice(0, 2).map((x) => {
                  const tone = STATUS_TONE[x.status] ?? STATUS_TONE.scheduled;
                  return (
                    <li
                      key={x.id}
                      className={`block truncate rounded px-1 py-0.5 text-[9px] font-medium ring-1 ring-inset ${tone}`}
                    >
                      {x.property?.name ?? '·'}
                    </li>
                  );
                })}
                {items.length > 2 ? (
                  <li className="px-1 text-[9px] text-text-3">
                    {t('calendar.moreCount').replace('{n}', String(items.length - 2))}
                  </li>
                ) : null}
              </ul>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 mb-4">
        <Link
          href="/owner/tasks/new"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand-gradient text-sm font-semibold text-white shadow-brand-glow active:scale-[0.99]"
        >
          <Plus className="h-4 w-4" /> {t('calendar.schedule')}
        </Link>
      </div>
    </LightLayout>
  );
}
