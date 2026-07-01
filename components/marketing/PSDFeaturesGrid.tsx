/**
 * PSDFeaturesGrid — 8-cell grid of features shared by both Workforce
 * and Home. Uses lucide-react line icons only (no emoji per brief).
 * Blue accent throughout since these are cross-solution capabilities.
 *
 * Each card is a Link that routes to the section, demo or dedicated
 * page where the feature is most tangible (e.g. "Chat integrado" →
 * #chat, "GPS + geofence" → live Cleaner demo, "Seguridad y GDPR" →
 * /security). No dead tiles — every card takes the visitor somewhere
 * useful.
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

// Each feature routes to the surface where it becomes tangible. Anchors
// (#chat, #demos, #contact) trigger smooth-scroll to the corresponding
// section on the landing; page-level hrefs (/security, /company,
// /operative/preview) navigate to the dedicated page or demo.
const ITEMS: Array<{
  key: FeatureKey;
  Icon: typeof Languages;
  href: string;
}> = [
  { key: 'multiLang', Icon: Languages, href: '#demos' },
  { key: 'realtime', Icon: Zap, href: '#chat' },
  { key: 'pwa', Icon: Smartphone, href: '/operative/preview' },
  { key: 'security', Icon: ShieldCheck, href: '/security' },
  { key: 'geofence', Icon: MapPin, href: '/operative/preview' },
  { key: 'photos', Icon: Camera, href: '/operative/preview' },
  { key: 'chat', Icon: MessageSquare, href: '#chat' },
  { key: 'exports', Icon: Download, href: '/owner/preview' },
];

export default async function PSDFeaturesGrid() {
  const t = await getTranslations('psd.landing.features');

  return (
    <section
      id="features"
      className="relative bg-slate-50 py-20 sm:py-28"
      aria-labelledby="psd-features-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#2563EB]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#2563EB] ring-1 ring-inset ring-[#2563EB]/20">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
            {t('eyebrow')}
          </span>
          <h2
            id="psd-features-heading"
            className="font-display mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-slate-600">{t('subtitle')}</p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ key, Icon, href }) => (
            <Link
              key={key}
              href={href}
              className="group relative rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#2563EB]/40 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
                  <Icon className="h-5 w-5" aria-hidden strokeWidth={1.75} />
                </span>
                <ArrowUpRight
                  className="h-4 w-4 text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#2563EB]"
                  aria-hidden
                />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">
                {t(`items.${key}.title`)}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                {t(`items.${key}.body`)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
