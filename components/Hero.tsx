import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Logo } from './Logo';
import { getMarketingSection } from '@/lib/marketing';
import type { HeroContent } from '@/app/hq/content/hero/page';

export async function Hero() {
  const stored = await getMarketingSection<HeroContent>('hero');
  const data: HeroContent = stored ?? (await loadFromI18n());

  return (
    <section className="relative bg-canvas pt-32 pb-32 sm:pt-40 sm:pb-40">
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <div className="flex justify-center">
          <Logo size="lg" variant="full" />
        </div>

        <h1 className="mt-14 font-display text-5xl font-semibold leading-[1.05] tracking-[-0.02em] text-graphite-1 sm:text-6xl lg:text-7xl">
          {data.title_a} {data.title_b}.
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-graphite-3">
          {data.subtitle}
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="mailto:portalservicesdigital@gmail.com?subject=Demo%20request"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-graphite-1 px-6 text-sm font-semibold text-white transition hover:bg-black"
          >
            {data.cta_primary}
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#portals"
            className="inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold text-graphite-1 transition hover:text-brand-600"
          >
            {data.cta_secondary} →
          </a>
        </div>
      </div>
    </section>
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
