'use client';

/**
 * Public, no-auth preview of the Cleaner (Operative) home page.
 *
 * Demo-only mirror of /operative — all state lives in useState, no
 * backend calls, no Supabase, no localStorage. Refresh resets the demo.
 *
 * Owned by app/operative/preview/. Uses preview-scoped components from
 * components/preview/* (incl. PreviewBottomTabBar) so the auth-gated
 * /operative route is unaffected.
 */
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  HelpCircle,
  MapPin,
  Minus,
  Navigation2,
  Phone,
  Play,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react';
import { AgendaHeader } from '@/components/operative/AgendaHeader';
import { DemoPhotoStrip } from '@/components/preview/DemoPhotoStrip';
import { PreviewBottomTabBar } from '@/components/preview/PreviewBottomTabBar';
import { SwipeableTaskCard } from '@/components/preview/SwipeableTaskCard';
import {
  EarningsAnimationProvider,
  useEarningsAnimation,
} from '@/components/preview/EarningsCoinAnimator';
import { PreviewEarningsStrip } from '@/components/preview/PreviewEarningsStrip';
import { PullToCheckInHero } from '@/components/preview/PullToCheckInHero';
import { KintsugiThread } from '@/components/preview/KintsugiThread';
import { PreviewFlavorToggle } from '@/components/preview/PreviewFlavorToggle';
import { CleanerConciergeSheet } from './_components/CleanerConciergeSheet';
import {
  TaskChecklist,
  type ChecklistItem as TaskChecklistItem,
} from '@/components/tasks/TaskChecklist';

type DemoStatus = 'scheduled' | 'in_progress' | 'completed';

type DemoTask = {
  id: string;
  start_time: string;
  status: DemoStatus;
  estimated_duration_min: number;
  property_name: string;
  client_name: string;
  address: string;
  postcode: string;
  notes: string;
  mapsUrl: string;
  phone: string;
  /** Set when the cleaner taps "Check-in" on the in-progress card. */
  checkInAt?: string;
  /** Set when the cleaner taps "Marcar completada". */
  completedAt?: string;
  /** Photos uploaded for this job (only used on the in-progress demo). */
  photos: string[];
  /** Hours the cleaner reported (NULL until they mark it). */
  actualHours: number | null;
  /** Cleaner pay rate for this task, in pence/hour. */
  cleanerPayRatePence: number;
  /** Tip from the client, in pence. */
  tipPence: number;
  /**
   * Optional checklist — mirrors tasks.checklist JSONB so the same shared
   * <TaskChecklist /> component can render here. Residential tasks usually
   * have none (the empty state copy handles that gracefully) but a host may
   * pin a short list when there's something idiosyncratic worth ticking.
   */
  checklist?: TaskChecklistItem[];
};

const INITIAL_TASKS: DemoTask[] = [
  {
    id: 'demo-1',
    start_time: '10:00',
    status: 'completed',
    estimated_duration_min: 90,
    property_name: 'Soho Loft',
    client_name: 'Mr. Thompson',
    address: '22 Old Compton St, Soho',
    postcode: 'London W1D 4TR',
    notes: 'Llaves en el lockbox (código 4421). Aspirar la alfombra del salón.',
    mapsUrl: 'https://maps.google.com/?q=22+Old+Compton+St+London+W1D+4TR',
    phone: '+447700900111',
    completedAt: '11:32',
    photos: [],
    actualHours: 1.5,
    cleanerPayRatePence: 1400,
    tipPence: 500,
  },
  {
    id: 'demo-2',
    start_time: '12:30',
    status: 'in_progress',
    estimated_duration_min: 60,
    property_name: 'Hackney Studio',
    client_name: 'Ms. Patel',
    address: '78 Mare St, Hackney',
    postcode: 'London E8 4RT',
    notes: 'Dejar la fregona limpia en el armario del baño. Recibo en la encimera.',
    mapsUrl: 'https://maps.google.com/?q=78+Mare+St+Hackney+London+E8+4RT',
    phone: '+447700900222',
    photos: [],
    actualHours: null,
    cleanerPayRatePence: 1400,
    tipPence: 0,
  },
  {
    id: 'demo-3',
    start_time: '14:30',
    status: 'scheduled',
    estimated_duration_min: 120,
    property_name: 'Shoreditch Penthouse',
    client_name: 'Ms. Walker',
    address: '31 Curtain Rd, Shoreditch',
    postcode: 'London EC2A 3LT',
    notes: 'Check-out de Airbnb. Sábanas limpias en el armario del pasillo.',
    mapsUrl: 'https://maps.google.com/?q=31+Curtain+Rd+Shoreditch+London+EC2A+3LT',
    phone: '+447700900333',
    photos: [],
    actualHours: null,
    cleanerPayRatePence: 1400,
    tipPence: 0,
    // Short, host-pinned checklist — shows how the same component degrades
    // gracefully from full Airbnb gating to a quick reminder list here.
    checklist: [
      { key: 'plants', label: 'Regar las plantas del balcón', done: false },
      { key: 'recycling', label: 'Bajar el reciclaje (martes)', done: false },
    ],
  },
];

const STATUS_META: Record<DemoStatus, { label: string; cls: string; dot: string }> = {
  scheduled: {
    label: 'Pendiente',
    cls: 'bg-slate-100 text-slate-700',
    dot: 'bg-slate-400',
  },
  in_progress: {
    label: 'En curso',
    cls: 'bg-amber-100 text-amber-800',
    dot: 'bg-amber-500 animate-pulse',
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

function formatHours(minutes: number): string {
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

export default function OperativePreviewHome() {
  const now = useMemo(() => new Date(), []);
  const [resetKey, setResetKey] = useState(0);
  return (
    <EarningsAnimationProvider key={resetKey}>
      <OperativePreviewHomeBody now={now} onReset={() => setResetKey((k) => k + 1)} />
    </EarningsAnimationProvider>
  );
}

function OperativePreviewHomeBody({
  now,
  onReset,
}: {
  now: Date;
  onReset: () => void;
}) {
  const [tasks, setTasks] = useState<DemoTask[]>(INITIAL_TASKS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ taskId: string; idx: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [agendaHelpOpen, setAgendaHelpOpen] = useState(false);
  /** Refs to each task <li> so the coin can spawn from the row that
   *  just got swiped — captured at the moment of completion. */
  const taskRowRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const { flyFrom, rollTo } = useEarningsAnimation();
  const prevTodayPenceRef = useRef<number>(0);

  function showToast(message: string) {
    setToast(message);
    // Trigger enter transition on the next frame, then schedule the exit.
    window.requestAnimationFrame(() => setToastVisible(true));
    window.setTimeout(() => setToastVisible(false), 1600);
    window.setTimeout(() => setToast(null), 1800);
  }

  // Hero card = next non-completed task, or last task if all done.
  const heroTask =
    tasks.find((t) => t.status !== 'completed') ?? tasks[tasks.length - 1];

  const doneCount = tasks.filter((t) => t.status === 'completed').length;
  const inProgressTaskId = tasks.find((t) => t.status === 'in_progress')?.id;

  // Today's earnings = sum of completed tasks' labour + tips (in pence).
  // Mirrors lib/cleaner-earnings.ts so the strip stays consistent.
  const todayPence = tasks
    .filter((t) => t.status === 'completed')
    .reduce((acc, t) => {
      const hours = t.actualHours ?? 0;
      const labour = Math.round(hours * t.cleanerPayRatePence);
      return acc + Math.max(0, labour + (t.tipPence ?? 0));
    }, 0);
  // Week total is a stable mocked figure (≈ five working days at this cadence).
  // Decoupled from today's clicks so it doesn't leap 5× when the cleaner
  // completes the last task. Stays sensible whether today=£0 or today=£40.
  const PRIOR_DAYS_PENCE = 21800; // £218 across Mon-Thu
  const weekPence = PRIOR_DAYS_PENCE + todayPence;

  // Seed the "previous" snapshot on the very first render so the next
  // completion knows where to start the odometer roll from.
  if (prevTodayPenceRef.current === 0 && todayPence > 0) {
    prevTodayPenceRef.current = todayPence;
  }

  function handleSetHours(taskId: string, hours: number) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, actualHours: Number.isFinite(hours) && hours >= 0 ? hours : t.actualHours }
          : t,
      ),
    );
  }

  function handleAdjustHours(taskId: string, delta: number) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const next = Math.max(0, Math.round(((t.actualHours ?? 0) + delta) * 4) / 4);
        return { ...t, actualHours: next };
      }),
    );
  }

  function handleToggleChecklist(taskId: string, key: string, done: boolean) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId || !t.checklist) return t;
        return {
          ...t,
          checklist: t.checklist.map((it) =>
            it.key === key
              ? {
                  ...it,
                  done,
                  doneAt: done ? new Date().toISOString() : undefined,
                }
              : it,
          ),
        };
      }),
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
    showToast('Check-in registrado');
  }

  function handleComplete(taskId: string) {
    // Spawn the coin from the row's centre before we lose the rect to
    // a re-render. The animator handles reduced-motion internally.
    const rowEl = taskRowRefs.current[taskId];
    const rect = rowEl?.getBoundingClientRect() ?? null;
    flyFrom(rect);

    setTasks((prev) => {
      const next = prev.map((t) =>
        t.id === taskId
          ? { ...t, status: 'completed' as DemoStatus, completedAt: nowHHMM() }
          : t,
      );
      // Compute the new "Hoy" figure from the next state and roll the
      // counter directly via rAF (no React re-render cost on the digits).
      const nextTodayPence = next
        .filter((t) => t.status === 'completed')
        .reduce((acc, t) => {
          const hours = t.actualHours ?? 0;
          const labour = Math.round(hours * t.cleanerPayRatePence);
          return acc + Math.max(0, labour + (t.tipPence ?? 0));
        }, 0);
      const prevPence = prevTodayPenceRef.current;
      prevTodayPenceRef.current = nextTodayPence;
      // Delay the counter roll until the coin lands (~420ms).
      window.setTimeout(() => rollTo(prevPence, nextTodayPence), 380);
      return next;
    });
    showToast('Tarea completada');
  }

  function handleCallClient(taskId: string) {
    const t = tasks.find((x) => x.id === taskId);
    if (!t) return;
    // In a real app this would open tel: — for the demo we surface a
    // toast so the visitor sees the action was recognised by the swipe.
    showToast(`Llamando a ${t.client_name}…`);
  }

  function handleUploadPhoto(taskId: string) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        // Cycle through the sample photos so repeated taps add new ones.
        const next = SAMPLE_PHOTO_URLS[t.photos.length % SAMPLE_PHOTO_URLS.length];
        return { ...t, photos: [...t.photos, next] };
      }),
    );
    // Make sure user can see the new photo
    setExpandedId(taskId);
    showToast('Foto subida');
  }

  function handleDeletePhoto(taskId: string, idx: number) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, photos: t.photos.filter((_, i) => i !== idx) } : t,
      ),
    );
    setLightbox(null);
    showToast('Foto eliminada');
  }

  function toggleExpand(taskId: string) {
    setExpandedId((cur) => (cur === taskId ? null : taskId));
  }

  const lightboxTask = lightbox ? tasks.find((t) => t.id === lightbox.taskId) : null;
  const lightboxSrc =
    lightboxTask && lightbox ? lightboxTask.photos[lightbox.idx] : null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-canvas pb-24">
      <PreviewFlavorToggle
        active="hogar"
        hogarHref="/operative/preview"
        airbnbHref="/operative/preview-airbnb"
      />
      {/* Ambient depth: emerald/teal blob top-left — sits behind content. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 z-0 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-emerald-300 to-teal-400 opacity-30 blur-3xl"
      />
      <div className="relative z-10 mx-auto max-w-md px-4 py-5">
        <AgendaHeader
          cleanerName="Carmen López"
          now={now}
          doneCount={doneCount}
          totalCount={tasks.length}
          weekHref="/operative/preview/week"
          inProgressTaskId={inProgressTaskId}
          decorationSlot={
            <KintsugiThread doneCount={doneCount} totalCount={tasks.length} />
          }
        />

        {/* Soft radial highlight above the earnings stats */}
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-4 h-24 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.05),_transparent_60%)]"
          />
          <PreviewEarningsStrip
            todayPence={todayPence}
            weekPence={weekPence}
            href="/operative/preview/week"
          />
        </div>

        {/* Hero card — siguiente parada.
            Only renders when there is genuinely a "next" job to act on. Once
            everything is completed we drop the hero so the timeline becomes
            the single source of truth (no double-rendering the in-progress
            task in two surfaces). */}
        {heroTask && heroTask.status !== 'completed' ? (
          <div className="mt-5">
          <PullToCheckInHero
            enabled={heroTask.status === 'scheduled'}
            onCheckIn={() => handleCheckIn(heroTask.id)}
          >
          <section className="rounded-2xl border border-brand-600/25 bg-brand-50/40 p-4 shadow-card">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-700">
                Siguiente parada
              </p>
              <span className="text-[11px] font-semibold tabular-nums text-text-3">
                {heroTask.start_time}
              </span>
            </div>
            <h2 className="mt-2 font-display text-lg font-semibold text-text-1">
              {heroTask.client_name}
            </h2>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-text-2">
              <MapPin className="h-3.5 w-3.5 text-brand-600" />
              {heroTask.address} · {heroTask.postcode}
            </p>

            <div className="mt-4 flex items-stretch gap-2">
              <a
                href={heroTask.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir esta dirección en Google Maps para navegar paso a paso"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-[15px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.5)] transition active:scale-[0.99]"
              >
                <Navigation2 className="h-4 w-4" /> Ir a la dirección
              </a>
              <a
                href={`tel:${heroTask.phone}`}
                aria-label="Llamar al cliente"
                title="Llamar al cliente o manager desde el teléfono"
                className="inline-flex h-auto min-h-[44px] w-12 shrink-0 items-center justify-center rounded-xl border border-surface-2 bg-surface-0 text-text-1 transition hover:border-brand-300 hover:text-brand-700"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </section>
          </PullToCheckInHero>
          </div>
        ) : null}

        {/* Agenda timeline — interactive */}
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-text-3">
              Agenda de hoy
              <button
                type="button"
                aria-label="Ayuda sobre la agenda"
                aria-expanded={agendaHelpOpen}
                aria-controls="agenda-help"
                onClick={() => setAgendaHelpOpen((o) => !o)}
                className="grid h-5 w-5 place-items-center rounded-full bg-surface-2 text-text-3 transition hover:bg-surface-3 hover:text-text-1"
              >
                <HelpCircle className="h-3 w-3" />
              </button>
            </h2>
            <Link
              href="/operative/preview/week"
              title="Ver el resumen de toda la semana"
              className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-brand-700 hover:text-brand-800"
            >
              <Navigation2 className="h-3 w-3" /> Ver semana
            </Link>
          </div>
          {agendaHelpOpen ? (
            <p
              id="agenda-help"
              className="mt-2 rounded-lg border border-dashed border-surface-2 bg-surface-1/60 px-3 py-2 text-[11px] leading-relaxed text-text-2"
            >
              Toca cualquier tarea para ver notas del cliente, hacer check-in o subir fotos.
            </p>
          ) : null}

          <ol
            className="relative mt-4"
            style={{ ['--rail-offset' as string]: 'calc(52px + 0.75rem + 0.5rem)' }}
          >
            <span
              aria-hidden
              className="absolute top-3 bottom-3 w-px bg-surface-2"
              style={{ left: 'var(--rail-offset)' }}
            />
            {tasks.map((task) => {
              const st = STATUS_META[task.status];
              const isExpanded = expandedId === task.id;
              return (
                <li
                  key={task.id}
                  id={`task-${task.id}`}
                  ref={(el) => {
                    taskRowRefs.current[task.id] = el;
                  }}
                  className="relative pb-3 last:pb-0 scroll-mt-24"
                >
                  <div className="flex items-stretch gap-3">
                    {/* Time column */}
                    <div className="flex w-[52px] shrink-0 flex-col items-end pt-2.5">
                      <p className="font-display text-base font-bold tabular-nums text-text-1">
                        {task.start_time}
                      </p>
                      <p className="mt-0.5 inline-flex items-center gap-0.5 text-[10px] text-text-3">
                        <Clock className="h-2.5 w-2.5" />
                        {formatHours(task.estimated_duration_min)}
                      </p>
                    </div>

                    {/* Status dot */}
                    <span className="relative flex w-4 shrink-0 justify-center pt-3.5">
                      <span
                        aria-hidden
                        className={`h-3 w-3 rounded-full ring-4 ring-surface-1 ${st.dot}`}
                      />
                    </span>

                    {/* Card — wrapped in SwipeableTaskCard so the
                        in-progress row can be swiped right to complete
                        or left to call the client. */}
                    <div className="min-w-0 flex-1">
                    <SwipeableTaskCard
                      enabled={task.status === 'in_progress'}
                      onComplete={() => handleComplete(task.id)}
                      onCallClient={() => handleCallClient(task.id)}
                    >
                    <div
                      className={
                        task.status === 'in_progress'
                          ? 'rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 p-[1px]'
                          : ''
                      }
                    >
                    <div className="rounded-2xl border border-surface-2 bg-paper p-3 shadow-[0_2px_4px_rgba(15,23,42,0.04),_0_10px_24px_-8px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-0.5">
                      <button
                        type="button"
                        onClick={() => toggleExpand(task.id)}
                        title="Toca para ver detalles del cliente y notas"
                        className="flex w-full items-start justify-between gap-2 text-left"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-sm font-semibold text-text-1">
                            {task.client_name}
                          </p>
                          <p className="mt-0.5 truncate text-[11px] text-text-3">
                            {task.property_name}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${st.cls}`}
                        >
                          {st.label}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="mt-1 h-4 w-4 text-text-3" />
                        ) : (
                          <ChevronDown className="mt-1 h-4 w-4 text-text-3" />
                        )}
                      </button>

                      <p className="mt-1 inline-flex items-center gap-1 truncate text-[11px] text-text-3">
                        <MapPin className="h-3 w-3 shrink-0 text-brand-600" />
                        <span className="truncate">
                          {task.address}, {task.postcode}
                        </span>
                      </p>

                      {task.checkInAt ? (
                        <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700">
                          <Play className="h-2.5 w-2.5" />
                          Check-in registrado a las {task.checkInAt}
                        </p>
                      ) : null}
                      {task.completedAt ? (
                        <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          Completada a las {task.completedAt}
                        </p>
                      ) : null}
                      {task.status === 'completed' && task.tipPence > 0 ? (
                        <span
                          title="Propina del cliente — 100% para ti, ya sumada a tus ganancias del día"
                          className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800"
                        >
                          Propina £{(task.tipPence / 100).toFixed(2)}
                        </span>
                      ) : null}
                      {task.status === 'in_progress' ? (
                        <div className="mt-2 rounded-xl bg-amber-50 px-3 py-2 ring-1 ring-amber-100">
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800">
                              <Clock className="h-3 w-3" />
                              Horas trabajadas
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleAdjustHours(task.id, -0.25)}
                                aria-label="Restar 15 minutos"
                                title="Restar 15 minutos"
                                disabled={(task.actualHours ?? 0) <= 0}
                                className="grid h-11 w-11 place-items-center rounded-lg border border-amber-200 bg-white text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <input
                                type="number"
                                min={0}
                                step={0.25}
                                value={task.actualHours ?? ''}
                                onChange={(e) => handleSetHours(task.id, Number(e.target.value))}
                                placeholder="0.0"
                                aria-label="Horas trabajadas"
                                title="Reporta cuántas horas tardaste — actualiza tus ganancias al instante"
                                className="h-11 w-16 rounded-lg border border-amber-200 bg-white text-center text-[15px] font-semibold tabular-nums text-text-1"
                              />
                              <button
                                type="button"
                                onClick={() => handleAdjustHours(task.id, 0.25)}
                                aria-label="Sumar 15 minutos"
                                title="Sumar 15 minutos"
                                className="grid h-11 w-11 place-items-center rounded-lg border border-amber-200 bg-white text-amber-800 transition hover:bg-amber-100"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                              <span className="text-[11px] font-semibold text-amber-700">h</span>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {/* Secondary actions: small icon chips, right-aligned, no
                          single dominant primary in this row. */}
                      <div className="mt-2 flex flex-wrap items-center justify-end gap-1.5">
                        <a
                          href={task.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Navegar con Google Maps"
                          title="Navegar a esta dirección con Google Maps"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition hover:bg-brand-100"
                        >
                          <Navigation2 className="h-3.5 w-3.5" />
                        </a>
                        {task.status === 'scheduled' ? (
                          <button
                            type="button"
                            onClick={() => handleCheckIn(task.id)}
                            title="Marcar que has llegado al cliente — registra la hora de inicio"
                            className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700 transition hover:bg-amber-100"
                          >
                            <Play className="h-3 w-3" />
                            Check-in
                          </button>
                        ) : null}
                        {task.status === 'in_progress' ? (
                          <button
                            type="button"
                            onClick={() => handleUploadPhoto(task.id)}
                            aria-label="Subir foto del trabajo"
                            title="Subir foto del trabajo terminado — el cliente la verá en su portal"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-50 text-cyan-700 transition hover:bg-cyan-100"
                          >
                            <Camera className="h-3.5 w-3.5" />
                          </button>
                        ) : null}
                      </div>

                      {/* Primary action: full-width "Marcar completada" wins
                          the decision-point at the end of the in-progress
                          card — no other action competes with it. */}
                      {task.status === 'in_progress' ? (
                        <button
                          type="button"
                          onClick={() => handleComplete(task.id)}
                          title="Marcar la tarea como terminada para liberarte de esta parada"
                          className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-3 text-[14px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(5,150,105,0.55)] transition active:scale-[0.99]"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Marcar completada
                        </button>
                      ) : null}

                      {/* Expanded details + photo grid */}
                      {isExpanded ? (
                        <div className="mt-3 rounded-xl border border-dashed border-surface-2 bg-surface-1/40 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-text-3">
                            Cliente
                          </p>
                          <p className="mt-0.5 text-[12px] font-semibold text-text-1">
                            {task.client_name}
                          </p>
                          <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-text-3">
                            Notas del propietario
                          </p>
                          <p className="mt-0.5 text-[11.5px] leading-relaxed text-text-2">
                            {task.notes}
                          </p>

                          {/* Optional checklist — the same shared component
                              the Airbnb route uses. For residential demos the
                              checklist is usually undefined/empty; we still
                              mount the component on the rare host-pinned list
                              (task 3) so the empty-state copy is reachable
                              when a host removes the items mid-day. */}
                          {task.checklist ? (
                            <div className="mt-3">
                              <TaskChecklist
                                items={task.checklist}
                                onToggle={(key, done) =>
                                  handleToggleChecklist(task.id, key, done)
                                }
                              />
                            </div>
                          ) : null}

                          {task.photos.length > 0 ? (
                            <>
                              <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-text-3">
                                Fotos subidas ({task.photos.length})
                              </p>
                              <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                                {task.photos.map((src, i) => (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <button
                                    type="button"
                                    key={`${src}-${i}`}
                                    onClick={() => setLightbox({ taskId: task.id, idx: i })}
                                    title="Ampliar foto — desde el lightbox puedes eliminarla"
                                    className="overflow-hidden rounded-lg ring-1 ring-surface-2"
                                  >
                                    <img
                                      src={src}
                                      alt={`Foto del trabajo ${i + 1}`}
                                      loading="lazy"
                                      className="aspect-square w-full object-cover"
                                    />
                                  </button>
                                ))}
                              </div>
                            </>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                    </div>
                    </SwipeableTaskCard>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <DemoPhotoStrip
          title="Tus últimas limpiezas"
          caption="Las fotos que subes después de cada servicio quedan guardadas — y el cliente las ve."
        />

        {/* Demo-only reset — kept as a quiet inline link, well clear of the
            thumb zone, so demo chrome doesn't bleed into production-shaped UI. */}
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
              alt={`Foto del trabajo en ${lightboxTask.property_name}`}
              className="w-full rounded-2xl"
            />
            <div className="mt-3 flex items-center justify-between gap-2">
              <p className="text-[11px] text-white/80">
                {lightboxTask.property_name} · foto {lightbox.idx + 1} de {lightboxTask.photos.length}
              </p>
              <button
                type="button"
                onClick={() => handleDeletePhoto(lightbox.taskId, lightbox.idx)}
                title="Eliminar esta foto del registro de la tarea"
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
          className="pointer-events-none fixed inset-x-0 bottom-20 z-[70] mx-auto flex max-w-md justify-center px-4"
          aria-live="polite"
        >
          <div
            className={`rounded-full bg-emerald-600/95 px-4 py-2 text-[12px] font-semibold text-white shadow-lg backdrop-blur transition duration-200 ease-out ${
              toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}
          >
            ✓ {toast}
          </div>
        </div>
      ) : null}

      <CleanerConciergeSheet />

      <PreviewBottomTabBar active="agenda" />
    </main>
  );
}
