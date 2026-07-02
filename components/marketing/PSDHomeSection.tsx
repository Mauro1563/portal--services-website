/**
 * PSDHomeSection — Portal Services: Home.
 *
 * The "Home green" companion to the Workforce section. Same rhythm
 * (light section with a subtle green-tinted gradient, richer card
 * hover states, deep gradient CTA) so the two solutions read as
 * mirrored halves of the same product family. Turnover Loop is a
 * connected chain of numbered chips linked by arrows.
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
import { getLocale } from 'next-intl/server';

const PILLAR_ICONS = [Calendar, Users2, Building2, RefreshCw];

export default async function PSDHomeSection() {
  const t = await getTranslations('psd.landing.home');
  const locale = (await getLocale()) as import('@/lib/i18n').Locale;

  const pillars = ['schedule', 'teams', 'properties', 'turnover'] as const;

  return (
    <section
      id="home-solution"
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#F0FDF4] to-white py-24 sm:py-32"
      aria-labelledby="psd-home-heading"
    >
      {/* Ambient green accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 h-[26rem] w-[26rem] rounded-full bg-[#10B981]/14 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 -right-24 h-64 w-64 rounded-full bg-[#10B981]/8 blur-3xl"
      />
      {/* Fine grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#10B981 1px, transparent 1px), linear-gradient(90deg, #10B981 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/30 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#059669] shadow-sm backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10B981]" />
            </span>
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

        {/* Pillars — richer cards with hover glow */}
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((key, i) => {
            const Icon = PILLAR_ICONS[i]!;
            return (
              <div
                key={key}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#10B981]/40 hover:shadow-[0_24px_60px_-30px_rgba(16,185,129,0.4)]"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#10B981]/0 blur-2xl transition duration-500 group-hover:bg-[#10B981]/15"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#10B981] to-[#34D399] transition-transform duration-500 group-hover:scale-x-100"
                />

                <span
                  className="relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] text-[#10B981] transition duration-500 group-hover:scale-105 group-hover:rotate-[-4deg]"
                  style={{
                    boxShadow: 'inset 0 0 0 1px rgba(16,185,129,0.15)',
                  }}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <p className="relative mt-5 font-display text-base font-bold text-slate-900">
                  {t(`pillars.${key}.title`)}
                </p>
                <p className="relative mt-2 text-sm leading-relaxed text-slate-600">
                  {t(`pillars.${key}.body`)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Turnover loop — connected chain */}
        <div className="relative mt-14 overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 sm:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-16 h-56 w-56 rounded-full bg-[#10B981]/8 blur-3xl"
          />
          <div className="relative max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#10B981]">
              {t('loopEyebrow')}
            </p>
            <h3 className="font-display mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              {t('loopTitle')}
            </h3>
            <p className="mt-3 text-slate-600">{t('loopBody')}</p>
          </div>
          <div className="relative mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            {(['step1', 'step2', 'step3', 'step4'] as const).map(
              (stepKey, i, arr) => (
                <div key={stepKey} className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/30 bg-gradient-to-r from-[#ECFDF5] to-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-sm">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-[#10B981] text-[10px] font-bold text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                      {i + 1}
                    </span>
                    {t(`loopSteps.${stepKey}`)}
                  </div>
                  {i < arr.length - 1 ? (
                    <ArrowRight
                      className="h-4 w-4 text-[#10B981]/60"
                      aria-hidden
                    />
                  ) : null}
                </div>
              ),
            )}
          </div>
        </div>

        {/* CTA card — deep emerald→teal gradient */}
        <div className="relative mt-14 overflow-hidden rounded-3xl bg-gradient-to-br from-[#064E3B] via-[#059669] to-[#10B981] p-8 sm:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#34D399]/25 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[#2563EB]/15 blur-3xl"
          />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#6EE7B7]">
                {t('ctaEyebrow')}
              </p>
              <h3 className="font-display mt-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                {t('ctaTitle')}
              </h3>
              <p className="mt-3 max-w-xl text-white/80">{t('ctaBody')}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={HOME_DEMOS[0]?.href ?? '/owner/preview'}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#065F46] shadow-lg transition hover:shadow-xl"
              >
                {t('ctaPrimary')}
                <ArrowRight
                  className="h-4 w-4 transition group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
              <Link
                href={
                  HOME_DEMOS.find((d) => d.key === 'airbnb-owner')?.href ??
                  '/owner/preview-airbnb'
                }
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
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
