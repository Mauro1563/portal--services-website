import { getTranslations } from 'next-intl/server';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { getMarketingSection } from '@/lib/marketing';
import type { HeroContent } from '@/app/hq/content/hero/page';

export async function Hero() {
  const stored = await getMarketingSection<HeroContent>('hero');
  const data: HeroContent = stored ?? (await loadFromI18n());

  return (
    <section className="relative overflow-hidden bg-ink-0 pt-28 pb-24 sm:pt-32 sm:pb-32">
      <div className="absolute inset-0 bg-mesh-1 opacity-90" />
      <div className="absolute inset-0 bg-grid" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {/* Big centered logo */}
        <div className="flex justify-center">
          <Logo size="xl" wrap={false} />
        </div>

        {/* Three-part tagline with the middle bit in cyan */}
        <p className="mt-10 font-display text-2xl font-semibold uppercase tracking-[0.18em] text-slate-200 sm:text-3xl">
          <span>{data.tagline_a}</span>{' '}
          <span className="text-cyan-300">{data.tagline_b}</span>{' '}
          <span className="text-slate-400">{data.tagline_c}</span>
        </p>

        {/* Sparkle audience chip */}
        <p className="mt-8 inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/[0.08] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200 backdrop-blur-sm">
          <Sparkles className="h-3 w-3" /> {data.audience_chip}
        </p>

        {/* Eyebrow + title */}
        <h1 className="mt-10 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
          {data.title_a}{' '}
          <span className="bg-gradient-to-r from-accent-sky via-brand-400 to-brand-600 bg-clip-text text-transparent">
            {data.title_b}
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
          {data.subtitle}
        </p>

        {/* Audience chips */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <AudienceChip label={data.audience_corporate} tone="cyan" />
          <AudienceChip label={data.audience_property} tone="blue" />
          <AudienceChip label={data.audience_facility} tone="indigo" />
        </div>

        {/* CTAs */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="mailto:portalservicesdigital@gmail.com?subject=Demo%20request"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-6 text-base font-semibold text-white shadow-[0_10px_30px_-8px_rgba(56,189,248,0.6)] transition hover:brightness-110"
          >
            {data.cta_primary}
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#portals"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-white/[0.06] px-6 text-base font-semibold text-white ring-1 ring-inset ring-white/[0.12] transition hover:bg-white/[0.10]"
          >
            {data.cta_secondary}
          </a>
        </div>

        <p className="mt-6 text-xs text-slate-500">{data.trust}</p>
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
    cyan: 'border-cyan-400/30 bg-cyan-500/[0.08] text-cyan-200',
    blue: 'border-blue-400/30 bg-blue-500/[0.08] text-blue-200',
    indigo: 'border-indigo-400/30 bg-indigo-500/[0.08] text-indigo-200',
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
