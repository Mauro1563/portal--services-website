import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import {
  BadgePoundSterling,
  Camera,
  CheckCircle2,
  Maximize2,
  Pencil,
  RotateCcw,
  StickyNote,
  Trash2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import {
  cancelTaskDetail,
  deleteTaskDetail,
  markTaskPaid,
  quickAssignCleaner,
} from './actions';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    updated?: string;
    cancelled?: string;
    error?: string;
  }>;
};

type TaskRow = {
  id: string;
  scheduled_for: string;
  status: string;
  notes: string | null;
  checked_in_at: string | null;
  completed_at: string | null;
  checkin_lat: number | null;
  checkin_lng: number | null;
  photo_url: string | null;
  service_name: string | null;
  price_pence: number | null;
  payment_status: string;
  payment_method: string | null;
  paid_amount_pence: number | null;
  paid_at: string | null;
  property: { id: string; name: string; address: string | null } | null;
  cleaner: { id: string; name: string } | null;
};

function statusInfo(status: string) {
  if (status === 'completed')
    return {
      label: 'Completada',
      icon: CheckCircle2,
      pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
      stripe: 'bg-emerald-50/60',
    };
  if (status === 'in_progress')
    return {
      label: 'En progreso',
      icon: CheckCircle2,
      pill: 'bg-sky-50 text-sky-700 ring-sky-200',
      stripe: 'bg-sky-50/60',
    };
  if (status === 'cancelled')
    return {
      label: 'Cancelada',
      icon: CheckCircle2,
      pill: 'bg-rose-50 text-rose-700 ring-rose-200',
      stripe: 'bg-rose-50/60',
    };
  return {
    label: 'Pendiente',
    icon: CheckCircle2,
    pill: 'bg-amber-50 text-amber-700 ring-amber-200',
    stripe: 'bg-amber-50/60',
  };
}

function fmtTime(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function durationLabel(start: string | null, end: string | null) {
  if (!start || !end) return '—';
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const minutes = Math.max(0, Math.round(ms / 60000));
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  }
  return `${minutes} min`;
}

function timestampLabel(scheduled: string, completed: string | null) {
  const date = completed ?? scheduled;
  const d = new Date(date);
  const today = new Date().toISOString().slice(0, 10);
  const iso = d.toISOString().slice(0, 10);
  const prefix = iso === today ? 'Hoy' : d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  if (!completed) return prefix;
  return `${prefix}, ${fmtTime(completed)}`;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default async function TaskDetail({ params, searchParams }: Props) {
  const { id } = await params;
  const { updated, cancelled, error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const [{ data }, { data: cleanersList }, { data: photosData }, { data: ratingData }] =
    await Promise.all([
      supabase
        .from('tasks')
        .select(
          'id, scheduled_for, status, notes, checked_in_at, completed_at, checkin_lat, checkin_lng, photo_url, service_name, price_pence, payment_status, payment_method, paid_amount_pence, paid_at, property:properties (id, name, address), cleaner:cleaners (id, name)',
        )
        .eq('id', id)
        .maybeSingle(),
      supabase.from('cleaners').select('id, name').order('name'),
      supabase
        .from('task_photos')
        .select('id, url, created_at')
        .eq('task_id', id)
        .order('created_at', { ascending: true }),
      supabase
        .from('task_ratings')
        .select('stars, comment, created_at')
        .eq('task_id', id)
        .maybeSingle(),
    ]);

  const task = data as unknown as TaskRow | null;
  if (!task) notFound();
  const photos = (photosData ?? []) as { id: string; url: string; created_at: string }[];
  const rating = ratingData as { stars: number; comment: string | null; created_at: string } | null;

  const st = statusInfo(task.status);
  const StatusIcon = st.icon;

  return (
    <LightLayout
      activeTab="tasks"
      title="Tarea"
      showBack
      backHref="/owner/tasks"
      rightSlot={
        <Link
          href={`/owner/tasks/${task.id}/edit`}
          aria-label="Edit"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/[0.06]"
        >
          <Pencil className="h-4.5 w-4.5" />
        </Link>
      }
    >
      {/* Status hero card */}
      <section
        className={`overflow-hidden rounded-3xl border border-surface-2 ${st.stripe} shadow-card`}
      >
        <div className="bg-surface-0 p-5">
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${st.pill}`}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              {st.label}
            </span>
            <span className="text-[11px] text-text-2">
              {timestampLabel(task.scheduled_for, task.completed_at)}
            </span>
          </div>

          <h1 className="mt-3 font-display text-xl font-semibold text-text-1">
            {task.property?.name ?? 'Propiedad eliminada'}
          </h1>
          {task.property?.address && (
            <p className="mt-0.5 text-xs text-text-2">{task.property.address}</p>
          )}

          {/* Timeline row: check-in / check-out / duration */}
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-surface-2 pt-4">
            <Timeline label="Check-in" value={fmtTime(task.checked_in_at)} />
            <Timeline label="Check-out" value={fmtTime(task.completed_at)} />
            <Timeline
              label="Duración"
              value={durationLabel(task.checked_in_at, task.completed_at)}
            />
          </div>
        </div>
      </section>

      {/* Flash messages */}
      {updated && (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          Limpieza actualizada.
        </p>
      )}
      {cancelled && (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Limpieza cancelada.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      )}

      {/* Photo gallery (multi-photo) */}
      <section className="mt-5">
        <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-text-3">
          Photos ({photos.length || (task.photo_url ? 1 : 0)})
        </h2>
        {photos.length > 0 ? (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {photos.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-xl border border-surface-2 bg-surface-0 shadow-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt="Cleaning" className="block aspect-square w-full object-cover" />
                <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-text-1 shadow-card transition group-hover:bg-white">
                  <Maximize2 className="h-3 w-3" />
                </span>
              </a>
            ))}
          </div>
        ) : task.photo_url ? (
          <a
            href={task.photo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mt-2 block overflow-hidden rounded-2xl border border-surface-2 bg-surface-0 shadow-card"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={task.photo_url}
              alt="Photo evidence"
              className="block w-full"
            />
            <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-text-1 shadow-card transition group-hover:bg-white">
              <Maximize2 className="h-4 w-4" />
            </span>
          </a>
        ) : (
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-dashed border-surface-2 bg-surface-0 p-5 text-sm text-text-2">
            <Camera className="h-5 w-5 text-text-3" />
            <span>
              No photos yet. The cleaner will upload them on completion.
            </span>
          </div>
        )}
      </section>

      {/* Client rating, if any */}
      {rating ? (
        <section className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-card">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-3">
            Client rating
          </h2>
          <div className="mt-2 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className={`text-lg ${n <= rating.stars ? 'text-amber-500' : 'text-surface-2'}`}
              >
                ★
              </span>
            ))}
            <span className="ml-2 text-[11px] text-text-3">
              {new Date(rating.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          {rating.comment ? (
            <p className="mt-2 rounded-xl border border-amber-200 bg-surface-0 p-3 text-sm text-text-1">
              {rating.comment}
            </p>
          ) : null}
        </section>
      ) : null}

      {/* Notas */}
      {task.notes && (
        <section className="mt-5">
          <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-text-3">
            Notas
          </h2>
          <div className="mt-2 rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card">
            <div className="flex items-start gap-2 text-sm text-text-1">
              <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-text-3" />
              <p>{task.notes}</p>
            </div>
          </div>
        </section>
      )}

      {/* Pago */}
      <section className="mt-5">
        <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-text-3">
          Pago
        </h2>
        <PaymentCard task={task} />
      </section>

      {/* Limpiadora — quick assign */}
      <section className="mt-5">
        <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-text-3">
          Limpiadora
        </h2>
        <div className="mt-2 rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600/10 text-sm font-semibold text-brand-700">
              {task.cleaner ? initials(task.cleaner.name) : '?'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-semibold text-text-1">
                {task.cleaner?.name ?? 'Sin asignar'}
              </p>
              {task.cleaner && (
                <Link
                  href={`/owner/cleaners/${task.cleaner.id}`}
                  className="text-[11px] text-brand-600 hover:text-brand-700"
                >
                  Ver perfil →
                </Link>
              )}
            </div>
          </div>

          <form action={quickAssignCleaner} className="mt-3 flex items-center gap-2">
            <input type="hidden" name="task_id" value={task.id} />
            <select
              name="cleaner_id"
              defaultValue={task.cleaner?.id ?? ''}
              className="h-9 min-w-0 flex-1 rounded-xl border border-surface-2 bg-surface-0 px-3 text-xs text-text-1 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            >
              <option value="">Sin asignar</option>
              {(cleanersList ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="inline-flex h-9 items-center rounded-xl bg-brand-600/10 px-3 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-600/20 hover:bg-brand-600/15"
            >
              {task.cleaner ? 'Reasignar' : 'Asignar'}
            </button>
          </form>
        </div>
      </section>

      {/* Map link (if we have GPS) */}
      {task.checkin_lat != null && task.checkin_lng != null && (
        <section className="mt-5">
          <a
            href={`https://maps.google.com/?q=${task.checkin_lat},${task.checkin_lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card hover:border-brand-600/30"
          >
            <div>
              <p className="text-sm font-medium text-text-1">Ubicación del check-in</p>
              <p className="mt-0.5 text-[11px] text-text-2">
                {task.checkin_lat.toFixed(4)}, {task.checkin_lng.toFixed(4)}
              </p>
            </div>
            <span className="text-xs text-brand-600">Abrir mapa →</span>
          </a>
        </section>
      )}

      {/* Property history CTA */}
      {task.property && (
        <div className="mt-6">
          <Link
            href={`/owner/properties/${task.property.id}?tab=historial`}
            className="flex h-12 w-full items-center justify-center rounded-2xl border border-brand-600/40 bg-surface-0 text-sm font-semibold text-brand-700 hover:bg-brand-600/[0.04]"
          >
            Ver historial de la propiedad
          </Link>
        </div>
      )}

      {/* Danger zone */}
      <section className="mt-6 mb-4 rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
        <h2 className="text-xs font-semibold text-rose-700">Zona de riesgo</h2>
        <p className="mt-1 text-[11px] text-rose-700/80">
          Cancelar mantiene el registro. Borrar elimina la limpieza, su check-in y la foto.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {task.status !== 'cancelled' && task.status !== 'completed' && (
            <form action={cancelTaskDetail}>
              <input type="hidden" name="task_id" value={task.id} />
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-amber-300 bg-white px-3 text-xs font-medium text-amber-700 hover:bg-amber-50"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Cancelar
              </button>
            </form>
          )}
          <form action={deleteTaskDetail}>
            <input type="hidden" name="task_id" value={task.id} />
            <button
              type="submit"
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-rose-300 bg-white px-3 text-xs font-medium text-rose-700 hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" /> Borrar
            </button>
          </form>
        </div>
      </section>
    </LightLayout>
  );
}

function money(pence: number | null) {
  if (pence == null) return null;
  return `£${(pence / 100).toFixed(2)}`;
}

const PAYMENT_PILL: Record<string, string> = {
  paid: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  partial: 'bg-amber-50 text-amber-700 ring-amber-200',
  waived: 'bg-slate-100 text-slate-600 ring-slate-200',
  pending: 'bg-rose-50 text-rose-700 ring-rose-200',
};

const PAYMENT_LABEL: Record<string, string> = {
  paid: 'Pagada',
  partial: 'Pago parcial',
  waived: 'Sin cobro',
  pending: 'Pendiente',
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  cash: '💵 Efectivo',
  card: '💳 Tarjeta',
  transfer: '🏦 Transferencia',
  bacs: '📮 BACS',
  apple_pay: '🍎 Apple Pay',
  google_pay: '🔵 Google Pay',
  other: '📋 Otro',
};

function PaymentCard({ task }: { task: TaskRow }) {
  const price = money(task.price_pence);
  const paid = money(task.paid_amount_pence);
  const status = task.payment_status || 'pending';
  const pill = PAYMENT_PILL[status] ?? PAYMENT_PILL.pending;
  const label = PAYMENT_LABEL[status] ?? status;
  const isClosed = status === 'paid' || status === 'waived';

  return (
    <div className="mt-2 rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {task.service_name ? (
            <p className="truncate text-[11px] uppercase tracking-wider text-text-3">
              {task.service_name}
            </p>
          ) : null}
          <p className="mt-0.5 font-display text-xl font-semibold tabular-nums text-text-1">
            {price ?? '—'}
          </p>
          {status === 'partial' && paid ? (
            <p className="mt-1 text-[11px] text-text-2">
              Pagado: <span className="font-semibold tabular-nums">{paid}</span>
              {price ? ` de ${price}` : ''}
            </p>
          ) : null}
          {task.payment_method && isClosed ? (
            <p className="mt-1 text-[11px] text-text-2">
              {PAYMENT_METHOD_LABEL[task.payment_method] ?? task.payment_method}
              {task.paid_at
                ? ` · ${new Date(task.paid_at).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                  })}`
                : ''}
            </p>
          ) : null}
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${pill}`}
        >
          {label}
        </span>
      </div>

      {!isClosed ? (
        <form
          action={markTaskPaid}
          className="mt-3 flex flex-wrap items-center gap-2 border-t border-surface-2 pt-3"
        >
          <input type="hidden" name="task_id" value={task.id} />
          <select
            name="payment_method"
            defaultValue={task.payment_method ?? ''}
            className="h-9 min-w-0 flex-1 rounded-xl border border-surface-2 bg-surface-0 px-3 text-xs text-text-1 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
          >
            <option value="">Método…</option>
            <option value="cash">💵 Efectivo</option>
            <option value="card">💳 Tarjeta</option>
            <option value="transfer">🏦 Transferencia</option>
            <option value="bacs">📮 BACS</option>
            <option value="apple_pay">🍎 Apple Pay</option>
            <option value="google_pay">🔵 Google Pay</option>
            <option value="other">📋 Otro</option>
          </select>
          <button
            type="submit"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-500/30 hover:bg-emerald-500/15"
          >
            <BadgePoundSterling className="h-3.5 w-3.5" /> Marcar pagada
          </button>
        </form>
      ) : null}
    </div>
  );
}

function Timeline({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-text-3">
        {label}
      </p>
      <p className="mt-1 font-display text-base font-semibold tabular-nums text-text-1">
        {value}
      </p>
    </div>
  );
}
