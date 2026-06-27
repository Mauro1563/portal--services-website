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
import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  HelpCircle,
  Info,
  MapPin,
  Navigation2,
  Play,
  X,
} from 'lucide-react';
import { AgendaHeader } from '@/components/operative/AgendaHeader';
import { EarningsStrip } from '@/components/operative/EarningsStrip';
import { DemoPhotoStrip, DEMO_PHOTOS } from '@/components/preview/DemoPhotoStrip';
import { PreviewBottomTabBar } from '@/components/preview/PreviewBottomTabBar';

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
  const [tasks, setTasks] = useState<DemoTask[]>(INITIAL_TASKS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Hero card = next non-completed task, or last task if all done.
  const heroTask =
    tasks.find((t) => t.status !== 'completed') ?? tasks[tasks.length - 1];

  const doneCount = tasks.filter((t) => t.status === 'completed').length;

  function handleCheckIn(taskId: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: 'in_progress' as DemoStatus, checkInAt: nowHHMM() }
          : t,
      ),
    );
  }

  function handleComplete(taskId: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: 'completed' as DemoStatus, completedAt: nowHHMM() }
          : t,
      ),
    );
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
  }

  function toggleExpand(taskId: string) {
    setExpandedId((cur) => (cur === taskId ? null : taskId));
  }

  return (
    <main className="min-h-screen bg-canvas pb-24">
      <div className="mx-auto max-w-md px-4 py-5">
        <AgendaHeader
          cleanerName="Carmen López"
          now={now}
          doneCount={doneCount}
          totalCount={tasks.length}
        />

        <EarningsStrip todayPence={4000} weekPence={28000} />

        {/* Hero card — siguiente parada */}
        {heroTask ? (
          <section className="mt-5 rounded-2xl border border-brand-600/30 bg-gradient-to-br from-white via-brand-50/40 to-cyan-50/40 p-4 shadow-card">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-700">
                Siguiente parada
              </p>
              <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold tabular-nums text-white">
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

            <div className="mt-3 grid grid-cols-2 gap-2">
              <a
                href={heroTask.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir esta dirección en Google Maps para navegar paso a paso"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-3 py-2.5 text-[12px] font-bold text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.5)]"
              >
                <Navigation2 className="h-3.5 w-3.5" /> Ir
              </a>
              <a
                href={`tel:${heroTask.phone}`}
                title="Llamar al cliente o manager desde el teléfono"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-surface-2 bg-surface-0 px-3 py-2.5 text-[12px] font-bold text-text-1"
              >
                Llamar
              </a>
            </div>
            <p className="mt-2 inline-flex items-center gap-1 text-[10px] text-text-3">
              <Info className="h-3 w-3" />
              "Ir" abre Google Maps y "Llamar" usa la app de teléfono — ambos funcionan en el móvil.
            </p>
          </section>
        ) : null}

        {/* Agenda timeline — interactive */}
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
              Agenda de hoy
              <span
                title="Toca cualquier tarea para ver las notas del cliente, hacer check-in o subir fotos."
                className="grid h-3.5 w-3.5 cursor-help place-items-center rounded-full bg-surface-2 text-[8px] font-bold text-text-3"
              >
                <HelpCircle className="h-3 w-3" />
              </span>
            </h2>
            <Link
              href="/operative/preview/week"
              title="Ver el resumen de toda la semana"
              className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-brand-700 hover:text-brand-800"
            >
              <Navigation2 className="h-3 w-3" /> Ver semana
            </Link>
          </div>

          <ol className="relative mt-4">
            <span
              aria-hidden
              className="absolute left-[60px] top-3 bottom-3 w-px bg-surface-2"
            />
            {tasks.map((task) => {
              const st = STATUS_META[task.status];
              const isExpanded = expandedId === task.id;
              return (
                <li key={task.id} className="relative pb-3 last:pb-0">
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

                    {/* Card */}
                    <div className="min-w-0 flex-1 rounded-2xl border border-surface-2 bg-paper p-3 shadow-card transition">
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

                      <div className="mt-2 flex flex-wrap items-center justify-end gap-1.5">
                        <a
                          href={task.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="Navegar a esta dirección con Google Maps"
                          className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-semibold text-brand-700 transition hover:bg-brand-100"
                        >
                          <Navigation2 className="h-3 w-3" />
                          Ir
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
                          <>
                            <button
                              type="button"
                              onClick={() => handleUploadPhoto(task.id)}
                              title="Subir foto del trabajo terminado — el cliente la verá en su portal"
                              className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-semibold text-cyan-700 transition hover:bg-cyan-100"
                            >
                              <Camera className="h-3 w-3" />
                              Subir foto
                            </button>
                            <button
                              type="button"
                              onClick={() => handleComplete(task.id)}
                              title="Marcar la tarea como terminada para liberarte de esta parada"
                              className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 transition hover:bg-emerald-100"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              Marcar completada
                            </button>
                          </>
                        ) : null}
                      </div>

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
                                    onClick={() => setLightboxIdx(i)}
                                    title="Ampliar foto"
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
                </li>
              );
            })}
          </ol>
        </section>

        <DemoPhotoStrip
          title="Tus últimas limpiezas"
          caption="Las fotos que subes después de cada servicio quedan guardadas — y el cliente las ve."
        />
      </div>

      {/* Photo lightbox */}
      {lightboxIdx !== null ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <div
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxIdx(null)}
              title="Cerrar"
              className="absolute -top-10 right-0 grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white backdrop-blur"
            >
              <X className="h-4 w-4" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={DEMO_PHOTOS[lightboxIdx % DEMO_PHOTOS.length].src}
              alt="Foto del trabajo"
              className="w-full rounded-2xl"
            />
            <p className="mt-2 text-center text-[11px] text-white/80">
              {DEMO_PHOTOS[lightboxIdx % DEMO_PHOTOS.length].label}
            </p>
          </div>
        </div>
      ) : null}

      <PreviewBottomTabBar active="agenda" />
    </main>
  );
}
