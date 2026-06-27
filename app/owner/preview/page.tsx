/**
 * Public preview of the Owner dashboard — clickable tour with mock data.
 * No auth, no Supabase. Every link routes inside /owner/preview/*.
 */
import Link from 'next/link';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { DemoStatCardsRow } from './_components/DemoStatCardsRow';
import { RevenueChart, type RevenuePoint } from '@/components/owner/RevenueChart';
import { DemoCorporateHeader } from './_components/DemoCorporateHeader';
import { DemoCleanersField, type DemoFieldCheckin } from './_components/DemoCleanersField';
import { DemoBottomTabBar } from './_components/DemoBottomTabBar';
import { DemoQuickActions } from './_components/DemoQuickActions';
import { DemoPhotoStrip } from '@/components/preview/DemoPhotoStrip';

export const metadata = {
  title: 'Demo · Owner',
  robots: { index: false, follow: false },
};

const revenueData: RevenuePoint[] = [
  { label: 'L', pence: 18000 },
  { label: 'M', pence: 24500 },
  { label: 'X', pence: 19500 },
  { label: 'J', pence: 31000 },
  { label: 'V', pence: 22500 },
  { label: 'S', pence: 12000 },
  { label: 'D', pence: 17500 },
];

// London coordinates roughly matching the property locations.
const checkins: DemoFieldCheckin[] = [
  {
    taskId: 'demo-1',
    cleanerName: 'Carmen Ruiz',
    propertyName: 'Soho Loft',
    clientName: 'María García',
    relative: 'hace 12 min',
    lat: 51.5132,
    lng: -0.1311,
  },
  {
    taskId: 'demo-3',
    cleanerName: 'Pedro Kovac',
    propertyName: 'Notting Hill Flat',
    clientName: 'Ana Romero',
    relative: 'hace 45 min',
    lat: 51.5152,
    lng: -0.2057,
  },
  {
    taskId: 'demo-2',
    cleanerName: 'Lucía Vega',
    propertyName: 'Camden House',
    clientName: 'Direct',
    relative: 'hace 2h',
    lat: 51.5390,
    lng: -0.1426,
  },
];

export default function OwnerPreviewHome() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto max-w-5xl px-3 pt-4 sm:px-4 sm:pt-5 lg:px-8 lg:pt-7">
        <DemoCorporateHeader
          firstName="Alan"
          subtitle="Alan Cleaners · 4 limpiezas hoy"
        />

        <div>
          <DemoStatCardsRow
            cleanersActive={3}
            bookingsWeek={12}
            revenueMonthPence={145000}
            bookingsDelta={{ label: '+20%', positive: true }}
            revenueDelta={{ label: '+12%', positive: true }}
          />

          <div className="mt-6">
            <RevenueChart data={revenueData} />
          </div>

          <div className="mt-4">
            <DemoCleanersField checkins={checkins} />
          </div>

          <div className="mt-8">
            <DemoQuickActions />
          </div>

          <Link
            href="/owner/preview/analytics"
            title="Ver tendencias semanales y KPIs detallados"
            className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-blue-300 hover:bg-blue-50/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
                <BarChart3 className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-slate-900">
                  Ver analítica completa
                </p>
                <p className="mt-0.5 text-[12px] text-slate-600">
                  Tendencias semanales, ingresos y KPIs detallados
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-blue-600" />
          </Link>
        </div>
        <div className="mt-10">
          <DemoPhotoStrip
            title="Limpiezas recientes del equipo"
            caption="Cada cleaner sube fotos al terminar. Tú y tus clientes las ven al instante."
          />
        </div>
      </div>

      <DemoBottomTabBar active="home" />
    </main>
  );
}
