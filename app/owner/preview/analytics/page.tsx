/**
 * Public preview: Owner → Analytics. Mocked data + bigger RevenueChart.
 */
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  CalendarPlus,
  PoundSterling,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { RevenueChart, type RevenuePoint } from '@/components/owner/RevenueChart';
import { DemoBottomTabBar } from '../_components/DemoBottomTabBar';

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

type Kpi = {
  label: string;
  value: string;
  hint: string;
  delta: { label: string; positive: boolean };
  Icon: React.ComponentType<{ className?: string }>;
  accent: string;
  ring: string;
};

const kpis: Kpi[] = [
  {
    label: 'Revenue mes',
    value: '£1,450',
    hint: 'objetivo £1,800',
    delta: { label: '+12%', positive: true },
    Icon: PoundSterling,
    accent: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
    ring: 'ring-emerald-100',
  },
  {
    label: 'Nuevas tareas',
    value: '12',
    hint: 'esta semana',
    delta: { label: '+20%', positive: true },
    Icon: CalendarPlus,
    accent: 'bg-gradient-to-br from-amber-400 to-amber-600',
    ring: 'ring-amber-100',
  },
  {
    label: 'Cleaners',
    value: '4',
    hint: '3 activos hoy',
    delta: { label: '+1', positive: true },
    Icon: Users,
    accent: 'bg-gradient-to-br from-blue-600 to-blue-700',
    ring: 'ring-blue-100',
  },
  {
    label: 'Propiedades',
    value: '6',
    hint: 'bajo gestión',
    delta: { label: '+2', positive: true },
    Icon: Building2,
    accent: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    ring: 'ring-cyan-100',
  },
  {
    label: 'Rating medio',
    value: '4.85',
    hint: '18 reviews este mes',
    delta: { label: '+0.1', positive: true },
    Icon: Star,
    accent: 'bg-gradient-to-br from-amber-400 to-orange-500',
    ring: 'ring-amber-100',
  },
  {
    label: 'Margen',
    value: '38%',
    hint: 'after-cost',
    delta: { label: '-2%', positive: false },
    Icon: TrendingUp,
    accent: 'bg-gradient-to-br from-slate-700 to-slate-900',
    ring: 'ring-slate-200',
  },
];

export default function OwnerAnalyticsPreview() {
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
            Demo · Analytics
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            KPIs de operación y tendencia de revenue.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {kpis.map((k) => {
            const Icon = k.Icon;
            return (
              <div
                key={k.label}
                className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
              >
                <div className="flex items-start justify-between gap-1">
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${k.accent} text-white shadow-sm ring-4 ${k.ring}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      k.delta.positive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    <TrendingUp
                      className={`h-2.5 w-2.5 ${k.delta.positive ? '' : 'rotate-180'}`}
                    />
                    {k.delta.label}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    {k.label}
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold tabular-nums leading-none text-slate-900">
                    {k.value}
                  </p>
                  <p className="mt-1 text-[10.5px] text-slate-500">{k.hint}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <RevenueChart data={revenueData} />
        </div>
      </div>

      <DemoBottomTabBar active="more" />
    </main>
  );
}
