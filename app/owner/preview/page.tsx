/**
 * Public preview of the Owner dashboard — clickable tour with mock data.
 * No auth, no Supabase. Every link routes inside /owner/preview/*.
 */
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
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

        <div className="space-y-5">
          <DemoStatCardsRow
            cleanersActive={3}
            bookingsWeek={12}
            revenueMonthPence={145000}
            bookingsDelta={{ label: '+20%', positive: true }}
            revenueDelta={{ label: '+12%', positive: true }}
          />

          <RevenueChart data={revenueData} />

          <DemoCleanersField checkins={checkins} />

          <DemoQuickActions />

          <Link
            href="/owner/preview/analytics"
            title="Ver tendencias semanales y KPIs detallados"
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 p-4 text-white shadow-sm hover:from-slate-800"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                Analytics
              </p>
              <p className="mt-1 text-sm font-semibold">
                Tendencias semanales y KPIs
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-white/70" />
          </Link>
        </div>
        <DemoPhotoStrip
          title="Limpiezas recientes del equipo"
          caption="Cada cleaner sube fotos al terminar. Tú y tus clientes las ven al instante."
        />
      </div>

      <DemoBottomTabBar active="home" />
    </main>
  );
}
