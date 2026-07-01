/**
 * PSDDemosSection — Real demo grid, URLs sourced from lib/marketing-config.
 *
 * Two tinted containers: Workforce (blue-tinted card, 6 sub-portals — all
 * comingSoon for now) and Home (green-tinted card, 5 experiences, all
 * live). Live demos render as a real Link; comingSoon demos render as a
 * disabled tile with a "Próximamente" pill so a Workforce visitor never
 * lands inside a Home demo by mistake.
 */

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowUpRight, Users, Home, Lock, Clock } from 'lucide-react';
import {
  WORKFORCE_DEMOS,
  HOME_DEMOS,
  type DemoTarget,
} from '@/lib/marketing-config';
import { getLocale, type Locale } from '@/lib/i18n';

type Accent = 'blue' | 'green';

const ACCENT_CONF: Record<
  Accent,
  {
    hex: string;
    hexSoft: string;
    tint: string; // container bg gradient (tailwind arbitrary value stops)
    stripe: string;
    Icon: typeof Users;
    title: string;
  }
> = {
  blue: {
    hex: '#2563EB',
    hexSoft: '#60A5FA',
    tint: 'from-[#F5F9FF] via-white to-[#EFF6FF]',
    stripe: 'from-[#2563EB] via-[#3B82F6] to-[#60A5FA]',
    Icon: Users,
    title: 'Portal Services: Workforce',
  },
  green: {
    hex: '#10B981',
    hexSoft: '#34D399',
    tint: 'from-[#F0FDF4] via-white to-[#ECFDF5]',
    stripe: 'from-[#10B981] via-[#22C55E] to-[#34D399]',
    Icon: Home,
    title: 'Portal Services: Home',
  },
};

export default async function PSDDemosSection() {
  const t = await getTranslations('psd.landing.demos');
  const locale = await getLocale();
  const comingSoonLabel = t('comingSoon');

  return (
    <section
      id="demos"
      className="relative overflow-hidden bg-white py-24 sm:py-32"
      aria-labelledby="psd-demos-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/3 h-72 w-72 rounded-full bg-[#2563EB]/6 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-1/3 h-72 w-72 rounded-full bg-[#10B981]/6 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-700 shadow-sm backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#2563EB] opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10B981]" />
            </span>
            {t('eyebrow')}
          </span>
          <h2
            id="psd-demos-heading"
            className="font-display mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-slate-600">{t('subtitle')}</p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <DemoContainer
            accent="blue"
            sub={t('workforceSub')}
            demos={WORKFORCE_DEMOS}
            locale={locale}
            comingSoonLabel={comingSoonLabel}
          />
          <DemoContainer
            accent="green"
            sub={t('homeSub')}
            demos={HOME_DEMOS}
            locale={locale}
            comingSoonLabel={comingSoonLabel}
          />
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-slate-500">
          {t('note')}
        </p>
      </div>
    </section>
  );
}

function DemoContainer({
  accent,
  sub,
  demos,
  locale,
  comingSoonLabel,
}: {
  accent: Accent;
  sub: string;
  demos: readonly DemoTarget[];
  locale: Locale;
  comingSoonLabel: string;
}) {
  const cfg = ACCENT_CONF[accent];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br ${cfg.tint} p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8`}
    >
      {/* Top accent stripe */}
      <div
        aria-hidden
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${cfg.stripe}`}
      />
      {/* Corner glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full blur-3xl"
        style={{ backgroundColor: `${cfg.hex}22` }}
      />

      <div className="relative flex items-center gap-3">
        <span
          className="grid h-11 w-11 place-items-center rounded-xl"
          style={{
            backgroundColor: `${cfg.hex}18`,
            color: cfg.hex,
            boxShadow: `inset 0 0 0 1px ${cfg.hex}33`,
          }}
        >
          <cfg.Icon className="h-5 w-5" aria-hidden />
        </span>
        <h3 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
          {cfg.title}
        </h3>
      </div>
      <p className="relative mt-3 text-sm leading-relaxed text-slate-600">
        {sub}
      </p>

      <ul className="relative mt-6 space-y-2">
        {demos.map((d) => (
          <li key={d.key}>
            <DemoTile
              demo={d}
              locale={locale}
              accent={cfg.hex}
              comingSoonLabel={comingSoonLabel}
            />
          </li>
        ))}
      </ul>
    </div>
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
        className="flex cursor-not-allowed items-center justify-between gap-3 rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-3 text-sm text-slate-500 backdrop-blur"
      >
        <span className="inline-flex items-center gap-2">
          <span className="font-medium">{name}</span>
          {demo.requiresAuth ? (
            <Lock
              className="h-3 w-3 text-slate-400"
              aria-label="Requires login"
            />
          ) : null}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 ring-1 ring-inset ring-slate-200">
          <Clock className="h-3 w-3" aria-hidden />
          {comingSoonLabel}
        </span>
      </div>
    );
  }

  const hoverBorder =
    accent === '#10B981'
      ? 'hover:border-[#10B981]/50'
      : 'hover:border-[#2563EB]/50';
  const hoverArrow =
    accent === '#10B981'
      ? 'group-hover:text-[#10B981]'
      : 'group-hover:text-[#2563EB]';

  return (
    <Link
      href={demo.href}
      className={`group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-0.5 hover:shadow-md ${hoverBorder}`}
    >
      <span className="inline-flex items-center gap-2">
        <span className="font-medium">{name}</span>
        {demo.requiresAuth ? (
          <Lock
            className="h-3 w-3 text-slate-400"
            aria-label="Requires login"
          />
        ) : null}
      </span>
      <ArrowUpRight
        className={`h-4 w-4 text-slate-400 transition ${hoverArrow}`}
        aria-hidden
      />
    </Link>
  );
}
