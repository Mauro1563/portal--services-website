import { getTranslations } from 'next-intl/server';
import { Button } from './ui';
import { ArrowRight, Building2, Home, Briefcase } from 'lucide-react';
import { Logo } from './Logo';
import { getMarketingSection } from '@/lib/marketing';
import type { HeroContent } from '@/app/hq/content/hero/page';

export async function Hero() {
  const stored = await getMarketingSection<HeroContent>('hero');
  const data: HeroContent = stored ?? (await loadFromI18n());

  return (
    <section className="relative overflow-hidden bg-ink-0 pt-32 pb-24 sm:pt-40 sm:pb-32">
      <div className="absolute inset-0 bg-mesh-1 opacity-90" />
      <div className="absolute inset-0 bg-grid" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-10 flex justify-center">
            <Logo size="lg" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
            {data.eyebrow}
          </p>

          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {data.title_a}{' '}
            <span className="bg-gradient-to-r from-accent-sky via-accent-soft to-brand-500 bg-clip-text text-transparent">
              {data.title_b}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            {data.subtitle}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-200">
              <Building2 className="h-3 w-3" /> {data.audience_corporate}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-200">
              <Briefcase className="h-3 w-3" /> {data.audience_property}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-200">
              <Home className="h-3 w-3" /> {data.audience_facility}
            </span>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
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

          <p className="mt-6 text-xs text-slate-500">{data.trust}</p>
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
  };
}
