/**
 * Public preview: Owner → Tasks list. Mocked data.
 * Interactive: search + filter pills (Hoy / Mañana / Todas) + status updates.
 */
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Info,
  MapPin,
  Plus,
  Search,
  X,
  XCircle,
} from 'lucide-react';
import { DemoBottomTabBar } from '../_components/DemoBottomTabBar';

type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
type Task = {
  id: string;
  date: string;
  time: string;
  property: string;
  address: string;
  cleaner: string;
  status: TaskStatus;
};

const initialTasks: Task[] = [
  { id: 'demo-1', date: 'Hoy', time: '09:00', property: 'Soho Loft', address: '22 Old Compton St, London W1D 4TR', cleaner: 'Carmen R.', status: 'in_progress' },
  { id: 'demo-2', date: 'Hoy', time: '11:30', property: 'Camden House', address: '47 Camden High St, London NW1', cleaner: 'Lucía V.', status: 'completed' },
  { id: 'demo-3', date: 'Hoy', time: '14:00', property: 'Notting Hill Flat', address: '12 Portobello Rd, London W11', cleaner: 'Pedro K.', status: 'pending' },
  { id: 'demo-4', date: 'Hoy', time: '17:00', property: 'Mayfair Studio', address: '8 Berkeley St, London W1J', cleaner: 'María R.', status: 'pending' },
  { id: 'demo-5', date: 'Mañana', time: '09:00', property: 'Soho Loft', address: '22 Old Compton St, London W1D', cleaner: 'Carmen R.', status: 'pending' },
  { id: 'demo-6', date: 'Mañana', time: '13:00', property: 'Camden House', address: '47 Camden High St, London NW1', cleaner: 'Lucía V.', status: 'cancelled' },
  { id: 'demo-7', date: 'Mañana', time: '16:30', property: 'Notting Hill Flat', address: '12 Portobello Rd, London W11', cleaner: 'Pedro K.', status: 'pending' },
  { id: 'demo-8', date: 'Vie', time: '10:00', property: 'Mayfair Studio', address: '8 Berkeley St, London W1J', cleaner: 'María R.', status: 'pending' },
];

const statusConfig: Record<TaskStatus, { label: string; bg: string; icon: typeof Circle }> = {
  pending: { label: 'Pendiente', bg: 'bg-slate-100 text-slate-700', icon: Circle },
  in_progress: { label: 'En curso', bg: 'bg-amber-100 text-amber-800', icon: Clock },
  completed: { label: 'Completada', bg: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2 },
  cancelled: { label: 'Cancelada', bg: 'bg-rose-100 text-rose-700', icon: XCircle },
};

type Filter = 'all' | 'today' | 'tomorrow';

export default function OwnerTasksPreview() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newProperty, setNewProperty] = useState('');
  const [newTime, setNewTime] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      if (filter === 'today' && t.date !== 'Hoy') return false;
      if (filter === 'tomorrow' && t.date !== 'Mañana') return false;
      if (q) {
        const hay = `${t.property} ${t.address} ${t.cleaner}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [tasks, filter, query]);

  function updateStatus(id: string, status: TaskStatus) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t)),
    );
  }

  function addTask() {
    if (!newProperty.trim() || !newTime.trim()) return;
    setTasks((prev) => [
      ...prev,
      {
        id: `new-${prev.length + 1}`,
        date: 'Hoy',
        time: newTime,
        property: newProperty,
        address: 'London',
        cleaner: 'Sin asignar',
        status: 'pending',
      },
    ]);
    setNewProperty('');
    setNewTime('');
    setShowNew(false);
  }

  const pillCls = (active: boolean) =>
    `h-9 rounded-full px-4 text-xs font-semibold transition ${
      active
        ? 'bg-blue-600 text-white shadow-sm'
        : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
    }`;

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-5">
          <Link
            href="/owner/preview"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Demo · Limpiezas
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Limpiezas
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {tasks.length} tareas programadas, en curso y completadas.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNew((s) => !s)}
            title="Crear una limpieza nueva ahora mismo"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.5)]"
          >
            <Plus className="h-4 w-4" /> Nueva limpieza
          </button>
        </div>

        {showNew ? (
          <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50/40 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Nueva limpieza
              </h3>
              <button
                type="button"
                onClick={() => setShowNew(false)}
                aria-label="Cerrar"
                className="rounded-full p-1 text-slate-500 hover:bg-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                value={newProperty}
                onChange={(e) => setNewProperty(e.target.value)}
                placeholder="Propiedad (ej. Soho Loft)"
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
              />
              <input
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="Hora (ej. 12:30)"
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
              />
            </div>
            <button
              type="button"
              onClick={addTask}
              className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Programar
            </button>
          </div>
        ) : null}

        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por propiedad, cleaner o cliente…"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter('today')}
            title="Mostrar sólo las limpiezas de hoy"
            className={pillCls(filter === 'today')}
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={() => setFilter('tomorrow')}
            title="Mostrar sólo las limpiezas de mañana"
            className={pillCls(filter === 'tomorrow')}
          >
            Mañana
          </button>
          <button
            type="button"
            onClick={() => setFilter('all')}
            title="Mostrar todas las limpiezas"
            className={pillCls(filter === 'all')}
          >
            Todas
          </button>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-slate-500">
            <Info className="h-3 w-3" /> Los filtros se aplican al instante.
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {visible.map((t) => {
            const cfg = statusConfig[t.status];
            const Icon = cfg.icon;
            return (
              <div
                key={t.id}
                className="group relative flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow"
              >
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 ring-1 ring-blue-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                    {t.date}
                  </span>
                  <span className="text-sm font-bold text-blue-900">{t.time}</span>
                </div>
                <Link
                  href={`/owner/preview/tasks/${t.id}`}
                  className="min-w-0 flex-1"
                  title="Abrir detalle de la limpieza"
                >
                  <h3 className="font-semibold text-slate-900">{t.property}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3 w-3" /> {t.address}
                    <span className="mx-1.5 text-slate-300">·</span>
                    {t.cleaner}
                  </p>
                </Link>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${cfg.bg}`}
                >
                  <Icon className="h-3 w-3" /> {cfg.label}
                </span>
                {t.status === 'pending' ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateStatus(t.id, 'in_progress')}
                      title="Aceptar y marcar la tarea como en curso"
                      className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100"
                    >
                      Aceptar
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(t.id, 'cancelled')}
                      title="Rechazar la tarea (se marca como cancelada)"
                      className="rounded-lg bg-rose-50 px-2 py-1 text-[10px] font-semibold text-rose-700 hover:bg-rose-100"
                    >
                      Rechazar
                    </button>
                  </div>
                ) : t.status === 'in_progress' ? (
                  <button
                    type="button"
                    onClick={() => updateStatus(t.id, 'completed')}
                    title="Marcar la limpieza como completada"
                    className="rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    Completar
                  </button>
                ) : null}
                <Link
                  href={`/owner/preview/tasks/${t.id}`}
                  aria-label="Abrir detalle"
                  className="ml-1"
                >
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-slate-500" />
                </Link>
              </div>
            );
          })}
          {visible.length === 0 ? (
            <p className="text-center text-sm text-slate-500">
              Sin tareas que coincidan con el filtro.
            </p>
          ) : null}
        </div>
      </div>

      <DemoBottomTabBar active="tasks" />
    </main>
  );
}
