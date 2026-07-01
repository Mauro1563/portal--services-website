/**
 * PSDWorkforceSection — Portal Services: Workforce.
 *
 * Real portal names (Operative, Supervisor, Manager, Director/HQ, Client,
 * Community, Health & Safety) sourced from lib/marketing-config so the
 * list stays in sync with the actual app. Modules grouped into 4
 * categories per the v2 brief:
 *   - Gestión de personal (registro, fichajes, turnos, coberturas, vacaciones)
 *   - Operativa diaria (órdenes, encuestas, evaluaciones, control fuerza)
 *   - Reportes & Control (reportes en vivo, HQ control, exportación nómina)
 *   - Seguridad (auditoría, accesos por rol)
 *
 * Accent is #2563EB (Workforce blue). Portal Chat is NOT included here —
 * it lives in its own PSDChatSection between Workforce and Home (F3-v2).
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

// Four category cards; each one lists its bundled modules underneath.
// Keys align with the psd.landing.workforce.categories.* i18n subtree.
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
      className="relative overflow-hidden bg-white py-20 sm:py-28"
      aria-labelledby="psd-workforce-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#2563EB]/6 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#2563EB]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#2563EB] ring-1 ring-inset ring-[#2563EB]/20">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
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

        {/* Portals grid — 7 role-specific sub-portals */}
        <div className="mt-12">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
            {t('portalsLabel')}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {WORKFORCE_DEMOS.map((portal) => (
              <div
                key={portal.key}
                className="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-[#2563EB]/40 hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#2563EB]" aria-hidden />
                  <p className="text-sm font-semibold text-slate-900">
                    {portal.name[locale]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modules — grouped into 4 categories (14 modules total) */}
        <div className="mt-16">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
            {t('modulesLabel')}
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {CATEGORIES.map(({ key, Icon, modules }) => (
              <article
                key={key}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#2563EB]/40 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    {t(`categories.${key}.title`)}
                  </h3>
                </div>
                <ul className="mt-4 space-y-2">
                  {modules.map((mod) => (
                    <li
                      key={mod}
                      className="flex items-start gap-2 text-sm text-slate-700"
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

        {/* CTA card */}
        <div className="mt-16 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-[#0B2A6B] to-[#103A8C] p-6 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#93C5FD]">
                {t('ctaEyebrow')}
              </p>
              <h3 className="font-display mt-3 text-2xl font-bold text-white sm:text-3xl">
                {t('ctaTitle')}
              </h3>
              <p className="mt-3 max-w-xl text-white/70">{t('ctaBody')}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={WORKFORCE_DEMOS[0]?.href ?? '/operative/preview'}
                className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
              >
                {t('ctaPrimary')}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="#contact"
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
