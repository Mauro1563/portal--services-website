/**
 * PSDDemosSection — Real demo grid, URLs sourced from lib/marketing-config.
 *
 * Two columns: Workforce (blue accent, 6 sub-portals — all comingSoon for
 * now) and Home (green accent, 5 experiences, all live). Live demos
 * render as a real Link; comingSoon demos render as a disabled tile with
 * a "Próximamente" pill so a Workforce visitor never lands inside a Home
 * demo by mistake.
 */

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowUpRight, Users, Home, Lock, Clock } from 'lucide-react';
import { WORKFORCE_DEMOS, HOME_DEMOS, type DemoTarget } from '@/lib/marketing-config';
import { getLocale, type Locale } from '@/lib/i18n';

export default async function PSDDemosSection() {
  const t = await getTranslations('psd.landing.demos');
  const locale = await getLocale();
  const comingSoonLabel = t('comingSoon');

  return (
    <section
      id="demos"
      className="relative bg-white py-20 sm:py-28"
      aria-labelledby="psd-demos-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-700 ring-1 ring-inset ring-slate-200">
            {t('eyebrow')}
          </span>
          <h2
            id="psd-demos-heading"
            className="font-display mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-slate-600">{t('subtitle')}</p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* Workforce demos */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
                <Users className="h-4 w-4" aria-hidden />
              </span>
              <h3 className="font-display text-xl font-bold text-slate-900">
                Portal Services: Workforce
              </h3>
            </div>
            <p className="mt-2 text-sm text-slate-600">{t('workforceSub')}</p>
            <ul className="mt-5 space-y-2">
              {WORKFORCE_DEMOS.map((d) => (
                <li key={d.key}>
                  <DemoTile
                    demo={d}
                    locale={locale}
                    accent="#2563EB"
                    comingSoonLabel={comingSoonLabel}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Home demos */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#10B981]/10 text-[#10B981]">
                <Home className="h-4 w-4" aria-hidden />
              </span>
              <h3 className="font-display text-xl font-bold text-slate-900">
                Portal Services: Home
              </h3>
            </div>
            <p className="mt-2 text-sm text-slate-600">{t('homeSub')}</p>
            <ul className="mt-5 space-y-2">
              {HOME_DEMOS.map((d) => (
                <li key={d.key}>
                  <DemoTile
                    demo={d}
                    locale={locale}
                    accent="#10B981"
                    comingSoonLabel={comingSoonLabel}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-slate-500">
          {t('note')}
        </p>
      </div>
    </section>
  );
}

function DemoTile({
  demo,
  locale,
  accent,
  comingSoonLabel,
}: {
  demo: DemoTarget;
  locale: Locale;
  accent: string;
  comingSoonLabel: string;
}) {
  const name = demo.name[locale];

  if (demo.comingSoon) {
    return (
      <div
        aria-disabled="true"
        className="flex cursor-not-allowed items-center justify-between gap-3 rounded-xl border border-dashed border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 opacity-90"
      >
        <span className="inline-flex items-center gap-2">
          <span className="font-medium">{name}</span>
          {demo.requiresAuth ? (
            <Lock className="h-3 w-3 text-slate-400" aria-label="Requires login" />
          ) : null}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 ring-1 ring-inset ring-slate-200">
          <Clock className="h-3 w-3" aria-hidden />
          {comingSoonLabel}
        </span>
      </div>
    );
  }

  // Accent hover coming from Tailwind arbitrary values keyed off the
  // section accent so blue Workforce and green Home tiles both light up
  // on hover without needing per-tile CSS.
  const hoverBorder = accent === '#10B981' ? 'hover:border-[#10B981]/50' : 'hover:border-[#2563EB]/50';
  const hoverArrow = accent === '#10B981' ? 'group-hover:text-[#10B981]' : 'group-hover:text-[#2563EB]';

  return (
    <Link
      href={demo.href}
      className={`group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 transition hover:shadow-sm ${hoverBorder}`}
    >
      <span className="inline-flex items-center gap-2">
        <span className="font-medium">{name}</span>
        {demo.requiresAuth ? (
          <Lock className="h-3 w-3 text-slate-400" aria-label="Requires login" />
        ) : null}
      </span>
      <ArrowUpRight
        className={`h-4 w-4 text-slate-400 transition ${hoverArrow}`}
        aria-hidden
      />
    </Link>
  );
}
