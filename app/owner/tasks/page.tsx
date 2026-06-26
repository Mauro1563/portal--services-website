import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CalendarDays, ChevronRight, ListChecks, MapPin, Plus, Search, SearchX, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import { EmptyState } from '@/components/EmptyState';
import { getT } from '@/lib/i18n';

type SearchParams = Promise<{
  q?: string;
  status?: string;
  property?: string;
  cleaner?: string;
  from?: string;
  to?: string;
}>;

type TaskRow = {
  id: string;
  scheduled_for: string;
  status: string;
  notes: string | null;
  checked_in_at: string | null;
  checkin_lat: number | null;
  checkin_lng: number | null;
  photo_url: string | null;
  property_id: string | null;
  cleaner_id: string | null;
  property: { name: string } | null;
  cleaner: { name: string } | null;
};

export default async function TasksPage({
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
  const { q, status, property, cleaner, from, to } = await searchParams;
  const effectiveStatus = status && status !== 'all' ? status : null;

  const STATUS_OPTIONS = [
    { value: 'all', label: t('tasks.filterAll') },
    { value: 'scheduled', label: t('tasks.filterScheduled') },
    { value: 'in_progress', label: t('tasks.filterInProgress') },
    { value: 'completed', label: t('tasks.filterCompleted') },
    { value: 'cancelled', label: t('tasks.filterCancelled') },
  ];

  const [{ data: propertiesAll }, { data: cleanersAll }] = await Promise.all([
    supabase.from('properties').select('id, name').order('name'),
    supabase.from('cleaners').select('id, name').order('name'),
  ]);

  let query = supabase
    .from('tasks')
    .select(
      'id, scheduled_for, status, notes, checked_in_at, checkin_lat, checkin_lng, photo_url, property_id, cleaner_id, property:properties (name), cleaner:cleaners (name)',
    )
    .order('scheduled_for', { ascending: true });

  if (effectiveStatus) query = query.eq('status', effectiveStatus);
  if (property) query = query.eq('property_id', property);
  if (cleaner) query = query.eq('cleaner_id', cleaner);
  if (from) query = query.gte('scheduled_for', from);
  if (to) query = query.lte('scheduled_for', to);

  const { data } = await query;
  let tasks = (data ?? []) as unknown as TaskRow[];

  if (q && q.trim().length > 0) {
    const needle = q.trim().toLowerCase();
    tasks = tasks.filter((x) => {
      const a = (x.property?.name ?? '').toLowerCase();
      const b = (x.cleaner?.name ?? '').toLowerCase();
      const c = (x.notes ?? '').toLowerCase();
      return a.includes(needle) || b.includes(needle) || c.includes(needle);
    });
  }

  const hasFilters = !!(q || effectiveStatus || property || cleaner || from || to);

  return (
    <LightLayout activeTab="tasks" title="Servicios">
      <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-text-1">
            {t('tasks.title')}
          </h1>
          <p className="mt-1 text-sm text-text-2">
            {hasFilters
              ? (tasks.length === 1
                  ? t('tasks.matches')
                  : t('tasks.matchesPlural')
                ).replace('{n}', String(tasks.length))
              : t('tasks.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/owner/calendar"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-surface-2 bg-surface-0 px-3 text-xs font-medium text-text-1 hover:bg-surface-1"
          >
            <CalendarDays className="h-3.5 w-3.5" /> {t('tasks.calendarView')}
          </Link>
          <Link
            href="/owner/tasks/new"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-gradient px-4 text-sm font-semibold text-white shadow-brand-glow transition hover:brightness-110 active:scale-[0.99]"
          >
            <Plus className="h-4 w-4" /> {t('tasks.addBtn')}
          </Link>
        </div>
      </div>

      {/* Filters card */}
      <form
        method="get"
        className="mt-5 rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card"
      >
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_OPTIONS.map((opt) => {
            const active =
              (opt.value === 'all' && !effectiveStatus) ||
              effectiveStatus === opt.value;
            return (
              <button
                key={opt.value}
                name="status"
                value={opt.value}
                type="submit"
                className={
                  active
                    ? 'inline-flex h-8 items-center rounded-full bg-brand-600/10 px-3 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-600/30'
                    : 'inline-flex h-8 items-center rounded-full bg-surface-1 px-3 text-xs font-medium text-text-2 ring-1 ring-inset ring-surface-2 hover:bg-surface-2'
                }
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-3" />
            <input
              type="text"
              name="q"
              defaultValue={q ?? ''}
              placeholder={t('tasks.searchPh')}
              className="h-10 w-full rounded-xl border border-surface-2 bg-surface-0 pl-9 pr-3 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
          </div>
          <select
            name="property"
            defaultValue={property ?? ''}
            className="h-10 rounded-xl border border-surface-2 bg-surface-0 px-3 text-sm text-text-1 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
          >
            <option value="">{t('tasks.allProperties')}</option>
            {(propertiesAll ?? []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <select
            name="cleaner"
            defaultValue={cleaner ?? ''}
            className="h-10 rounded-xl border border-surface-2 bg-surface-0 px-3 text-sm text-text-1 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
          >
            <option value="">{t('tasks.allCleaners')}</option>
            {(cleanersAll ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <input
              type="date"
              name="from"
              defaultValue={from ?? ''}
              className="h-10 w-full rounded-xl border border-surface-2 bg-surface-0 px-3 text-sm text-text-1 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
            <span className="text-xs text-text-3">→</span>
            <input
              type="date"
              name="to"
              defaultValue={to ?? ''}
              className="h-10 w-full rounded-xl border border-surface-2 bg-surface-0 px-3 text-sm text-text-1 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-[11px] text-text-3">
            {hasFilters ? t('tasks.filtersApplied') : t('tasks.noFilters')}
          </div>
          <div className="flex items-center gap-2">
            {hasFilters && (
              <Link
                href="/owner/tasks"
                className="inline-flex h-8 items-center gap-1 rounded-full border border-surface-2 bg-surface-0 px-3 text-xs text-text-2 hover:bg-surface-1"
              >
                <X className="h-3 w-3" /> {t('common.clear')}
              </Link>
            )}
            <button
              type="submit"
              className="inline-flex h-8 items-center rounded-full bg-brand-600/10 px-3 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-600/30 hover:bg-brand-600/15"
            >
              {t('common.apply')}
            </button>
          </div>
        </div>
      </form>

      {tasks.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-surface-2 bg-surface-0">
          {hasFilters ? (
            <EmptyState
              icon={SearchX}
              tone="neutral"
              title={t('tasks.noMatches')}
              description={t('tasks.tryAdjust')}
            />
          ) : (
            <EmptyState
              icon={ListChecks}
              title={t('tasks.empty')}
              description={t('tasks.emptyHint')}
              actions={[
                { label: 'Programar limpieza', href: '/owner/tasks/new' },
              ]}
            />
          )}
        </div>
      ) : (
        <ul className="mt-5 space-y-2">
          {tasks.map((x) => (
            <li key={x.id}>
              <Link
                href={`/owner/tasks/${x.id}`}
                className="flex items-start gap-3 rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card transition hover:border-brand-600/30 hover:shadow-card-lg"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-semibold text-text-1">
                    {x.property?.name ?? t('dashboard.propertyRemoved')}
                  </p>
                  <p className="mt-0.5 text-xs text-text-2">
                    {new Date(x.scheduled_for).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                    {x.cleaner?.name
                      ? ` · ${x.cleaner.name}`
                      : ` · ${t('common.unassigned')}`}
                  </p>
                  {x.notes && (
                    <p className="mt-2 text-[11px] text-text-3">{x.notes}</p>
                  )}
                  {x.checked_in_at && (
                    <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-brand-700">
                      <MapPin className="h-3 w-3" />
                      {t('tasks.checkedInAt').replace(
                        '{time}',
                        new Date(x.checked_in_at).toLocaleString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: 'numeric',
                          month: 'short',
                        }),
                      )}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {x.photo_url && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={x.photo_url}
                      alt="Evidence"
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                  )}
                  <StatusPill status={x.status} t={t} />
                  <ChevronRight className="h-4 w-4 shrink-0 text-text-3" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      </div>
    </LightLayout>
  );
}

function StatusPill({ status, t }: { status: string; t: (k: string) => string }) {
  const map: Record<string, { label: string; cls: string }> = {
    scheduled: { label: t('status.scheduled'), cls: 'bg-amber-50 text-amber-700 ring-amber-200' },
    in_progress: { label: t('status.in_progress'), cls: 'bg-sky-50 text-sky-700 ring-sky-200' },
    completed: { label: t('status.completed'), cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
    cancelled: { label: t('status.cancelled'), cls: 'bg-rose-50 text-rose-700 ring-rose-200' },
  };
  const it = map[status] ?? map.scheduled;
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${it.cls}`}
    >
      {it.label}
    </span>
  );
}
