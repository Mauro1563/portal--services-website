/**
 * Public preview of the Owner dashboard — clickable tour with mock data.
 * No auth, no Supabase. Every link routes inside /owner/preview/*.
 */
'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, Sparkles } from 'lucide-react';
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
import { OwnerConciergeSheet } from './_components/OwnerConciergeSheet';
import { PreviewFlavorToggle } from '@/components/preview/PreviewFlavorToggle';
import { useClientLocale, pickCopy } from '@/lib/use-locale-client';

const COPY = {
  en: {
    headerSubtitle: 'Alan Cleaners · 4 cleans today',
    minAgo12: '12 min ago',
    minAgo45: '45 min ago',
    hoursAgo2: '2h ago',
    schedulerTitle: 'Plan the week — assign cleaners to properties',
    schedulerLabel: 'Plan the week',
    schedulerHint: 'Assign cleaners to properties. Your team and your clients see it instantly.',
    analyticsTitle: 'See weekly trends and detailed KPIs',
    analyticsLabel: 'See full analytics',
    analyticsHint: 'Weekly trends, revenue and detailed KPIs',
    photoTitle: 'Recent team cleans',
    photoCaption: 'Every cleaner uploads photos when they finish. You and your clients see them instantly.',
  },
  es: {
    headerSubtitle: 'Alan Cleaners · 4 limpiezas hoy',
    minAgo12: 'hace 12 min',
    minAgo45: 'hace 45 min',
    hoursAgo2: 'hace 2h',
    schedulerTitle: 'Programa la semana — asigna cleaners a propiedades',
    schedulerLabel: 'Programar semana',
    schedulerHint: 'Asigna cleaners a propiedades. Tu equipo y tus clientes lo ven al instante.',
    analyticsTitle: 'Ver tendencias semanales y KPIs detallados',
    analyticsLabel: 'Ver analítica completa',
    analyticsHint: 'Tendencias semanales, ingresos y KPIs detallados',
    photoTitle: 'Limpiezas recientes del equipo',
    photoCaption: 'Cada cleaner sube fotos al terminar. Tú y tus clientes las ven al instante.',
  },
  pt: {
    headerSubtitle: 'Alan Cleaners · 4 limpezas hoje',
    minAgo12: 'há 12 min',
    minAgo45: 'há 45 min',
    hoursAgo2: 'há 2h',
    schedulerTitle: 'Programa a semana — atribui cleaners a propriedades',
    schedulerLabel: 'Programar semana',
    schedulerHint: 'Atribui cleaners a propriedades. A tua equipa e os teus clientes vêem ao instante.',
    analyticsTitle: 'Vê tendências semanais e KPIs detalhados',
    analyticsLabel: 'Ver análise completa',
    analyticsHint: 'Tendências semanais, receitas e KPIs detalhados',
    photoTitle: 'Limpezas recentes da equipa',
    photoCaption: 'Cada cleaner envia fotos ao terminar. Tu e os teus clientes vêem ao instante.',
  },
} as const;

const revenueData: RevenuePoint[] = [
  { label: 'L', pence: 18000 },
  { label: 'M', pence: 24500 },
  { label: 'X', pence: 19500 },
  { label: 'J', pence: 31000 },
  { label: 'V', pence: 22500 },
  { label: 'S', pence: 12000 },
  { label: 'D', pence: 17500 },
];

export default function OwnerPreviewHome() {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);

  // London coordinates roughly matching the property locations.
  const checkins: DemoFieldCheckin[] = [
    {
      taskId: 'demo-1',
      cleanerName: 'Carmen Ruiz',
      propertyName: 'Soho Loft',
      clientName: 'María García',
      relative: t.minAgo12,
      lat: 51.5132,
      lng: -0.1311,
    },
    {
      taskId: 'demo-3',
      cleanerName: 'Pedro Kovac',
      propertyName: 'Notting Hill Flat',
      clientName: 'Ana Romero',
      relative: t.minAgo45,
      lat: 51.5152,
      lng: -0.2057,
    },
    {
      taskId: 'demo-2',
      cleanerName: 'Lucía Vega',
      propertyName: 'Camden House',
      clientName: 'Direct',
      relative: t.hoursAgo2,
      lat: 51.5390,
      lng: -0.1426,
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 pb-20">
      <PreviewFlavorToggle
        active="hogar"
        hogarHref="/owner/preview"
        airbnbHref="/owner/preview-airbnb"
      />
      {/* Ambient depth: cyan/blue blob top-right — sits behind content. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 z-0 h-[420px] w-[420px] rounded-full bg-[#00D8C7]/15 blur-3xl"
      />
      <div className="relative z-10 mx-auto max-w-5xl px-3 pt-4 sm:px-4 sm:pt-5 lg:px-8 lg:pt-7">
        <DemoCorporateHeader
          firstName="Alan"
          subtitle={t.headerSubtitle}
        />

        <div className="mb-4 flex justify-end">
          <DemoPullSummary />
        </div>

        <div>
          {/* Soft radial highlight above the stat row */}
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-4 h-24 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.05),_transparent_60%)]"
            />
            <DemoStatCardsRow
              cleanersActive={3}
              bookingsWeek={12}
              revenueMonthPence={145000}
              bookingsDelta={{ label: '+20%', positive: true }}
              revenueDelta={{ label: '+12%', positive: true }}
            />
          </div>

          <div className="mt-6">
            <RevenueChart data={revenueData} />
          </div>

          <div className="mt-4">
            <DemoCleanersField checkins={checkins} />
          </div>

          {/* Featured element: today-hero wrapped with a hairline gradient border */}
          <div className="mt-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 p-[1px]">
            <div className="rounded-2xl bg-slate-50">
              <DemoTodayHero />
            </div>
          </div>

          <Link
            href="/owner/preview/scheduler"
            title={t.schedulerTitle}
            className="group mt-4 flex items-center justify-between gap-3 rounded-2xl bg-[#0A0D18] p-4 text-white shadow-[0_1px_2px_rgba(15,23,42,0.04),_0_8px_24px_-8px_rgba(10,13,24,0.45)] transition duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D8C7]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#00D8C7] text-[#0A0D18] shadow-sm">
                <Sparkles className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-white">
                  {t.schedulerLabel}
                </p>
                <p className="mt-0.5 text-[12px] text-white/70">
                  {t.schedulerHint}
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-[#00D8C7] transition group-hover:translate-x-0.5" />
          </Link>

          <div className="mt-8">
            <DemoQuickActions />
          </div>

          <Link
            href="/owner/preview/analytics"
            title={t.analyticsTitle}
            className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04),_0_4px_12px_-2px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
                <BarChart3 className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-slate-900">
                  {t.analyticsLabel}
                </p>
                <p className="mt-0.5 text-[12px] text-slate-600">
                  {t.analyticsHint}
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-blue-600" />
          </Link>
        </div>
        <div className="mt-10">
          <DemoPhotoStrip
            title={t.photoTitle}
            caption={t.photoCaption}
          />
        </div>
      </div>

      <DemoCommandPalette />
      <OwnerConciergeSheet />
      <DemoBottomTabBar active="home" />
    </main>
  );
}
