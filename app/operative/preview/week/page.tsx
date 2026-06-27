'use client';

/**
 * Public, no-auth preview of the Cleaner /week page. Mock data only.
 *
 * Now interactive: tap any day's task to expand inline notes, and use
 * the status filter chips at the top to slice the week by progress.
 * All state is in-memory — refreshing resets the demo.
 */
import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  HelpCircle,
  MapPin,
  Play,
  PoundSterling,
  RotateCcw,
  Star,
  X,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { PreviewBottomTabBar } from '@/components/preview/PreviewBottomTabBar';

type DemoStatus = 'scheduled' | 'completed' | 'in_progress';

type MockWeekTask = {
  id: string;
  status: DemoStatus;
  service_name: string;
  price_pence: number;
  estimated_duration_min: number;
  property: { name: string; address: string };
  notes: string;
};

type Day = {
  label: string;
  isToday: boolean;
  tasks: MockWeekTask[];
};

const DAYS: Day[] = [
  {
    label: 'Lunes 23 Jun',
    isToday: false,
    tasks: [
      {
        id: 'w-1',
        status: 'completed',
        service_name: 'Limpieza profunda',
        price_pence: 6500,
        estimated_duration_min: 120,
        property: {
          name: 'Soho Loft',
          address: '22 Old Compton St, London W1D 4TR',
        },
        notes: 'Cliente muy satisfecho. Pidió que la próxima vez se cambie el filtro de la campana.',
      },
    ],
  },
  {
    label: 'Martes 24 Jun',
    isToday: false,
    tasks: [
      {
        id: 'w-2',
        status: 'completed',
        service_name: 'Mantenimiento',
        price_pence: 4000,
        estimated_duration_min: 90,
        property: {
          name: 'Hackney Studio',
          address: '78 Mare St, London E8 4RT',
        },
        notes: 'Reponer pastillas del lavavajillas (quedaba solo una).',
      },
      {
        id: 'w-3',
        status: 'completed',
        service_name: 'Check-out',
        price_pence: 5500,
        estimated_duration_min: 105,
        property: {
          name: 'Shoreditch Penthouse',
          address: '31 Curtain Rd, London EC2A 3LT',
        },
        notes: 'Cambio de sábanas + reposición de amenities.',
      },
    ],
  },
  {
    label: 'Miércoles 25 Jun',
    isToday: false,
    tasks: [],
  },
  {
    label: 'Jueves 26 Jun',
    isToday: false,
    tasks: [
      {
        id: 'w-4',
        status: 'completed',
        service_name: 'Limpieza estándar',
        price_pence: 4000,
        estimated_duration_min: 75,
        property: {
          name: 'Notting Hill Flat',
          address: '12 Portobello Rd, London W11 2DZ',
        },
        notes: 'Atención a la repisa de la ventana — el cliente lo pidió la última vez.',
      },
    ],
  },
  {
    label: 'Viernes 27 Jun',
    isToday: true,
    tasks: [
      {
        id: 'w-5',
        status: 'completed',
        service_name: 'Limpieza estándar',
        price_pence: 4000,
        estimated_duration_min: 90,
        property: {
          name: 'Soho Loft',
          address: '22 Old Compton St, London W1D 4TR',
        },
        notes: 'Listo a las 11:32, fotos subidas.',
      },
      {
        id: 'w-6',
        status: 'in_progress',
        service_name: 'Mantenimiento',
        price_pence: 3500,
        estimated_duration_min: 60,
        property: {
          name: 'Hackney Studio',
          address: '78 Mare St, London E8 4RT',
        },
        notes: 'En curso. Llaves en el lockbox (código 4421).',
      },
      {
        id: 'w-7',
        status: 'scheduled',
        service_name: 'Check-out',
        price_pence: 6500,
        estimated_duration_min: 120,
        property: {
          name: 'Shoreditch Penthouse',
          address: '31 Curtain Rd, London EC2A 3LT',
        },
        notes: 'Check-out Airbnb a las 14:30. Sábanas limpias en armario del pasillo.',
      },
    ],
  },
  {
    label: 'Sábado 28 Jun',
    isToday: false,
    tasks: [
      {
        id: 'w-8',
        status: 'scheduled',
        service_name: 'Limpieza profunda',
        price_pence: 7500,
        estimated_duration_min: 150,
        property: {
          name: 'Mayfair Studio',
          address: '8 Berkeley St, London W1J 8DY',
        },
        notes: 'Limpieza profunda mensual — traer aspirador grande.',
      },
    ],
  },
  {
    label: 'Domingo 29 Jun',
    isToday: false,
    tasks: [],
  },
];

function formatMoney(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

function formatHours(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${minutes}m`;
}

type Filter = 'all' | 'completed' | 'in_progress' | 'scheduled';

const FILTERS: Array<{ key: Filter; label: string; title: string }> = [
  {
    key: 'all',
    label: 'Todas',
    title: 'Ver todas las tareas de la semana',
  },
  {
    key: 'completed',
    label: 'Completadas',
    title: 'Filtrar solo las tareas terminadas',
  },
  {
    key: 'in_progress',
    label: 'En curso',
    title: 'Filtrar solo las tareas que tienes ahora mismo en curso',
  },
  {
    key: 'scheduled',
    label: 'Pendientes',
    title: 'Filtrar solo las tareas todavía por hacer',
  },
];

function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function OperativePreviewWeek() {
  const [resetKey, setResetKey] = useState(0);
  return <OperativePreviewWeekBody key={resetKey} onReset={() => setResetKey((k) => k + 1)} />;
}

function OperativePreviewWeekBody({ onReset }: { onReset: () => void }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [collapsedDays, setCollapsedDays] = useState<Set<string>>(new Set());
  const [days, setDays] = useState<Day[]>(DAYS);
  const [selectedTask, setSelectedTask] = useState<{ dayLabel: string; taskId: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [kpiSheet, setKpiSheet] = useState<'worked' | 'earnings' | 'rating' | null>(null);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 1800);
  }

  const allTasks = useMemo(() => days.flatMap((d) => d.tasks), [days]);
  const totalMinutes = useMemo(
    () => allTasks.reduce((sum, t) => sum + t.estimated_duration_min, 0),
    [allTasks],
  );
  const totalEarnings = useMemo(
    () =>
      allTasks
        .filter((t) => t.status === 'completed')
        .reduce((sum, t) => sum + t.price_pence, 0),
    [allTasks],
  );
  const avgStars = 4.8;
  const ratingCount = allTasks.filter((t) => t.status === 'completed').length;

  const filteredDays = useMemo<Day[]>(
    () =>
      days.map((d) => ({
        ...d,
        tasks:
          filter === 'all' ? d.tasks : d.tasks.filter((t) => t.status === filter),
      })),
    [filter, days],
  );

  function toggleDay(label: string) {
    setCollapsedDays((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

  function updateTaskStatus(taskId: string, status: DemoStatus) {
    setDays((prev) =>
      prev.map((d) => ({
        ...d,
        tasks: d.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
      })),
    );
    if (status === 'in_progress') {
      showToast(`Check-in registrado a las ${nowHHMM()}`);
    } else if (status === 'completed') {
      showToast('Tarea marcada como completada');
    }
  }

  const selected =
    selectedTask &&
    days
      .find((d) => d.label === selectedTask.dayLabel)
      ?.tasks.find((t) => t.id === selectedTask.taskId);

  return (
    <main className="relative min-h-screen overflow-hidden bg-canvas pb-24">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-md items-center justify-between gap-2 px-4">
          <Link
            href="/operative/preview"
            aria-label="Back"
            title="Volver a la agenda de hoy"
            className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-graphite-1 hover:bg-surface-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Logo size="sm" />
          <span className="-mr-2 flex h-9 w-9" aria-hidden />
        </div>
      </header>

      <div className="mx-auto max-w-md px-4 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-500">
          This week
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-graphite-1">
          23 Jun – 29 Jun
        </h1>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Kpi
            icon={<Clock className="h-3.5 w-3.5 text-brand-500" />}
            label="Worked"
            value={formatHours(totalMinutes)}
            title="Ver el desglose de horas trabajadas por día"
            onClick={() => setKpiSheet('worked')}
          />
          <Kpi
            icon={<PoundSterling className="h-3.5 w-3.5 text-emerald-600" />}
            label="Earnings"
            value={formatMoney(totalEarnings)}
            title="Ver desglose de ganancias por tarea"
            onClick={() => setKpiSheet('earnings')}
          />
          <Kpi
            icon={<Star className="h-3.5 w-3.5 text-amber-500" />}
            label={`Rating (${ratingCount})`}
            value={avgStars.toFixed(1)}
            title="Ver valoraciones recientes del cliente"
            onClick={() => setKpiSheet('rating')}
          />
        </div>

        {/* Filter chips */}
        <div className="mt-5">
          <div className="flex items-center gap-1.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-graphite-3">
              Filtrar
            </p>
            <span
              title="Toca un chip para filtrar las tareas por estado. El recuento se actualiza al instante."
              className="grid h-3.5 w-3.5 cursor-help place-items-center rounded-full text-graphite-3"
            >
              <HelpCircle className="h-3 w-3" />
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {FILTERS.map((f) => {
              const active = f.key === filter;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  title={f.title}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                    active
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'border border-line bg-paper text-graphite-3 hover:text-graphite-1'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <section className="mt-6 space-y-4">
          {filteredDays.map((day) => {
            const isCollapsed = collapsedDays.has(day.label);
            return (
              <div key={day.label}>
                <button
                  type="button"
                  onClick={() => toggleDay(day.label)}
                  title={isCollapsed ? 'Mostrar tareas de este día' : 'Ocultar tareas de este día'}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-1 py-1 text-left transition hover:bg-surface-2/40 ${
                    day.isToday ? 'text-brand-600' : 'text-graphite-3'
                  }`}
                >
                  <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                    <Calendar className="h-3 w-3" />
                    {day.label}
                    {day.isToday ? ' · TODAY' : ''}
                    <span className="rounded-full bg-surface-2 px-1.5 text-[9px] font-bold text-graphite-3">
                      {day.tasks.length}
                    </span>
                  </h2>
                  {isCollapsed ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronUp className="h-3.5 w-3.5" />
                  )}
                </button>
                {isCollapsed ? null : day.tasks.length === 0 ? (
                  <p className="mt-1 ml-5 text-[11px] text-graphite-3">
                    {filter === 'all' ? 'No cleanings' : 'Sin coincidencias'}
                  </p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {day.tasks.map((t, idx) => (
                      <li key={t.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedTask({ dayLabel: day.label, taskId: t.id })}
                          title="Abrir detalles de la tarea — incluye Check-in y Completar"
                          className="flex w-full items-start gap-3 rounded-2xl border border-line bg-paper p-3 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-brand-400 hover:shadow-[0_4px_12px_-4px_rgba(37,99,235,0.18)]"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[11px] font-semibold text-brand-700">
                            {idx + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-display text-sm font-semibold text-graphite-1">
                              {t.property.name}
                            </p>
                            <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-brand-600">
                              <MapPin className="h-3 w-3" /> {t.property.address}
                            </span>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-[10px] text-graphite-3">
                              <span>{t.service_name}</span>
                              <span className="inline-flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatHours(t.estimated_duration_min)}
                              </span>
                              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                                <PoundSterling className="h-3 w-3" />
                                {formatMoney(t.price_pence)}
                              </span>
                              <StatusBadge status={t.status} />
                            </div>
                          </div>
                          {t.status === 'completed' ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </section>
      </div>

      {/* Task details sheet */}
      {selected && selectedTask ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 sm:items-center"
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-paper p-5 shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-graphite-3">
                  {selectedTask.dayLabel} · {selected.service_name}
                </p>
                <h2 className="mt-1 font-display text-lg font-semibold text-graphite-1">
                  {selected.property.name}
                </h2>
                <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-brand-600">
                  <MapPin className="h-3 w-3" /> {selected.property.address}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                title="Cerrar"
                className="grid h-8 w-8 place-items-center rounded-full text-graphite-3 hover:bg-surface-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-graphite-3">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatHours(selected.estimated_duration_min)}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                <PoundSterling className="h-3 w-3" />
                {formatMoney(selected.price_pence)}
              </span>
              <StatusBadge status={selected.status} />
            </div>

            <div className="mt-4 rounded-xl border border-dashed border-line bg-surface-1/40 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-graphite-3">
                Notas
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-graphite-1">
                {selected.notes}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {selected.status === 'scheduled' ? (
                <button
                  type="button"
                  onClick={() => updateTaskStatus(selected.id, 'in_progress')}
                  title="Marcar que has llegado al cliente — registra hora de inicio"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2.5 text-[12px] font-bold text-white shadow"
                >
                  <Play className="h-3.5 w-3.5" /> Check-in
                </button>
              ) : null}
              {selected.status === 'in_progress' ? (
                <button
                  type="button"
                  onClick={() => updateTaskStatus(selected.id, 'completed')}
                  title="Marcar la tarea como terminada"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-[12px] font-bold text-white shadow"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Completar
                </button>
              ) : null}
              {selected.status === 'completed' ? (
                <button
                  type="button"
                  onClick={() => updateTaskStatus(selected.id, 'scheduled')}
                  title="Revertir esta tarea a pendiente (sólo demo)"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-paper px-3 py-2.5 text-[12px] font-bold text-graphite-1"
                >
                  Reabrir
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                title="Cerrar el panel sin cambios"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-paper px-3 py-2.5 text-[12px] font-bold text-graphite-1"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* KPI breakdown sheet */}
      {kpiSheet ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 sm:items-center"
          onClick={() => setKpiSheet(null)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-paper p-5 shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-graphite-3">
                  Esta semana
                </p>
                <h2 className="mt-1 font-display text-lg font-semibold text-graphite-1">
                  {kpiSheet === 'worked'
                    ? 'Horas trabajadas por día'
                    : kpiSheet === 'earnings'
                      ? 'Ganancias por tarea'
                      : 'Valoraciones de clientes'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setKpiSheet(null)}
                title="Cerrar"
                className="grid h-8 w-8 place-items-center rounded-full text-graphite-3 hover:bg-surface-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {kpiSheet === 'worked' ? (
              <ul className="mt-4 divide-y divide-line rounded-xl border border-line">
                {days.map((d) => {
                  const mins = d.tasks.reduce((s, t) => s + t.estimated_duration_min, 0);
                  return (
                    <li key={d.label} className="flex items-center justify-between gap-3 px-3 py-2.5 text-[12px]">
                      <span className={`font-medium ${d.isToday ? 'text-brand-600' : 'text-graphite-1'}`}>
                        {d.label}
                        {d.isToday ? ' · HOY' : ''}
                      </span>
                      <span className="tabular-nums text-graphite-3">
                        {mins === 0 ? '—' : formatHours(mins)}
                      </span>
                    </li>
                  );
                })}
                <li className="flex items-center justify-between gap-3 bg-surface-1/40 px-3 py-2.5 text-[12px] font-semibold">
                  <span className="text-graphite-1">Total semana</span>
                  <span className="tabular-nums text-graphite-1">{formatHours(totalMinutes)}</span>
                </li>
              </ul>
            ) : null}

            {kpiSheet === 'earnings' ? (
              <ul className="mt-4 divide-y divide-line rounded-xl border border-line">
                {allTasks
                  .filter((t) => t.status === 'completed')
                  .map((t) => (
                    <li key={t.id} className="flex items-center justify-between gap-3 px-3 py-2.5 text-[12px]">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-graphite-1">
                          {t.property.name}
                        </p>
                        <p className="truncate text-[10px] text-graphite-3">
                          {t.service_name}
                        </p>
                      </div>
                      <span className="shrink-0 font-semibold tabular-nums text-emerald-700">
                        {formatMoney(t.price_pence)}
                      </span>
                    </li>
                  ))}
                <li className="flex items-center justify-between gap-3 bg-surface-1/40 px-3 py-2.5 text-[12px] font-semibold">
                  <span className="text-graphite-1">Total ganado</span>
                  <span className="tabular-nums text-graphite-1">{formatMoney(totalEarnings)}</span>
                </li>
              </ul>
            ) : null}

            {kpiSheet === 'rating' ? (
              <ul className="mt-4 space-y-2">
                {(() => {
                  const completed = allTasks.filter((t) => t.status === 'completed');
                  const MOCK_REVIEWS = [
                    { stars: 5, text: 'Impecable, todo brillaba. Volveremos a reservar.' },
                    { stars: 5, text: 'Súper puntual y muy detallista — gracias.' },
                    { stars: 4, text: 'Buen trabajo, la cocina quedó perfecta.' },
                    { stars: 5, text: 'Atención al detalle excelente, sábanas planchadas.' },
                    { stars: 5, text: 'Mejor limpieza que hemos tenido en meses.' },
                  ];
                  return completed.slice(0, MOCK_REVIEWS.length).map((t, i) => {
                    const r = MOCK_REVIEWS[i];
                    return (
                      <li key={t.id} className="rounded-xl border border-line bg-paper p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[12px] font-semibold text-graphite-1">
                            {t.property.name}
                          </p>
                          <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-600">
                            {Array.from({ length: r.stars }).map((_, k) => (
                              <Star key={k} className="h-3 w-3 fill-amber-500 text-amber-500" />
                            ))}
                          </span>
                        </div>
                        <p className="mt-1 text-[11.5px] leading-relaxed text-graphite-3">
                          "{r.text}"
                        </p>
                      </li>
                    );
                  });
                })()}
                <li className="rounded-xl bg-surface-1/40 px-3 py-2.5 text-center text-[11px] font-semibold text-graphite-1">
                  Promedio {avgStars.toFixed(1)} ★ sobre {ratingCount} servicios
                </li>
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Toast */}
      {toast ? (
        <div
          className="pointer-events-none fixed inset-x-0 bottom-20 z-[70] mx-auto flex max-w-md justify-center px-4"
          aria-live="polite"
        >
          <div className="rounded-full bg-emerald-600/95 px-4 py-2 text-[12px] font-semibold text-white shadow-lg backdrop-blur">
            ✓ {toast}
          </div>
        </div>
      ) : null}

      {/* Reset demo */}
      <button
        type="button"
        onClick={onReset}
        title="Reiniciar la demo — vuelve al estado inicial sin recargar"
        className="fixed bottom-20 right-3 z-[55] inline-flex items-center gap-1 rounded-full bg-paper/90 px-3 py-1.5 text-[10px] font-semibold text-graphite-3 shadow ring-1 ring-line backdrop-blur hover:text-graphite-1"
      >
        <RotateCcw className="h-3 w-3" />
        Reiniciar demo
      </button>

      <PreviewBottomTabBar active="tareas" />
    </main>
  );
}

const STATUS_LABEL: Record<DemoStatus, { label: string; cls: string }> = {
  scheduled: { label: 'Pendiente', cls: 'bg-slate-100 text-slate-700' },
  in_progress: { label: 'En curso', cls: 'bg-amber-100 text-amber-800' },
  completed: { label: 'Completada', cls: 'bg-emerald-100 text-emerald-800' },
};

function StatusBadge({ status }: { status: DemoStatus }) {
  const s = STATUS_LABEL[status];
  return (
    <span className={`rounded-full px-1.5 py-0.5 text-[9.5px] font-semibold ${s.cls}`}>
      {s.label}
    </span>
  );
}

function Kpi({
  icon,
  label,
  value,
  title,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  title?: string;
  /** When provided, the tile renders as a button — tap opens the matching
   *  inline breakdown sheet. Same visual treatment plus a hover ring so
   *  the affordance is discoverable. */
  onClick?: () => void;
}) {
  const className =
    'rounded-xl border border-line bg-paper p-3 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)]' +
    (onClick ? ' transition hover:border-brand-400 hover:shadow-[0_4px_12px_-4px_rgba(37,99,235,0.18)]' : '');
  const body = (
    <>
      <div className="flex justify-center">{icon}</div>
      <p className="mt-1.5 font-display text-base font-bold text-graphite-1 tabular-nums">
        {value}
      </p>
      <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-graphite-3">
        {label}
      </p>
    </>
  );
  if (onClick) {
    return (
      <button type="button" onClick={onClick} title={title} className={`${className} w-full text-center`}>
        {body}
      </button>
    );
  }
  return (
    <div title={title} className={className}>
      {body}
    </div>
  );
}
