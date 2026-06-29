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
import { pickCopy, useClientLocale, type ClientLocale } from '@/lib/use-locale-client';
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

const COPY = {
  en: {
    statusScheduled: 'Pending',
    statusInProgress: 'In progress',
    statusCompleted: 'Completed',
    note1: 'Keys in the lockbox (code 4421). Hoover the living room rug.',
    note2: 'Leave the mop clean in the bathroom cupboard. Receipt on the worktop.',
    note3: 'Airbnb check-out. Fresh sheets in the hallway cupboard.',
    checklistPlants: 'Water the balcony plants',
    checklistRecycling: 'Take out the recycling (Tuesday)',
    cleanerName: 'Carmen López',
    nextStop: 'Next stop',
    goToAddress: 'Go to address',
    callClientAria: 'Call client',
    callClientTitle: 'Call the client or manager from your phone',
    todayAgenda: "Today's agenda",
    agendaHelpAria: 'Agenda help',
    agendaHelp: 'Tap any task to view client notes, check in or upload photos.',
    seeWeek: 'See week',
    seeWeekTitle: 'View the full week summary',
    weekHrefTitle: 'View the full week summary',
    checkInLoggedAt: (time: string) => `Checked in at ${time}`,
    completedAt: (time: string) => `Completed at ${time}`,
    tipLabel: (amount: string) => `Tip £${amount}`,
    tipTitle: 'Client tip — 100% yours, already added to today\'s earnings',
    hoursWorked: 'Hours worked',
    minus15Aria: 'Subtract 15 minutes',
    minus15Title: 'Subtract 15 minutes',
    plus15Aria: 'Add 15 minutes',
    plus15Title: 'Add 15 minutes',
    hoursInputAria: 'Hours worked',
    hoursInputTitle: 'Report how long you took — updates your earnings instantly',
    navigateAria: 'Navigate with Google Maps',
    navigateTitle: 'Navigate to this address with Google Maps',
    checkInTitle: 'Mark that you have arrived at the client — logs the start time',
    checkIn: 'Check-in',
    uploadPhotoAria: 'Upload a job photo',
    uploadPhotoTitle: 'Upload a photo of the finished job — the client sees it in their portal',
    markCompleted: 'Mark completed',
    markCompletedTitle: 'Mark the task done so you are free of this stop',
    expandTitle: 'Tap to view client details and notes',
    clientLabel: 'Client',
    ownerNotes: 'Owner notes',
    photosUploaded: (n: number) => `Photos uploaded (${n})`,
    photoZoomTitle: 'Enlarge photo — from the lightbox you can delete it',
    photoAlt: (i: number) => `Job photo ${i}`,
    photoLightboxAlt: (prop: string) => `Job photo at ${prop}`,
    photoCounter: (i: number, total: number) => `photo ${i} of ${total}`,
    deletePhotoTitle: 'Remove this photo from the task record',
    deletePhoto: 'Delete photo',
    closeTitle: 'Close',
    checkInRegistered: 'Check-in registered',
    taskCompleted: 'Task completed',
    callingClient: (name: string) => `Calling ${name}…`,
    photoUploaded: 'Photo uploaded',
    photoDeleted: 'Photo deleted',
    photoStripTitle: 'Your latest cleans',
    photoStripCaption: 'The photos you upload after each service are saved — and the client sees them.',
    resetDemo: 'Reset demo',
    resetDemoTitle: 'Reset the demo — back to the initial state without reloading',
  },
  es: {
    statusScheduled: 'Pendiente',
    statusInProgress: 'En curso',
    statusCompleted: 'Completada',
    note1: 'Llaves en el lockbox (código 4421). Aspirar la alfombra del salón.',
    note2: 'Dejar la fregona limpia en el armario del baño. Recibo en la encimera.',
    note3: 'Check-out de Airbnb. Sábanas limpias en el armario del pasillo.',
    checklistPlants: 'Regar las plantas del balcón',
    checklistRecycling: 'Bajar el reciclaje (martes)',
    cleanerName: 'Carmen López',
    nextStop: 'Siguiente parada',
    goToAddress: 'Ir a la dirección',
    callClientAria: 'Llamar al cliente',
    callClientTitle: 'Llamar al cliente o manager desde el teléfono',
    todayAgenda: 'Agenda de hoy',
    agendaHelpAria: 'Ayuda sobre la agenda',
    agendaHelp: 'Toca cualquier tarea para ver notas del cliente, hacer check-in o subir fotos.',
    seeWeek: 'Ver semana',
    seeWeekTitle: 'Ver el resumen de toda la semana',
    weekHrefTitle: 'Ver el resumen de toda la semana',
    checkInLoggedAt: (time: string) => `Check-in registrado a las ${time}`,
    completedAt: (time: string) => `Completada a las ${time}`,
    tipLabel: (amount: string) => `Propina £${amount}`,
    tipTitle: 'Propina del cliente — 100% para ti, ya sumada a tus ganancias del día',
    hoursWorked: 'Horas trabajadas',
    minus15Aria: 'Restar 15 minutos',
    minus15Title: 'Restar 15 minutos',
    plus15Aria: 'Sumar 15 minutos',
    plus15Title: 'Sumar 15 minutos',
    hoursInputAria: 'Horas trabajadas',
    hoursInputTitle: 'Reporta cuántas horas tardaste — actualiza tus ganancias al instante',
    navigateAria: 'Navegar con Google Maps',
    navigateTitle: 'Navegar a esta dirección con Google Maps',
    checkInTitle: 'Marcar que has llegado al cliente — registra la hora de inicio',
    checkIn: 'Check-in',
    uploadPhotoAria: 'Subir foto del trabajo',
    uploadPhotoTitle: 'Subir foto del trabajo terminado — el cliente la verá en su portal',
    markCompleted: 'Marcar completada',
    markCompletedTitle: 'Marcar la tarea como terminada para liberarte de esta parada',
    expandTitle: 'Toca para ver detalles del cliente y notas',
    clientLabel: 'Cliente',
    ownerNotes: 'Notas del propietario',
    photosUploaded: (n: number) => `Fotos subidas (${n})`,
    photoZoomTitle: 'Ampliar foto — desde el lightbox puedes eliminarla',
    photoAlt: (i: number) => `Foto del trabajo ${i}`,
    photoLightboxAlt: (prop: string) => `Foto del trabajo en ${prop}`,
    photoCounter: (i: number, total: number) => `foto ${i} de ${total}`,
    deletePhotoTitle: 'Eliminar esta foto del registro de la tarea',
    deletePhoto: 'Eliminar foto',
    closeTitle: 'Cerrar',
    checkInRegistered: 'Check-in registrado',
    taskCompleted: 'Tarea completada',
    callingClient: (name: string) => `Llamando a ${name}…`,
    photoUploaded: 'Foto subida',
    photoDeleted: 'Foto eliminada',
    photoStripTitle: 'Tus últimas limpiezas',
    photoStripCaption: 'Las fotos que subes después de cada servicio quedan guardadas — y el cliente las ve.',
    resetDemo: 'Reiniciar demo',
    resetDemoTitle: 'Reiniciar la demo — vuelve al estado inicial sin recargar',
  },
  pt: {
    statusScheduled: 'Pendente',
    statusInProgress: 'Em curso',
    statusCompleted: 'Concluída',
    note1: 'Chaves no cofre (código 4421). Aspirar o tapete da sala.',
    note2: 'Deixar a esfregona limpa no armário da casa de banho. Recibo na bancada.',
    note3: 'Check-out de Airbnb. Lençóis limpos no armário do corredor.',
    checklistPlants: 'Regar as plantas da varanda',
    checklistRecycling: 'Descer a reciclagem (terça-feira)',
    cleanerName: 'Carmen López',
    nextStop: 'Próxima paragem',
    goToAddress: 'Ir para a morada',
    callClientAria: 'Ligar ao cliente',
    callClientTitle: 'Ligar ao cliente ou ao gestor a partir do telefone',
    todayAgenda: 'Agenda de hoje',
    agendaHelpAria: 'Ajuda sobre a agenda',
    agendaHelp: 'Toque em qualquer tarefa para ver notas do cliente, fazer check-in ou enviar fotos.',
    seeWeek: 'Ver semana',
    seeWeekTitle: 'Ver o resumo de toda a semana',
    weekHrefTitle: 'Ver o resumo de toda a semana',
    checkInLoggedAt: (time: string) => `Check-in registado às ${time}`,
    completedAt: (time: string) => `Concluída às ${time}`,
    tipLabel: (amount: string) => `Gorjeta £${amount}`,
    tipTitle: 'Gorjeta do cliente — 100% para si, já somada aos ganhos do dia',
    hoursWorked: 'Horas trabalhadas',
    minus15Aria: 'Subtrair 15 minutos',
    minus15Title: 'Subtrair 15 minutos',
    plus15Aria: 'Somar 15 minutos',
    plus15Title: 'Somar 15 minutos',
    hoursInputAria: 'Horas trabalhadas',
    hoursInputTitle: 'Indique quantas horas demorou — atualiza os seus ganhos no momento',
    navigateAria: 'Navegar com o Google Maps',
    navigateTitle: 'Navegar até esta morada com o Google Maps',
    checkInTitle: 'Marcar que chegou ao cliente — regista a hora de início',
    checkIn: 'Check-in',
    uploadPhotoAria: 'Enviar foto do trabalho',
    uploadPhotoTitle: 'Enviar foto do trabalho terminado — o cliente vê-a no portal',
    markCompleted: 'Marcar concluída',
    markCompletedTitle: 'Marcar a tarefa como terminada para se libertar desta paragem',
    expandTitle: 'Toque para ver detalhes do cliente e notas',
    clientLabel: 'Cliente',
    ownerNotes: 'Notas do proprietário',
    photosUploaded: (n: number) => `Fotos enviadas (${n})`,
    photoZoomTitle: 'Ampliar foto — a partir do lightbox pode apagá-la',
    photoAlt: (i: number) => `Foto do trabalho ${i}`,
    photoLightboxAlt: (prop: string) => `Foto do trabalho em ${prop}`,
    photoCounter: (i: number, total: number) => `foto ${i} de ${total}`,
    deletePhotoTitle: 'Eliminar esta foto do registo da tarefa',
    deletePhoto: 'Eliminar foto',
    closeTitle: 'Fechar',
    checkInRegistered: 'Check-in registado',
    taskCompleted: 'Tarefa concluída',
    callingClient: (name: string) => `A ligar para ${name}…`,
    photoUploaded: 'Foto enviada',
    photoDeleted: 'Foto eliminada',
    photoStripTitle: 'As suas últimas limpezas',
    photoStripCaption: 'As fotos que envia após cada serviço ficam guardadas — e o cliente vê-as.',
    resetDemo: 'Reiniciar demo',
    resetDemoTitle: 'Reiniciar a demo — volta ao estado inicial sem recarregar',
  },
} as const satisfies Record<ClientLocale, unknown>;

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

type CopyShape = (typeof COPY)['en'];

function buildInitialTasks(t: CopyShape): DemoTask[] {
  return [
    {
      id: 'demo-1',
      start_time: '10:00',
      status: 'completed',
      estimated_duration_min: 90,
      property_name: 'Soho Loft',
      client_name: 'Mr. Thompson',
      address: '22 Old Compton St, Soho',
      postcode: 'London W1D 4TR',
      notes: t.note1,
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
      notes: t.note2,
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
      notes: t.note3,
      mapsUrl: 'https://maps.google.com/?q=31+Curtain+Rd+Shoreditch+London+EC2A+3LT',
      phone: '+447700900333',
      photos: [],
      actualHours: null,
      cleanerPayRatePence: 1400,
      tipPence: 0,
      // Short, host-pinned checklist — shows how the same component degrades
      // gracefully from full Airbnb gating to a quick reminder list here.
      checklist: [
        { key: 'plants', label: t.checklistPlants, done: false },
        { key: 'recycling', label: t.checklistRecycling, done: false },
      ],
    },
  ];
}

function buildStatusMeta(t: CopyShape): Record<DemoStatus, { label: string; cls: string; dot: string }> {
  return {
    scheduled: {
      label: t.statusScheduled,
      cls: 'bg-slate-100 text-slate-700',
      dot: 'bg-slate-400',
    },
    in_progress: {
      label: t.statusInProgress,
      cls: 'bg-slate-100 text-slate-900',
      dot: 'bg-[#00D8C7] animate-pulse',
    },
    completed: {
      label: t.statusCompleted,
      cls: 'bg-slate-900 text-white',
      dot: 'bg-emerald-600',
    },
  };
}

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
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  const STATUS_META = useMemo(() => buildStatusMeta(t), [t]);
  const [tasks, setTasks] = useState<DemoTask[]>(() => buildInitialTasks(t));
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
    showToast(t.checkInRegistered);
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
    showToast(t.taskCompleted);
  }

  function handleCallClient(taskId: string) {
    const task = tasks.find((x) => x.id === taskId);
    if (!task) return;
    // In a real app this would open tel: — for the demo we surface a
    // toast so the visitor sees the action was recognised by the swipe.
    showToast(t.callingClient(task.client_name));
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
    showToast(t.photoUploaded);
  }

  function handleDeletePhoto(taskId: string, idx: number) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, photos: t.photos.filter((_, i) => i !== idx) } : t,
      ),
    );
    setLightbox(null);
    showToast(t.photoDeleted);
  }

  function toggleExpand(taskId: string) {
    setExpandedId((cur) => (cur === taskId ? null : taskId));
  }

  const lightboxTask = lightbox ? tasks.find((t) => t.id === lightbox.taskId) : null;
  const lightboxSrc =
    lightboxTask && lightbox ? lightboxTask.photos[lightbox.idx] : null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 pb-24">
      <PreviewFlavorToggle
        active="hogar"
        hogarHref="/operative/preview"
        airbnbHref="/operative/preview-airbnb"
      />
      <div className="relative z-10 mx-auto max-w-md px-4 py-5">
        <AgendaHeader
          cleanerName={t.cleanerName}
          now={now}
          doneCount={doneCount}
          totalCount={tasks.length}
          weekHref="/operative/preview/week"
          inProgressTaskId={inProgressTaskId}
          decorationSlot={
            <KintsugiThread doneCount={doneCount} totalCount={tasks.length} />
          }
        />

        {/* Earnings strip — white surface with midnight numbers */}
        <div className="relative">
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
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),_0_10px_24px_-12px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-700">
                <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-[#00D8C7]" />
                {t.nextStop}
              </span>
              <span className="text-[11px] font-semibold tabular-nums text-slate-500">
                {heroTask.start_time}
              </span>
            </div>
            <h2 className="mt-2 font-display text-lg font-semibold text-slate-900">
              {heroTask.client_name}
            </h2>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-600">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              {heroTask.address} · {heroTask.postcode}
            </p>

            <div className="mt-4 flex items-stretch gap-2">
              <a
                href={heroTask.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={t.navigateTitle}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0A0D18] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_8px_20px_-12px_rgba(10,13,24,0.5)] transition hover:bg-slate-800 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D8C7] focus-visible:ring-offset-2"
              >
                <Navigation2 className="h-4 w-4" /> {t.goToAddress}
              </a>
              <a
                href={`tel:${heroTask.phone}`}
                aria-label={t.callClientAria}
                title={t.callClientTitle}
                className="inline-flex h-auto min-h-[44px] w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
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
            <h2 className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-700">
              {t.todayAgenda}
              <button
                type="button"
                aria-label={t.agendaHelpAria}
                aria-expanded={agendaHelpOpen}
                aria-controls="agenda-help"
                onClick={() => setAgendaHelpOpen((o) => !o)}
                className="grid h-5 w-5 place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
              >
                <HelpCircle className="h-3 w-3" />
              </button>
            </h2>
            <Link
              href="/operative/preview/week"
              title={t.seeWeekTitle}
              className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-900 hover:text-[#0A0D18]"
            >
              <Navigation2 className="h-3 w-3" /> {t.seeWeek}
            </Link>
          </div>
          {agendaHelpOpen ? (
            <p
              id="agenda-help"
              className="mt-2 rounded-lg border border-dashed border-surface-2 bg-surface-1/60 px-3 py-2 text-[11px] leading-relaxed text-text-2"
            >
              {t.agendaHelp}
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
                          ? 'rounded-2xl bg-gradient-to-br from-[#00D8C7]/30 to-[#00D8C7]/0 p-[1px]'
                          : ''
                      }
                    >
                    <div className="rounded-2xl border border-surface-2 bg-paper p-3 shadow-[0_2px_4px_rgba(15,23,42,0.04),_0_10px_24px_-8px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-0.5">
                      <button
                        type="button"
                        onClick={() => toggleExpand(task.id)}
                        title={t.expandTitle}
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

                      <p className="mt-1 inline-flex items-center gap-1 truncate text-[11px] text-slate-500">
                        <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                        <span className="truncate">
                          {task.address}, {task.postcode}
                        </span>
                      </p>

                      {task.checkInAt ? (
                        <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700">
                          <Play className="h-2.5 w-2.5 text-[#00D8C7]" />
                          {t.checkInLoggedAt(task.checkInAt)}
                        </p>
                      ) : null}
                      {task.completedAt ? (
                        <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          {t.completedAt(task.completedAt)}
                        </p>
                      ) : null}
                      {task.status === 'completed' && task.tipPence > 0 ? (
                        <span
                          title={t.tipTitle}
                          className="mt-1 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-900"
                        >
                          <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-[#00D8C7]" />
                          {t.tipLabel((task.tipPence / 100).toFixed(2))}
                        </span>
                      ) : null}
                      {task.status === 'in_progress' ? (
                        <div className="mt-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-900">
                              <Clock className="h-3 w-3 text-slate-500" />
                              {t.hoursWorked}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleAdjustHours(task.id, -0.25)}
                                aria-label={t.minus15Aria}
                                title={t.minus15Title}
                                disabled={(task.actualHours ?? 0) <= 0}
                                className="grid h-11 w-11 place-items-center rounded-lg border border-slate-200 bg-white text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
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
                                aria-label={t.hoursInputAria}
                                title={t.hoursInputTitle}
                                className="h-11 w-16 rounded-lg border border-slate-200 bg-white text-center text-[15px] font-semibold tabular-nums text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D8C7]"
                              />
                              <button
                                type="button"
                                onClick={() => handleAdjustHours(task.id, 0.25)}
                                aria-label={t.plus15Aria}
                                title={t.plus15Title}
                                className="grid h-11 w-11 place-items-center rounded-lg border border-slate-200 bg-white text-slate-900 transition hover:bg-slate-100"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                              <span className="text-[11px] font-semibold text-slate-600">h</span>
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
                          aria-label={t.navigateAria}
                          title={t.navigateTitle}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          <Navigation2 className="h-3.5 w-3.5" />
                        </a>
                        {task.status === 'scheduled' ? (
                          <button
                            type="button"
                            onClick={() => handleCheckIn(task.id)}
                            title={t.checkInTitle}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-900 transition hover:bg-slate-50"
                          >
                            <Play className="h-3 w-3 text-[#00D8C7]" />
                            {t.checkIn}
                          </button>
                        ) : null}
                        {task.status === 'in_progress' ? (
                          <button
                            type="button"
                            onClick={() => handleUploadPhoto(task.id)}
                            aria-label={t.uploadPhotoAria}
                            title={t.uploadPhotoTitle}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
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
                          title={t.markCompletedTitle}
                          className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#0A0D18] px-3 py-3 text-[14px] font-semibold text-white shadow-[0_8px_20px_-12px_rgba(10,13,24,0.55)] transition hover:bg-slate-800 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D8C7] focus-visible:ring-offset-2"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          {t.markCompleted}
                        </button>
                      ) : null}

                      {/* Expanded details + photo grid */}
                      {isExpanded ? (
                        <div className="mt-3 rounded-xl border border-dashed border-surface-2 bg-surface-1/40 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-text-3">
                            {t.clientLabel}
                          </p>
                          <p className="mt-0.5 text-[12px] font-semibold text-text-1">
                            {task.client_name}
                          </p>
                          <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-text-3">
                            {t.ownerNotes}
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
                                {t.photosUploaded(task.photos.length)}
                              </p>
                              <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                                {task.photos.map((src, i) => (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <button
                                    type="button"
                                    key={`${src}-${i}`}
                                    onClick={() => setLightbox({ taskId: task.id, idx: i })}
                                    title={t.photoZoomTitle}
                                    className="overflow-hidden rounded-lg ring-1 ring-surface-2"
                                  >
                                    <img
                                      src={src}
                                      alt={t.photoAlt(i + 1)}
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
          title={t.photoStripTitle}
          caption={t.photoStripCaption}
        />

        {/* Demo-only reset — kept as a quiet inline link, well clear of the
            thumb zone, so demo chrome doesn't bleed into production-shaped UI. */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={onReset}
            title={t.resetDemoTitle}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium text-text-3 transition hover:text-text-1"
          >
            <RotateCcw className="h-3 w-3" />
            {t.resetDemo}
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
              title={t.closeTitle}
              className="absolute -top-10 right-0 grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white backdrop-blur"
            >
              <X className="h-4 w-4" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxSrc}
              alt={t.photoLightboxAlt(lightboxTask.property_name)}
              className="w-full rounded-2xl"
            />
            <div className="mt-3 flex items-center justify-between gap-2">
              <p className="text-[11px] text-white/80">
                {lightboxTask.property_name} · {t.photoCounter(lightbox.idx + 1, lightboxTask.photos.length)}
              </p>
              <button
                type="button"
                onClick={() => handleDeletePhoto(lightbox.taskId, lightbox.idx)}
                title={t.deletePhotoTitle}
                className="inline-flex items-center gap-1 rounded-full bg-red-500/90 px-3 py-1.5 text-[11px] font-semibold text-white shadow hover:bg-red-500"
              >
                <Trash2 className="h-3 w-3" />
                {t.deletePhoto}
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
            className={`inline-flex items-center gap-1.5 rounded-full bg-[#0A0D18] px-4 py-2 text-[12px] font-semibold text-white shadow-lg backdrop-blur transition duration-200 ease-out ${
              toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}
          >
            <span aria-hidden className="text-[#00D8C7]">✓</span> {toast}
          </div>
        </div>
      ) : null}

      <CleanerConciergeSheet />

      <PreviewBottomTabBar active="agenda" />
    </main>
  );
}
