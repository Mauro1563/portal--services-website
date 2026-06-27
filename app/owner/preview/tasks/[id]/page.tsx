/**
 * Public preview: Owner → Task detail. Mocked data, id-based lookup.
 */
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Camera,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  Star,
} from 'lucide-react';
import { DemoBottomTabBar } from '../../_components/DemoBottomTabBar';

export const metadata = {
  title: 'Demo · Owner',
  robots: { index: false, follow: false },
};

type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

type TaskDetail = {
  id: string;
  property: string;
  address: string;
  beds: number;
  baths: number;
  area: number;
  cleaner: string;
  cleanerInitials: string;
  cleanerPin: string;
  client: string;
  clientInitials: string;
  rating: string;
  cleaningsPerMonth: number;
  date: string;
  time: string;
  status: TaskStatus;
  notes: string;
};

const STATUS: Record<TaskStatus, { label: string; cls: string; icon: typeof Clock }> = {
  pending: { label: 'Pendiente', cls: 'bg-slate-100 text-slate-700', icon: Clock },
  in_progress: { label: 'En curso', cls: 'bg-amber-100 text-amber-800', icon: Clock },
  completed: { label: 'Completada', cls: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2 },
  cancelled: { label: 'Cancelada', cls: 'bg-rose-100 text-rose-700', icon: Clock },
};

const DETAILS: Record<string, TaskDetail> = {
  'demo-1': {
    id: 'demo-1', property: 'Apto Centro 4B', address: 'Calle Mayor 12, Madrid', beds: 2, baths: 2, area: 65,
    cleaner: 'Carmen Ruiz', cleanerInitials: 'CR', cleanerPin: '026389',
    client: 'María García', clientInitials: 'MG', rating: '4.9', cleaningsPerMonth: 3,
    date: 'Hoy', time: '09:00 – 11:00', status: 'in_progress',
    notes: 'Cocina, salón y 2 baños completados. Reposición de toallas hecha. El detergente del baño se está acabando — comprar antes del lunes.',
  },
  'demo-2': {
    id: 'demo-2', property: 'Casa Sol', address: 'Av. del Parque 8, Madrid', beds: 4, baths: 3, area: 180,
    cleaner: 'Lucía Vega', cleanerInitials: 'LV', cleanerPin: '041572',
    client: 'Direct booking', clientInitials: 'DB', rating: '5.0', cleaningsPerMonth: 4,
    date: 'Hoy', time: '11:30 – 14:00', status: 'completed',
    notes: 'Limpieza completa con cambio de sábanas en 4 habitaciones. Terraza barrida y muebles repuestos.',
  },
  'demo-3': {
    id: 'demo-3', property: 'Loft Goya', address: 'Calle Goya 22, Madrid', beds: 1, baths: 1, area: 45,
    cleaner: 'Pedro Kovac', cleanerInitials: 'PK', cleanerPin: '093821',
    client: 'Ana Romero', clientInitials: 'AR', rating: '4.7', cleaningsPerMonth: 2,
    date: 'Hoy', time: '14:00 – 15:30', status: 'pending',
    notes: 'Programada para esta tarde. Llaves en cerradura inteligente, código 4712.',
  },
  'demo-4': {
    id: 'demo-4', property: 'Estudio Salamanca', address: 'Velázquez 45, Madrid', beds: 0, baths: 1, area: 32,
    cleaner: 'María Reyes', cleanerInitials: 'MR', cleanerPin: '058914',
    client: 'Direct booking', clientInitials: 'DB', rating: '4.8', cleaningsPerMonth: 5,
    date: 'Hoy', time: '17:00 – 18:00', status: 'pending',
    notes: 'Turn-around rápido entre huéspedes. Reposición standard.',
  },
};

function fallback(id: string): TaskDetail {
  return {
    id,
    property: 'Limpieza programada',
    address: 'Madrid',
    beds: 2, baths: 1, area: 60,
    cleaner: 'Carmen Ruiz', cleanerInitials: 'CR', cleanerPin: '000000',
    client: 'Cliente demo', clientInitials: 'CD', rating: '4.8', cleaningsPerMonth: 2,
    date: 'Próx.', time: '10:00 – 12:00', status: 'pending',
    notes: 'Tarea de demostración.',
  };
}

export default async function OwnerTaskDetailPreview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = DETAILS[id] ?? fallback(id);
  const st = STATUS[t.status];
  const StIcon = st.icon;

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-4 px-5">
          <Link
            href="/owner/preview/tasks"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" /> Volver
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Demo · {t.id}
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${st.cls}`}
            >
              <StIcon className="h-3 w-3" /> {st.label}
            </span>
            <h1 className="mt-3 text-2xl font-semibold text-slate-900">{t.property}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5" /> {t.address} · {t.date} {t.time}
            </p>
          </div>
          <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Editar
          </button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
          <section className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="aspect-[16/10] bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-100">
                <div className="flex h-full items-center justify-center text-slate-500">
                  <Camera className="h-8 w-8" />
                  <span className="ml-2 text-sm">Foto del trabajo</span>
                </div>
              </div>
              <div className="border-t border-slate-100 p-4">
                <h3 className="text-sm font-semibold text-slate-700">Notas del cleaner</h3>
                <p className="mt-1 text-sm text-slate-600">{t.notes}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {['inicio', 'progreso', 'final'].map((k, i) => (
                <div
                  key={k}
                  className="aspect-square rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 ring-1 ring-slate-200 flex flex-col items-center justify-center text-slate-500"
                >
                  <Camera className="h-5 w-5" />
                  <span className="mt-1 text-[10px] uppercase tracking-wider">
                    Foto {i + 1}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700">Check-in</h3>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>09:02 · GPS confirmado en la propiedad</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>09:15 · Foto inicial subida</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                  <span>Foto final pendiente</span>
                </li>
              </ul>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Cleaner
              </h3>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-white">
                  {t.cleanerInitials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.cleaner}</p>
                  <p className="text-xs text-slate-500">PIN {t.cleanerPin}</p>
                </div>
              </div>
              <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                <MessageSquare className="h-3.5 w-3.5" /> Enviar mensaje
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Cliente
              </h3>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold text-white">
                  {t.clientInitials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.client}</p>
                  <p className="text-xs text-slate-500">
                    {t.cleaningsPerMonth} limpiezas/mes
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-amber-400">
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="ml-1 text-xs text-slate-600">{t.rating} avg</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Propiedad
              </h3>
              <div className="mt-3 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-600">
                  <Building2 className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.property}</p>
                  <p className="text-xs text-slate-500">
                    {t.beds} dorm · {t.baths} baños · {t.area}m²
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <DemoBottomTabBar active="tasks" />
    </main>
  );
}
