import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  ListChecks,
  MapPin,
  Plus,
  Search,
  SearchX,
  Sparkles,
  StickyNote,
  X,
  XCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import { EmptyState } from '@/components/EmptyState';
import { TasksAutoRefresh } from '@/components/owner/TasksAutoRefresh';
import { CsvExportButton } from '@/components/CsvExportButton';
import { getT } from '@/lib/i18n';
import { acceptBookingRequest, rejectBookingRequest } from './actions';

type SearchParams = Promise<{
  q?: string;
  status?: string;
  property?: string;
  cleaner?: string;
  from?: string;
  to?: string;
  flash?: string;
  error?: string;
}>;

type TaskRow = {
  id: string;
  scheduled_for: string;
  start_time: string | null;
  status: string;
  notes: string | null;
  checked_in_at: string | null;
  checkin_lat: number | null;
  checkin_lng: number | null;
  photo_url: string | null;
  property_id: string | null;
  cleaner_id: string | null;
  service_name: string | null;
  price_pence: number | null;
  payment_status: string | null;
  paid_at: string | null;
  property: { name: string } | null;
  cleaner: { name: string } | null;
  client: { name: string } | null;
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
  const { q, status, property, cleaner, from, to, flash, error: flashError } =
    await searchParams;
  const effectiveStatus = status && status !== 'all' ? status : null;

  const STATUS_OPTIONS = [
    { value: 'all', label: t('tasks.filterAll') },
    { value: 'requested', label: 'Solicitudes' },
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
      'id, scheduled_for, start_time, status, notes, checked_in_at, checkin_lat, checkin_lng, photo_url, property_id, cleaner_id, service_name, price_pence, payment_status, paid_at, property:properties (name), cleaner:cleaners (name), client:clients (name)',
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
    <LightLayout activeTab="tasks" title="Limpiezas">
      <TasksAutoRefresh ownerId={user.id} />
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
          <CsvExportButton
            rows={tasks.map((x) => ({
              scheduled_for: x.scheduled_for,
              start_time: x.start_time ?? '',
              status: x.status,
              property: x.property?.name ?? '',
              cleaner: x.cleaner?.name ?? '',
              price_pence: x.price_pence ?? '',
              payment_status: x.payment_status ?? '',
              paid_at: x.paid_at ?? '',
            }))}
            filename="limpiezas"
            headers={[
              { key: 'scheduled_for', label: 'Fecha' },
              { key: 'start_time', label: 'Hora' },
              { key: 'status', label: 'Estado' },
              { key: 'property', label: 'Propiedad' },
              { key: 'cleaner', label: 'Limpiador' },
              { key: 'price_pence', label: 'Precio (pence)' },
              { key: 'payment_status', label: 'Pago' },
              { key: 'paid_at', label: 'Cobrado' },
            ]}
          />
          <Link
            href="/owner/tasks/new"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-gradient px-4 text-sm font-semibold text-white shadow-brand-glow transition hover:brightness-110 active:scale-[0.99]"
          >
            <Plus className="h-4 w-4" /> {t('tasks.addBtn')}
          </Link>
        </div>
      </div>

      {flash === 'accepted' ? (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
          ✓ Solicitud aceptada. La tarea ya está en agenda — asígnale un cleaner desde el detalle.
        </p>
      ) : flash === 'rejected' ? (
        <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700">
          Solicitud rechazada (status: cancelled).
        </p>
      ) : null}
      {flashError ? (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {flashError}
        </p>
      ) : null}

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

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
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
          {tasks.map((x) =>
            x.status === 'requested' ? (
              <RequestedRow key={x.id} task={x} />
            ) : (
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
            ),
          )}
        </ul>
      )}

      </div>
    </LightLayout>
  );
}

function RequestedRow({ task }: { task: TaskRow }) {
  const dateLabel = new Date(task.scheduled_for + 'T00:00:00').toLocaleDateString(
    'es-ES',
    { weekday: 'long', day: 'numeric', month: 'short' },
  );
  return (
    <li>
      <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50/70 via-white to-white p-4 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-700">
              <Sparkles className="h-3 w-3" /> Solicitud nueva
            </p>
            <p className="mt-1 font-display text-sm font-semibold text-text-1">
              {task.client?.name ?? 'Cliente'} ·{' '}
              <span className="text-text-2">
                {task.service_name ?? 'Limpieza'}
              </span>
            </p>
            <p className="mt-0.5 text-[11.5px] text-text-3">
              <Calendar className="-mt-0.5 mr-1 inline h-3 w-3" />
              {dateLabel}
              {task.start_time ? ` · ${task.start_time.slice(0, 5)}` : ''}
            </p>
            {task.notes ? (
              <p className="mt-2 inline-flex items-start gap-1.5 rounded-lg bg-violet-100/50 px-2.5 py-1.5 text-[11px] text-violet-900">
                <StickyNote className="mt-0.5 h-3 w-3 shrink-0" />
                <span className="line-clamp-3">{task.notes}</span>
              </p>
            ) : null}
          </div>
          <Link
            href={`/owner/tasks/${task.id}`}
            className="inline-flex h-7 shrink-0 items-center gap-1 rounded-full border border-violet-300 px-2.5 text-[10px] font-semibold text-violet-700 hover:bg-violet-100/60"
          >
            Ver
          </Link>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 border-t border-violet-100 pt-3">
          <form action={acceptBookingRequest}>
            <input type="hidden" name="task_id" value={task.id} />
            <button
              type="submit"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-3.5 text-[12px] font-bold text-white shadow-[0_6px_16px_-6px_rgba(5,150,105,0.45)] transition hover:brightness-110"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Aceptar
            </button>
          </form>
          <form action={rejectBookingRequest}>
            <input type="hidden" name="task_id" value={task.id} />
            <button
              type="submit"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3.5 text-[12px] font-semibold text-rose-700 transition hover:bg-rose-50"
            >
              <XCircle className="h-3.5 w-3.5" /> Rechazar
            </button>
          </form>
          <p className="ml-auto self-center text-[10.5px] text-violet-700/70">
            Aceptar deja la tarea en agenda — asigna cleaner desde el detalle.
          </p>
        </div>
      </div>
    </li>
  );
}

function StatusPill({ status, t }: { status: string; t: (k: string) => string }) {
  const map: Record<string, { label: string; cls: string }> = {
    requested: { label: 'Solicitada', cls: 'bg-violet-50 text-violet-700 ring-violet-200' },
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
