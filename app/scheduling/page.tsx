import Link from 'next/link';
import { ArrowRight, CalendarClock, Sparkles } from 'lucide-react';
import { ZapliNavbar } from '@/components/nav/ZapliNavbar';
import { requireOwner } from '@/lib/auth';

export const metadata = {
  title: 'Scheduling · Zapli',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function SchedulingPage() {
  // Auth-only gate. The real scheduler lives at /owner/calendar today; this
  // page is a friendly bridge until we lift the calendar into the Zapli shell.
  await requireOwner();

  return (
    <div className="min-h-screen bg-slate-50">
      <ZapliNavbar active="scheduling" signedIn />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Scheduling
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Programa y reasigna tareas para tu equipo.
          </p>
        </div>

        <section className="mt-6 overflow-hidden rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-white shadow-sm">
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-white">
                <Sparkles className="h-5 w-5" aria-hidden />
              </span>
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                  Próximamente
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  Scheduler integrado
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Próximamente se integrará el scheduler aquí. Mientras tanto
                  usa el calendario completo →
                </p>
              </div>
            </div>
            <Link
              href="/owner/calendar"
              className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 sm:self-auto"
            >
              <CalendarClock className="h-4 w-4" aria-hidden />
              Ir al calendario
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">
            ¿Qué traerá esta vista?
          </h3>
          <ul className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
              Vista semana con drag-and-drop entre cleaners.
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
              Auto-asignación según disponibilidad y carga.
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
              Sincronización con iCal de Airbnb y Booking.
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
              Notificaciones al cleaner al confirmar el plan.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
