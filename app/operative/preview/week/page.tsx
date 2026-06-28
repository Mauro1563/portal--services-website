'use client';

/**
 * Public, no-auth preview of the Cleaner /week page.
 *
 * Reads from the shared preview schedule (lib/preview-schedule.ts) so
 * changes the owner makes in /owner/preview/scheduler appear here on
 * refresh. The cleaner persona is Carmen (cl-carmen) — we filter the
 * weekly schedule down to only her assignments.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  PoundSterling,
  RefreshCw,
  Sparkles,
  Star,
  User,
  X,
} from 'lucide-react';
import { pickCopy, useClientLocale, type ClientLocale } from '@/lib/use-locale-client';
import { ZapliLogo } from '@/components/brand/ZapliLogo';
import { PreviewBottomTabBar } from '@/components/preview/PreviewBottomTabBar';
import {
  WEEK_DAYS,
  loadSchedule,
  type ScheduledTask,
  type WeekDay,
} from '@/lib/preview-schedule';

/** Persona for the cleaner demo — we slice the shared schedule down to
 *  this cleaner so the operative portal feels personal. */
const CURRENT_CLEANER_ID = 'cl-carmen';

type DemoStatus = ScheduledTask['status'];

const COPY = {
  en: {
    backAria: 'Back',
    backTitle: "Back to today's agenda",
    refreshAria: 'Refresh',
    refreshTitle: 'Refresh — pulls in the changes the manager just made',
    bannerNew: "You've just been given 2 new tasks this week",
    bannerDismissAria: 'Dismiss notice',
    bannerDismissTitle: 'Dismiss',
    weekRoute: 'Your week ahead',
    assignedBy: 'Assigned by Alan (your manager)',
    kpiWorked: 'Worked',
    kpiWorkedTitle: 'See the worked-hours breakdown by day',
    kpiEarnings: 'Earnings',
    kpiEarningsTitle: 'See earnings breakdown by task',
    kpiRating: (n: number) => `Rating (${n})`,
    kpiRatingTitle: 'See recent client ratings',
    filter: 'Filter',
    filterHelpAria: 'Filter help',
    filterHelp: 'Tap a chip to filter tasks by status. The count updates instantly.',
    filterAll: 'All',
    filterAllTitle: 'See every task this week',
    filterCompleted: 'Completed',
    filterCompletedTitle: 'Filter to only finished tasks',
    filterInProgress: 'In progress',
    filterInProgressTitle: 'Filter to only tasks you have in progress right now',
    filterScheduled: 'Pending',
    filterScheduledTitle: 'Filter to only tasks still to do',
    today: 'TODAY',
    dayHide: 'Hide tasks for this day',
    dayShow: 'Show tasks for this day',
    noCleans: 'No cleans',
    noMatches: 'No matches',
    openTaskTitle: 'Open task details',
    refresh: 'Refresh',
    refreshFootTitle: 'Reload — fetches the latest changes from the manager',
    closeTitle: 'Close',
    closeSheet: 'Close',
    closeSheetTitle: 'Close the panel',
    thisWeek: 'This week',
    kpiSheetWorked: 'Hours worked by day',
    kpiSheetEarnings: 'Earnings by task',
    kpiSheetRating: 'Client ratings',
    weekTotal: 'Week total',
    totalEarned: 'Total earned',
    ratingAverage: (avg: string, count: number) => `Average ${avg} ★ across ${count} services`,
    mockReviews: [
      { stars: 5, text: 'Spotless — everything sparkled. Will rebook.' },
      { stars: 5, text: 'Super punctual and very thorough — thank you.' },
      { stars: 4, text: 'Lovely job, the kitchen was perfect.' },
      { stars: 5, text: 'Outstanding attention to detail, sheets ironed.' },
      { stars: 5, text: 'Best clean we have had in months.' },
    ] as ReadonlyArray<{ stars: number; text: string }>,
    statusScheduled: 'Pending',
    statusInProgress: 'In progress',
    statusCompleted: 'Completed',
    days: {
      mon: 'Monday',
      tue: 'Tuesday',
      wed: 'Wednesday',
      thu: 'Thursday',
      fri: 'Friday',
      sat: 'Saturday',
      sun: 'Sunday',
    } as Record<WeekDay, string>,
  },
  es: {
    backAria: 'Volver',
    backTitle: 'Volver a la agenda de hoy',
    refreshAria: 'Refrescar',
    refreshTitle: 'Refrescar — recarga los cambios que el manager acaba de hacer',
    bannerNew: 'Acabas de recibir 2 nuevas tareas esta semana',
    bannerDismissAria: 'Descartar aviso',
    bannerDismissTitle: 'Descartar',
    weekRoute: 'Tu ruta de la semana',
    assignedBy: 'Asignada por Alan (tu manager)',
    kpiWorked: 'Trabajado',
    kpiWorkedTitle: 'Ver el desglose de horas trabajadas por día',
    kpiEarnings: 'Ganancias',
    kpiEarningsTitle: 'Ver desglose de ganancias por tarea',
    kpiRating: (n: number) => `Valoración (${n})`,
    kpiRatingTitle: 'Ver valoraciones recientes del cliente',
    filter: 'Filtrar',
    filterHelpAria: 'Ayuda sobre los filtros',
    filterHelp: 'Toca un chip para filtrar las tareas por estado. El recuento se actualiza al instante.',
    filterAll: 'Todas',
    filterAllTitle: 'Ver todas las tareas de la semana',
    filterCompleted: 'Completadas',
    filterCompletedTitle: 'Filtrar solo las tareas terminadas',
    filterInProgress: 'En curso',
    filterInProgressTitle: 'Filtrar solo las tareas que tienes ahora mismo en curso',
    filterScheduled: 'Pendientes',
    filterScheduledTitle: 'Filtrar solo las tareas todavía por hacer',
    today: 'HOY',
    dayHide: 'Ocultar tareas de este día',
    dayShow: 'Mostrar tareas de este día',
    noCleans: 'Sin limpiezas',
    noMatches: 'Sin coincidencias',
    openTaskTitle: 'Abrir detalles de la tarea',
    refresh: 'Refrescar',
    refreshFootTitle: 'Recargar — trae los últimos cambios del manager',
    closeTitle: 'Cerrar',
    closeSheet: 'Cerrar',
    closeSheetTitle: 'Cerrar el panel',
    thisWeek: 'Esta semana',
    kpiSheetWorked: 'Horas trabajadas por día',
    kpiSheetEarnings: 'Ganancias por tarea',
    kpiSheetRating: 'Valoraciones de clientes',
    weekTotal: 'Total semana',
    totalEarned: 'Total ganado',
    ratingAverage: (avg: string, count: number) => `Promedio ${avg} ★ sobre ${count} servicios`,
    mockReviews: [
      { stars: 5, text: 'Impecable, todo brillaba. Volveremos a reservar.' },
      { stars: 5, text: 'Súper puntual y muy detallista — gracias.' },
      { stars: 4, text: 'Buen trabajo, la cocina quedó perfecta.' },
      { stars: 5, text: 'Atención al detalle excelente, sábanas planchadas.' },
      { stars: 5, text: 'Mejor limpieza que hemos tenido en meses.' },
    ] as ReadonlyArray<{ stars: number; text: string }>,
    statusScheduled: 'Pendiente',
    statusInProgress: 'En curso',
    statusCompleted: 'Completada',
    days: {
      mon: 'Lunes',
      tue: 'Martes',
      wed: 'Miércoles',
      thu: 'Jueves',
      fri: 'Viernes',
      sat: 'Sábado',
      sun: 'Domingo',
    } as Record<WeekDay, string>,
  },
  pt: {
    backAria: 'Voltar',
    backTitle: 'Voltar à agenda de hoje',
    refreshAria: 'Atualizar',
    refreshTitle: 'Atualizar — recarrega as alterações que o gestor acabou de fazer',
    bannerNew: 'Acabou de receber 2 novas tarefas esta semana',
    bannerDismissAria: 'Descartar aviso',
    bannerDismissTitle: 'Descartar',
    weekRoute: 'A sua rota da semana',
    assignedBy: 'Atribuída por Alan (o seu gestor)',
    kpiWorked: 'Trabalhado',
    kpiWorkedTitle: 'Ver o detalhe de horas trabalhadas por dia',
    kpiEarnings: 'Ganhos',
    kpiEarningsTitle: 'Ver detalhe de ganhos por tarefa',
    kpiRating: (n: number) => `Avaliação (${n})`,
    kpiRatingTitle: 'Ver avaliações recentes dos clientes',
    filter: 'Filtrar',
    filterHelpAria: 'Ajuda sobre os filtros',
    filterHelp: 'Toque num chip para filtrar as tarefas por estado. A contagem atualiza no momento.',
    filterAll: 'Todas',
    filterAllTitle: 'Ver todas as tarefas da semana',
    filterCompleted: 'Concluídas',
    filterCompletedTitle: 'Filtrar apenas as tarefas terminadas',
    filterInProgress: 'Em curso',
    filterInProgressTitle: 'Filtrar apenas as tarefas que tem em curso neste momento',
    filterScheduled: 'Pendentes',
    filterScheduledTitle: 'Filtrar apenas as tarefas ainda por fazer',
    today: 'HOJE',
    dayHide: 'Ocultar tarefas deste dia',
    dayShow: 'Mostrar tarefas deste dia',
    noCleans: 'Sem limpezas',
    noMatches: 'Sem correspondências',
    openTaskTitle: 'Abrir detalhes da tarefa',
    refresh: 'Atualizar',
    refreshFootTitle: 'Recarregar — traz as últimas alterações do gestor',
    closeTitle: 'Fechar',
    closeSheet: 'Fechar',
    closeSheetTitle: 'Fechar o painel',
    thisWeek: 'Esta semana',
    kpiSheetWorked: 'Horas trabalhadas por dia',
    kpiSheetEarnings: 'Ganhos por tarefa',
    kpiSheetRating: 'Avaliações de clientes',
    weekTotal: 'Total da semana',
    totalEarned: 'Total ganho',
    ratingAverage: (avg: string, count: number) => `Média ${avg} ★ em ${count} serviços`,
    mockReviews: [
      { stars: 5, text: 'Impecável, tudo a brilhar. Vamos reservar de novo.' },
      { stars: 5, text: 'Super pontual e muito minuciosa — obrigado.' },
      { stars: 4, text: 'Bom trabalho, a cozinha ficou perfeita.' },
      { stars: 5, text: 'Atenção ao detalhe excelente, lençóis engomados.' },
      { stars: 5, text: 'A melhor limpeza que tivemos em meses.' },
    ] as ReadonlyArray<{ stars: number; text: string }>,
    statusScheduled: 'Pendente',
    statusInProgress: 'Em curso',
    statusCompleted: 'Concluída',
    days: {
      mon: 'Segunda',
      tue: 'Terça',
      wed: 'Quarta',
      thu: 'Quinta',
      fri: 'Sexta',
      sat: 'Sábado',
      sun: 'Domingo',
    } as Record<WeekDay, string>,
  },
} as const satisfies Record<ClientLocale, unknown>;

type Day = {
  key: WeekDay;
  label: string;
  isToday: boolean;
  tasks: ScheduledTask[];
};

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

function expectedPayPence(t: ScheduledTask): number {
  // Cleaner is paid per hour — payPence is the hourly rate in pence.
  return Math.round((t.durationMin / 60) * t.payPence);
}

type Filter = 'all' | 'completed' | 'in_progress' | 'scheduled';

function buildFilters(
  t: (typeof COPY)['en'],
): Array<{ key: Filter; label: string; title: string }> {
  return [
    { key: 'all', label: t.filterAll, title: t.filterAllTitle },
    { key: 'completed', label: t.filterCompleted, title: t.filterCompletedTitle },
    { key: 'in_progress', label: t.filterInProgress, title: t.filterInProgressTitle },
    { key: 'scheduled', label: t.filterScheduled, title: t.filterScheduledTitle },
  ];
}

/** Today's WeekDay key, so the matching day card gets the "HOY" badge. */
function todayKey(): WeekDay {
  // JS getDay: 0=Sun..6=Sat. Our schema starts on Monday.
  const order: WeekDay[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return order[new Date().getDay()];
}

export default function OperativePreviewWeek() {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  const FILTERS = useMemo(() => buildFilters(t), [t]);
  const DAY_LABELS_LOCAL = t.days;
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [collapsedDays, setCollapsedDays] = useState<Set<WeekDay>>(new Set());
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [filterHelpOpen, setFilterHelpOpen] = useState(false);
  const [kpiSheet, setKpiSheet] = useState<'worked' | 'earnings' | 'rating' | null>(null);

  const refresh = useCallback(() => {
    const all = loadSchedule();
    setTasks(all.filter((t) => t.cleanerId === CURRENT_CLEANER_ID));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const today = todayKey();

  const days = useMemo<Day[]>(() => {
    const sorted = [...tasks].sort((a, b) => a.startTime.localeCompare(b.startTime));
    return WEEK_DAYS.map((key) => ({
      key,
      label: DAY_LABELS_LOCAL[key],
      isToday: key === today,
      tasks: sorted.filter((t) => t.day === key),
    }));
  }, [tasks, today]);

  const filteredDays = useMemo<Day[]>(
    () =>
      days.map((d) => ({
        ...d,
        tasks: filter === 'all' ? d.tasks : d.tasks.filter((t) => t.status === filter),
      })),
    [filter, days],
  );

  const allTasks = tasks;
  const filterCounts = useMemo(
    () => ({
      all: allTasks.length,
      completed: allTasks.filter((t) => t.status === 'completed').length,
      in_progress: allTasks.filter((t) => t.status === 'in_progress').length,
      scheduled: allTasks.filter((t) => t.status === 'scheduled').length,
    }),
    [allTasks],
  );
  const totalMinutes = useMemo(
    () => allTasks.reduce((sum, t) => sum + t.durationMin, 0),
    [allTasks],
  );
  const totalEarnings = useMemo(
    () =>
      allTasks
        .filter((t) => t.status === 'completed')
        .reduce((sum, t) => sum + expectedPayPence(t), 0),
    [allTasks],
  );
  const avgStars = 4.8;
  const ratingCount = allTasks.filter((t) => t.status === 'completed').length;

  function toggleDay(key: WeekDay) {
    setCollapsedDays((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  const selected = selectedTaskId
    ? tasks.find((t) => t.id === selectedTaskId) ?? null
    : null;
  const selectedDayLabel = selected ? DAY_LABELS_LOCAL[selected.day] : '';

  return (
    <main className="relative min-h-screen overflow-hidden bg-canvas pb-24">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-md items-center justify-between gap-2 px-4">
          <Link
            href="/operative/preview"
            aria-label={t.backAria}
            title={t.backTitle}
            className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-graphite-1 hover:bg-surface-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <ZapliLogo size="sm" />
          <button
            type="button"
            onClick={refresh}
            aria-label={t.refreshAria}
            title={t.refreshTitle}
            className="-mr-2 flex h-9 w-9 items-center justify-center rounded-full text-graphite-1 hover:bg-surface-2"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Sticky "new tasks this week" banner — mock for demo punch. */}
      {bannerVisible ? (
        <div className="sticky top-14 z-30 border-b border-amber-200/70 bg-gradient-to-r from-amber-50 to-amber-100/80 backdrop-blur">
          <div className="mx-auto flex max-w-md items-center gap-2 px-4 py-2">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-600" />
            <p className="flex-1 text-[11.5px] font-semibold text-amber-900">
              {t.bannerNew}
            </p>
            <button
              type="button"
              onClick={() => setBannerVisible(false)}
              aria-label={t.bannerDismissAria}
              title={t.bannerDismissTitle}
              className="grid h-5 w-5 place-items-center rounded-full text-amber-700 hover:bg-amber-200/70"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-md px-4 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-500">
          {t.weekRoute}
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-graphite-1">
          23 Jun – 29 Jun
        </h1>
        <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-graphite-3">
          <User className="h-3 w-3" /> {t.assignedBy}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Kpi
            icon={<Clock className="h-3.5 w-3.5 text-brand-500" />}
            label={t.kpiWorked}
            value={formatHours(totalMinutes)}
            title={t.kpiWorkedTitle}
            onClick={() => setKpiSheet('worked')}
          />
          <Kpi
            icon={<PoundSterling className="h-3.5 w-3.5 text-emerald-600" />}
            label={t.kpiEarnings}
            value={formatMoney(totalEarnings)}
            title={t.kpiEarningsTitle}
            onClick={() => setKpiSheet('earnings')}
          />
          <Kpi
            icon={<Star className="h-3.5 w-3.5 text-amber-500" />}
            label={t.kpiRating(ratingCount)}
            value={avgStars.toFixed(1)}
            title={t.kpiRatingTitle}
            onClick={() => setKpiSheet('rating')}
          />
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-graphite-3">
              {t.filter}
            </p>
            <button
              type="button"
              aria-label={t.filterHelpAria}
              aria-expanded={filterHelpOpen}
              aria-controls="filter-help"
              onClick={() => setFilterHelpOpen((o) => !o)}
              className="grid h-5 w-5 place-items-center rounded-full bg-surface-2 text-graphite-3 transition hover:bg-surface-3 hover:text-graphite-1"
            >
              <HelpCircle className="h-3 w-3" />
            </button>
          </div>
          {filterHelpOpen ? (
            <p
              id="filter-help"
              className="mt-2 rounded-lg border border-dashed border-line bg-surface-1/60 px-3 py-2 text-[11px] leading-relaxed text-graphite-3"
            >
              {t.filterHelp}
            </p>
          ) : null}
          <div className="mt-2 inline-flex rounded-full border border-line bg-paper p-0.5">
            {FILTERS.map((f) => {
              const active = f.key === filter;
              const count = filterCounts[f.key];
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  title={f.title}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                    active
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-graphite-3 hover:text-graphite-1'
                  }`}
                >
                  {f.label}
                  <span
                    className={`rounded-full px-1.5 text-[10px] font-bold tabular-nums ${
                      active ? 'bg-white/25 text-white' : 'bg-surface-2 text-graphite-3'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <section className="mt-6 space-y-4">
          {filteredDays.map((day) => {
            const isCollapsed = collapsedDays.has(day.key);
            return (
              <div key={day.key}>
                <button
                  type="button"
                  onClick={() => toggleDay(day.key)}
                  title={isCollapsed ? t.dayShow : t.dayHide}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-1 py-1 text-left transition hover:bg-surface-2/40 ${
                    day.isToday ? 'text-brand-600' : 'text-graphite-3'
                  }`}
                >
                  <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                    <Calendar className="h-3 w-3" />
                    {day.label}
                    {day.isToday ? ` · ${t.today}` : ''}
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
                    {filter === 'all' ? t.noCleans : t.noMatches}
                  </p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {day.tasks.map((task, idx) => {
                      const pay = expectedPayPence(task);
                      return (
                        <li key={task.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedTaskId(task.id)}
                            title={t.openTaskTitle}
                            className="flex w-full items-start gap-3 rounded-2xl border border-line bg-paper p-3 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-brand-400 hover:shadow-[0_4px_12px_-4px_rgba(37,99,235,0.18)]"
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[11px] font-semibold text-brand-700">
                              {idx + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <p className="min-w-0 truncate font-display text-sm font-semibold text-graphite-1">
                                  {task.propertyName}
                                </p>
                                <span className="shrink-0 font-display text-sm font-semibold tabular-nums text-emerald-700">
                                  {formatMoney(pay)}
                                </span>
                              </div>
                              <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-brand-600">
                                <MapPin className="h-3 w-3" /> {task.propertyAddress}
                              </span>
                              <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-graphite-3">
                                <User className="h-3 w-3" /> {task.clientName}
                              </p>
                              <p className="mt-1 truncate text-[11px] text-graphite-3">
                                {task.startTime} · {formatHours(task.durationMin)}
                              </p>
                              <div className="mt-1.5 flex items-center gap-2">
                                <StatusBadge status={task.status} labels={t} />
                                {task.status === 'completed' ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                ) : null}
                              </div>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </section>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={refresh}
            title={t.refreshFootTitle}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-[11px] font-medium text-graphite-3 transition hover:text-graphite-1"
          >
            <RefreshCw className="h-3 w-3" />
            {t.refresh}
          </button>
        </div>
      </div>

      {/* Task details sheet */}
      {selected ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 sm:items-center"
          onClick={() => setSelectedTaskId(null)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-paper p-5 shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-graphite-3">
                  {selectedDayLabel} · {selected.startTime}
                </p>
                <h2 className="mt-1 font-display text-lg font-semibold text-graphite-1">
                  {selected.propertyName}
                </h2>
                <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-brand-600">
                  <MapPin className="h-3 w-3" /> {selected.propertyAddress}
                </p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-graphite-3">
                  <User className="h-3 w-3" /> {selected.clientName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTaskId(null)}
                title={t.closeTitle}
                className="grid h-8 w-8 place-items-center rounded-full text-graphite-3 hover:bg-surface-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-graphite-3">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatHours(selected.durationMin)}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                <PoundSterling className="h-3 w-3" />
                {formatMoney(expectedPayPence(selected))}
              </span>
              <StatusBadge status={selected.status} labels={t} />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setSelectedTaskId(null)}
                title={t.closeSheetTitle}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-paper px-3 py-2.5 text-[12px] font-bold text-graphite-1"
              >
                {t.closeSheet}
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
                  {t.thisWeek}
                </p>
                <h2 className="mt-1 font-display text-lg font-semibold text-graphite-1">
                  {kpiSheet === 'worked'
                    ? t.kpiSheetWorked
                    : kpiSheet === 'earnings'
                      ? t.kpiSheetEarnings
                      : t.kpiSheetRating}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setKpiSheet(null)}
                title={t.closeTitle}
                className="grid h-8 w-8 place-items-center rounded-full text-graphite-3 hover:bg-surface-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {kpiSheet === 'worked' ? (
              <ul className="mt-4 divide-y divide-line rounded-xl border border-line">
                {days.map((d) => {
                  const mins = d.tasks.reduce((s, task) => s + task.durationMin, 0);
                  return (
                    <li key={d.key} className="flex items-center justify-between gap-3 px-3 py-2.5 text-[12px]">
                      <span className={`font-medium ${d.isToday ? 'text-brand-600' : 'text-graphite-1'}`}>
                        {d.label}
                        {d.isToday ? ` · ${t.today}` : ''}
                      </span>
                      <span className="tabular-nums text-graphite-3">
                        {mins === 0 ? '—' : formatHours(mins)}
                      </span>
                    </li>
                  );
                })}
                <li className="flex items-center justify-between gap-3 bg-surface-1/40 px-3 py-2.5 text-[12px] font-semibold">
                  <span className="text-graphite-1">{t.weekTotal}</span>
                  <span className="tabular-nums text-graphite-1">{formatHours(totalMinutes)}</span>
                </li>
              </ul>
            ) : null}

            {kpiSheet === 'earnings' ? (
              <ul className="mt-4 divide-y divide-line rounded-xl border border-line">
                {allTasks
                  .filter((task) => task.status === 'completed')
                  .map((task) => (
                    <li key={task.id} className="flex items-center justify-between gap-3 px-3 py-2.5 text-[12px]">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-graphite-1">
                          {task.propertyName}
                        </p>
                        <p className="truncate text-[10px] text-graphite-3">
                          {DAY_LABELS_LOCAL[task.day]} · {formatHours(task.durationMin)}
                        </p>
                      </div>
                      <span className="shrink-0 font-semibold tabular-nums text-emerald-700">
                        {formatMoney(expectedPayPence(task))}
                      </span>
                    </li>
                  ))}
                <li className="flex items-center justify-between gap-3 bg-surface-1/40 px-3 py-2.5 text-[12px] font-semibold">
                  <span className="text-graphite-1">{t.totalEarned}</span>
                  <span className="tabular-nums text-graphite-1">{formatMoney(totalEarnings)}</span>
                </li>
              </ul>
            ) : null}

            {kpiSheet === 'rating' ? (
              <ul className="mt-4 space-y-2">
                {(() => {
                  const completed = allTasks.filter((task) => task.status === 'completed');
                  const MOCK_REVIEWS = t.mockReviews;
                  return completed.slice(0, MOCK_REVIEWS.length).map((task, i) => {
                    const r = MOCK_REVIEWS[i];
                    return (
                      <li key={task.id} className="rounded-xl border border-line bg-paper p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[12px] font-semibold text-graphite-1">
                            {task.propertyName}
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
                  {t.ratingAverage(avgStars.toFixed(1), ratingCount)}
                </li>
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}

      <PreviewBottomTabBar active="tareas" />
    </main>
  );
}

const STATUS_CLS: Record<DemoStatus, string> = {
  scheduled: 'bg-slate-100 text-slate-700',
  in_progress: 'bg-amber-100 text-amber-800',
  completed: 'bg-emerald-100 text-emerald-800',
};

function StatusBadge({
  status,
  labels,
}: {
  status: DemoStatus;
  labels: Pick<
    (typeof COPY)['en'],
    'statusScheduled' | 'statusInProgress' | 'statusCompleted'
  >;
}) {
  const cls = STATUS_CLS[status];
  const label =
    status === 'scheduled'
      ? labels.statusScheduled
      : status === 'in_progress'
        ? labels.statusInProgress
        : labels.statusCompleted;
  return (
    <span className={`rounded-full px-1.5 py-0.5 text-[9.5px] font-semibold ${cls}`}>
      {label}
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
