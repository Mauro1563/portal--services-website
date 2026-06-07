/**
 * Public preview: Owner → Tasks list. Mocked data.
 */
import Link from 'next/link';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  MapPin,
  Plus,
  Search,
  XCircle,
} from 'lucide-react';

export const metadata = {
  title: 'Preview · Owner Tasks',
  robots: { index: false, follow: false },
};

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

const tasks: Task[] = [
  { id: '1', date: 'Hoy', time: '09:00', property: 'Apto Centro 4B', address: 'Calle Mayor 12, Madrid', cleaner: 'Carmen R.', status: 'in_progress' },
  { id: '2', date: 'Hoy', time: '11:30', property: 'Casa Sol', address: 'Av. del Parque 8', cleaner: 'Lucía V.', status: 'completed' },
  { id: '3', date: 'Hoy', time: '14:00', property: 'Loft Goya', address: 'Calle Goya 22', cleaner: 'Pedro K.', status: 'pending' },
  { id: '4', date: 'Hoy', time: '17:00', property: 'Estudio Salamanca', address: 'Velázquez 45', cleaner: 'María R.', status: 'pending' },
  { id: '5', date: 'Mañana', time: '09:00', property: 'Apto Centro 4B', address: 'Calle Mayor 12', cleaner: 'Carmen R.', status: 'pending' },
  { id: '6', date: 'Mañana', time: '13:00', property: 'Casa Sol', address: 'Av. del Parque 8', cleaner: 'Lucía V.', status: 'cancelled' },
];

const statusConfig: Record<TaskStatus, { label: string; bg: string; icon: typeof Circle }> = {
  pending: { label: 'Pendiente', bg: 'bg-slate-100 text-slate-700', icon: Circle },
  in_progress: { label: 'En curso', bg: 'bg-amber-100 text-amber-800', icon: Clock },
  completed: { label: 'Completada', bg: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2 },
  cancelled: { label: 'Cancelada', bg: 'bg-rose-100 text-rose-700', icon: XCircle },
};

export default function OwnerTasksPreview() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-5">
          <Link href="/owner/preview" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> Owner Dashboard
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Preview · Tasks</span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Cleanings</h1>
            <p className="mt-1 text-sm text-slate-500">Tareas programadas, en curso y completadas.</p>
          </div>
          <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.5)]">
            <Plus className="h-4 w-4" /> Nueva limpieza
          </button>
        </div>

        <div className="mt-5 relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por propiedad, cleaner o cliente…"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        <div className="mt-6 space-y-3">
          {tasks.map((t) => {
            const cfg = statusConfig[t.status];
            const Icon = cfg.icon;
            return (
              <article
                key={t.id}
                className="group relative flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow"
              >
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 ring-1 ring-blue-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">{t.date}</span>
                  <span className="text-sm font-bold text-blue-900">{t.time}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900">{t.property}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3 w-3" /> {t.address}
                    <span className="mx-1.5 text-slate-300">·</span>
                    {t.cleaner}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${cfg.bg}`}>
                  <Icon className="h-3 w-3" /> {cfg.label}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-slate-500" />
              </article>
            );
          })}
        </div>

        <Link
          href="/owner/preview/tasks/1"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          Ver detalle de una limpieza <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
