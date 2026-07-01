/**
 * PSDHomeSection — Portal Services: Home.
 *
 * Residential cleaning + Airbnb Turnover Loop. Accent teal-cold #0EA5A4
 * (within the blue family). Screenshot placeholder is a dark navy tile
 * so the section reads consistently with the Workforce card even though
 * the surface bg is light.
 */

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import {
  ArrowRight,
  Calendar,
  Users2,
  Building2,
  RefreshCw,
} from 'lucide-react';
import { HOME_DEMOS } from '@/lib/marketing-config';
import { getLocale } from '@/lib/i18n';

const PILLAR_ICONS = [Calendar, Users2, Building2, RefreshCw];

export default async function PSDHomeSection() {
  const t = await getTranslations('psd.landing.home');
  const locale = await getLocale();

  const pillars = ['schedule', 'teams', 'properties', 'turnover'] as const;

  return (
    <section
      id="home-solution"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-28"
      aria-labelledby="psd-home-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#0EA5A4]/8 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#0EA5A4]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#0EA5A4] ring-1 ring-inset ring-[#0EA5A4]/20">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#0EA5A4]" />
            {t('eyebrow')}
          </span>
          <h2
            id="psd-home-heading"
            className="font-display mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            {t('title')}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            {t('body')}
          </p>
        </div>

        {/* Pillars grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((key, i) => {
            const Icon = PILLAR_ICONS[i]!;
            return (
              <div
                key={key}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#0EA5A4]/40 hover:shadow-md"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#0EA5A4]/10 text-[#0EA5A4]">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="mt-4 font-semibold text-slate-900">
                  {t(`pillars.${key}.title`)}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {t(`pillars.${key}.body`)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Turnover Loop visualization */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#0EA5A4]">
              {t('loopEyebrow')}
            </p>
            <h3 className="font-display mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
              {t('loopTitle')}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {t('loopBody')}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
            {(['step1', 'step2', 'step3', 'step4'] as const).map(
              (stepKey, i, arr) => (
                <div key={stepKey} className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#0EA5A4]/30 bg-[#0EA5A4]/5 px-3 py-1.5 text-xs font-semibold text-slate-800">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[#0EA5A4] text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                    {t(`loopSteps.${stepKey}`)}
                  </div>
                  {i < arr.length - 1 ? (
                    <ArrowRight
                      className="h-4 w-4 text-slate-400"
                      aria-hidden
                    />
                  ) : null}
                </div>
              ),
            )}
          </div>
        </div>

        {/* Screenshot placeholder + CTAs */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-[#0B2A6B] to-[#103A8C] p-6 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#5EEAD4]">
                {t('ctaEyebrow')}
              </p>
              <h3 className="font-display mt-3 text-2xl font-bold text-white sm:text-3xl">
                {t('ctaTitle')}
              </h3>
              <p className="mt-3 max-w-xl text-white/70">{t('ctaBody')}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={HOME_DEMOS[0]?.href ?? '/owner/preview'}
                className="inline-flex items-center gap-2 rounded-full bg-[#0EA5A4] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
              >
                {t('ctaPrimary')}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={HOME_DEMOS.find((d) => d.key === 'airbnb-owner')?.href ?? '/owner/preview-airbnb'}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                {t('ctaSecondary')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
