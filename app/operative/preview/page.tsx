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
import { AsistenteSheet } from '@/components/preview/AsistenteSheet';

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
  },
];

const STATUS_META: Record<DemoStatus, { label: string; cls: string; dot: string }> = {
  scheduled: {
    label: 'pendiente',
    cls: 'border border-[#1414141A] bg-[#F4EFE6] text-[#54524D]',
    dot: 'bg-[#54524D]/40',
  },
  in_progress: {
    label: 'en curso',
    cls: 'bg-[#FF5B1F] text-[#1A0A04]',
    dot: 'bg-[#FF5B1F] animate-pulse',
  },
  completed: {
    label: 'completada',
    cls: 'bg-[#3F5B3A] text-[#F4EFE6]',
    dot: 'bg-[#3F5B3A]',
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
  const [asistenteOpen, setAsistenteOpen] = useState(false);
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
    <main className="ps-paper-grain min-h-screen pb-24">
      <div className="mx-auto max-w-md px-4 pt-6 md:pt-10">
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

        <PreviewEarningsStrip
          todayPence={todayPence}
          weekPence={weekPence}
          href="/operative/preview/week"
        />

        {/* Hero card — siguiente parada.
            Only renders when there is genuinely a "next" job to act on. Once
            everything is completed we drop the hero so the timeline becomes
            the single source of truth (no double-rendering the in-progress
            task in two surfaces). */}
        {heroTask && heroTask.status !== 'completed' ? (
          <div className="mt-6">
          <PullToCheckInHero
            enabled={heroTask.status === 'scheduled'}
            onCheckIn={() => handleCheckIn(heroTask.id)}
          >
          <section className="ps-set rounded-[12px] bg-[#141414] p-6 text-[#F4EFE6]">
            <div className="flex items-center justify-between gap-2">
              <p className="ps-mono text-[12px] text-[#F4EFE6]/60">
                <span className="ps-link-mandarin text-[#F4EFE6]">siguiente parada</span>
              </p>
              <span className="ps-mono text-[12px] tabular-nums text-[#F4EFE6]/70">
                {heroTask.start_time}
              </span>
            </div>
            <h2 className="ps-serif mt-3 text-[32px] leading-[0.95] tracking-[-0.02em] text-[#F4EFE6]">
              {heroTask.client_name}
            </h2>
            <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-[#F4EFE6]/70">
              <MapPin className="h-3.5 w-3.5 text-[#FF5B1F]" />
              {heroTask.address} · {heroTask.postcode}
            </p>

            <div className="mt-5 flex items-stretch gap-2">
              <a
                href={heroTask.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir esta dirección en Google Maps para navegar paso a paso"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#FF5B1F] px-5 py-3 text-[15px] font-medium text-[#1A0A04] transition-colors hover:bg-[#FF5B1F]/90"
                style={{ transitionDuration: 'var(--dur-fast)', transitionTimingFunction: 'var(--ease)' }}
              >
                <Navigation2 className="h-4 w-4" /> Ir a la dirección
              </a>
              <a
                href={`tel:${heroTask.phone}`}
                aria-label="Llamar al cliente"
                title="Llamar al cliente o manager desde el teléfono"
                className="inline-flex h-auto min-h-[44px] w-12 shrink-0 items-center justify-center rounded-full border border-[#F4EFE6]/25 text-[#F4EFE6] transition-colors hover:border-[#F4EFE6]"
                style={{ transitionDuration: 'var(--dur-fast)', transitionTimingFunction: 'var(--ease)' }}
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </section>
          </PullToCheckInHero>
          </div>
        ) : null}

        {/* Agenda timeline — interactive */}
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="ps-mono inline-flex items-center gap-1.5 text-[12px] text-[#54524D]">
              <span className="ps-link-mandarin text-[#141414]">agenda de hoy</span>
              <button
                type="button"
                aria-label="Ayuda sobre la agenda"
                aria-expanded={agendaHelpOpen}
                aria-controls="agenda-help"
                onClick={() => setAgendaHelpOpen((o) => !o)}
                className="grid h-5 w-5 place-items-center rounded-full border border-[#1414141A] text-[#54524D] transition-colors hover:border-[#141414] hover:text-[#141414]"
                style={{ transitionDuration: 'var(--dur-fast)', transitionTimingFunction: 'var(--ease)' }}
              >
                <HelpCircle className="h-3 w-3" />
              </button>
            </h2>
            <Link
              href="/operative/preview/week"
              title="Ver el resumen de toda la semana"
              className="ps-mono inline-flex items-center gap-1 text-[12px] text-[#141414] ps-link ps-link-mandarin"
            >
              <Navigation2 className="h-3 w-3" /> ver semana
            </Link>
          </div>
          {agendaHelpOpen ? (
            <p
              id="agenda-help"
              className="mt-3 rounded-[12px] border border-[#1414141A] bg-[#E4DACA] px-4 py-3 text-[13px] leading-relaxed text-[#54524D]"
            >
              Toca cualquier tarea para ver notas del cliente, hacer check-in o subir fotos.
            </p>
          ) : null}

          <ol
            className="relative mt-5"
            style={{ ['--rail-offset' as string]: 'calc(52px + 0.75rem + 0.5rem)' }}
          >
            <span
              aria-hidden
              className="absolute top-3 bottom-3 w-px bg-[#1414141A]"
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
                    <div className="flex w-[52px] shrink-0 flex-col items-end pt-3">
                      <p className="ps-serif text-[22px] leading-none tracking-[-0.02em] tabular-nums text-[#141414]">
                        {task.start_time}
                      </p>
                      <p className="ps-mono mt-1 inline-flex items-center gap-0.5 text-[11px] text-[#54524D]">
                        <Clock className="h-2.5 w-2.5" />
                        {formatHours(task.estimated_duration_min)}
                      </p>
                    </div>

                    {/* Status dot */}
                    <span className="relative flex w-4 shrink-0 justify-center pt-4">
                      <span
                        aria-hidden
                        className={`h-3 w-3 rounded-full ring-4 ring-[#F4EFE6] ${st.dot}`}
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
                    <div className="ps-set rounded-[12px] border border-[#1414141A] bg-[#E4DACA] p-5">
                      <button
                        type="button"
                        onClick={() => toggleExpand(task.id)}
                        title="Toca para ver detalles del cliente y notas"
                        className="flex w-full items-start justify-between gap-2 text-left"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="ps-serif truncate text-[20px] leading-tight tracking-[-0.015em] text-[#141414]">
                            {task.client_name}
                          </p>
                          <p className="ps-mono mt-1 truncate text-[12px] text-[#54524D]">
                            {task.property_name}
                          </p>
                        </div>
                        <span
                          className={`ps-mono shrink-0 rounded-full px-2.5 py-0.5 text-[11px] ${st.cls}`}
                        >
                          {st.label}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="mt-1 h-4 w-4 text-[#54524D]" />
                        ) : (
                          <ChevronDown className="mt-1 h-4 w-4 text-[#54524D]" />
                        )}
                      </button>

                      <p className="mt-2 inline-flex items-center gap-1.5 truncate text-[12px] text-[#54524D]">
                        <MapPin className="h-3 w-3 shrink-0 text-[#FF5B1F]" />
                        <span className="truncate">
                          {task.address}, {task.postcode}
                        </span>
                      </p>

                      {task.checkInAt ? (
                        <p className="ps-mono mt-2 inline-flex items-center gap-1 text-[11px] text-[#141414]">
                          <Play className="h-2.5 w-2.5 text-[#FF5B1F]" />
                          check-in registrado a las {task.checkInAt}
                        </p>
                      ) : null}
                      {task.completedAt ? (
                        <p className="ps-mono mt-2 inline-flex items-center gap-1 text-[11px] text-[#3F5B3A]">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          completada a las {task.completedAt}
                        </p>
                      ) : null}
                      {task.status === 'completed' && task.tipPence > 0 ? (
                        <span
                          title="Propina del cliente — 100% para ti, ya sumada a tus ganancias del día"
                          className="ps-mono mt-2 inline-flex items-center gap-1 rounded-full border border-[#1414141A] bg-[#F4EFE6] px-2.5 py-0.5 text-[11px] text-[#141414]"
                        >
                          propina <span className="tabular-nums">£{(task.tipPence / 100).toFixed(2)}</span>
                        </span>
                      ) : null}
                      {task.status === 'in_progress' ? (
                        <div className="mt-3 rounded-[12px] border border-[#1414141A] bg-[#F4EFE6] px-3 py-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="ps-mono inline-flex items-center gap-1 text-[12px] text-[#141414]">
                              <Clock className="h-3 w-3" />
                              horas trabajadas
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleAdjustHours(task.id, -0.25)}
                                aria-label="Restar 15 minutos"
                                title="Restar 15 minutos"
                                disabled={(task.actualHours ?? 0) <= 0}
                                className="grid h-11 w-11 place-items-center rounded-[12px] border border-[#1414141A] bg-[#E4DACA] text-[#141414] transition-colors hover:border-[#141414] disabled:cursor-not-allowed disabled:opacity-40"
                                style={{ transitionDuration: 'var(--dur-fast)', transitionTimingFunction: 'var(--ease)' }}
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
                                className="ps-serif h-11 w-16 rounded-[12px] border border-[#1414141A] bg-[#E4DACA] text-center text-[18px] tabular-nums text-[#141414] focus:border-[#FF5B1F] focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleAdjustHours(task.id, 0.25)}
                                aria-label="Sumar 15 minutos"
                                title="Sumar 15 minutos"
                                className="grid h-11 w-11 place-items-center rounded-[12px] border border-[#1414141A] bg-[#E4DACA] text-[#141414] transition-colors hover:border-[#141414]"
                                style={{ transitionDuration: 'var(--dur-fast)', transitionTimingFunction: 'var(--ease)' }}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                              <span className="ps-mono text-[12px] text-[#54524D]">h</span>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {/* Secondary actions: small icon chips, right-aligned, no
                          single dominant primary in this row. */}
                      <div className="mt-3 flex flex-wrap items-center justify-end gap-1.5">
                        <a
                          href={task.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Navegar con Google Maps"
                          title="Navegar a esta dirección con Google Maps"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#1414141A] bg-[#F4EFE6] text-[#141414] transition-colors hover:border-[#141414]"
                          style={{ transitionDuration: 'var(--dur-fast)', transitionTimingFunction: 'var(--ease)' }}
                        >
                          <Navigation2 className="h-3.5 w-3.5" />
                        </a>
                        {task.status === 'scheduled' ? (
                          <button
                            type="button"
                            onClick={() => handleCheckIn(task.id)}
                            title="Marcar que has llegado al cliente — registra la hora de inicio"
                            className="ps-mono inline-flex items-center gap-1 rounded-full bg-[#FF5B1F] px-3 py-1 text-[11px] text-[#1A0A04]"
                          >
                            <Play className="h-3 w-3" />
                            check-in
                          </button>
                        ) : null}
                        {task.status === 'in_progress' ? (
                          <button
                            type="button"
                            onClick={() => handleUploadPhoto(task.id)}
                            aria-label="Subir foto del trabajo"
                            title="Subir foto del trabajo terminado — el cliente la verá en su portal"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#1414141A] bg-[#F4EFE6] text-[#141414] transition-colors hover:border-[#141414]"
                            style={{ transitionDuration: 'var(--dur-fast)', transitionTimingFunction: 'var(--ease)' }}
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
                          className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#FF5B1F] px-4 py-3 text-[14px] font-medium text-[#1A0A04] transition-colors hover:bg-[#FF5B1F]/90"
                          style={{ transitionDuration: 'var(--dur-fast)', transitionTimingFunction: 'var(--ease)' }}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Marcar completada
                        </button>
                      ) : null}

                      {/* Expanded details + photo grid */}
                      {isExpanded ? (
                        <div className="ps-set mt-3 rounded-[12px] border border-[#1414141A] bg-[#F4EFE6] p-4">
                          <p className="ps-mono text-[12px] text-[#54524D]">cliente</p>
                          <p className="ps-serif mt-1 text-[18px] leading-tight tracking-[-0.015em] text-[#141414]">
                            {task.client_name}
                          </p>
                          <p className="ps-mono mt-3 text-[12px] text-[#54524D]">notas del propietario</p>
                          <p className="mt-1 text-[13px] leading-relaxed text-[#141414]">
                            {task.notes}
                          </p>

                          {task.photos.length > 0 ? (
                            <>
                              <p className="ps-mono mt-4 text-[12px] text-[#54524D]">
                                fotos subidas (<span className="tabular-nums">{task.photos.length}</span>)
                              </p>
                              <div className="mt-2 grid grid-cols-3 gap-1.5">
                                {task.photos.map((src, i) => (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <button
                                    type="button"
                                    key={`${src}-${i}`}
                                    onClick={() => setLightbox({ taskId: task.id, idx: i })}
                                    title="Ampliar foto — desde el lightbox puedes eliminarla"
                                    className="overflow-hidden rounded-[12px] border border-[#1414141A]"
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
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onReset}
            title="Reiniciar la demo — vuelve al estado inicial sin recargar"
            className="ps-mono inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] text-[#54524D] transition-colors hover:text-[#141414]"
            style={{ transitionDuration: 'var(--dur-fast)', transitionTimingFunction: 'var(--ease)' }}
          >
            <RotateCcw className="h-3 w-3" />
            reiniciar demo
          </button>
        </div>
      </div>

      {/* Photo lightbox */}
      {lightbox && lightboxSrc && lightboxTask ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#141414]/85 p-4"
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
              className="absolute -top-10 right-0 grid h-8 w-8 place-items-center rounded-full border border-[#F4EFE6]/25 text-[#F4EFE6]"
            >
              <X className="h-4 w-4" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxSrc}
              alt={`Foto del trabajo en ${lightboxTask.property_name}`}
              className="w-full rounded-[12px] border border-[#F4EFE6]/15"
            />
            <div className="mt-3 flex items-center justify-between gap-2">
              <p className="ps-mono text-[12px] text-[#F4EFE6]/70">
                {lightboxTask.property_name} · foto <span className="tabular-nums">{lightbox.idx + 1}</span> de <span className="tabular-nums">{lightboxTask.photos.length}</span>
              </p>
              <button
                type="button"
                onClick={() => handleDeletePhoto(lightbox.taskId, lightbox.idx)}
                title="Eliminar esta foto del registro de la tarea"
                className="ps-mono inline-flex items-center gap-1 rounded-full bg-[#FF5B1F] px-3 py-1.5 text-[12px] text-[#1A0A04]"
              >
                <Trash2 className="h-3 w-3" />
                eliminar foto
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Toast — fades + lifts in/out so the confirmation registers
          peripherally without dominating the screen. */}
      {toast ? (
        <div
          className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] mx-auto flex max-w-md justify-center px-4"
          aria-live="polite"
        >
          <div
            className={`ps-mono rounded-full bg-[#141414] px-4 py-2 text-[12px] text-[#F4EFE6] transition ${
              toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}
            style={{
              transitionDuration: 'var(--dur-base)',
              transitionTimingFunction: 'var(--ease)',
            }}
          >
            <span className="text-[#FF5B1F]">✓</span> {toast}
          </div>
        </div>
      ) : null}

      <AsistenteSheet
        open={asistenteOpen}
        onClose={() => setAsistenteOpen(false)}
        tasks={tasks}
        onAction={(s) => {
          // Map the suggestion back to a concrete demo behaviour so the
          // sheet feels causally connected to the agenda state.
          if (s.kind === 'report-hours') {
            const inProg = tasks.find((t) => t.status === 'in_progress');
            if (inProg) {
              setExpandedId(inProg.id);
              handleSetHours(inProg.id, 1);
              showToast('Horas pre-rellenadas');
            }
          } else if (s.kind === 'call-client') {
            const next = tasks.find((t) => t.status === 'scheduled');
            if (next) handleCallClient(next.id);
          } else if (s.kind === 'upload-photo') {
            const done = tasks.find((t) => t.status === 'completed' && t.photos.length === 0);
            if (done) handleUploadPhoto(done.id);
          }
        }}
      />

      <PreviewBottomTabBar
        active="agenda"
        onAsistentePress={() => setAsistenteOpen(true)}
        onAsistentePullUp={() => setAsistenteOpen(true)}
      />
    </main>
  );
}
