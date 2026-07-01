/**
 * PSDTrustBar — first dark punctuation of the landing.
 *
 * Sits between the light hero and the light Workforce section as a
 * navy band so the page doesn't read as one long white sheet. Anonymous
 * TRUST_METRICS from lib/marketing-config; no company names, no invented
 * testimonials. Each metric gets an alternating blue/green accent dot
 * so the palette stays present even on the dark surface.
 */

import { getTranslations } from 'next-intl/server';
import { TRUST_METRICS } from '@/lib/marketing-config';
import { getLocale } from '@/lib/i18n';

const ACCENTS = ['#2563EB', '#10B981', '#2563EB', '#10B981'];

export default async function PSDTrustBar() {
  const t = await getTranslations('psd.landing.trust');
  const locale = await getLocale();

  return (
    <section
      id="trust"
      className="relative overflow-hidden bg-gradient-to-b from-[#0B1327] via-[#0F1B3D] to-[#0B1327]"
      aria-labelledby="psd-trust-heading"
    >
      {/* Ambient blobs — barely-there brand tints keeping the dark band alive */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-[#2563EB]/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-[#10B981]/15 blur-3xl"
      />
      {/* Subtle radial dot pattern for texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #FFFFFF 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <h2
          id="psd-trust-heading"
          className="mb-8 text-center text-[10px] font-bold uppercase tracking-[0.28em] text-white/50"
        >
          {t('eyebrow')}
        </h2>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {TRUST_METRICS.map((m, i) => {
            const dot = ACCENTS[i % ACCENTS.length];
            return (
              <div key={m.value} className="group text-center">
                <div
                  className="mx-auto mb-3 h-1 w-6 rounded-full transition-all group-hover:w-10"
                  style={{ backgroundColor: dot }}
                />
                <p className="font-display bg-gradient-to-b from-white to-white/70 bg-clip-text text-3xl font-bold tabular-nums text-transparent sm:text-4xl lg:text-5xl">
                  {m.value}
                </p>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/60 sm:text-xs">
                  {m.label[locale]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
