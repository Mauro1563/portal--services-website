/**
 * PSDComparisonSection — "¿Cuál es para ti?" side-by-side comparison.
 *
 * Table-style layout with two columns: Workforce (blue #2563EB accent)
 * and Home (green #10B981 accent). Rows compare who it's for, key
 * capability, deployment size, integrations and price entry.
 */

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Users, Home, Check } from 'lucide-react';

export default async function PSDComparisonSection() {
  const t = await getTranslations('psd.landing.comparison');

  const rows = ['audience', 'core', 'size', 'integrations', 'price'] as const;

  return (
    <section
      id="which"
      className="relative bg-white py-20 sm:py-28"
      aria-labelledby="psd-comparison-heading"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-700 ring-1 ring-inset ring-slate-200">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
            {t('eyebrow')}
          </span>
          <h2
            id="psd-comparison-heading"
            className="font-display mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-slate-600">{t('subtitle')}</p>
        </div>

        {/* Comparison table */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Row header column (labels) — collapses to inline labels on mobile */}
            <div className="hidden border-r border-slate-200 bg-slate-50 md:block" />
            {/* Workforce column header */}
            <div className="border-b border-slate-200 bg-white p-6 text-center md:border-b-0">
              <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-[#2563EB]/10 text-[#2563EB]">
                <Users className="h-5 w-5" aria-hidden />
              </div>
              <p className="mt-3 font-display text-lg font-bold text-slate-900">
                Portal Services: Workforce
              </p>
            </div>
            {/* Home column header */}
            <div className="border-b border-slate-200 bg-slate-50 p-6 text-center md:border-b-0 md:border-l md:border-slate-200">
              <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-[#10B981]/10 text-[#10B981]">
                <Home className="h-5 w-5" aria-hidden />
              </div>
              <p className="mt-3 font-display text-lg font-bold text-slate-900">
                Portal Services: Home
              </p>
            </div>

            {rows.map((row) => (
              <>
                <div
                  key={`${row}-label`}
                  className="border-t border-slate-200 bg-slate-50 p-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 md:p-5"
                >
                  {t(`rows.${row}.label`)}
                </div>
                <div
                  key={`${row}-wf`}
                  className="border-t border-slate-200 p-4 text-sm text-slate-800 md:p-5"
                >
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#2563EB] md:hidden">
                    Workforce
                  </span>
                  {t(`rows.${row}.workforce`)}
                </div>
                <div
                  key={`${row}-home`}
                  className="border-t border-slate-200 bg-slate-50/40 p-4 text-sm text-slate-800 md:border-l md:border-slate-200 md:p-5"
                >
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#10B981] md:hidden">
                    Home
                  </span>
                  {t(`rows.${row}.home`)}
                </div>
              </>
            ))}
          </div>
        </div>

        {/* Both include */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
            {t('bothLabel')}
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {(['multiLang', 'realtime', 'pwa', 'security'] as const).map((k) => (
              <li key={k} className="flex items-start gap-2 text-sm text-slate-800">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" aria-hidden />
                <span>{t(`both.${k}`)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs — one per solution */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="#soluciones"
            className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
          >
            {t('ctaWorkforce')}
          </Link>
          <Link
            href="#home-solution"
            className="inline-flex items-center gap-2 rounded-full bg-[#10B981] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#059669]"
          >
            {t('ctaHome')}
          </Link>
        </div>
      </div>
    </section>
  );
}
