import { getTranslations } from 'next-intl/server';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './ui';
import { BrowserFrame } from './ui/DeviceFrame';
import { HQDashboardMockup } from './mockups/HQDashboardMockup';
import { getMarketingSection } from '@/lib/marketing';
import type { HeroContent } from '@/app/hq/content/hero/page';

export async function Hero() {
  const stored = await getMarketingSection<HeroContent>('hero');
  const data: HeroContent = stored ?? (await loadFromI18n());

  return (
    <section className="relative overflow-hidden bg-canvas pt-32 pb-20 sm:pt-36 sm:pb-24">
      {/* Soft ambient mesh */}
      <div className="absolute inset-0 bg-mesh-light opacity-80" />
      <div className="absolute inset-0 bg-grid" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          {/* ───── Copy column ───── */}
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600 backdrop-blur-sm">
              <Sparkles className="h-3 w-3" /> {data.eyebrow}
            </p>

            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-graphite-1 sm:text-5xl lg:text-[3.5rem]">
              {data.title_a}{' '}
              <span className="bg-gradient-to-r from-accent-sky via-brand-400 to-brand-600 bg-clip-text text-transparent">
                {data.title_b}
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-graphite-3">
              {data.subtitle}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-2">
              <AudienceChip label={data.audience_corporate} tone="cyan" />
              <AudienceChip label={data.audience_property} tone="blue" />
              <AudienceChip label={data.audience_facility} tone="indigo" />
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                href="mailto:portalservicesdigital@gmail.com?subject=Demo%20request"
              >
                {data.cta_primary}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="secondary" href="#portals">
                {data.cta_secondary}
              </Button>
            </div>

            <p className="mt-6 text-xs text-graphite-4">{data.trust}</p>
          </div>

          {/* ───── Mockup column ───── */}
          <div className="relative lg:translate-y-2">
            {/* Soft halo behind the frame */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-to-br from-cyan-300/30 via-brand-400/20 to-transparent blur-3xl"
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

function AudienceChip({
  label,
  tone,
}: {
  label: string;
  tone: 'cyan' | 'blue' | 'indigo';
}) {
  const map = {
    cyan: 'border-cyan-200 bg-cyan-50 text-cyan-700',
    blue: 'border-blue-200 bg-blue-50 text-blue-700',
    indigo: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${map[tone]}`}
    >
      {label}
    </span>
  );
}

async function loadFromI18n(): Promise<HeroContent> {
  const t = await getTranslations('hero');
  return {
    eyebrow: t('eyebrow'),
    title_a: t('title_a'),
    title_b: t('title_b'),
    subtitle: t('subtitle'),
    cta_primary: t('cta_primary'),
    cta_secondary: t('cta_secondary'),
    trust: t('trust'),
    audience_corporate: t('audience_corporate'),
    audience_property: t('audience_property'),
    audience_facility: t('audience_facility'),
  };
}
