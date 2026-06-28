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

const SHORT_DAY: Record<WeekDay, string> = {
  mon: 'LUN',
  tue: 'MAR',
  wed: 'MIÉ',
  thu: 'JUE',
  fri: 'VIE',
  sat: 'SÁB',
  sun: 'DOM',
};

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

const SERVICE_OPTIONS: Array<{ value: ScheduledTask['service']; label: string; pence: number }> = [
  { value: 'estandar', label: 'Estándar', pence: 4500 },
  { value: 'profunda', label: 'Profunda', pence: 9500 },
  { value: 'cristales', label: 'Cristales', pence: 6500 },
  { value: 'mudanza', label: 'Mudanza', pence: 12500 },
];

type SheetState =
  | { kind: 'edit'; task: ScheduledTask }
  | { kind: 'create'; day: WeekDay }
  | null;

type FormState = {
  cleanerId: string;
  propertyId: string;
  startTime: string;
  durationMin: number;
  service: ScheduledTask['service'];
};

function emptyForm(): FormState {
  return {
    cleanerId: DEMO_CLEANERS[0].id,
    propertyId: DEMO_PROPERTIES[0].id,
    startTime: '10:00',
    durationMin: 120,
    service: 'estandar',
  };
}

function fromTask(t: ScheduledTask): FormState {
  return {
    cleanerId: t.cleanerId,
    propertyId: t.propertyId,
    startTime: t.startTime,
    durationMin: t.durationMin,
    service: t.service,
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
  return SERVICE_OPTIONS.find((s) => s.value === service)?.pence ?? 4500;
}

function makeId(): string {
  return `t-${Math.random().toString(36).slice(2, 9)}`;
}

export default function OwnerSchedulerPage() {
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
    const chargePence = priceFor(form.service);
    const payPence = Math.round(chargePence * 0.6);

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
        durationMin: form.durationMin,
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
        durationMin: form.durationMin,
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
            aria-label="Volver"
            title="Volver al dashboard"
            className="-ml-1 grid h-9 w-9 place-items-center rounded-full text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Programación
            </p>
            <h1 className="-mt-0.5 truncate font-display text-base font-semibold text-slate-900">
              Calendario semanal
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
              title="Ver esta semana"
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
                weekOffset === 0
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ← Esta semana
            </button>
            <button
              type="button"
              onClick={() => setWeekOffset(1)}
              title="Ver la próxima semana"
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
                weekOffset === 1
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Próxima →
            </button>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-200">
            <CalendarDays className="h-3 w-3" />
            {weekOffset === 0 ? '24 – 30 Jun' : '1 – 7 Jul'}
          </span>
        </div>

        {/* Summary header */}
        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h2 className="inline-flex items-center gap-2 font-display text-lg font-semibold text-slate-900">
            <Sparkles className="h-4 w-4 text-blue-600" /> Programación de la semana
          </h2>
          <p className="mt-1 text-[13px] text-slate-600">
            <span className="font-semibold text-slate-900">{totalCleanings}</span> limpiezas
            {' · '}
            <span className="font-semibold text-slate-900">{totalCleaners}</span> cleaners
            {' · '}
            <span className="font-semibold text-emerald-700">{formatMoney(totalCharge)}</span> esta semana
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
                  title={isCollapsed ? 'Mostrar este día' : 'Ocultar este día'}
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
                      title="Añadir una tarea a este día"
                      className="mb-2 inline-flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-blue-200 bg-blue-50/50 px-3 py-1.5 text-[12px] font-semibold text-blue-700 hover:bg-blue-50"
                    >
                      <Plus className="h-3.5 w-3.5" /> Añadir tarea
                    </button>
                    {dayTasks.length === 0 ? (
                      <p className="px-1 py-2 text-center text-[11.5px] text-slate-400">
                        Sin limpiezas programadas
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
        title={sheet?.kind === 'edit' ? 'Editar tarea' : `Nueva tarea · ${sheet ? DAY_LABELS[sheet.day] : ''}`}
      >
        <div className="space-y-3">
          <Field label="Cleaner" icon={<Users className="h-3.5 w-3.5 text-slate-500" />}>
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

          <Field label="Propiedad">
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

          <div className="grid grid-cols-2 gap-3">
            <Field label="Hora inicio" icon={<Clock className="h-3.5 w-3.5 text-slate-500" />}>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900"
              />
            </Field>
            <Field label="Duración (min)">
              <input
                type="number"
                min={30}
                step={15}
                value={form.durationMin}
                onChange={(e) =>
                  setForm((f) => ({ ...f, durationMin: Math.max(30, Number(e.target.value) || 30) }))
                }
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900"
              />
            </Field>
          </div>

          <Field label="Servicio">
            <select
              value={form.service}
              onChange={(e) =>
                setForm((f) => ({ ...f, service: e.target.value as ScheduledTask['service'] }))
              }
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900"
            >
              {SERVICE_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label} · {formatMoney(s.pence)}
                </option>
              ))}
            </select>
          </Field>

          <div className="mt-4 flex items-center gap-2">
            {sheet?.kind === 'edit' ? (
              <button
                type="button"
                onClick={deleteCurrent}
                title="Eliminar esta tarea"
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-[12px] font-bold text-rose-700 hover:bg-rose-100"
              >
                <Trash2 className="h-3.5 w-3.5" /> Eliminar
              </button>
            ) : null}
            <button
              type="button"
              onClick={closeSheet}
              title="Cerrar sin guardar"
              className="ml-auto rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={saveForm}
              title="Guardar cambios"
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-[12px] font-bold text-white hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </div>
      </DemoSheet>

      <DemoToast
        show={toast}
        message="Programación guardada · Carmen, Pedro y Ana ya la ven en su app"
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
}: {
  day: WeekDay;
  dateStub: number;
  tasks: ScheduledTask[];
  onAdd: () => void;
  onSelect: (task: ScheduledTask) => void;
}) {
  return (
    <div className="flex min-h-[280px] flex-col rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="mb-2 px-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {SHORT_DAY[day]} {dateStub}
        </p>
        <p className="font-display text-[13px] font-semibold text-slate-900">
          {DAY_LABELS[day]}
        </p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        title={`Añadir una tarea al ${DAY_LABELS[day]}`}
        className="mb-2 inline-flex items-center justify-center gap-1 rounded-lg border border-dashed border-blue-200 bg-blue-50/50 px-2 py-1.5 text-[11px] font-semibold text-blue-700 hover:bg-blue-50"
      >
        <Plus className="h-3 w-3" /> Añadir tarea
      </button>
      <div className="flex-1 space-y-1.5">
        {tasks.length === 0 ? (
          <p className="px-1 py-2 text-center text-[10.5px] text-slate-400">
            Sin limpiezas
          </p>
        ) : (
          tasks.map((t) => (
            <TaskCard key={t.id} task={t} onClick={() => onSelect(t)} compact />
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
