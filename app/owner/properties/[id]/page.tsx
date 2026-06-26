import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import {
  ArrowRight,
  Building2,
  Calendar,
  Pencil,
  RefreshCw,
  Trash2,
  User,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import { deleteProperty, syncProperty } from './actions';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    error?: string;
    tab?: string;
  }>;
};

type TaskRow = {
  id: string;
  scheduled_for: string;
  status: string;
  estimated_duration_min: number | null;
  cleaner: { name: string } | null;
};

type LinkedClient = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  postcode: string | null;
  key_info: string | null;
  wifi_info: string | null;
};

type PropertyRow = {
  id: string;
  name: string;
  address: string | null;
  notes: string | null;
  airbnb_ical_url: string | null;
  platform: string | null;
  guests: number | null;
  floor_area_sqm: number | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  client_id: string | null;
  client: LinkedClient | LinkedClient[] | null;
  created_at: string;
};

const TABS = [
  { key: 'resumen', label: 'Resumen' },
  { key: 'calendario', label: 'Calendario' },
  { key: 'detalles', label: 'Detalles' },
  { key: 'historial', label: 'Historial' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

function platformLabel(p: string | null): string {
  if (!p) return 'Directo';
  if (p === 'airbnb') return 'Airbnb';
  if (p === 'booking') return 'Booking.com';
  if (p === 'direct') return 'Directo';
  return 'Otro';
}

export default async function PropertyDetail({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const tab: TabKey =
    (TABS.find((t) => t.key === sp.tab)?.key as TabKey) ?? 'resumen';

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const { data } = await supabase
    .from('properties')
    .select(
      'id, name, address, notes, airbnb_ical_url, platform, guests, floor_area_sqm, contact_name, contact_phone, contact_email, client_id, created_at, client:clients (id, name, phone, email, postcode, key_info, wifi_info)',
    )
    .eq('id', id)
    .maybeSingle();

  const property = data as unknown as PropertyRow | null;
  if (!property) notFound();

  const { data: tasksRaw } = await supabase
    .from('tasks')
    .select(
      'id, scheduled_for, status, estimated_duration_min, cleaner:cleaners (name)',
    )
    .eq('property_id', id)
    .order('scheduled_for', { ascending: true });

  const tasks = (tasksRaw ?? []) as unknown as TaskRow[];
  const today = new Date().toISOString().split('T')[0];
  const upcoming = tasks.filter((t) => t.scheduled_for >= today);
  const past = tasks
    .filter((t) => t.scheduled_for < today)
    .reverse()
    .slice(0, 30);
  const nextTask = upcoming[0] ?? null;

  return (
    <LightLayout
      activeTab="properties"
      title="Propiedad"
      showBack
      backHref="/owner/properties"
      rightSlot={
        <Link
          href={`/owner/properties/${property.id}/edit`}
          aria-label="Edit"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/[0.06]"
        >
          <Pencil className="h-4.5 w-4.5" />
        </Link>
      }
    >
      {/* Property header card */}
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy-900 text-white">
          <Building2 className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-xl font-semibold text-text-1">
            {property.name}
          </h1>
          {property.address && (
            <p className="mt-0.5 text-xs text-text-2">{property.address}</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <nav className="mt-5 flex gap-1 overflow-x-auto border-b border-surface-2">
        {TABS.map((t) => {
          const active = t.key === tab;
          return (
            <Link
              key={t.key}
              href={`/owner/properties/${property.id}?tab=${t.key}`}
              className={
                'shrink-0 px-3 pb-2 text-sm font-medium transition-colors ' +
                (active
                  ? 'border-b-2 border-brand-600 text-brand-600'
                  : 'border-b-2 border-transparent text-text-2 hover:text-text-1')
              }
              aria-current={active ? 'page' : undefined}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>

      {sp.error && (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {sp.error}
        </p>
      )}

      {/* Tab content */}
      {tab === 'resumen' && (
        <ResumenTab nextTask={nextTask} property={property} />
      )}
      {tab === 'calendario' && (
        <CalendarTab upcoming={upcoming} propertyId={property.id} />
      )}
      {tab === 'detalles' && <DetallesTab property={property} />}
      {tab === 'historial' && <HistorialTab past={past} />}

      {/* CTA */}
      <div className="mt-6 mb-4">
        <Link
          href={`/owner/calendar?property=${property.id}`}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand-gradient text-sm font-semibold text-white shadow-brand-glow active:scale-[0.99]"
        >
          Ver calendario completo
        </Link>
      </div>

      {/* Danger zone (always visible at the bottom) */}
      <section className="mt-6 rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
        <h2 className="text-xs font-semibold text-rose-700">Zona de riesgo</h2>
        <p className="mt-1 text-[11px] text-rose-700/80">
          Borrar la propiedad también elimina todas sus limpiezas. No se puede deshacer.
        </p>
        <form action={deleteProperty} className="mt-3">
          <input type="hidden" name="property_id" value={property.id} />
          <button
            type="submit"
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-rose-300 bg-white px-3 text-xs font-medium text-rose-700 hover:bg-rose-50"
          >
            <Trash2 className="h-3.5 w-3.5" /> Borrar propiedad
          </button>
        </form>
      </section>
    </LightLayout>
  );
}

// ----- Tabs ------------------------------------------------------------------

function ResumenTab({
  nextTask,
  property,
}: {
  nextTask: TaskRow | null;
  property: PropertyRow;
}) {
  const client = Array.isArray(property.client)
    ? property.client[0] ?? null
    : property.client;

  return (
    <div className="mt-5 space-y-5">
      {/* Cliente vinculado */}
      {client ? (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-3">
            Cliente
          </h2>
          <Link
            href={`/owner/clients/${client.id}`}
            className="mt-2 flex items-center gap-3 rounded-2xl border border-cyan-200 bg-cyan-50/40 p-4 shadow-card transition hover:border-brand-600/40 hover:bg-cyan-50/60"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600/10 text-brand-700">
              <User className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-semibold text-text-1">
                {client.name}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-text-3">
                {[client.phone, client.email].filter(Boolean).join(' · ') ||
                  'Sin datos de contacto'}
              </p>
            </div>
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-brand-700">
              Abrir →
            </span>
          </Link>
        </section>
      ) : property.contact_name ||
        property.contact_phone ||
        property.contact_email ? (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-3">
            Contacto del dueño
          </h2>
          <div className="mt-2 rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <User className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-semibold text-text-1">
                  {property.contact_name ?? 'Sin nombre'}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-text-3">
                  {[property.contact_phone, property.contact_email]
                    .filter(Boolean)
                    .join(' · ') || '—'}
                </p>
                <p className="mt-2 text-[11px] text-text-3">
                  Contacto suelto. Si querés un portal cliente +
                  chat,{' '}
                  <Link
                    href={`/owner/clients/new`}
                    className="font-semibold text-brand-700 hover:underline"
                  >
                    creá un cliente
                  </Link>{' '}
                  y vinculalo desde el editor de la propiedad.
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Próxima limpieza */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-3">
          Próxima limpieza
        </h2>
        {nextTask ? (
          <Link
            href={`/owner/tasks/${nextTask.id}`}
            className="mt-2 flex items-center gap-3 rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card transition hover:border-brand-600/30 hover:shadow-card-lg"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600/10">
              <Calendar className="h-4.5 w-4.5 text-brand-600" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-semibold text-text-1">
                {dateLabel(nextTask.scheduled_for)}
              </p>
              <p className="mt-0.5 text-[11px] text-text-2">
                Checkout: {platformLabel(property.platform)}
                {nextTask.estimated_duration_min
                  ? ` · ${formatDuration(nextTask.estimated_duration_min)} estimadas`
                  : ''}
              </p>
            </div>
            <StatusPill status={nextTask.status} />
          </Link>
        ) : (
          <div className="mt-2 rounded-2xl border border-dashed border-surface-2 bg-surface-0 p-4 text-center text-sm text-text-2">
            No hay próximas limpiezas.{' '}
            <Link href="/owner/tasks/new" className="text-brand-600 hover:text-brand-700">
              Programar →
            </Link>
          </div>
        )}
      </section>

      {/* Información rápida */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-3">
          Información
        </h2>
        <ul className="mt-2 divide-y divide-surface-2 overflow-hidden rounded-2xl border border-surface-2 bg-surface-0 shadow-card">
          <InfoRow label="Plataforma" value={platformLabel(property.platform)} />
          {property.airbnb_ical_url && (
            <InfoRow
              label="URL iCal"
              value={shortUrl(property.airbnb_ical_url)}
              monospace
            />
          )}
          {property.guests != null && (
            <InfoRow label="Huéspedes" value={String(property.guests)} />
          )}
          {property.floor_area_sqm != null && (
            <InfoRow label="Superficie" value={`${property.floor_area_sqm} m²`} />
          )}
          {property.notes && <InfoRow label="Notas" value={property.notes} wrap />}
        </ul>
      </section>
    </div>
  );
}

function CalendarTab({
  upcoming,
  propertyId,
}: {
  upcoming: TaskRow[];
  propertyId: string;
}) {
  return (
    <div className="mt-5">
      <div className="flex items-end justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-3">
          Próximas ({upcoming.length})
        </h2>
        <Link
          href={`/owner/calendar?property=${propertyId}`}
          className="text-xs font-medium text-brand-600 hover:text-brand-700"
        >
          Vista mensual →
        </Link>
      </div>

      {upcoming.length === 0 ? (
        <div className="mt-3 rounded-2xl border border-dashed border-surface-2 bg-surface-0 p-4 text-center text-sm text-text-2">
          No hay limpiezas programadas.{' '}
          <Link href="/owner/tasks/new" className="text-brand-600 hover:text-brand-700">
            Programar <ArrowRight className="inline h-3 w-3" />
          </Link>
        </div>
      ) : (
        <ul className="mt-3 space-y-2">
          {upcoming.map((t) => (
            <li key={t.id}>
              <Link
                href={`/owner/tasks/${t.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-surface-2 bg-surface-0 px-4 py-3 shadow-card hover:border-brand-600/30"
              >
                <div className="min-w-0">
                  <p className="font-display text-sm font-semibold text-text-1">
                    {dateLabel(t.scheduled_for)}
                  </p>
                  <p className="mt-0.5 text-[11px] text-text-2">
                    {t.cleaner?.name ?? 'Sin asignar'}
                  </p>
                </div>
                <StatusPill status={t.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DetallesTab({ property }: { property: PropertyRow }) {
  return (
    <div className="mt-5 space-y-5">
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-3">
          Detalles
        </h2>
        <ul className="mt-2 divide-y divide-surface-2 overflow-hidden rounded-2xl border border-surface-2 bg-surface-0 shadow-card">
          <InfoRow label="Nombre" value={property.name} />
          {property.address && <InfoRow label="Dirección" value={property.address} />}
          <InfoRow label="Plataforma" value={platformLabel(property.platform)} />
          <InfoRow label="Huéspedes" value={property.guests?.toString() ?? '—'} />
          <InfoRow
            label="Superficie"
            value={property.floor_area_sqm ? `${property.floor_area_sqm} m²` : '—'}
          />
          <InfoRow
            label="iCal"
            value={property.airbnb_ical_url ? shortUrl(property.airbnb_ical_url) : '—'}
            monospace
          />
          {property.notes && <InfoRow label="Notas" value={property.notes} wrap />}
          <InfoRow
            label="Creada"
            value={new Date(property.created_at).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          />
        </ul>
      </section>

      {/* iCal sync */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-3">
          Sincronización iCal
        </h2>
        {property.airbnb_ical_url ? (
          <form
            action={syncProperty}
            className="mt-2 flex items-center justify-between gap-3 rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card"
          >
            <div>
              <p className="text-sm font-medium text-text-1">Sincronizar ahora</p>
              <p className="mt-0.5 text-[11px] text-text-3">
                El cron diario corre a las 06:00 UTC.
              </p>
            </div>
            <input type="hidden" name="property_id" value={property.id} />
            <button
              type="submit"
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-brand-gradient px-3 text-xs font-medium text-white shadow-brand-glow"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Sync
            </button>
          </form>
        ) : (
          <div className="mt-2 rounded-2xl border border-dashed border-surface-2 bg-surface-0 p-4 text-sm text-text-2">
            Sin URL iCal. Toca <em>Editar</em> arriba y pega la URL desde Airbnb →
            Calendario.
          </div>
        )}
      </section>
    </div>
  );
}

function HistorialTab({ past }: { past: TaskRow[] }) {
  if (past.length === 0) {
    return (
      <div className="mt-5 rounded-2xl border border-dashed border-surface-2 bg-surface-0 p-6 text-center text-sm text-text-2">
        Sin historial todavía.
      </div>
    );
  }
  return (
    <div className="mt-5">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-text-3">
        Últimas {past.length}
      </h2>
      <ul className="mt-2 space-y-2">
        {past.map((t) => (
          <li key={t.id}>
            <Link
              href={`/owner/tasks/${t.id}`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-surface-2 bg-surface-0 px-4 py-3 shadow-card hover:border-brand-600/30"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-1">
                  {dateLabel(t.scheduled_for)}
                </p>
                <p className="mt-0.5 text-[11px] text-text-2">
                  {t.cleaner?.name ?? 'Sin asignar'}
                </p>
              </div>
              <StatusPill status={t.status} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ----- Building blocks -------------------------------------------------------

function InfoRow({
  label,
  value,
  monospace,
  wrap,
}: {
  label: string;
  value: string;
  monospace?: boolean;
  wrap?: boolean;
}) {
  return (
    <li className="flex items-start justify-between gap-3 px-4 py-3">
      <span className="shrink-0 text-xs font-medium text-text-2">{label}</span>
      <span
        className={
          (monospace ? 'font-mono text-[11px] ' : 'text-sm ') +
          (wrap ? 'text-right' : 'truncate text-right') +
          ' text-text-1'
        }
      >
        {value}
      </span>
    </li>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    scheduled: {
      label: 'Pendiente',
      cls: 'bg-amber-50 text-amber-700 ring-amber-200',
    },
    in_progress: {
      label: 'En progreso',
      cls: 'bg-sky-50 text-sky-700 ring-sky-200',
    },
    completed: {
      label: 'Completada',
      cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    },
    cancelled: {
      label: 'Cancelada',
      cls: 'bg-rose-50 text-rose-700 ring-rose-200',
    },
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

function dateLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date().toISOString().slice(0, 10);
  if (iso === today) return 'Hoy';
  return d.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function shortUrl(url: string): string {
  try {
    const u = new URL(url);
    const host = u.host.replace(/^www\./, '');
    const path = u.pathname.length > 12 ? u.pathname.slice(0, 12) + '…' : u.pathname;
    return host + path;
  } catch {
    return url.length > 28 ? url.slice(0, 28) + '…' : url;
  }
}

function formatDuration(min: number): string {
  if (min >= 60) {
    const h = Math.floor(min / 60);
    const r = min % 60;
    return r ? `${h}h ${r}m` : `${h}h`;
  }
  return `${min}m`;
}
