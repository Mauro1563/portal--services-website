import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { getMarketingSection } from '@/lib/marketing';
import type { CTABannerContent } from '@/app/hq/content/cta_banner/page';

export async function CTABanner() {
  const stored = await getMarketingSection<CTABannerContent>('cta_banner');
  const data: CTABannerContent = stored ?? (await loadFromI18n());

  return (
    <section className="relative bg-canvas py-32 sm:py-40">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-display text-5xl font-semibold leading-[1.05] tracking-[-0.02em] text-graphite-1 sm:text-6xl lg:text-7xl">
          {data.title}
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-lg text-graphite-3">
          {data.subtitle}
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="mailto:portalservicesdigital@gmail.com?subject=Demo%20request"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-graphite-1 px-6 text-sm font-semibold text-white transition hover:bg-black"
          >
            {data.primary} <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="mailto:portalservicesdigital@gmail.com?subject=Sales%20inquiry"
            className="inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold text-graphite-1 transition hover:text-brand-600"
          >
            {data.secondary} →
          </a>
        </div>
      </div>
    </section>
  );
}

async function loadFromI18n(): Promise<CTABannerContent> {
  const t = await getTranslations('cta_banner');
  return {
    title: t('title'),
    subtitle: t('subtitle'),
    primary: t('primary'),
    secondary: t('secondary'),
  };
}
