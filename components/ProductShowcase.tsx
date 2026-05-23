import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { BrowserFrame } from './ui/DeviceFrame';
import { HQDashboardMockup } from './mockups/HQDashboardMockup';

export function ProductShowcase() {
  const t = useTranslations('showcase');

  const bullets = [
    t('bullet_real_time'),
    t('bullet_mobile_first'),
    t('bullet_branded'),
  ];

  return (
    <section className="relative overflow-hidden bg-ink-0 py-24 text-white sm:py-32">
      <div className="absolute inset-0 bg-mesh-1 opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-cyan-500/15 blur-[140px]"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
          {/* Copy */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
              {t('eyebrow')}
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              {t('title')}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-300">
              {t('subtitle')}
            </p>

            <ul className="mt-7 space-y-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 ring-1 ring-inset ring-cyan-400/30">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-slate-200">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mockup */}
          <div className="relative lg:translate-y-2">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-to-br from-cyan-400/25 via-brand-500/15 to-transparent blur-3xl"
            />
            <BrowserFrame url="hq.portalservices.digital">
              <HQDashboardMockup />
            </BrowserFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
