/**
 * PSDFeaturesGrid — 8-cell grid of features shared by both Workforce
 * and Home. Uses lucide-react line icons only (no emoji per brief).
 * Blue accent throughout since these are cross-solution capabilities.
 */

import { getTranslations } from 'next-intl/server';
import {
  Languages,
  Zap,
  Smartphone,
  ShieldCheck,
  MapPin,
  Camera,
  MessageSquare,
  Download,
} from 'lucide-react';

const ICONS = [
  Languages,
  Zap,
  Smartphone,
  ShieldCheck,
  MapPin,
  Camera,
  MessageSquare,
  Download,
] as const;

const KEYS = [
  'multiLang',
  'realtime',
  'pwa',
  'security',
  'geofence',
  'photos',
  'chat',
  'exports',
] as const;

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
          {KEYS.map((k, i) => {
            const Icon = ICONS[i]!;
            return (
              <div
                key={k}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-[#2563EB]/30 hover:shadow-md"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
                  <Icon className="h-5 w-5" aria-hidden strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">
                  {t(`items.${k}.title`)}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {t(`items.${k}.body`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
