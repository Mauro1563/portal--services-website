'use client';

/**
 * Public, no-auth preview of the Cleaner (Operative) home page —
 * AIRBNB CHECKOUT variant.
 *
 * Sibling to /operative/preview but tuned for the Airbnb short-let workflow:
 *   - Each task is a "checkout turn" between two guests, with a hard
 *     deadline (next check-in) and a check-out time we cannot start before.
 *   - The job isn't done until a strict checklist is ticked AND at least
 *     four photos (salón, cocina, baño, dormitorio) are uploaded. The
 *     "Marcar completada" CTA stays disabled until both gates pass — so
 *     the cleaner cannot accidentally short-cut Airbnb's standards.
 *   - Each property has a lockbox code instead of a "key under the mat"
 *     note — we surface it as a copyable chip, since cleaners often
 *     arrive with sticky hands and don't want to scroll through notes.
 *   - The accent colour is orange to differentiate this preview from
 *     the standard cleaner demo (emerald) at a glance — useful when
 *     two tabs are open during sales walkthroughs.
 *
 * Demo-only: all state lives in useState, no backend calls, no Supabase,
 * no localStorage. Refresh resets the demo.
 *
 * Standalone page (no layout) — we mount DemoTopBar directly so this
 * route can live next to /operative/preview without that layout's chrome.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  KeyRound,
  MapPin,
  Navigation2,
  RotateCcw,
  Timer,
  Trash2,
  X,
} from 'lucide-react';
import { DemoTopBar } from '@/components/preview/DemoTopBar';
import { PreviewFlavorToggle } from '@/components/preview/PreviewFlavorToggle';
import { TaskChecklist, type ChecklistItem as TaskChecklistItem } from '@/components/tasks/TaskChecklist';
import { CompletionGate } from '@/components/tasks/CompletionGate';

type DemoStatus = 'scheduled' | 'in_progress' | 'completed';

/** Photo zones an Airbnb cleaner has to capture before marking done. */
const REQUIRED_PHOTO_ZONES = ['salón', 'cocina', 'baño', 'dormitorio'] as const;
const MIN_PHOTOS_REQUIRED = REQUIRED_PHOTO_ZONES.length; // 4

/** Master checklist — every item must be ticked before completing. */
type ChecklistItemId =
  | 'sheets'
  | 'towels'
  | 'paper'
  | 'soap'
  | 'coffee'
  | 'water'
  | 'vacuum'
  | 'bathroom';

type ChecklistItem = {
  id: ChecklistItemId;
  label: string;
  /** Short helper line that explains the Airbnb standard behind this item. */
  hint?: string;
};

const CHECKLIST: ChecklistItem[] = [
  {
    id: 'sheets',
    label: 'Cambiar sábanas',
    hint: '4 sábanas por cama king (bajera, encimera, 2 fundas).',
  },
  {
    id: 'towels',
    label: 'Reponer toallas',
    hint: '2 de baño + 2 de cara por huésped.',
  },
  { id: 'paper', label: 'Restock papel higiénico (x2)' },
  { id: 'soap', label: 'Restock jabón' },
  { id: 'coffee', label: 'Restock café / té' },
  { id: 'water', label: 'Restock agua' },
  { id: 'vacuum', label: 'Aspirar todas las habitaciones' },
  { id: 'bathroom', label: 'Lavar baño completo (suelo, sanitarios, espejo)' },
];

type DemoTask = {
  id: string;
  /** Day label for the agenda divider — keeps "Hoy / Mañana / Vie" grouping clear. */
  dayLabel: string;
  /** Sort key for stable ordering within the agenda. */
  daySortKey: number;
  property_name: string;
  address: string;
  postcode: string;
  /** Previous guest's check-out time (we cannot start cleaning before this + buffer). */
  previousCheckOut: string;
  /** When we are expected to begin cleaning. */
  cleaningStart: string;
  /** Next guest's check-in — the hard deadline. */
  nextCheckIn: string;
  /** A real timestamp for the next check-in, used to drive the countdown. */
  nextCheckInAt: Date;
  estimated_duration_min: number;
  lockboxCode: string;
  notes: string;
  mapsUrl: string;
  status: DemoStatus;
  /** Per-task checklist tick state — every id starts false. */
  checklist: Record<ChecklistItemId, boolean>;
  /** Photos uploaded for this job. */
  photos: string[];
  /** Set when the cleaner taps "Check-in" on the turnover card. */
  checkInAt?: string;
  /** Set when the cleaner taps "Marcar completada". */
  completedAt?: string;
  /** Hours the cleaner reported once they marked it complete. */
  actualHours: number | null;
  /** Cleaner pay rate for this task, in pence/hour. */
  cleanerPayRatePence: number;
  /** Tip from the guest/host, in pence. */
  tipPence: number;
};

/** Build a Date for today at a given HH:MM. */
function todayAt(hhmm: string, dayOffset = 0): Date {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(h, m, 0, 0);
  return d;
}

function emptyChecklist(): Record<ChecklistItemId, boolean> {
  return CHECKLIST.reduce(
    (acc, item) => {
      acc[item.id] = false;
      return acc;
    },
    {} as Record<ChecklistItemId, boolean>,
  );
}

function buildInitialTasks(): DemoTask[] {
  return [
    {
      id: 'air-1',
      dayLabel: 'Hoy',
      daySortKey: 0,
      property_name: 'Shoreditch Loft · 2BR',
      address: '12 Curtain Rd, Shoreditch',
      postcode: 'London EC2A 3LT',
      previousCheckOut: '11:00',
      cleaningStart: '11:30',
      nextCheckIn: '15:00',
      nextCheckInAt: todayAt('15:00'),
      estimated_duration_min: 150,
      lockboxCode: '4421',
      notes:
        'Anfitrión: Olivia Hart. Sábanas limpias en el armario del pasillo. Café en grano en la despensa.',
      mapsUrl:
        'https://maps.google.com/?q=12+Curtain+Rd+Shoreditch+London+EC2A+3LT',
      status: 'in_progress',
      checklist: emptyChecklist(),
      photos: [],
      checkInAt: '11:34',
      actualHours: null,
      cleanerPayRatePence: 1600,
      tipPence: 0,
    },
    {
      id: 'air-2',
      dayLabel: 'Hoy',
      daySortKey: 0,
      property_name: 'Soho Studio · 1BR',
      address: '46 Old Compton St, Soho',
      postcode: 'London W1D 4UH',
      previousCheckOut: '10:00',
      cleaningStart: '14:30',
      nextCheckIn: '16:00',
      nextCheckInAt: todayAt('16:00'),
      estimated_duration_min: 75,
      lockboxCode: '0317',
      notes:
        'Anfitrión: Marco Lin. Reponer cápsulas Nespresso (caja amarilla en cajón superior).',
      mapsUrl:
        'https://maps.google.com/?q=46+Old+Compton+St+Soho+London+W1D+4UH',
      status: 'scheduled',
      checklist: emptyChecklist(),
      photos: [],
      actualHours: null,
      cleanerPayRatePence: 1600,
      tipPence: 0,
    },
    {
      id: 'air-3',
      dayLabel: 'Mañana',
      daySortKey: 1,
      property_name: 'Hackney Townhouse · 3BR',
      address: '88 Mare St, Hackney',
      postcode: 'London E8 4RT',
      previousCheckOut: '11:00',
      cleaningStart: '11:30',
      nextCheckIn: '15:00',
      nextCheckInAt: todayAt('15:00', 1),
      estimated_duration_min: 180,
      lockboxCode: '7782',
      notes:
        'Anfitrión: Priya Shah. Hay un perro pequeño — usar aspiradora con filtro HEPA del armario.',
      mapsUrl: 'https://maps.google.com/?q=88+Mare+St+Hackney+London+E8+4RT',
      status: 'scheduled',
      checklist: emptyChecklist(),
      photos: [],
      actualHours: null,
      cleanerPayRatePence: 1600,
      tipPence: 0,
    },
  ];
}

const STATUS_META: Record<
  DemoStatus,
  { label: string; cls: string; dot: string }
> = {
  scheduled: {
    label: 'Pendiente',
    cls: 'bg-slate-100 text-slate-700',
    dot: 'bg-slate-400',
  },
  in_progress: {
    label: 'En curso',
    cls: 'bg-orange-100 text-orange-800',
    dot: 'bg-orange-500 animate-pulse',
  },
  completed: {
    label: 'Completada',
    cls: 'bg-emerald-100 text-emerald-800',
    dot: 'bg-emerald-500',
  },
};

const SAMPLE_PHOTO_URLS = [
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=70',
  'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&auto=format&fit=crop&q=70',
  'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=70',
  'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&auto=format&fit=crop&q=70',
  'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop&q=70',
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=70',
];

function formatDuration(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${minutes}m`;
}

function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/**
 * Render the countdown between now and the next check-in. Returns a
 * compact "Xh Ym" string and a tone hint so the caller can colour-code
 * the urgency (green > 2h, orange 30m–2h, red < 30m, slate when expired).
 */
function useCountdown(target: Date): { label: string; tone: 'safe' | 'warn' | 'urgent' | 'late' } {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    // 30s tick is plenty — we only render down to the minute, and a
    // shorter interval would burn battery without changing the UI.
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) {
    return { label: 'check-in vencido', tone: 'late' };
  }
  const totalMin = Math.floor(diffMs / 60_000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  const label = h > 0 ? `${h}h ${m}m` : `${m}m`;
  let tone: 'safe' | 'warn' | 'urgent' = 'safe';
  if (totalMin < 30) tone = 'urgent';
  else if (totalMin < 120) tone = 'warn';
  return { label, tone };
}

export default function OperativePreviewAirbnbHome() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <OperativePreviewAirbnbBody
      key={resetKey}
      onReset={() => setResetKey((k) => k + 1)}
    />
  );
}

function OperativePreviewAirbnbBody({ onReset }: { onReset: () => void }) {
  const initialTasks = useMemo(() => buildInitialTasks(), []);
  const [tasks, setTasks] = useState<DemoTask[]>(initialTasks);
  const [expandedId, setExpandedId] = useState<string | null>('air-1');
  const [lightbox, setLightbox] = useState<
    { taskId: string; idx: number } | null
  >(null);
  const [toast, setToast] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  function showToast(message: string) {
    setToast(message);
    window.requestAnimationFrame(() => setToastVisible(true));
    window.setTimeout(() => setToastVisible(false), 1600);
    window.setTimeout(() => setToast(null), 1800);
  }

  // Hero card = next non-completed task, or the last task if all done.
  // For Airbnb we sort by daySortKey then by check-in deadline so the
  // most urgent turnover bubbles to the top.
  const sortedTasks = useMemo(
    () =>
      [...tasks].sort((a, b) => {
        if (a.daySortKey !== b.daySortKey) return a.daySortKey - b.daySortKey;
        return a.nextCheckInAt.getTime() - b.nextCheckInAt.getTime();
      }),
    [tasks],
  );
  const heroTask =
    sortedTasks.find((t) => t.status !== 'completed') ??
    sortedTasks[sortedTasks.length - 1];

  const doneCount = tasks.filter((t) => t.status === 'completed').length;

  // Today's earnings = sum of completed tasks' labour + tips (in pence).
  // Mirrors lib/cleaner-earnings.ts so this preview stays consistent
  // with the standard cleaner demo and the real portal.
  const todayPence = tasks
    .filter((t) => t.status === 'completed')
    .reduce((acc, t) => {
      const hours = t.actualHours ?? 0;
      const labour = Math.round(hours * t.cleanerPayRatePence);
      return acc + Math.max(0, labour + (t.tipPence ?? 0));
    }, 0);

  function handleToggleChecklist(taskId: string, itemId: ChecklistItemId) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              checklist: { ...t.checklist, [itemId]: !t.checklist[itemId] },
            }
          : t,
      ),
    );
  }

  function handleCheckIn(taskId: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: 'in_progress' as DemoStatus, checkInAt: nowHHMM() }
          : t,
      ),
    );
    setExpandedId(taskId);
    showToast('Check-in registrado');
  }

  function handleComplete(taskId: string) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        // Snap actualHours to the estimate when the cleaner marks done —
        // the pay strip needs *something* to multiply against the rate.
        // A real app would prompt; here we use the estimate as a sensible
        // default so the demo's earnings counter moves.
        const hours = t.actualHours ?? t.estimated_duration_min / 60;
        return {
          ...t,
          status: 'completed' as DemoStatus,
          completedAt: nowHHMM(),
          actualHours: hours,
        };
      }),
    );
    showToast('Turnover completado');
  }

  function handleUploadPhoto(taskId: string) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const next = SAMPLE_PHOTO_URLS[t.photos.length % SAMPLE_PHOTO_URLS.length];
        return { ...t, photos: [...t.photos, next] };
      }),
    );
    setExpandedId(taskId);
    showToast('Foto subida');
  }

  function handleDeletePhoto(taskId: string, idx: number) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, photos: t.photos.filter((_, i) => i !== idx) }
          : t,
      ),
    );
    setLightbox(null);
    showToast('Foto eliminada');
  }

  function handleCopyLockbox(code: string) {
    // Best-effort clipboard write — falls back to a toast either way so
    // the demo always confirms the action even where clipboard is blocked
    // (e.g. inside some embedded preview iframes).
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code).catch(() => {
        /* swallowed — toast still fires */
      });
    }
    showToast(`Código ${code} copiado`);
  }

  function toggleExpand(taskId: string) {
    setExpandedId((cur) => (cur === taskId ? null : taskId));
  }

  const lightboxTask = lightbox
    ? tasks.find((t) => t.id === lightbox.taskId)
    : null;
  const lightboxSrc =
    lightboxTask && lightbox ? lightboxTask.photos[lightbox.idx] : null;

  return (
    <>
      <DemoTopBar portal="cleaner" title="DEMO · CLEANER (AIRBNB)" />
      <PreviewFlavorToggle
        active="airbnb"
        hogarHref="/operative/preview"
        airbnbHref="/operative/preview-airbnb"
      />
      <main className="relative min-h-screen overflow-hidden bg-canvas pb-16">
        {/* Ambient depth: warm orange/amber blob top-left, mirroring the
            standard preview's emerald/teal blob but signalling the Airbnb
            variant at a glance. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-32 z-0 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-orange-300 to-amber-400 opacity-30 blur-3xl"
        />
        <div className="relative z-10 mx-auto max-w-md px-4 py-5">
          <header className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange-700">
                Airbnb · Turnovers
              </p>
              <h1 className="mt-1 font-display text-2xl font-semibold text-text-1">
                Hola, Carmen
              </h1>
              <p className="mt-0.5 text-[12px] text-text-3">
                {doneCount} de {tasks.length} turnovers completados · Londres
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-3">
                Hoy
              </p>
              <p className="mt-0.5 font-display text-xl font-bold tabular-nums text-text-1">
                £{(todayPence / 100).toFixed(2)}
              </p>
            </div>
          </header>

          {/* Hero card — próximo turnover.
              Only renders while there is a non-completed turn to act on. */}
          {heroTask && heroTask.status !== 'completed' ? (
            <div className="mt-5">
              <TurnoverHero
                task={heroTask}
                onCheckIn={() => handleCheckIn(heroTask.id)}
                onCopyLockbox={() => handleCopyLockbox(heroTask.lockboxCode)}
              />
            </div>
          ) : null}

          {/* Agenda timeline — turnover cards, grouped by day label */}
          <section className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-text-3">
                Agenda de turnovers
              </h2>
            </div>

            <ol className="mt-4 space-y-3">
              {sortedTasks.map((task, idx) => {
                const prev = sortedTasks[idx - 1];
                const showDayDivider = !prev || prev.dayLabel !== task.dayLabel;
                return (
                  <li key={task.id} id={`task-${task.id}`} className="scroll-mt-24">
                    {showDayDivider ? (
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-text-3">
                        {task.dayLabel}
                      </p>
                    ) : null}
                    <TurnoverCard
                      task={task}
                      expanded={expandedId === task.id}
                      onToggleExpand={() => toggleExpand(task.id)}
                      onCheckIn={() => handleCheckIn(task.id)}
                      onComplete={() => handleComplete(task.id)}
                      onUploadPhoto={() => handleUploadPhoto(task.id)}
                      onToggleChecklist={(itemId) =>
                        handleToggleChecklist(task.id, itemId)
                      }
                      onOpenPhoto={(i) =>
                        setLightbox({ taskId: task.id, idx: i })
                      }
                      onCopyLockbox={() => handleCopyLockbox(task.lockboxCode)}
                    />
                  </li>
                );
              })}
            </ol>
          </section>

          {/* Demo-only reset — kept quiet, well clear of the thumb zone. */}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={onReset}
              title="Reiniciar la demo — vuelve al estado inicial sin recargar"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium text-text-3 transition hover:text-text-1"
            >
              <RotateCcw className="h-3 w-3" />
              Reiniciar demo
            </button>
          </div>
        </div>

        {/* Photo lightbox */}
        {lightbox && lightboxSrc && lightboxTask ? (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
            onClick={() => setLightbox(null)}
          >
            <div
              className="relative w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setLightbox(null)}
                title="Cerrar"
                className="absolute -top-10 right-0 grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white backdrop-blur"
              >
                <X className="h-4 w-4" />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxSrc}
                alt={`Foto del turnover en ${lightboxTask.property_name}`}
                className="w-full rounded-2xl"
              />
              <div className="mt-3 flex items-center justify-between gap-2">
                <p className="text-[11px] text-white/80">
                  {lightboxTask.property_name} · foto {lightbox.idx + 1} de{' '}
                  {lightboxTask.photos.length}
                </p>
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(lightbox.taskId, lightbox.idx)}
                  title="Eliminar esta foto del registro del turnover"
                  className="inline-flex items-center gap-1 rounded-full bg-red-500/90 px-3 py-1.5 text-[11px] font-semibold text-white shadow hover:bg-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                  Eliminar foto
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Toast — fades + lifts in/out so the confirmation registers
            peripherally without dominating the screen. */}
        {toast ? (
          <div
            className="pointer-events-none fixed inset-x-0 bottom-8 z-[70] mx-auto flex max-w-md justify-center px-4"
            aria-live="polite"
          >
            <div
              className={`rounded-full bg-orange-600/95 px-4 py-2 text-[12px] font-semibold text-white shadow-lg backdrop-blur transition duration-200 ease-out ${
                toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              }`}
            >
              ✓ {toast}
            </div>
          </div>
        ) : null}
      </main>
    </>
  );
}

/** ---------- Hero card: próximo turnover --------------------------- */

function TurnoverHero({
  task,
  onCheckIn,
  onCopyLockbox,
}: {
  task: DemoTask;
  onCheckIn: () => void;
  onCopyLockbox: () => void;
}) {
  const countdown = useCountdown(task.nextCheckInAt);
  const toneCls = {
    safe: 'bg-emerald-100 text-emerald-800',
    warn: 'bg-amber-100 text-amber-800',
    urgent: 'bg-red-100 text-red-800',
    late: 'bg-red-600 text-white',
  }[countdown.tone];

  return (
    <section className="rounded-2xl border border-orange-500/30 bg-orange-50/50 p-4 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-orange-700">
          Próximo turnover
        </p>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${toneCls}`}
          title="Tiempo restante hasta el siguiente check-in"
        >
          <Timer className="h-3 w-3" />
          {countdown.label}
        </span>
      </div>
      <h2 className="mt-2 font-display text-lg font-semibold text-text-1">
        {task.property_name}
      </h2>
      <p className="mt-1 inline-flex items-center gap-1 text-xs text-text-2">
        <MapPin className="h-3.5 w-3.5 text-orange-600" />
        {task.address} · {task.postcode}
      </p>

      <dl className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-white/70 px-3 py-2 ring-1 ring-orange-100">
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-text-3">
            Huésped anterior
          </dt>
          <dd className="mt-0.5 text-[12px] font-semibold text-text-1">
            Salida {task.previousCheckOut}
          </dd>
          <dd className="text-[10.5px] text-text-3">
            limpieza inicia {task.cleaningStart}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-text-3">
            Próximo huésped
          </dt>
          <dd className="mt-0.5 text-[12px] font-semibold text-text-1">
            Llegada {task.nextCheckIn}
          </dd>
          <dd className="text-[10.5px] text-text-3">debes terminar antes</dd>
        </div>
      </dl>

      <div className="mt-3 flex items-stretch gap-2">
        <a
          href={task.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Abrir esta dirección en Google Maps para navegar paso a paso"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-[15px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(234,88,12,0.55)] transition active:scale-[0.99]"
        >
          <Navigation2 className="h-4 w-4" /> Ir a la dirección
        </a>
        <button
          type="button"
          onClick={onCopyLockbox}
          aria-label="Copiar código del lockbox"
          title={`Lockbox ${task.lockboxCode} · toca para copiar`}
          className="inline-flex h-auto min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl border border-orange-200 bg-white px-3 text-orange-800 transition hover:border-orange-300 hover:bg-orange-50"
        >
          <KeyRound className="h-4 w-4" />
          <span className="font-mono text-[13px] font-bold tabular-nums">
            {task.lockboxCode}
          </span>
          <Copy className="h-3 w-3 opacity-60" />
        </button>
      </div>

      {task.status === 'scheduled' ? (
        <button
          type="button"
          onClick={onCheckIn}
          className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-orange-300 bg-white px-3 py-2.5 text-[13px] font-semibold text-orange-800 transition hover:bg-orange-50"
        >
          Check-in al llegar
        </button>
      ) : null}
    </section>
  );
}

/** ---------- Turnover row card ------------------------------------- */

function TurnoverCard({
  task,
  expanded,
  onToggleExpand,
  onCheckIn,
  onComplete,
  onUploadPhoto,
  onToggleChecklist,
  onOpenPhoto,
  onCopyLockbox,
}: {
  task: DemoTask;
  expanded: boolean;
  onToggleExpand: () => void;
  onCheckIn: () => void;
  onComplete: () => void;
  onUploadPhoto: () => void;
  onToggleChecklist: (itemId: ChecklistItemId) => void;
  onOpenPhoto: (idx: number) => void;
  onCopyLockbox: () => void;
}) {
  const st = STATUS_META[task.status];
  const countdown = useCountdown(task.nextCheckInAt);

  const enoughPhotos = task.photos.length >= MIN_PHOTOS_REQUIRED;

  // Project the demo's typed-id-keyed checklist dict into the JSONB
  // {key,label,done} array shape that TaskChecklist + CompletionGate
  // share with the live route — keeps a single component contract.
  const checklistItems: TaskChecklistItem[] = CHECKLIST.map((item) => ({
    key: item.id,
    label: item.label,
    done: task.checklist[item.id],
  }));

  // Earnings preview for the in-progress row — durationMin * payRate + tips,
  // matching lib/cleaner-earnings.ts so payroll never disagrees with the app.
  const projectedPence = Math.round(
    (task.estimated_duration_min / 60) * task.cleanerPayRatePence,
  ) + (task.tipPence ?? 0);

  return (
    <div
      className={
        task.status === 'in_progress'
          ? 'rounded-2xl bg-gradient-to-br from-orange-500/25 to-amber-500/10 p-[1px]'
          : ''
      }
    >
      <div className="rounded-2xl border border-surface-2 bg-paper p-3 shadow-[0_2px_4px_rgba(15,23,42,0.04),_0_10px_24px_-8px_rgba(15,23,42,0.08)] transition duration-200">
        <button
          type="button"
          onClick={onToggleExpand}
          title="Toca para ver checklist, lockbox y notas"
          className="flex w-full items-start justify-between gap-2 text-left"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-semibold text-text-1">
              {task.property_name}
            </p>
            <p className="mt-0.5 inline-flex items-center gap-1 truncate text-[11px] text-text-3">
              <MapPin className="h-3 w-3 shrink-0 text-orange-600" />
              <span className="truncate">
                {task.address}, {task.postcode}
              </span>
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${st.cls}`}
          >
            <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full align-middle ${st.dot}`} />
            {st.label}
          </span>
          {expanded ? (
            <ChevronUp className="mt-1 h-4 w-4 text-text-3" />
          ) : (
            <ChevronDown className="mt-1 h-4 w-4 text-text-3" />
          )}
        </button>

        {/* Turn window — compact 2-line summary, always visible. */}
        <div className="mt-2 grid grid-cols-3 gap-2 rounded-lg bg-surface-1/60 px-2.5 py-1.5 text-[10.5px]">
          <div>
            <p className="font-bold uppercase tracking-wider text-text-3">Salida</p>
            <p className="mt-0.5 font-semibold tabular-nums text-text-1">
              {task.previousCheckOut}
            </p>
          </div>
          <div>
            <p className="font-bold uppercase tracking-wider text-text-3">Limpieza</p>
            <p className="mt-0.5 font-semibold tabular-nums text-text-1">
              {task.cleaningStart} · {formatDuration(task.estimated_duration_min)}
            </p>
          </div>
          <div>
            <p className="font-bold uppercase tracking-wider text-text-3">Llegada</p>
            <p className="mt-0.5 font-semibold tabular-nums text-text-1">
              {task.nextCheckIn}
            </p>
          </div>
        </div>

        {task.status !== 'completed' ? (
          <p
            className={`mt-1.5 inline-flex items-center gap-1 text-[10.5px] font-semibold ${
              countdown.tone === 'late'
                ? 'text-red-700'
                : countdown.tone === 'urgent'
                  ? 'text-red-700'
                  : countdown.tone === 'warn'
                    ? 'text-amber-700'
                    : 'text-emerald-700'
            }`}
          >
            <Timer className="h-3 w-3" />
            {countdown.tone === 'late'
              ? 'check-in vencido'
              : `quedan ${countdown.label} hasta el check-in`}
          </p>
        ) : null}

        {task.checkInAt ? (
          <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-orange-700">
            <Clock className="h-2.5 w-2.5" />
            Check-in registrado a las {task.checkInAt}
          </p>
        ) : null}
        {task.completedAt ? (
          <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
            <CheckCircle2 className="h-2.5 w-2.5" />
            Completada a las {task.completedAt}
          </p>
        ) : null}

        {/* Always-visible quick actions row. */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <a
            href={task.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label="Navegar con Google Maps"
            title="Navegar a esta dirección con Google Maps"
            className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-[10.5px] font-semibold text-orange-700 transition hover:bg-orange-100"
          >
            <Navigation2 className="h-3 w-3" />
            Maps
          </a>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCopyLockbox();
            }}
            aria-label="Copiar código del lockbox"
            title={`Lockbox ${task.lockboxCode} · toca para copiar`}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10.5px] font-semibold text-slate-800 transition hover:bg-slate-200"
          >
            <KeyRound className="h-3 w-3" />
            <span className="font-mono tabular-nums">{task.lockboxCode}</span>
          </button>
          {task.status === 'scheduled' ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCheckIn();
              }}
              title="Marcar que has llegado al apartamento"
              className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-[10.5px] font-semibold text-orange-800 transition hover:bg-orange-200"
            >
              Check-in
            </button>
          ) : null}
          {task.status === 'in_progress' ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUploadPhoto();
              }}
              aria-label="Subir foto del turnover"
              title="Subir foto del turnover — necesitas 4 mínimo"
              className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2.5 py-1 text-[10.5px] font-semibold text-cyan-800 transition hover:bg-cyan-100"
            >
              <Camera className="h-3 w-3" />
              Foto
            </button>
          ) : null}
          {task.status !== 'completed' ? (
            <span
              className="ml-auto inline-flex items-center gap-1 text-[10.5px] font-semibold text-text-3"
              title="Pago estimado: duración × tarifa horaria + propinas"
            >
              Estim. £{(projectedPence / 100).toFixed(2)}
            </span>
          ) : (
            <span className="ml-auto inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700">
              Pagado £
              {(
                (Math.round((task.actualHours ?? 0) * task.cleanerPayRatePence) +
                  (task.tipPence ?? 0)) /
                100
              ).toFixed(2)}
            </span>
          )}
        </div>

        {/* Expanded section: checklist + photos + notes */}
        {expanded ? (
          <div className="mt-3 space-y-3">
            {/* Checklist — consolidated through the shared TaskChecklist
                component so the live task page, the Airbnb demo and the
                Hogar demo all render and gate completion identically. We
                project the demo's typed-id-keyed dict into the JSONB
                {key,label,done} shape the component expects. */}
            <TaskChecklist
              items={checklistItems}
              onToggle={(key) => onToggleChecklist(key as ChecklistItemId)}
            />

            {/* The CHECKLIST hint copy doesn't live in the JSONB shape, so
                surface it just below the gated rows — preserves the
                "Airbnb standard behind this item" explainer without
                bloating the shared component. */}
            <ul className="-mt-2 space-y-0.5 pl-7 text-[10.5px] text-text-3">
              {CHECKLIST.filter((c) => c.hint).map((c) => (
                <li key={`${c.id}-hint`}>
                  <span className="font-semibold text-text-2">{c.label}:</span>{' '}
                  {c.hint}
                </li>
              ))}
            </ul>

            {/* Photos */}
            <section className="rounded-xl border border-dashed border-surface-2 bg-surface-1/40 p-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-3">
                  Fotos obligatorias
                </p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${
                    enoughPhotos
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-white text-text-3 ring-1 ring-surface-2'
                  }`}
                >
                  {task.photos.length}/{MIN_PHOTOS_REQUIRED}
                </span>
              </div>
              <p className="mt-1 text-[10.5px] text-text-3">
                Necesitamos una de cada zona: {REQUIRED_PHOTO_ZONES.join(', ')}.
              </p>

              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {task.photos.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <button
                    type="button"
                    key={`${src}-${i}`}
                    onClick={() => onOpenPhoto(i)}
                    title="Ampliar foto — desde el lightbox puedes eliminarla"
                    className="overflow-hidden rounded-lg ring-1 ring-surface-2"
                  >
                    <img
                      src={src}
                      alt={`Foto del turnover ${i + 1}`}
                      loading="lazy"
                      className="aspect-square w-full object-cover"
                    />
                  </button>
                ))}
                {task.status === 'in_progress' ? (
                  <button
                    type="button"
                    onClick={onUploadPhoto}
                    aria-label="Añadir foto"
                    className="grid aspect-square w-full place-items-center rounded-lg border border-dashed border-orange-300 bg-white text-orange-700 transition hover:bg-orange-50"
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                ) : null}
              </div>
            </section>

            {/* Lockbox + notes */}
            <section className="rounded-xl border border-dashed border-surface-2 bg-surface-1/40 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-3">
                Lockbox
              </p>
              <button
                type="button"
                onClick={onCopyLockbox}
                className="mt-1 inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-white px-3 py-1.5 font-mono text-[14px] font-bold tabular-nums text-orange-800 transition hover:bg-orange-50"
              >
                <KeyRound className="h-3.5 w-3.5" />
                {task.lockboxCode}
                <Copy className="h-3 w-3 opacity-60" />
              </button>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-text-3">
                Notas del anfitrión
              </p>
              <p className="mt-0.5 text-[11.5px] leading-relaxed text-text-2">
                {task.notes}
              </p>
            </section>

            {/* Complete CTA — gated on checklist + photos via the shared
                CompletionGate so the disable rules stay identical between
                the demo, the live page and the Hogar variant. */}
            {task.status === 'in_progress' ? (
              <CompletionGate
                checklist={checklistItems}
                photosCount={task.photos.length}
                requiredPhotos={MIN_PHOTOS_REQUIRED}
                onComplete={onComplete}
              />
            ) : null}

            {task.status === 'scheduled' ? (
              <button
                type="button"
                onClick={onCheckIn}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-3 py-3 text-[14px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(234,88,12,0.55)] transition active:scale-[0.99]"
              >
                Check-in y empezar
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
