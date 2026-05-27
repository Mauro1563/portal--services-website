import { getTranslations } from 'next-intl/server';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { getMarketingSection } from '@/lib/marketing';
import type { HeroContent } from '@/app/hq/content/hero/page';

export async function Hero() {
  const stored = await getMarketingSection<HeroContent>('hero');
  const data: HeroContent = stored ?? (await loadFromI18n());

  return (
    <section className="relative overflow-hidden bg-canvas pt-28 pb-24 sm:pt-32 sm:pb-32">
      <div className="absolute inset-0 bg-mesh-light opacity-80" />
      <div className="absolute inset-0 bg-grid" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {/* Brand mark with tagline baked in */}
        <div className="flex justify-center">
          <Logo
            size="xl"
            variant="full"
            className="[filter:contrast(1.15)_saturate(1.1)_brightness(0.92)]"
          />
        </div>

        {/* Sparkle audience chip */}
        <p className="mt-8 inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600 backdrop-blur-sm">
          <Sparkles className="h-3 w-3" /> {data.audience_chip}
        </p>

        <h1 className="mt-10 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-graphite-1 sm:text-5xl lg:text-[3.25rem]">
          {data.title_a}{' '}
          <span className="bg-gradient-to-r from-accent-sky via-brand-400 to-brand-600 bg-clip-text text-transparent">
            {data.title_b}
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-graphite-3">
          {data.subtitle}
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <AudienceChip label={data.audience_corporate} tone="cyan" />
          <AudienceChip label={data.audience_property} tone="blue" />
          <AudienceChip label={data.audience_facility} tone="indigo" />
        </div>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="mailto:hola@portalservices.digital?subject=Demo%20request"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-6 text-base font-semibold text-white shadow-[0_10px_30px_-8px_rgba(56,189,248,0.55)] transition hover:brightness-110"
          >
            {data.cta_primary}
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#portals"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-paper px-6 text-base font-semibold text-graphite-1 ring-1 ring-inset ring-slate-200 transition hover:bg-slate-50 hover:ring-slate-300"
          >
            {data.cta_secondary}
          </a>
        </div>

        <p className="mt-6 text-xs text-graphite-4">{data.trust}</p>
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
    tagline_a: t('tagline_a'),
    tagline_b: t('tagline_b'),
    tagline_c: t('tagline_c'),
    audience_chip: t('audience_chip'),
  };
}
