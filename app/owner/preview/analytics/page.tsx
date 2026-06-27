/**
 * Public preview: Owner → Analytics. Mocked data + bigger RevenueChart.
 * Interactive: clickable KPI cards, 7d/30d/90d range selector, period dropdown.
 */
'use client';

import { useMemo, useState } from 'react';
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

type Range = '7d' | '30d' | '90d';
type Period = 'week' | 'month' | 'quarter';

const REVENUE_BY_RANGE: Record<Range, RevenuePoint[]> = {
  '7d': [
    { label: 'L', pence: 18000 },
    { label: 'M', pence: 24500 },
    { label: 'X', pence: 19500 },
    { label: 'J', pence: 31000 },
    { label: 'V', pence: 22500 },
    { label: 'S', pence: 12000 },
    { label: 'D', pence: 17500 },
  ],
  '30d': [
    { label: 'S1', pence: 128000 },
    { label: 'S2', pence: 145000 },
    { label: 'S3', pence: 162000 },
    { label: 'S4', pence: 158000 },
  ],
  '90d': [
    { label: 'Abr', pence: 540000 },
    { label: 'May', pence: 612000 },
    { label: 'Jun', pence: 705000 },
  ],
};

type Kpi = {
  key: string;
  label: string;
  byPeriod: Record<Period, { value: string; hint: string; delta: { label: string; positive: boolean } }>;
  Icon: React.ComponentType<{ className?: string }>;
  accent: string;
  ring: string;
  href: string;
  title: string;
};

const KPIS: Kpi[] = [
  {
    key: 'revenue',
    label: 'Revenue',
    byPeriod: {
      week: { value: '£1,450', hint: 'objetivo £1,800', delta: { label: '+12%', positive: true } },
      month: { value: '£5,930', hint: 'objetivo £7,000', delta: { label: '+9%', positive: true } },
      quarter: { value: '£18,570', hint: 'objetivo £21,000', delta: { label: '+15%', positive: true } },
    },
    Icon: PoundSterling,
    accent: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
    ring: 'ring-emerald-100',
    href: '/owner/preview/tasks',
    title: 'Ver las limpiezas que generan este revenue',
  },
  {
    key: 'tasks',
    label: 'Nuevas tareas',
    byPeriod: {
      week: { value: '12', hint: 'esta semana', delta: { label: '+20%', positive: true } },
      month: { value: '48', hint: 'este mes', delta: { label: '+8%', positive: true } },
      quarter: { value: '142', hint: 'este trimestre', delta: { label: '+22%', positive: true } },
    },
    Icon: CalendarPlus,
    accent: 'bg-gradient-to-br from-amber-400 to-amber-600',
    ring: 'ring-amber-100',
    href: '/owner/preview/tasks',
    title: 'Ir al listado completo de tareas',
  },
  {
    key: 'cleaners',
    label: 'Cleaners',
    byPeriod: {
      week: { value: '4', hint: '3 activos hoy', delta: { label: '+1', positive: true } },
      month: { value: '4', hint: '4 activos este mes', delta: { label: '+1', positive: true } },
      quarter: { value: '5', hint: '+1 contratación', delta: { label: '+2', positive: true } },
    },
    Icon: Users,
    accent: 'bg-gradient-to-br from-blue-600 to-blue-700',
    ring: 'ring-blue-100',
    href: '/owner/preview/cleaners',
    title: 'Gestionar el equipo de cleaners',
  },
  {
    key: 'properties',
    label: 'Propiedades',
    byPeriod: {
      week: { value: '6', hint: 'bajo gestión', delta: { label: '+2', positive: true } },
      month: { value: '6', hint: 'bajo gestión', delta: { label: '+2', positive: true } },
      quarter: { value: '7', hint: '+1 alta', delta: { label: '+3', positive: true } },
    },
    Icon: Building2,
    accent: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    ring: 'ring-cyan-100',
    href: '/owner/preview/properties',
    title: 'Abrir el listado de propiedades',
  },
  {
    key: 'rating',
    label: 'Rating medio',
    byPeriod: {
      week: { value: '4.85', hint: '18 reviews esta semana', delta: { label: '+0.1', positive: true } },
      month: { value: '4.83', hint: '72 reviews este mes', delta: { label: '+0.05', positive: true } },
      quarter: { value: '4.80', hint: '210 reviews', delta: { label: '-0.02', positive: false } },
    },
    Icon: Star,
    accent: 'bg-gradient-to-br from-amber-400 to-orange-500',
    ring: 'ring-amber-100',
    href: '/owner/preview/clients',
    title: 'Ver clientes y reviews por cliente',
  },
  {
    key: 'margin',
    label: 'Margen',
    byPeriod: {
      week: { value: '38%', hint: 'after-cost', delta: { label: '-2%', positive: false } },
      month: { value: '41%', hint: 'after-cost', delta: { label: '+3%', positive: true } },
      quarter: { value: '40%', hint: 'after-cost', delta: { label: '+1%', positive: true } },
    },
    Icon: TrendingUp,
    accent: 'bg-gradient-to-br from-slate-700 to-slate-900',
    ring: 'ring-slate-200',
    href: '/owner/preview/tasks',
    title: 'Revisar costes por tarea',
  },
];

export default function OwnerAnalyticsPreview() {
  const [range, setRange] = useState<Range>('7d');
  const [period, setPeriod] = useState<Period>('week');

  const revenueData = REVENUE_BY_RANGE[range];

  const periodLabel = useMemo(() => {
    switch (period) {
      case 'week':
        return 'Esta semana';
      case 'month':
        return 'Este mes';
      case 'quarter':
        return 'Trimestre';
    }
  }, [period]);

  const rangePill = (active: boolean) =>
    `h-8 rounded-full px-3 text-[11px] font-semibold transition ${
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
            Demo · Analytics
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Analytics
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              KPIs de operación y tendencia de revenue · {periodLabel}.
            </p>
          </div>
          <label className="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-600">
            Periodo
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as Period)}
              title="Cambia el periodo para actualizar los KPI"
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700"
            >
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="quarter">Trimestre</option>
            </select>
          </label>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {KPIS.map((k) => {
            const Icon = k.Icon;
            const p = k.byPeriod[period];
            return (
              <Link
                key={k.key}
                href={k.href}
                title={k.title}
                className="group flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow"
              >
                <div className="flex items-start justify-between gap-1">
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${k.accent} text-white shadow-sm ring-4 ${k.ring}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      p.delta.positive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    <TrendingUp
                      className={`h-2.5 w-2.5 ${p.delta.positive ? '' : 'rotate-180'}`}
                    />
                    {p.delta.label}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    {k.label}
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold tabular-nums leading-none text-slate-900 group-hover:text-blue-700">
                    {p.value}
                  </p>
                  <p className="mt-1 text-[10.5px] text-slate-500">{p.hint}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Rango:
          </span>
          {(['7d', '30d', '90d'] as Range[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              title={
                r === '7d'
                  ? 'Ver revenue de los últimos 7 días'
                  : r === '30d'
                  ? 'Ver revenue de los últimos 30 días por semana'
                  : 'Ver revenue de los últimos 90 días por mes'
              }
              className={rangePill(range === r)}
            >
              {r === '7d' ? '7 días' : r === '30d' ? '30 días' : '90 días'}
            </button>
          ))}
        </div>

        <div className="mt-3">
          <RevenueChart data={revenueData} />
        </div>
      </div>

      <DemoBottomTabBar active="more" />
    </main>
  );
}
