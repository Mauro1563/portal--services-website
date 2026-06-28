import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Gift,
  KeyRound,
  MapPin,
  Phone,
  PoundSterling,
  StickyNote,
  User,
  Wifi,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { createAdminClient } from '@/lib/supabase/admin';
import { CheckInButton } from '../../CheckInButton';
import { PhotoUploadButton } from '../../PhotoUploadButton';
import { CleanerNoteForm } from './CleanerNoteForm';
import { ActualHoursForm } from './ActualHoursForm';
import { TaskChecklistSection } from './TaskChecklistSection';
import { CompletionGateForm } from './CompletionGateForm';
import type { ChecklistItem } from '@/components/tasks/TaskChecklist';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    note_saved?: string;
    hours_saved?: string;
    error?: string;
  }>;
};

type DetailTask = {
  id: string;
  scheduled_for: string;
  start_time: string | null;
  status: string;
  notes: string | null;
  cleaner_note: string | null;
  checked_in_at: string | null;
  completed_at: string | null;
  service_name: string | null;
  price_pence: number | null;
  estimated_duration_min: number | null;
  actual_hours: number | string | null;
  cleaner_pay_rate_pence: number | null;
  tip_pence: number | null;
  /** JSONB array — {key,label,done,doneAt?,doneByUserId?}. Empty for residential. */
  checklist: ChecklistItem[] | null;
  /** Minimum task_photos required before this task can be marked completed. */
  required_photos: number | null;
  property: {
    name: string | null;
    address: string | null;
    notes: string | null;
  } | null;
  client: {
    name: string | null;
    address: string | null;
    postcode: string | null;
    phone: string | null;
    key_info: string | null;
    wifi_info: string | null;
  } | null;
};

type Photo = { id: string; url: string; created_at: string };

function formatMoney(pence: number | null): string {
  return pence ? `£${(pence / 100).toFixed(2)}` : '—';
}

function formatHours(minutes: number | null): string {
  if (!minutes) return '—';
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${minutes}m`;
}

function formatTime(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

const STATUS_META: Record<string, { label: string; cls: string }> = {
  scheduled: { label: 'Scheduled', cls: 'bg-slate-100 text-slate-700' },
  in_progress: { label: 'In progress', cls: 'bg-amber-100 text-amber-800' },
  completed: { label: 'Completed', cls: 'bg-emerald-100 text-emerald-800' },
  cancelled: { label: 'Cancelled', cls: 'bg-rose-100 text-rose-700' },
};

export default async function OperativeTaskDetail({ params }: Props) {
  const { id } = await params;

  const cookieStore = await cookies();
  const cleanerId = cookieStore.get('cleaner_session')?.value;
  if (!cleanerId) redirect('/operative/login');

  const admin = createAdminClient();

  const [{ data: taskData }, { data: photosData }, { data: cleanerRow }] =
    await Promise.all([
      admin
        .from('tasks')
        .select(
          'id, scheduled_for, start_time, status, notes, cleaner_note, checked_in_at, completed_at, service_name, price_pence, estimated_duration_min, actual_hours, cleaner_pay_rate_pence, tip_pence, checklist, required_photos, property:properties (name, address, notes), client:clients (name, address, postcode, phone, key_info, wifi_info)',
        )
        .eq('id', id)
        .eq('cleaner_id', cleanerId)
        .maybeSingle(),
      admin
        .from('task_photos')
        .select('id, url, created_at')
        .eq('task_id', id)
        .order('created_at', { ascending: true }),
      // Default rate fallback for the live preview in the hours form
      // — per-task override wins, this is only used when the task
      // doesn't specify its own.
      admin
        .from('cleaners')
        .select('default_hourly_pay_pence')
        .eq('id', cleanerId)
        .maybeSingle(),
    ]);

  const task = taskData as unknown as DetailTask | null;
  if (!task) notFound();
  const photos = (photosData ?? []) as Photo[];
  const defaultPayRate =
    (cleanerRow as { default_hourly_pay_pence?: number } | null)
      ?.default_hourly_pay_pence ?? 0;
  const effectivePayRate =
    task.cleaner_pay_rate_pence ?? defaultPayRate;
  // actual_hours comes back from Postgres NUMERIC as either string or
  // number depending on the supabase-js codec — normalise to a display
  // string for the form's initial value.
  const initialHoursStr =
    task.actual_hours == null
      ? ''
      : typeof task.actual_hours === 'string'
        ? task.actual_hours
        : String(task.actual_hours);
  const tipPence = task.tip_pence ?? 0;

  const status = STATUS_META[task.status] ?? STATUS_META.scheduled;
  const scheduledDate = new Date(task.scheduled_for + 'T00:00:00Z');
  const isToday = task.scheduled_for === new Date().toISOString().slice(0, 10);

  // Normalise the JSONB array — Supabase returns `null`/`unknown` until the
  // column is populated, so coerce to a typed array we can hand to the
  // shared TaskChecklist / CompletionGate components.
  const checklistItems: ChecklistItem[] = Array.isArray(task.checklist)
    ? task.checklist
        .filter(
          (it): it is ChecklistItem =>
            !!it && typeof it.key === 'string' && typeof it.label === 'string',
        )
        .map((it) => ({
          key: it.key,
          label: it.label,
          done: !!it.done,
          doneAt: it.doneAt,
          doneByUserId: it.doneByUserId,
        }))
    : [];
  const requiredPhotos = task.required_photos ?? 0;
  const photosCount = photos.length;
  // An "Airbnb-style" task is anything that gates completion behind either a
  // checklist or a photo minimum. Residential tasks usually have neither, so
  // we keep the existing "tap PhotoUpload to complete" flow there and switch
  // to the gated CompletionGate only when there's actually something to gate.
  const isGatedTask = checklistItems.length > 0 || requiredPhotos > 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-canvas pb-16">
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

      <div className="mx-auto max-w-md px-4 py-6 space-y-5">
        {/* Status hero */}
        <section className="rounded-2xl border border-line bg-paper p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${status.cls}`}
            >
              {status.label}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-graphite-3">
              <Calendar className="h-3 w-3" />
              {scheduledDate.toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'short',
                timeZone: 'UTC',
              })}
              {isToday ? ' · TODAY' : ''}
              {task.start_time ? ` · ${task.start_time.slice(0, 5)}` : ''}
            </span>
          </div>
          {(() => {
            // Address priority: client's house (house_cleaning) wins, falls
            // back to property (airbnb). Postcode appended for GPS precision.
            const fallbackAddress = task.property?.address ?? null;
            const address = task.client?.address ?? fallbackAddress;
            const postcode = task.client?.postcode ?? null;
            const headline =
              task.client?.name ?? task.property?.name ?? 'Sin destino';
            const mapsQuery = [address, postcode].filter(Boolean).join(', ');
            return (
              <>
                <h1 className="mt-3 font-display text-xl font-semibold text-graphite-1">
                  {headline}
                </h1>
                {address ? (
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(mapsQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
                  >
                    <MapPin className="h-3.5 w-3.5" /> {address}
                    {postcode ? ` · ${postcode}` : ''}
                  </a>
                ) : null}
              </>
            );
          })()}

          {/* Meta row */}
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center">
            <Meta
              icon={<Clock className="h-3.5 w-3.5 text-brand-500" />}
              label="Duration"
              value={formatHours(task.estimated_duration_min)}
            />
            <Meta
              icon={<PoundSterling className="h-3.5 w-3.5 text-emerald-600" />}
              label="Service"
              value={formatMoney(task.price_pence)}
            />
            <Meta
              icon={<User className="h-3.5 w-3.5 text-slate-500" />}
              label="Client"
              value={task.client?.name ?? '—'}
            />
          </div>
        </section>

        {/* Service name (only if set and different from property) */}
        {task.service_name ? (
          <p className="text-center text-[11px] uppercase tracking-wider text-graphite-3">
            {task.service_name}
          </p>
        ) : null}

        {/* On-site info — keys, wifi, phone — pulled from the client. */}
        {task.client &&
        (task.client.key_info || task.client.wifi_info || task.client.phone) ? (
          <section className="rounded-2xl border border-surface-2 bg-surface-0 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-graphite-3">
              On-site info
            </p>
            <ul className="mt-3 space-y-3">
              {task.client.key_info ? (
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-700">
                    <KeyRound className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-graphite-3">
                      Llaves / acceso
                    </p>
                    <p className="mt-0.5 text-sm leading-relaxed text-graphite-1">
                      {task.client.key_info}
                    </p>
                  </div>
                </li>
              ) : null}
              {task.client.wifi_info ? (
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-cyan-50 text-brand-700">
                    <Wifi className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-graphite-3">
                      Wifi
                    </p>
                    <p className="mt-0.5 break-words font-mono text-sm text-graphite-1">
                      {task.client.wifi_info}
                    </p>
                  </div>
                </li>
              ) : null}
              {task.client.phone ? (
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                    <Phone className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-graphite-3">
                      Contacto
                    </p>
                    <a
                      href={`tel:${task.client.phone.replace(/\s+/g, '')}`}
                      className="mt-0.5 inline-block text-sm font-semibold text-brand-700 hover:underline"
                    >
                      {task.client.phone}
                    </a>
                  </div>
                </li>
              ) : null}
            </ul>
          </section>
        ) : null}

        {/* Notes from manager */}
        {task.notes ? (
          <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
              <StickyNote className="h-3 w-3" /> Note from manager
            </p>
            <p className="mt-2 text-sm leading-relaxed text-graphite-1">
              {task.notes}
            </p>
          </section>
        ) : null}

        {/* Airbnb-style checklist — only rendered when there's something to
            tick off. Residential tasks get an empty array and the section is
            skipped entirely (we don't want a hollow "0 de 0" card on every
            house-cleaning job). Read-only once the task is completed so the
            historical state stays visible without inviting further edits. */}
        {checklistItems.length > 0 ? (
          <TaskChecklistSection
            taskId={task.id}
            items={checklistItems}
            readOnly={task.status === 'completed' || task.status === 'cancelled'}
          />
        ) : null}

        {/* Cleaner → owner note (always editable while task is assigned) */}
        <CleanerNoteForm taskId={task.id} initial={task.cleaner_note ?? ''} />

        {/* Cleaner-reported hours — drives payroll. Kept editable on any
            non-cancelled task so a cleaner can correct yesterday's
            figure without bothering the manager. */}
        {task.status !== 'cancelled' ? (
          <ActualHoursForm
            taskId={task.id}
            initial={initialHoursStr}
            payRatePence={effectivePayRate}
            tipPence={tipPence}
          />
        ) : null}

        {/* Action area: changes by status */}
        {task.status === 'completed' ? (
          <section className="relative animate-fade-up overflow-hidden rounded-3xl border border-clean-mint/40 bg-gradient-to-br from-clean-mint-soft via-white to-clean-aqua-soft/40 p-6 text-center shadow-mint-glow">
            {/* Celebration sparkles */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-[18%] top-3 text-[14px] text-clean-aqua-glow animate-sparkle"
            >
              ✦
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute right-[14%] top-5 text-[10px] text-clean-mint animate-sparkle"
              style={{ animationDelay: '0.6s' }}
            >
              ✦
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute right-[22%] bottom-3 text-[12px] text-clean-aqua animate-sparkle"
              style={{ animationDelay: '1.3s' }}
            >
              ✦
            </span>
            <div className="relative">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-clean-mint text-white shadow-mint-glow animate-fade-in">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="mt-3 font-display text-base font-semibold text-graphite-1">
                ¡Listo!
              </p>
              <p className="mt-1 text-[11px] text-graphite-3">
                {task.checked_in_at && task.completed_at ? (
                  <>
                    Entrada {formatTime(task.checked_in_at)} · finalizada{' '}
                    {formatTime(task.completed_at)}
                  </>
                ) : task.completed_at ? (
                  <>Finalizada {formatTime(task.completed_at)}</>
                ) : null}
              </p>
              {/* Tip celebration — only shown on completed tasks where
                  the client actually tipped. We pull from tasks.tip_pence
                  directly (not derived) so the figure here matches the
                  payroll figure the owner sees. */}
              {tipPence > 0 ? (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-800 shadow-sm">
                  <Gift className="h-3 w-3" />
                  Propina recibida: £{(tipPence / 100).toFixed(2)}
                </p>
              ) : null}
            </div>
          </section>
        ) : task.status === 'in_progress' ? (
          <section className="rounded-2xl border border-brand-600/30 bg-brand-600/[0.04] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
              In progress · checked in {formatTime(task.checked_in_at)}
            </p>
            <p className="mt-2 text-xs text-graphite-2">
              {isGatedTask
                ? 'Tick every checklist item and upload the required photos before you can mark the job as completed.'
                : "Take photos when you're done. Uploading them marks the job as completed and notifies the manager."}
            </p>
            <div className="mt-4">
              <PhotoUploadButton taskId={task.id} />
            </div>
            {/* Gated completion: only shown on Airbnb-style tasks. Residential
                tasks (no checklist + required_photos=0) keep the photo-upload
                auto-completion flow they've always had — no behaviour change
                for the existing cleaner muscle memory there. */}
            {isGatedTask ? (
              <div className="mt-4">
                <CompletionGateForm
                  taskId={task.id}
                  checklist={checklistItems}
                  photosCount={photosCount}
                  requiredPhotos={requiredPhotos}
                />
              </div>
            ) : null}
          </section>
        ) : task.status === 'cancelled' ? (
          <section className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4 text-center">
            <p className="text-sm font-semibold text-rose-700">
              This task has been cancelled.
            </p>
            <p className="mt-1 text-[11px] text-graphite-3">
              No further action is needed.
            </p>
          </section>
        ) : (
          <section className="rounded-2xl border border-brand-600/30 bg-brand-600/[0.04] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
              Ready to start
            </p>
            <p className="mt-2 text-xs text-graphite-2">
              Tap below when you arrive. We'll record your location so the
              manager knows you're on site.
            </p>
            <div className="mt-4">
              <CheckInButton taskId={task.id} />
            </div>
          </section>
        )}

        {/* Uploaded photos */}
        {photos.length > 0 ? (
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-graphite-3">
              Photos ({photos.length})
            </h2>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {photos.map((p) => (
                <a
                  key={p.id}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square overflow-hidden rounded-lg border border-line bg-surface-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </a>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function Meta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex justify-center">{icon}</div>
      <p className="mt-1 font-display text-sm font-bold text-graphite-1">
        {value}
      </p>
      <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-graphite-3">
        {label}
      </p>
    </div>
  );
}
