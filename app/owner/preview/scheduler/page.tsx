'use client';

/**
 * Owner weekly scheduler — preview, no auth.
 *
 * Visual planning board for the week. The owner drags time, cleaner and
 * property assignments per day; every change persists to localStorage via
 * lib/preview-schedule.ts so the same edits show up in the operative and
 * client preview portals.
 *
 * Mobile-first: collapsible day list on phones, 7-column grid on
 * desktop. Edit/create both reuse the same DemoSheet form.
 */

import { useEffect, useMemo, useState } from 'react';
import { useClientLocale, pickCopy } from '@/lib/use-locale-client';

const COPY = {
  en: {
    back: 'Back',
    backToDashboard: 'Back to dashboard',
    scheduling: 'Scheduling',
    weeklyCalendar: 'Weekly calendar',
    thisWeekTitle: 'See this week',
    thisWeek: '← This week',
    nextWeekTitle: 'See next week',
    nextWeek: 'Next →',
    weekScheduling: 'Week schedule',
    cleansWord: 'cleans',
    cleanersWord: 'cleaners',
    thisWeekSuffix: 'this week',
    showDay: 'Show this day',
    hideDay: 'Hide this day',
    addTask: 'Add task',
    addTaskTo: (day: string) => `Add a task on ${day}`,
    noScheduledCleans: 'No scheduled cleans',
    noCleans: 'No cleans',
    editTask: 'Edit task',
    newTask: 'New task',
    cleanerField: 'Cleaner',
    propertyField: 'Property',
    startTime: 'Start time',
    duration: 'Duration',
    hours: 'Hours',
    minutes: 'Minutes',
    total: 'Total',
    service: 'Service',
    chargeField: 'Price charged to client (£)',
    chargeHint: 'Editable — the service rate is just a suggestion.',
    payField: 'Cleaner pay (£)',
    payHint: 'What the cleaner will earn for this task. You can adjust.',
    deleteTitle: 'Delete this task',
    delete: 'Delete',
    cancelTitle: 'Close without saving',
    cancel: 'Cancel',
    saveTitle: 'Save changes',
    save: 'Save',
    toast: 'Schedule saved · Carmen, Pedro and Ana can see it in their app',
    serviceStandard: 'Standard',
    serviceDeep: 'Deep',
    serviceWindows: 'Windows',
    serviceMoving: 'Move-out',
    weekRangeThis: '24 – 30 Jun',
    weekRangeNext: '1 – 7 Jul',
    dayMon: 'MON',
    dayTue: 'TUE',
    dayWed: 'WED',
    dayThu: 'THU',
    dayFri: 'FRI',
    daySat: 'SAT',
    daySun: 'SUN',
  },
  es: {
    back: 'Volver',
    backToDashboard: 'Volver al dashboard',
    scheduling: 'Programación',
    weeklyCalendar: 'Calendario semanal',
    thisWeekTitle: 'Ver esta semana',
    thisWeek: '← Esta semana',
    nextWeekTitle: 'Ver la próxima semana',
    nextWeek: 'Próxima →',
    weekScheduling: 'Programación de la semana',
    cleansWord: 'limpiezas',
    cleanersWord: 'cleaners',
    thisWeekSuffix: 'esta semana',
    showDay: 'Mostrar este día',
    hideDay: 'Ocultar este día',
    addTask: 'Añadir tarea',
    addTaskTo: (day: string) => `Añadir una tarea al ${day}`,
    noScheduledCleans: 'Sin limpiezas programadas',
    noCleans: 'Sin limpiezas',
    editTask: 'Editar tarea',
    newTask: 'Nueva tarea',
    cleanerField: 'Cleaner',
    propertyField: 'Propiedad',
    startTime: 'Hora inicio',
    duration: 'Duración',
    hours: 'Horas',
    minutes: 'Minutos',
    total: 'Total',
    service: 'Servicio',
    chargeField: 'Precio cobrado al cliente (£)',
    chargeHint: 'Editable — la tarifa del servicio es solo una sugerencia.',
    payField: 'Pago al cleaner (£)',
    payHint: 'Lo que ganará el cleaner por esta tarea. Puedes ajustar.',
    deleteTitle: 'Eliminar esta tarea',
    delete: 'Eliminar',
    cancelTitle: 'Cerrar sin guardar',
    cancel: 'Cancelar',
    saveTitle: 'Guardar cambios',
    save: 'Guardar',
    toast: 'Programación guardada · Carmen, Pedro y Ana ya la ven en su app',
    serviceStandard: 'Estándar',
    serviceDeep: 'Profunda',
    serviceWindows: 'Cristales',
    serviceMoving: 'Mudanza',
    weekRangeThis: '24 – 30 Jun',
    weekRangeNext: '1 – 7 Jul',
    dayMon: 'LUN',
    dayTue: 'MAR',
    dayWed: 'MIÉ',
    dayThu: 'JUE',
    dayFri: 'VIE',
    daySat: 'SÁB',
    daySun: 'DOM',
  },
  pt: {
    back: 'Voltar',
    backToDashboard: 'Voltar ao dashboard',
    scheduling: 'Agendamento',
    weeklyCalendar: 'Calendário semanal',
    thisWeekTitle: 'Ver esta semana',
    thisWeek: '← Esta semana',
    nextWeekTitle: 'Ver a próxima semana',
    nextWeek: 'Próxima →',
    weekScheduling: 'Agendamento da semana',
    cleansWord: 'limpezas',
    cleanersWord: 'cleaners',
    thisWeekSuffix: 'esta semana',
    showDay: 'Mostrar este dia',
    hideDay: 'Ocultar este dia',
    addTask: 'Adicionar tarefa',
    addTaskTo: (day: string) => `Adicionar uma tarefa em ${day}`,
    noScheduledCleans: 'Sem limpezas agendadas',
    noCleans: 'Sem limpezas',
    editTask: 'Editar tarefa',
    newTask: 'Nova tarefa',
    cleanerField: 'Cleaner',
    propertyField: 'Propriedade',
    startTime: 'Hora de início',
    duration: 'Duração',
    hours: 'Horas',
    minutes: 'Minutos',
    total: 'Total',
    service: 'Serviço',
    chargeField: 'Preço cobrado ao cliente (£)',
    chargeHint: 'Editável — a tarifa do serviço é apenas uma sugestão.',
    payField: 'Pagamento ao cleaner (£)',
    payHint: 'O que o cleaner irá ganhar nesta tarefa. Podes ajustar.',
    deleteTitle: 'Eliminar esta tarefa',
    delete: 'Eliminar',
    cancelTitle: 'Fechar sem guardar',
    cancel: 'Cancelar',
    saveTitle: 'Guardar alterações',
    save: 'Guardar',
    toast: 'Agendamento guardado · Carmen, Pedro e Ana já o vêem na app',
    serviceStandard: 'Padrão',
    serviceDeep: 'Profunda',
    serviceWindows: 'Vidros',
    serviceMoving: 'Mudança',
    weekRangeThis: '24 – 30 Jun',
    weekRangeNext: '1 – 7 Jul',
    dayMon: 'SEG',
    dayTue: 'TER',
    dayWed: 'QUA',
    dayThu: 'QUI',
    dayFri: 'SEX',
    daySat: 'SÁB',
    daySun: 'DOM',
  },
} as const;

type SchedulerCopy = (typeof COPY)['en'];
import Link from 'next/link';
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock,
  Plus,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react';
import { DemoSheet, DemoToast } from '@/components/preview/DemoSheet';
import { DemoBottomTabBar } from '../_components/DemoBottomTabBar';
import {
  DAY_LABELS,
  DEMO_CLEANERS,
  DEMO_PROPERTIES,
  WEEK_DAYS,
  loadSchedule,
  saveSchedule,
  type ScheduledTask,
  type WeekDay,
} from '@/lib/preview-schedule';

function shortDay(t: SchedulerCopy): Record<WeekDay, string> {
  return {
    mon: t.dayMon,
    tue: t.dayTue,
    wed: t.dayWed,
    thu: t.dayThu,
    fri: t.dayFri,
    sat: t.daySat,
    sun: t.daySun,
  };
}

// Stubbed date numbers — purely cosmetic for the demo.
const DAY_STUB_DATES_THIS: Record<WeekDay, number> = {
  mon: 24,
  tue: 25,
  wed: 26,
  thu: 27,
  fri: 28,
  sat: 29,
  sun: 30,
};

const DAY_STUB_DATES_NEXT: Record<WeekDay, number> = {
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
  sun: 7,
};

type ServiceOption = { value: ScheduledTask['service']; label: string; pence: number };

function serviceOptions(t: SchedulerCopy): ServiceOption[] {
  return [
    { value: 'estandar', label: t.serviceStandard, pence: 4500 },
    { value: 'profunda', label: t.serviceDeep, pence: 9500 },
    { value: 'cristales', label: t.serviceWindows, pence: 6500 },
    { value: 'mudanza', label: t.serviceMoving, pence: 12500 },
  ];
}

const SERVICE_PRICES: Record<ScheduledTask['service'], number> = {
  estandar: 4500,
  profunda: 9500,
  cristales: 6500,
  mudanza: 12500,
};

// Native <select> options every 30 min from 06:00 to 21:30.
const START_TIME_OPTIONS: string[] = (() => {
  const out: string[] = [];
  for (let h = 6; h <= 21; h++) {
    out.push(`${String(h).padStart(2, '0')}:00`);
    out.push(`${String(h).padStart(2, '0')}:30`);
  }
  return out;
})();

const HOUR_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const MINUTE_OPTIONS = [0, 15, 30, 45];

// Demo fallback: cleaner default hourly pay in pence (£12/h).
const DEFAULT_CLEANER_HOURLY_PAY_PENCE = 1200;

type SheetState =
  | { kind: 'edit'; task: ScheduledTask }
  | { kind: 'create'; day: WeekDay }
  | null;

type FormState = {
  cleanerId: string;
  propertyId: string;
  startTime: string;
  durationHours: number;
  durationMinutes: number;
  service: ScheduledTask['service'];
  chargePence: number;
  payPence: number;
};

function emptyForm(): FormState {
  const durationHours = 2;
  const durationMinutes = 0;
  return {
    cleanerId: DEMO_CLEANERS[0].id,
    propertyId: DEMO_PROPERTIES[0].id,
    startTime: '10:00',
    durationHours,
    durationMinutes,
    service: 'estandar',
    chargePence: priceFor('estandar'),
    payPence: DEFAULT_CLEANER_HOURLY_PAY_PENCE * durationHours,
  };
}

function fromTask(t: ScheduledTask): FormState {
  return {
    cleanerId: t.cleanerId,
    propertyId: t.propertyId,
    startTime: t.startTime,
    durationHours: Math.floor(t.durationMin / 60),
    durationMinutes: t.durationMin % 60,
    service: t.service,
    chargePence: t.chargePence,
    payPence: t.payPence,
  };
}

function formatHours(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${minutes}m`;
}

function formatMoney(pence: number): string {
  return `£${Math.round(pence / 100)}`;
}

function priceFor(service: ScheduledTask['service']): number {
  return SERVICE_PRICES[service] ?? 4500;
}

function makeId(): string {
  return `t-${Math.random().toString(36).slice(2, 9)}`;
}

export default function OwnerSchedulerPage() {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  const SHORT_DAY = shortDay(t);
  const SERVICE_OPTIONS = serviceOptions(t);
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [weekOffset, setWeekOffset] = useState<0 | 1>(0);
  const [sheet, setSheet] = useState<SheetState>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [collapsed, setCollapsed] = useState<Set<WeekDay>>(new Set());
  const [toast, setToast] = useState(false);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    setTasks(loadSchedule());
    setLoaded(true);
  }, []);

  // Persist on any tasks change (after the initial hydration).
  useEffect(() => {
    if (!loaded) return;
    saveSchedule(tasks);
  }, [tasks, loaded]);

  function flashToast() {
    setToast(true);
    window.setTimeout(() => setToast(false), 1500);
  }

  function openEdit(task: ScheduledTask) {
    setForm(fromTask(task));
    setSheet({ kind: 'edit', task });
  }

  function openCreate(day: WeekDay) {
    setForm(emptyForm());
    setSheet({ kind: 'create', day });
  }

  function closeSheet() {
    setSheet(null);
  }

  function saveForm() {
    if (!sheet) return;
    const cleaner = DEMO_CLEANERS.find((c) => c.id === form.cleanerId)!;
    const property = DEMO_PROPERTIES.find((p) => p.id === form.propertyId)!;
    const durationMin = form.durationHours * 60 + form.durationMinutes;
    const chargePence = form.chargePence;
    const payPence = form.payPence;

    if (sheet.kind === 'edit') {
      const updated: ScheduledTask = {
        ...sheet.task,
        cleanerId: cleaner.id,
        cleanerName: cleaner.name,
        propertyId: property.id,
        propertyName: property.name,
        propertyAddress: property.address,
        clientId: property.clientId,
        clientName: property.clientName,
        startTime: form.startTime,
        durationMin,
        service: form.service,
        chargePence,
        payPence,
      };
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } else {
      const created: ScheduledTask = {
        id: makeId(),
        day: sheet.day,
        startTime: form.startTime,
        durationMin,
        cleanerId: cleaner.id,
        cleanerName: cleaner.name,
        propertyId: property.id,
        propertyName: property.name,
        propertyAddress: property.address,
        clientId: property.clientId,
        clientName: property.clientName,
        service: form.service,
        chargePence,
        payPence,
        status: 'scheduled',
      };
      setTasks((prev) => [...prev, created]);
    }
    closeSheet();
    flashToast();
  }

  function deleteCurrent() {
    if (!sheet || sheet.kind !== 'edit') return;
    setTasks((prev) => prev.filter((t) => t.id !== sheet.task.id));
    closeSheet();
    flashToast();
  }

  function toggleDay(day: WeekDay) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  }

  const tasksByDay = useMemo(() => {
    const map: Record<WeekDay, ScheduledTask[]> = {
      mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [],
    };
    for (const t of tasks) map[t.day].push(t);
    for (const d of WEEK_DAYS) map[d].sort((a, b) => a.startTime.localeCompare(b.startTime));
    return map;
  }, [tasks]);

  const totalCleanings = tasks.length;
  const totalCleaners = new Set(tasks.map((t) => t.cleanerId)).size;
  const totalCharge = tasks.reduce((sum, t) => sum + t.chargePence, 0);
  const dateStubs = weekOffset === 0 ? DAY_STUB_DATES_THIS : DAY_STUB_DATES_NEXT;

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 pb-24">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-3 sm:px-4">
          <Link
            href="/owner/preview"
            aria-label={t.back}
            title={t.backToDashboard}
            className="-ml-1 grid h-9 w-9 place-items-center rounded-full text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              {t.scheduling}
            </p>
            <h1 className="-mt-0.5 truncate font-display text-base font-semibold text-slate-900">
              {t.weeklyCalendar}
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-3 pt-4 sm:px-4 sm:pt-6 lg:px-8">
        {/* Week navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-full border border-slate-200 bg-white p-0.5 shadow-sm">
            <button
              type="button"
              onClick={() => setWeekOffset(0)}
              title={t.thisWeekTitle}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
                weekOffset === 0
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.thisWeek}
            </button>
            <button
              type="button"
              onClick={() => setWeekOffset(1)}
              title={t.nextWeekTitle}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
                weekOffset === 1
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.nextWeek}
            </button>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-200">
            <CalendarDays className="h-3 w-3" />
            {weekOffset === 0 ? t.weekRangeThis : t.weekRangeNext}
          </span>
        </div>

        {/* Summary header */}
        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h2 className="inline-flex items-center gap-2 font-display text-lg font-semibold text-slate-900">
            <Sparkles className="h-4 w-4 text-blue-600" /> {t.weekScheduling}
          </h2>
          <p className="mt-1 text-[13px] text-slate-600">
            <span className="font-semibold text-slate-900">{totalCleanings}</span> {t.cleansWord}
            {' · '}
            <span className="font-semibold text-slate-900">{totalCleaners}</span> {t.cleanersWord}
            {' · '}
            <span className="font-semibold text-emerald-700">{formatMoney(totalCharge)}</span> {t.thisWeekSuffix}
          </p>
        </section>

        {/* Desktop 7-column grid */}
        <section className="mt-5 hidden grid-cols-7 gap-2 lg:grid">
          {WEEK_DAYS.map((day) => (
            <DayColumn
              key={day}
              day={day}
              dateStub={dateStubs[day]}
              tasks={tasksByDay[day]}
              onAdd={() => openCreate(day)}
              onSelect={openEdit}
              t={t}
              shortDayLabel={SHORT_DAY}
            />
          ))}
        </section>

        {/* Mobile / tablet: collapsible day list */}
        <section className="mt-5 space-y-2 lg:hidden">
          {WEEK_DAYS.map((day) => {
            const isCollapsed = collapsed.has(day);
            const dayTasks = tasksByDay[day];
            return (
              <div
                key={day}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
              >
                <button
                  type="button"
                  onClick={() => toggleDay(day)}
                  title={isCollapsed ? t.showDay : t.hideDay}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-display text-[13px] font-semibold text-slate-900">
                      {DAY_LABELS[day]}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {SHORT_DAY[day]} {dateStubs[day]}
                    </span>
                    <span className="rounded-full bg-slate-100 px-1.5 text-[10px] font-bold text-slate-600">
                      {dayTasks.length}
                    </span>
                  </div>
                  {isCollapsed ? (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  )}
                </button>
                {isCollapsed ? null : (
                  <div className="border-t border-slate-100 p-2.5">
                    <button
                      type="button"
                      onClick={() => openCreate(day)}
                      title={t.addTaskTo(DAY_LABELS[day])}
                      className="mb-2 inline-flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-blue-200 bg-blue-50/50 px-3 py-1.5 text-[12px] font-semibold text-blue-700 hover:bg-blue-50"
                    >
                      <Plus className="h-3.5 w-3.5" /> {t.addTask}
                    </button>
                    {dayTasks.length === 0 ? (
                      <p className="px-1 py-2 text-center text-[11.5px] text-slate-400">
                        {t.noScheduledCleans}
                      </p>
                    ) : (
                      <ul className="space-y-1.5">
                        {dayTasks.map((t) => (
                          <li key={t.id}>
                            <TaskCard task={t} onClick={() => openEdit(t)} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </div>

      {/* Edit / create sheet */}
      <DemoSheet
        open={sheet !== null}
        onClose={closeSheet}
        title={sheet?.kind === 'edit' ? t.editTask : `${t.newTask} · ${sheet ? DAY_LABELS[sheet.day] : ''}`}
      >
        <div className="space-y-3">
          <Field label={t.cleanerField} icon={<Users className="h-3.5 w-3.5 text-slate-500" />}>
            <select
              value={form.cleanerId}
              onChange={(e) => setForm((f) => ({ ...f, cleanerId: e.target.value }))}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900"
            >
              {DEMO_CLEANERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t.propertyField}>
            <select
              value={form.propertyId}
              onChange={(e) => setForm((f) => ({ ...f, propertyId: e.target.value }))}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900"
            >
              {DEMO_PROPERTIES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.clientName}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t.startTime} icon={<Clock className="h-3.5 w-3.5 text-slate-500" />}>
            <select
              value={form.startTime}
              onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900"
            >
              {START_TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <div>
            <span className="mb-1 inline-flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
              {t.duration}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {t.hours}
                </span>
                <select
                  value={form.durationHours}
                  onChange={(e) =>
                    setForm((f) => {
                      const next = { ...f, durationHours: Number(e.target.value) };
                      // Refresh cleaner pay suggestion when hours change, only if
                      // the user hasn't overridden it (matches default-for-current).
                      const defaultPay =
                        DEFAULT_CLEANER_HOURLY_PAY_PENCE * f.durationHours;
                      if (f.payPence === defaultPay) {
                        next.payPence = DEFAULT_CLEANER_HOURLY_PAY_PENCE * next.durationHours;
                      }
                      return next;
                    })
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900"
                >
                  {HOUR_OPTIONS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {t.minutes}
                </span>
                <select
                  value={form.durationMinutes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, durationMinutes: Number(e.target.value) }))
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900"
                >
                  {MINUTE_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              {t.total}: {formatHours(form.durationHours * 60 + form.durationMinutes)}
            </p>
          </div>

          <Field label={t.service}>
            <select
              value={form.service}
              onChange={(e) => {
                const nextService = e.target.value as ScheduledTask['service'];
                setForm((f) => ({
                  ...f,
                  service: nextService,
                  // Auto-fill the suggested service price; the field stays editable.
                  chargePence: priceFor(nextService),
                }));
              }}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900"
            >
              {SERVICE_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label} · {formatMoney(s.pence)}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t.chargeField}>
            <input
              type="number"
              step="0.50"
              min="0"
              value={(form.chargePence / 100).toFixed(2)}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  chargePence: Math.max(0, Math.round(Number(e.target.value) * 100) || 0),
                }))
              }
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              {t.chargeHint}
            </p>
          </Field>

          <Field label={t.payField}>
            <input
              type="number"
              step="0.50"
              min="0"
              value={(form.payPence / 100).toFixed(2)}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  payPence: Math.max(0, Math.round(Number(e.target.value) * 100) || 0),
                }))
              }
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              {t.payHint}
            </p>
          </Field>

          <div className="mt-4 flex items-center gap-2">
            {sheet?.kind === 'edit' ? (
              <button
                type="button"
                onClick={deleteCurrent}
                title={t.deleteTitle}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-[12px] font-bold text-rose-700 hover:bg-rose-100"
              >
                <Trash2 className="h-3.5 w-3.5" /> {t.delete}
              </button>
            ) : null}
            <button
              type="button"
              onClick={closeSheet}
              title={t.cancelTitle}
              className="ml-auto rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-bold text-slate-700 hover:bg-slate-50"
            >
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={saveForm}
              title={t.saveTitle}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-[12px] font-bold text-white hover:bg-blue-700"
            >
              {t.save}
            </button>
          </div>
        </div>
      </DemoSheet>

      <DemoToast
        show={toast}
        message={t.toast}
      />
      <DemoBottomTabBar active="tasks" />
    </main>
  );
}

function DayColumn({
  day,
  dateStub,
  tasks,
  onAdd,
  onSelect,
  t,
  shortDayLabel,
}: {
  day: WeekDay;
  dateStub: number;
  tasks: ScheduledTask[];
  onAdd: () => void;
  onSelect: (task: ScheduledTask) => void;
  t: SchedulerCopy;
  shortDayLabel: Record<WeekDay, string>;
}) {
  return (
    <div className="flex min-h-[280px] flex-col rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="mb-2 px-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {shortDayLabel[day]} {dateStub}
        </p>
        <p className="font-display text-[13px] font-semibold text-slate-900">
          {DAY_LABELS[day]}
        </p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        title={t.addTaskTo(DAY_LABELS[day])}
        className="mb-2 inline-flex items-center justify-center gap-1 rounded-lg border border-dashed border-blue-200 bg-blue-50/50 px-2 py-1.5 text-[11px] font-semibold text-blue-700 hover:bg-blue-50"
      >
        <Plus className="h-3 w-3" /> {t.addTask}
      </button>
      <div className="flex-1 space-y-1.5">
        {tasks.length === 0 ? (
          <p className="px-1 py-2 text-center text-[10.5px] text-slate-400">
            {t.noCleans}
          </p>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onSelect(task)} compact />
          ))
        )}
      </div>
    </div>
  );
}

function TaskCard({
  task,
  onClick,
  compact = false,
}: {
  task: ScheduledTask;
  onClick: () => void;
  compact?: boolean;
}) {
  const cleaner = DEMO_CLEANERS.find((c) => c.id === task.cleanerId);
  const color = cleaner?.color ?? '#2563eb';
  const initials = cleaner?.initials ?? '··';
  return (
    <button
      type="button"
      onClick={onClick}
      title={`${task.cleanerName} · ${task.propertyName} · ${formatHours(task.durationMin)}`}
      className="block w-full rounded-xl border bg-white p-2 text-left transition hover:-translate-y-0.5 hover:shadow"
      style={{ borderLeftWidth: 3, borderLeftColor: color, borderColor: '#e2e8f0' }}
    >
      <div className="flex items-center gap-2">
        <span className="font-display text-[12px] font-bold tabular-nums text-slate-900">
          {task.startTime}
        </span>
        <span
          className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[9.5px] font-bold text-white"
          style={{ backgroundColor: color }}
          aria-hidden
        >
          {initials.charAt(0)}
        </span>
        <span className={`min-w-0 flex-1 truncate text-[11.5px] font-semibold text-slate-800 ${compact ? '' : ''}`}>
          {task.propertyName}
        </span>
      </div>
      <p className="mt-1 truncate text-[10.5px] text-slate-500">
        {cleaner?.name.split(' ')[0] ?? task.cleanerName} · {formatHours(task.durationMin)}
      </p>
    </button>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 inline-flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}
