/**
 * Public preview of the Owner dashboard — clickable tour with mock data.
 * No auth, no Supabase. Every link routes inside /owner/preview/*.
 */
import Link from 'next/link';
import {
  BarChart3,
  Building2,
  ChevronRight,
  ListChecks,
  Users,
} from 'lucide-react';
import { StatCardsRow } from '@/components/owner/StatCardsRow';
import { RevenueChart, type RevenuePoint } from '@/components/owner/RevenueChart';
import { DemoCorporateHeader } from './_components/DemoCorporateHeader';
import { DemoCleanersField, type DemoFieldCheckin } from './_components/DemoCleanersField';
import { DemoBottomTabBar } from './_components/DemoBottomTabBar';
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

const checkins: DemoFieldCheckin[] = [
  {
    taskId: 'demo-1',
    cleanerName: 'Carmen Ruiz',
    propertyName: 'Apto Centro 4B',
    clientName: 'María García',
    relative: 'hace 12 min',
    lat: 40.4168,
    lng: -3.7038,
  },
  {
    taskId: 'demo-3',
    cleanerName: 'Pedro Kovac',
    propertyName: 'Loft Goya',
    clientName: 'Ana Romero',
    relative: 'hace 45 min',
    lat: 40.4239,
    lng: -3.6779,
  },
  {
    taskId: 'demo-2',
    cleanerName: 'Lucía Vega',
    propertyName: 'Casa Sol',
    clientName: 'Direct',
    relative: 'hace 2h',
  },
];

const tiles: Array<{
  href: string;
  label: string;
  hint: string;
  Icon: React.ComponentType<{ className?: string }>;
  accent: string;
}> = [
  {
    href: '/owner/preview/tasks',
    label: 'Limpiezas',
    hint: '4 hoy',
    Icon: ListChecks,
    accent: 'from-blue-600 to-blue-700',
  },
  {
    href: '/owner/preview/properties',
    label: 'Propiedades',
    hint: '6 sitios',
    Icon: Building2,
    accent: 'from-emerald-500 to-emerald-700',
  },
  {
    href: '/owner/preview/cleaners',
    label: 'Cleaners',
    hint: '4 en equipo',
    Icon: Users,
    accent: 'from-amber-500 to-amber-600',
  },
  {
    href: '/owner/preview/clients',
    label: 'Clientes',
    hint: '6 activos',
    Icon: BarChart3,
    accent: 'from-slate-700 to-slate-900',
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
          <StatCardsRow
            cleanersActive={3}
            bookingsWeek={12}
            revenueMonthPence={145000}
            bookingsDelta={{ label: '+20%', positive: true }}
            revenueDelta={{ label: '+12%', positive: true }}
          />

          <RevenueChart data={revenueData} />

          <DemoCleanersField checkins={checkins} />

          <section>
            <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Accesos rápidos
            </p>
            <div className="grid grid-cols-2 gap-3">
              {tiles.map((t) => {
                const Icon = t.Icon;
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow"
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${t.accent} text-white shadow-sm`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {t.label}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-slate-500">
                        {t.hint}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-slate-500" />
                  </Link>
                );
              })}
            </div>
          </section>

          <Link
            href="/owner/preview/analytics"
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
