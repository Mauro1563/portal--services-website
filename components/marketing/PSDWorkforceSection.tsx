/**
 * PSDWorkforceSection — Portal Services: Workforce.
 *
 * Light section, but tinted blue-white gradient (`from-white via-[#F5F9FF]
 * to-white`) so it reads as the "Workforce blue" side of the landing.
 * Real portal names come from lib/marketing-config so this stays in sync
 * with the actual app. Modules grouped into 4 categories per the v2
 * brief (personnel / operations / reports / security).
 *
 * Portal Chat lives in its own PSDChatSection between Workforce and
 * Home (F3-v2) — it's not in this section.
 */

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import {
  ArrowRight,
  Users,
  ClipboardCheck,
  BarChart3,
  Shield,
  UsersRound,
  CheckCircle2,
} from 'lucide-react';
import { WORKFORCE_DEMOS } from '@/lib/marketing-config';
import { getLocale } from '@/lib/i18n';

const CATEGORIES = [
  {
    key: 'personnel',
    Icon: UsersRound,
    modules: ['register', 'timeclock', 'shifts', 'coverage', 'holidays'],
  },
  {
    key: 'operations',
    Icon: ClipboardCheck,
    modules: ['orders', 'surveys', 'evaluations', 'workforceControl'],
  },
  {
    key: 'reports',
    Icon: BarChart3,
    modules: ['liveReports', 'hqControl', 'payrollExport'],
  },
  {
    key: 'security',
    Icon: Shield,
    modules: ['audit', 'roleAccess'],
  },
] as const;

export default async function PSDWorkforceSection() {
  const t = await getTranslations('psd.landing.workforce');
  const locale = await getLocale();

  return (
    <section
      id="soluciones"
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#F5F9FF] to-white py-24 sm:py-32"
      aria-labelledby="psd-workforce-heading"
    >
      {/* Ambient blue accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 h-[26rem] w-[26rem] rounded-full bg-[#2563EB]/12 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 -left-32 h-64 w-64 rounded-full bg-[#2563EB]/8 blur-3xl"
      />
      {/* Fine grid pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#2563EB 1px, transparent 1px), linear-gradient(90deg, #2563EB 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/25 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#1D4ED8] shadow-sm backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#2563EB] opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
            </span>
            {t('eyebrow')}
          </span>
          <h2
            id="psd-workforce-heading"
            className="font-display mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            {t('title')}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            {t('body')}
          </p>
        </div>

        {/* Portals grid */}
        <div className="mt-14">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
            {t('portalsLabel')}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {WORKFORCE_DEMOS.map((portal) => (
              <div
                key={portal.key}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#2563EB]/40 hover:shadow-[0_10px_30px_-10px_rgba(37,99,235,0.35)]"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-[#2563EB] to-[#60A5FA] transition-transform duration-500 group-hover:scale-x-100"
                />
                <div className="relative flex items-center gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#EFF6FF] text-[#2563EB] transition group-hover:bg-[#2563EB] group-hover:text-white">
                    <Users className="h-4 w-4" aria-hidden />
                  </span>
                  <p className="text-sm font-semibold text-slate-900">
                    {portal.name[locale]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modules — grouped into 4 categories */}
        <div className="mt-16">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
            {t('modulesLabel')}
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {CATEGORIES.map(({ key, Icon, modules }) => (
              <article
                key={key}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#2563EB]/40 hover:shadow-[0_24px_60px_-30px_rgba(37,99,235,0.35)]"
              >
                {/* Accent corner glow on hover */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#2563EB]/0 blur-2xl transition duration-500 group-hover:bg-[#2563EB]/15"
                />
                {/* Top accent stripe */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#60A5FA] opacity-0 transition group-hover:opacity-100"
                />

                <div className="relative flex items-center gap-3">
                  <span
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-[#2563EB] transition duration-500 group-hover:scale-105 group-hover:rotate-[-4deg]"
                    style={{
                      boxShadow: 'inset 0 0 0 1px rgba(37,99,235,0.15)',
                    }}
                  >
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    {t(`categories.${key}.title`)}
                  </h3>
                </div>
                <ul className="relative mt-5 space-y-2.5">
                  {modules.map((mod) => (
                    <li
                      key={mod}
                      className="flex items-start gap-2 text-sm leading-relaxed text-slate-700"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]"
                        aria-hidden
                      />
                      <span>{t(`modules.${mod}`)}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        {/* CTA card — deeper gradient with accent glow */}
        <div className="relative mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B2A6B] via-[#103A8C] to-[#2563EB] p-8 sm:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#60A5FA]/25 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[#10B981]/15 blur-3xl"
          />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#93C5FD]">
                {t('ctaEyebrow')}
              </p>
              <h3 className="font-display mt-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                {t('ctaTitle')}
              </h3>
              <p className="mt-3 max-w-xl text-white/75">{t('ctaBody')}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={WORKFORCE_DEMOS[0]?.href ?? '/operative/preview'}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0B2A6B] shadow-lg transition hover:shadow-xl"
              >
                {t('ctaPrimary')}
                <ArrowRight
                  className="h-4 w-4 transition group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
              <Link
                href="#contact"
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
