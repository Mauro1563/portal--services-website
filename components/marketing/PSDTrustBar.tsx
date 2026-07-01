/**
 * PSDTrustBar — standalone strip of anonymous, sourced-from-config
 * metrics that sits between the hero and the Workforce section. No
 * company names, no invented testimonials — every value comes from
 * lib/marketing-config.TRUST_METRICS so it can be edited without
 * touching this component.
 */

import { getTranslations } from 'next-intl/server';
import { TRUST_METRICS } from '@/lib/marketing-config';
import { getLocale } from '@/lib/i18n';

export default async function PSDTrustBar() {
  const t = await getTranslations('psd.landing.trust');
  const locale = await getLocale();

  return (
    <section
      id="trust"
      className="border-y border-slate-200 bg-slate-50"
      aria-labelledby="psd-trust-heading"
    >
      <div className="mx-auto max-w-7xl px-6 py-8 sm:py-10">
        <h2
          id="psd-trust-heading"
          className="mb-6 text-center text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500"
        >
          {t('eyebrow')}
        </h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {TRUST_METRICS.map((m) => (
            <div key={m.value} className="text-center">
              <p className="font-display text-3xl font-bold tabular-nums text-[#0B2A6B] sm:text-4xl">
                {m.value}
              </p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-slate-600 sm:text-xs">
                {m.label[locale]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
