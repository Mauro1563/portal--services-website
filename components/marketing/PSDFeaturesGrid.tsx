/**
 * PSDFeaturesGrid — 8-cell grid of features shared by both Workforce
 * and Home. Each card is a Link that routes to the section, demo or
 * dedicated page where the feature is most tangible.
 *
 * Alternates blue and green accent colors across the grid so both brand
 * hues remain present on this shared section instead of the earlier
 * all-blue treatment.
 */

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import {
  ArrowUpRight,
  Languages,
  Zap,
  Smartphone,
  ShieldCheck,
  MapPin,
  Camera,
  MessageSquare,
  Download,
} from 'lucide-react';

type FeatureKey =
  | 'multiLang'
  | 'realtime'
  | 'pwa'
  | 'security'
  | 'geofence'
  | 'photos'
  | 'chat'
  | 'exports';

type Accent = 'blue' | 'green';

const ACCENT: Record<
  Accent,
  {
    tileBg: string;
    tileText: string;
    hoverBorder: string;
    tileRing: string;
    hoverArrow: string;
    focusRing: string;
    stripe: string;
  }
> = {
  blue: {
    tileBg: 'bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]',
    tileText: 'text-[#2563EB]',
    hoverBorder: 'hover:border-[#2563EB]/40',
    tileRing: 'inset 0 0 0 1px rgba(37,99,235,0.15)',
    hoverArrow: 'group-hover:text-[#2563EB]',
    focusRing: 'focus-visible:ring-[#2563EB]',
    stripe: 'from-[#2563EB] to-[#60A5FA]',
  },
  green: {
    tileBg: 'bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5]',
    tileText: 'text-[#10B981]',
    hoverBorder: 'hover:border-[#10B981]/40',
    tileRing: 'inset 0 0 0 1px rgba(16,185,129,0.15)',
    hoverArrow: 'group-hover:text-[#10B981]',
    focusRing: 'focus-visible:ring-[#10B981]',
    stripe: 'from-[#10B981] to-[#34D399]',
  },
};

const ITEMS: Array<{
  key: FeatureKey;
  Icon: typeof Languages;
  href: string;
  accent: Accent;
}> = [
  { key: 'multiLang', Icon: Languages, href: '#demos', accent: 'blue' },
  { key: 'realtime', Icon: Zap, href: '#chat', accent: 'green' },
  { key: 'pwa', Icon: Smartphone, href: '/operative/preview', accent: 'blue' },
  { key: 'security', Icon: ShieldCheck, href: '/security', accent: 'green' },
  { key: 'geofence', Icon: MapPin, href: '/operative/preview', accent: 'blue' },
  { key: 'photos', Icon: Camera, href: '/operative/preview', accent: 'green' },
  { key: 'chat', Icon: MessageSquare, href: '#chat', accent: 'blue' },
  { key: 'exports', Icon: Download, href: '/owner/preview', accent: 'green' },
];

export default async function PSDFeaturesGrid() {
  const t = await getTranslations('psd.landing.features');

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-slate-50 py-24 sm:py-32"
      aria-labelledby="psd-features-heading"
    >
      {/* Ambient blue+green blob pair */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#2563EB]/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#10B981]/8 blur-3xl"
      />
      {/* Dot pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #0F172A 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage:
            'radial-gradient(ellipse at center, black 45%, transparent 90%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-700 shadow-sm backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#2563EB] opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
            </span>
            {t('eyebrow')}
          </span>
          <h2
            id="psd-features-heading"
            className="font-display mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-slate-600">{t('subtitle')}</p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ key, Icon, href, accent }) => {
            const a = ACCENT[accent];
            return (
              <Link
                key={key}
                href={href}
                className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 ${a.hoverBorder} ${a.focusRing}`}
              >
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r ${a.stripe} transition-transform duration-500 group-hover:scale-x-100`}
                />
                <div className="relative flex items-start justify-between">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-xl ${a.tileBg} ${a.tileText} transition duration-500 group-hover:scale-105 group-hover:rotate-[-6deg]`}
                    style={{ boxShadow: a.tileRing }}
                  >
                    <Icon
                      className="h-5 w-5"
                      aria-hidden
                      strokeWidth={1.75}
                    />
                  </span>
                  <ArrowUpRight
                    className={`h-4 w-4 text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${a.hoverArrow}`}
                    aria-hidden
                  />
                </div>
                <h3 className="relative mt-5 font-display text-base font-bold text-slate-900">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-slate-600">
                  {t(`items.${key}.body`)}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
