/**
 * Public preview of the Owner dashboard — clickable tour with mock data.
 * No auth, no Supabase. Every link routes inside /owner/preview/*.
 */
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DemoStatCardsRow } from './_components/DemoStatCardsRow';
import { RevenueChart, type RevenuePoint } from '@/components/owner/RevenueChart';
import { DemoCorporateHeader } from './_components/DemoCorporateHeader';
import { DemoCleanersField, type DemoFieldCheckin } from './_components/DemoCleanersField';
import { DemoBottomTabBar } from './_components/DemoBottomTabBar';
import { DemoQuickActions } from './_components/DemoQuickActions';
import { DemoPhotoStrip } from '@/components/preview/DemoPhotoStrip';
import { DemoTodayHero } from './_components/DemoTodayHero';
import { DemoCommandPalette } from './_components/DemoCommandPalette';
import { DemoPullSummary } from './_components/DemoPullSummary';

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
    <main className="ps-paper-grain min-h-screen pb-24 text-[#141414]">
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-10">
        <DemoCorporateHeader
          firstName="Alan"
          subtitle="Alan Cleaners · 4 limpiezas hoy"
        />

        <div className="mb-6 flex justify-end">
          <DemoPullSummary />
        </div>

        <div className="space-y-6 md:space-y-8">
          <DemoStatCardsRow
            cleanersActive={3}
            bookingsWeek={12}
            revenueMonthPence={145000}
            bookingsDelta={{ label: '+20%', positive: true }}
            revenueDelta={{ label: '+12%', positive: true }}
          />

          <div className="ps-set rounded-[12px] border border-[#1414141A] bg-[#E4DACA] p-5 md:p-6">
            <RevenueChart data={revenueData} />
          </div>

          <DemoCleanersField checkins={checkins} />

          <DemoTodayHero />

          <DemoQuickActions />

          <Link
            href="/owner/preview/analytics"
            title="Ver tendencias semanales y KPIs detallados"
            className="ps-set group flex items-center justify-between gap-4 rounded-[12px] border border-[#1414141A] bg-[#E4DACA] p-5 text-[#141414] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5B1F] md:p-6"
            style={{ transitionDuration: '160ms' }}
          >
            <div className="min-w-0">
              <p className="font-mono text-[12px] text-[#54524D]">
                analítica
                <span className="ml-1 inline-block h-[1px] w-6 align-middle bg-[#FF5B1F]" />
              </p>
              <p className="mt-2 font-serif text-[24px] leading-[1.05] tracking-[-0.02em] text-[#141414] md:text-[28px]" style={{ fontFamily: "'Instrument Serif', serif" }}>
                Ver analítica completa
              </p>
              <p className="mt-1 text-[13px] text-[#54524D]">
                Tendencias semanales, ingresos y KPIs detallados.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-[#FF5B1F] transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-10 md:mt-14">
          <DemoPhotoStrip
            title="Limpiezas recientes del equipo"
            caption="Cada cleaner sube fotos al terminar. Tú y tus clientes las ven al instante."
          />
        </div>
      </div>

      <DemoCommandPalette />
      <DemoBottomTabBar active="home" />
    </main>
  );
}
