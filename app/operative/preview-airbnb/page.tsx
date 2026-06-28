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
import { pickCopy, useClientLocale, type ClientLocale } from '@/lib/use-locale-client';
import { DemoTopBar } from '@/components/preview/DemoTopBar';
import { PreviewFlavorToggle } from '@/components/preview/PreviewFlavorToggle';
import { TaskChecklist, type ChecklistItem as TaskChecklistItem } from '@/components/tasks/TaskChecklist';
import { CompletionGate } from '@/components/tasks/CompletionGate';

type DemoStatus = 'scheduled' | 'in_progress' | 'completed';

const COPY = {
  en: {
    statusScheduled: 'Pending',
    statusInProgress: 'In progress',
    statusCompleted: 'Completed',
    dayToday: 'Today',
    dayTomorrow: 'Tomorrow',
    requiredPhotoZones: ['living room', 'kitchen', 'bathroom', 'bedroom'] as ReadonlyArray<string>,
    checklist: {
      sheets: 'Change sheets',
      sheetsHint: '4 sheets per king bed (fitted, flat, 2 pillowcases).',
      towels: 'Restock towels',
      towelsHint: '2 bath + 2 face towels per guest.',
      paper: 'Restock toilet paper (x2)',
      soap: 'Restock soap',
      coffee: 'Restock coffee / tea',
      water: 'Restock water',
      vacuum: 'Hoover every room',
      bathroom: 'Full bathroom clean (floor, fixtures, mirror)',
    },
    headerPortal: 'DEMO · CLEANER (AIRBNB)',
    overline: 'Airbnb · Turnovers',
    greeting: 'Hi, Carmen',
    summary: (done: number, total: number) => `${done} of ${total} turnovers done · London`,
    todayEarnings: 'Today',
    nextTurnover: 'Next turnover',
    countdownTitle: 'Time remaining until the next check-in',
    countdownLate: 'check-in overdue',
    countdownRemaining: (label: string) => `${label} until check-in`,
    previousGuest: 'Previous guest',
    nextGuest: 'Next guest',
    checkOutAt: (time: string) => `Out ${time}`,
    cleaningStartsAt: (time: string) => `cleaning starts ${time}`,
    arrivalAt: (time: string) => `Arrives ${time}`,
    mustFinishBefore: 'finish before then',
    goToAddress: 'Go to address',
    goToAddressTitle: 'Open this address in Google Maps for step-by-step directions',
    copyLockboxAria: 'Copy lockbox code',
    copyLockboxTitle: (code: string) => `Lockbox ${code} · tap to copy`,
    checkInOnArrival: 'Check-in on arrival',
    agendaOfTurnovers: 'Turnover agenda',
    turnoverNotes: 'Toggle for checklist, lockbox and notes',
    colSalida: 'Out',
    colLimpieza: 'Clean',
    colLlegada: 'In',
    checkInLoggedAt: (time: string) => `Checked in at ${time}`,
    completedAt: (time: string) => `Completed at ${time}`,
    navigateAria: 'Navigate with Google Maps',
    navigateTitle: 'Navigate to this address with Google Maps',
    mapsLabel: 'Maps',
    checkInScheduled: 'Mark that you have arrived at the flat',
    checkIn: 'Check-in',
    uploadPhotoAria: 'Upload a turnover photo',
    uploadPhotoTitle: 'Upload a turnover photo — you need 4 minimum',
    photoLabel: 'Photo',
    estimatedPay: (amount: string) => `Est. £${amount}`,
    estimatedPayTitle: 'Estimated pay: duration × hourly rate + tips',
    paidLabel: (amount: string) => `Paid £${amount}`,
    requiredPhotos: 'Required photos',
    requiredPhotosHint: (zones: string) => `We need one of each zone: ${zones}.`,
    photoZoomTitle: 'Enlarge photo — from the lightbox you can delete it',
    addPhotoAria: 'Add photo',
    photoAlt: (i: number) => `Turnover photo ${i}`,
    lockboxLabel: 'Lockbox',
    hostNotes: 'Host notes',
    note1: 'Host: Olivia Hart. Fresh sheets in the hallway cupboard. Coffee beans in the pantry.',
    note2: 'Host: Marco Lin. Restock Nespresso pods (yellow box, top drawer).',
    note3: 'Host: Priya Shah. There is a small dog — use the HEPA-filter hoover from the cupboard.',
    checkInAndStart: 'Check-in and start',
    photoLightboxAlt: (prop: string) => `Turnover photo at ${prop}`,
    photoCounter: (i: number, total: number) => `photo ${i} of ${total}`,
    deletePhotoTitle: 'Remove this photo from the turnover record',
    deletePhoto: 'Delete photo',
    closeTitle: 'Close',
    resetDemo: 'Reset demo',
    resetDemoTitle: 'Reset the demo — back to the initial state without reloading',
    toastCheckIn: 'Check-in registered',
    toastTurnover: 'Turnover completed',
    toastPhoto: 'Photo uploaded',
    toastPhotoDeleted: 'Photo deleted',
    toastCopied: (code: string) => `Code ${code} copied`,
  },
  es: {
    statusScheduled: 'Pendiente',
    statusInProgress: 'En curso',
    statusCompleted: 'Completada',
    dayToday: 'Hoy',
    dayTomorrow: 'Mañana',
    requiredPhotoZones: ['salón', 'cocina', 'baño', 'dormitorio'] as ReadonlyArray<string>,
    checklist: {
      sheets: 'Cambiar sábanas',
      sheetsHint: '4 sábanas por cama king (bajera, encimera, 2 fundas).',
      towels: 'Reponer toallas',
      towelsHint: '2 de baño + 2 de cara por huésped.',
      paper: 'Restock papel higiénico (x2)',
      soap: 'Restock jabón',
      coffee: 'Restock café / té',
      water: 'Restock agua',
      vacuum: 'Aspirar todas las habitaciones',
      bathroom: 'Lavar baño completo (suelo, sanitarios, espejo)',
    },
    headerPortal: 'DEMO · CLEANER (AIRBNB)',
    overline: 'Airbnb · Turnovers',
    greeting: 'Hola, Carmen',
    summary: (done: number, total: number) => `${done} de ${total} turnovers completados · Londres`,
    todayEarnings: 'Hoy',
    nextTurnover: 'Próximo turnover',
    countdownTitle: 'Tiempo restante hasta el siguiente check-in',
    countdownLate: 'check-in vencido',
    countdownRemaining: (label: string) => `quedan ${label} hasta el check-in`,
    previousGuest: 'Huésped anterior',
    nextGuest: 'Próximo huésped',
    checkOutAt: (time: string) => `Salida ${time}`,
    cleaningStartsAt: (time: string) => `limpieza inicia ${time}`,
    arrivalAt: (time: string) => `Llegada ${time}`,
    mustFinishBefore: 'debes terminar antes',
    goToAddress: 'Ir a la dirección',
    goToAddressTitle: 'Abrir esta dirección en Google Maps para navegar paso a paso',
    copyLockboxAria: 'Copiar código del lockbox',
    copyLockboxTitle: (code: string) => `Lockbox ${code} · toca para copiar`,
    checkInOnArrival: 'Check-in al llegar',
    agendaOfTurnovers: 'Agenda de turnovers',
    turnoverNotes: 'Toca para ver checklist, lockbox y notas',
    colSalida: 'Salida',
    colLimpieza: 'Limpieza',
    colLlegada: 'Llegada',
    checkInLoggedAt: (time: string) => `Check-in registrado a las ${time}`,
    completedAt: (time: string) => `Completada a las ${time}`,
    navigateAria: 'Navegar con Google Maps',
    navigateTitle: 'Navegar a esta dirección con Google Maps',
    mapsLabel: 'Maps',
    checkInScheduled: 'Marcar que has llegado al apartamento',
    checkIn: 'Check-in',
    uploadPhotoAria: 'Subir foto del turnover',
    uploadPhotoTitle: 'Subir foto del turnover — necesitas 4 mínimo',
    photoLabel: 'Foto',
    estimatedPay: (amount: string) => `Estim. £${amount}`,
    estimatedPayTitle: 'Pago estimado: duración × tarifa horaria + propinas',
    paidLabel: (amount: string) => `Pagado £${amount}`,
    requiredPhotos: 'Fotos obligatorias',
    requiredPhotosHint: (zones: string) => `Necesitamos una de cada zona: ${zones}.`,
    photoZoomTitle: 'Ampliar foto — desde el lightbox puedes eliminarla',
    addPhotoAria: 'Añadir foto',
    photoAlt: (i: number) => `Foto del turnover ${i}`,
    lockboxLabel: 'Lockbox',
    hostNotes: 'Notas del anfitrión',
    note1: 'Anfitrión: Olivia Hart. Sábanas limpias en el armario del pasillo. Café en grano en la despensa.',
    note2: 'Anfitrión: Marco Lin. Reponer cápsulas Nespresso (caja amarilla en cajón superior).',
    note3: 'Anfitrión: Priya Shah. Hay un perro pequeño — usar aspiradora con filtro HEPA del armario.',
    checkInAndStart: 'Check-in y empezar',
    photoLightboxAlt: (prop: string) => `Foto del turnover en ${prop}`,
    photoCounter: (i: number, total: number) => `foto ${i} de ${total}`,
    deletePhotoTitle: 'Eliminar esta foto del registro del turnover',
    deletePhoto: 'Eliminar foto',
    closeTitle: 'Cerrar',
    resetDemo: 'Reiniciar demo',
    resetDemoTitle: 'Reiniciar la demo — vuelve al estado inicial sin recargar',
    toastCheckIn: 'Check-in registrado',
    toastTurnover: 'Turnover completado',
    toastPhoto: 'Foto subida',
    toastPhotoDeleted: 'Foto eliminada',
    toastCopied: (code: string) => `Código ${code} copiado`,
  },
  pt: {
    statusScheduled: 'Pendente',
    statusInProgress: 'Em curso',
    statusCompleted: 'Concluída',
    dayToday: 'Hoje',
    dayTomorrow: 'Amanhã',
    requiredPhotoZones: ['sala', 'cozinha', 'casa de banho', 'quarto'] as ReadonlyArray<string>,
    checklist: {
      sheets: 'Mudar lençóis',
      sheetsHint: '4 lençóis por cama king (ajustável, lençol, 2 fronhas).',
      towels: 'Repor toalhas',
      towelsHint: '2 de banho + 2 de rosto por hóspede.',
      paper: 'Repor papel higiénico (x2)',
      soap: 'Repor sabonete',
      coffee: 'Repor café / chá',
      water: 'Repor água',
      vacuum: 'Aspirar todas as divisões',
      bathroom: 'Lavar casa de banho por completo (chão, sanitários, espelho)',
    },
    headerPortal: 'DEMO · CLEANER (AIRBNB)',
    overline: 'Airbnb · Turnovers',
    greeting: 'Olá, Carmen',
    summary: (done: number, total: number) => `${done} de ${total} turnovers concluídos · Londres`,
    todayEarnings: 'Hoje',
    nextTurnover: 'Próximo turnover',
    countdownTitle: 'Tempo restante até ao próximo check-in',
    countdownLate: 'check-in expirado',
    countdownRemaining: (label: string) => `faltam ${label} até ao check-in`,
    previousGuest: 'Hóspede anterior',
    nextGuest: 'Próximo hóspede',
    checkOutAt: (time: string) => `Saída ${time}`,
    cleaningStartsAt: (time: string) => `limpeza inicia ${time}`,
    arrivalAt: (time: string) => `Chegada ${time}`,
    mustFinishBefore: 'deve terminar antes',
    goToAddress: 'Ir para a morada',
    goToAddressTitle: 'Abrir esta morada no Google Maps para navegar passo a passo',
    copyLockboxAria: 'Copiar código do cofre',
    copyLockboxTitle: (code: string) => `Cofre ${code} · toque para copiar`,
    checkInOnArrival: 'Check-in ao chegar',
    agendaOfTurnovers: 'Agenda de turnovers',
    turnoverNotes: 'Toque para ver checklist, cofre e notas',
    colSalida: 'Saída',
    colLimpieza: 'Limpeza',
    colLlegada: 'Chegada',
    checkInLoggedAt: (time: string) => `Check-in registado às ${time}`,
    completedAt: (time: string) => `Concluída às ${time}`,
    navigateAria: 'Navegar com o Google Maps',
    navigateTitle: 'Navegar até esta morada com o Google Maps',
    mapsLabel: 'Maps',
    checkInScheduled: 'Marcar que chegou ao apartamento',
    checkIn: 'Check-in',
    uploadPhotoAria: 'Enviar foto do turnover',
    uploadPhotoTitle: 'Enviar foto do turnover — precisa de 4 no mínimo',
    photoLabel: 'Foto',
    estimatedPay: (amount: string) => `Estim. £${amount}`,
    estimatedPayTitle: 'Pagamento estimado: duração × tarifa horária + gorjetas',
    paidLabel: (amount: string) => `Pago £${amount}`,
    requiredPhotos: 'Fotos obrigatórias',
    requiredPhotosHint: (zones: string) => `É preciso uma de cada zona: ${zones}.`,
    photoZoomTitle: 'Ampliar foto — a partir do lightbox pode apagá-la',
    addPhotoAria: 'Adicionar foto',
    photoAlt: (i: number) => `Foto do turnover ${i}`,
    lockboxLabel: 'Cofre',
    hostNotes: 'Notas do anfitrião',
    note1: 'Anfitrião: Olivia Hart. Lençóis limpos no armário do corredor. Café em grão na despensa.',
    note2: 'Anfitrião: Marco Lin. Repor cápsulas Nespresso (caixa amarela na gaveta de cima).',
    note3: 'Anfitrião: Priya Shah. Há um cão pequeno — usar aspirador com filtro HEPA do armário.',
    checkInAndStart: 'Check-in e começar',
    photoLightboxAlt: (prop: string) => `Foto do turnover em ${prop}`,
    photoCounter: (i: number, total: number) => `foto ${i} de ${total}`,
    deletePhotoTitle: 'Eliminar esta foto do registo do turnover',
    deletePhoto: 'Eliminar foto',
    closeTitle: 'Fechar',
    resetDemo: 'Reiniciar demo',
    resetDemoTitle: 'Reiniciar a demo — volta ao estado inicial sem recarregar',
    toastCheckIn: 'Check-in registado',
    toastTurnover: 'Turnover concluído',
    toastPhoto: 'Foto enviada',
    toastPhotoDeleted: 'Foto eliminada',
    toastCopied: (code: string) => `Código ${code} copiado`,
  },
} as const satisfies Record<ClientLocale, unknown>;

type AirbnbCopy = (typeof COPY)['en'];

/** Photo zones an Airbnb cleaner has to capture before marking done.
 *  Kept as a fixed-length tuple at module scope for MIN_PHOTOS_REQUIRED. */
const REQUIRED_PHOTO_ZONES_LEN = 4;
const MIN_PHOTOS_REQUIRED = REQUIRED_PHOTO_ZONES_LEN;

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

function buildChecklist(t: AirbnbCopy): ChecklistItem[] {
  return [
    { id: 'sheets', label: t.checklist.sheets, hint: t.checklist.sheetsHint },
    { id: 'towels', label: t.checklist.towels, hint: t.checklist.towelsHint },
    { id: 'paper', label: t.checklist.paper },
    { id: 'soap', label: t.checklist.soap },
    { id: 'coffee', label: t.checklist.coffee },
    { id: 'water', label: t.checklist.water },
    { id: 'vacuum', label: t.checklist.vacuum },
    { id: 'bathroom', label: t.checklist.bathroom },
  ];
}

const CHECKLIST_IDS: ChecklistItemId[] = [
  'sheets',
  'towels',
  'paper',
  'soap',
  'coffee',
  'water',
  'vacuum',
  'bathroom',
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
  return CHECKLIST_IDS.reduce(
    (acc, id) => {
      acc[id] = false;
      return acc;
    },
    {} as Record<ChecklistItemId, boolean>,
  );
}

function buildInitialTasks(t: AirbnbCopy): DemoTask[] {
  return [
    {
      id: 'air-1',
      dayLabel: t.dayToday,
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
      notes: t.note1,
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
      dayLabel: t.dayToday,
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
      notes: t.note2,
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
      dayLabel: t.dayTomorrow,
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
      notes: t.note3,
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

function buildStatusMeta(
  t: AirbnbCopy,
): Record<DemoStatus, { label: string; cls: string; dot: string }> {
  return {
    scheduled: {
      label: t.statusScheduled,
      cls: 'bg-slate-100 text-slate-700',
      dot: 'bg-slate-400',
    },
    in_progress: {
      label: t.statusInProgress,
      cls: 'bg-orange-100 text-orange-800',
      dot: 'bg-orange-500 animate-pulse',
    },
    completed: {
      label: t.statusCompleted,
      cls: 'bg-emerald-100 text-emerald-800',
      dot: 'bg-emerald-500',
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
function useCountdown(
  target: Date,
  lateLabel: string,
): { label: string; tone: 'safe' | 'warn' | 'urgent' | 'late' } {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    // 30s tick is plenty — we only render down to the minute, and a
    // shorter interval would burn battery without changing the UI.
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) {
    return { label: lateLabel, tone: 'late' };
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
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  const STATUS_META = useMemo(() => buildStatusMeta(t), [t]);
  const initialTasks = useMemo(() => buildInitialTasks(t), [t]);
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
    showToast(t.toastCheckIn);
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
    showToast(t.toastTurnover);
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
    showToast(t.toastPhoto);
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
    showToast(t.toastPhotoDeleted);
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
    showToast(t.toastCopied(code));
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
      <DemoTopBar portal="cleaner" title={t.headerPortal} />
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
                {t.overline}
              </p>
              <h1 className="mt-1 font-display text-2xl font-semibold text-text-1">
                {t.greeting}
              </h1>
              <p className="mt-0.5 text-[12px] text-text-3">
                {t.summary(doneCount, tasks.length)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-3">
                {t.todayEarnings}
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
                copy={t}
                onCheckIn={() => handleCheckIn(heroTask.id)}
                onCopyLockbox={() => handleCopyLockbox(heroTask.lockboxCode)}
              />
            </div>
          ) : null}

          {/* Agenda timeline — turnover cards, grouped by day label */}
          <section className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-text-3">
                {t.agendaOfTurnovers}
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
                      copy={t}
                      statusMeta={STATUS_META}
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
  copy,
  onCheckIn,
  onCopyLockbox,
}: {
  task: DemoTask;
  copy: AirbnbCopy;
  onCheckIn: () => void;
  onCopyLockbox: () => void;
}) {
  const countdown = useCountdown(task.nextCheckInAt, copy.countdownLate);
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
          {copy.nextTurnover}
        </p>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${toneCls}`}
          title={copy.countdownTitle}
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
            {copy.previousGuest}
          </dt>
          <dd className="mt-0.5 text-[12px] font-semibold text-text-1">
            {copy.checkOutAt(task.previousCheckOut)}
          </dd>
          <dd className="text-[10.5px] text-text-3">
            {copy.cleaningStartsAt(task.cleaningStart)}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-text-3">
            {copy.nextGuest}
          </dt>
          <dd className="mt-0.5 text-[12px] font-semibold text-text-1">
            {copy.arrivalAt(task.nextCheckIn)}
          </dd>
          <dd className="text-[10.5px] text-text-3">{copy.mustFinishBefore}</dd>
        </div>
      </dl>

      <div className="mt-3 flex items-stretch gap-2">
        <a
          href={task.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={copy.goToAddressTitle}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-[15px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(234,88,12,0.55)] transition active:scale-[0.99]"
        >
          <Navigation2 className="h-4 w-4" /> {copy.goToAddress}
        </a>
        <button
          type="button"
          onClick={onCopyLockbox}
          aria-label={copy.copyLockboxAria}
          title={copy.copyLockboxTitle(task.lockboxCode)}
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
          {copy.checkInOnArrival}
        </button>
      ) : null}
    </section>
  );
}

/** ---------- Turnover row card ------------------------------------- */

function TurnoverCard({
  task,
  copy,
  statusMeta,
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
  copy: AirbnbCopy;
  statusMeta: Record<DemoStatus, { label: string; cls: string; dot: string }>;
  expanded: boolean;
  onToggleExpand: () => void;
  onCheckIn: () => void;
  onComplete: () => void;
  onUploadPhoto: () => void;
  onToggleChecklist: (itemId: ChecklistItemId) => void;
  onOpenPhoto: (idx: number) => void;
  onCopyLockbox: () => void;
}) {
  const st = statusMeta[task.status];
  const countdown = useCountdown(task.nextCheckInAt, copy.countdownLate);
  const CHECKLIST = useMemo(() => buildChecklist(copy), [copy]);

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
          title={copy.turnoverNotes}
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
            <p className="font-bold uppercase tracking-wider text-text-3">{copy.colSalida}</p>
            <p className="mt-0.5 font-semibold tabular-nums text-text-1">
              {task.previousCheckOut}
            </p>
          </div>
          <div>
            <p className="font-bold uppercase tracking-wider text-text-3">{copy.colLimpieza}</p>
            <p className="mt-0.5 font-semibold tabular-nums text-text-1">
              {task.cleaningStart} · {formatDuration(task.estimated_duration_min)}
            </p>
          </div>
          <div>
            <p className="font-bold uppercase tracking-wider text-text-3">{copy.colLlegada}</p>
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
              ? copy.countdownLate
              : copy.countdownRemaining(countdown.label)}
          </p>
        ) : null}

        {task.checkInAt ? (
          <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-orange-700">
            <Clock className="h-2.5 w-2.5" />
            {copy.checkInLoggedAt(task.checkInAt)}
          </p>
        ) : null}
        {task.completedAt ? (
          <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
            <CheckCircle2 className="h-2.5 w-2.5" />
            {copy.completedAt(task.completedAt)}
          </p>
        ) : null}

        {/* Always-visible quick actions row. */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <a
            href={task.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={copy.navigateAria}
            title={copy.navigateTitle}
            className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-[10.5px] font-semibold text-orange-700 transition hover:bg-orange-100"
          >
            <Navigation2 className="h-3 w-3" />
            {copy.mapsLabel}
          </a>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCopyLockbox();
            }}
            aria-label={copy.copyLockboxAria}
            title={copy.copyLockboxTitle(task.lockboxCode)}
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
              title={copy.checkInScheduled}
              className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-[10.5px] font-semibold text-orange-800 transition hover:bg-orange-200"
            >
              {copy.checkIn}
            </button>
          ) : null}
          {task.status === 'in_progress' ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUploadPhoto();
              }}
              aria-label={copy.uploadPhotoAria}
              title={copy.uploadPhotoTitle}
              className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2.5 py-1 text-[10.5px] font-semibold text-cyan-800 transition hover:bg-cyan-100"
            >
              <Camera className="h-3 w-3" />
              {copy.photoLabel}
            </button>
          ) : null}
          {task.status !== 'completed' ? (
            <span
              className="ml-auto inline-flex items-center gap-1 text-[10.5px] font-semibold text-text-3"
              title={copy.estimatedPayTitle}
            >
              {copy.estimatedPay((projectedPence / 100).toFixed(2))}
            </span>
          ) : (
            <span className="ml-auto inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700">
              {copy.paidLabel(
                (
                  (Math.round((task.actualHours ?? 0) * task.cleanerPayRatePence) +
                    (task.tipPence ?? 0)) /
                  100
                ).toFixed(2),
              )}
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
                  {copy.requiredPhotos}
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
                {copy.requiredPhotosHint(copy.requiredPhotoZones.join(', '))}
              </p>

              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {task.photos.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <button
                    type="button"
                    key={`${src}-${i}`}
                    onClick={() => onOpenPhoto(i)}
                    title={copy.photoZoomTitle}
                    className="overflow-hidden rounded-lg ring-1 ring-surface-2"
                  >
                    <img
                      src={src}
                      alt={copy.photoAlt(i + 1)}
                      loading="lazy"
                      className="aspect-square w-full object-cover"
                    />
                  </button>
                ))}
                {task.status === 'in_progress' ? (
                  <button
                    type="button"
                    onClick={onUploadPhoto}
                    aria-label={copy.addPhotoAria}
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
                {copy.lockboxLabel}
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
                {copy.hostNotes}
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
                {copy.checkInAndStart}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
