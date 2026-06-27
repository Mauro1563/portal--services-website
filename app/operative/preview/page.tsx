/**
 * Public, no-auth preview of the Cleaner (Operative) home page.
 * Mirrors /operative visually using mock data. Linked from /hq/vistas.
 */
import Link from 'next/link';
import { MapPin, Navigation2 } from 'lucide-react';
import { AgendaHeader } from '@/components/operative/AgendaHeader';
import { AgendaTimeline, type AgendaTask } from '@/components/operative/AgendaTimeline';
import { EarningsStrip } from '@/components/operative/EarningsStrip';
import { BottomTabBar } from '@/components/operative/BottomTabBar';
import { DemoPhotoStrip } from '@/components/preview/DemoPhotoStrip';

export const metadata = {
  title: 'Demo · Cleaner',
  robots: { index: false, follow: false },
};

const MOCK_TASKS: AgendaTask[] = [
  {
    id: 'demo-1',
    start_time: '10:00:00',
    status: 'completed',
    estimated_duration_min: 90,
    property: { name: 'Apto 2A', address: '12 Carrer del Sol' },
    client: {
      name: 'Sr. Rodríguez',
      address: '12 Carrer del Sol',
      postcode: 'BCN 08001',
    },
  },
  {
    id: 'demo-2',
    start_time: '12:30:00',
    status: 'in_progress',
    estimated_duration_min: 60,
    property: { name: 'Estudio Loft', address: '5 Av. Diagonal' },
    client: {
      name: 'Sra. Martín',
      address: '5 Av. Diagonal',
      postcode: 'BCN 08015',
    },
  },
  {
    id: 'demo-3',
    start_time: '14:30:00',
    status: 'scheduled',
    estimated_duration_min: 120,
    property: { name: 'Casa Gómez', address: '47 Passeig de Gràcia' },
    client: {
      name: 'Mrs. Gómez',
      address: '47 Passeig de Gràcia',
      postcode: 'BCN 08008',
    },
  },
];

export default function OperativePreviewHome() {
  const now = new Date();

  return (
    <main className="min-h-screen bg-canvas pb-24">
      <div className="mx-auto max-w-md px-4 py-5">
        <AgendaHeader
          cleanerName="Carmen López"
          now={now}
          doneCount={2}
          totalCount={3}
        />

        <EarningsStrip todayPence={4000} weekPence={28000} />

        {/* Hero card — siguiente parada */}
        <section className="mt-5 rounded-2xl border border-brand-600/30 bg-gradient-to-br from-white via-brand-50/40 to-cyan-50/40 p-4 shadow-card">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-700">
              Siguiente parada
            </p>
            <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold tabular-nums text-white">
              14:30
            </span>
          </div>
          <h2 className="mt-2 font-display text-lg font-semibold text-text-1">
            Mrs. Gómez
          </h2>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-text-2">
            <MapPin className="h-3.5 w-3.5 text-brand-600" />
            47 Passeig de Gràcia · BCN 08008
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <a
              href="https://maps.google.com/?q=47+Passeig+de+Gracia+Barcelona"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-3 py-2.5 text-[12px] font-bold text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.5)]"
            >
              <Navigation2 className="h-3.5 w-3.5" /> Ir
            </a>
            <a
              href="tel:+34600000000"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-surface-2 bg-surface-0 px-3 py-2.5 text-[12px] font-bold text-text-1"
            >
              Llamar
            </a>
          </div>
        </section>

        {/* Agenda timeline */}
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
              Agenda de hoy
            </h2>
            <Link
              href="/operative/preview/week"
              className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-brand-700 hover:text-brand-800"
            >
              <Navigation2 className="h-3 w-3" /> Ver semana
            </Link>
          </div>
          <AgendaTimeline tasks={MOCK_TASKS} />
        </section>

        <DemoPhotoStrip
          title="Tus últimas limpiezas"
          caption="Las fotos que subes después de cada servicio quedan guardadas — y el cliente las ve."
        />
      </div>

      <BottomTabBar active="agenda" />
    </main>
  );
}
