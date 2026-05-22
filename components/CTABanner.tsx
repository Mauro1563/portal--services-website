import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { getMarketingSection } from '@/lib/marketing';
import type { CTABannerContent } from '@/app/hq/content/cta_banner/page';

export async function CTABanner() {
  const stored = await getMarketingSection<CTABannerContent>('cta_banner');
  const data: CTABannerContent = stored ?? (await loadFromI18n());

  return (
    <section className="relative bg-canvas py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-1 via-ink-0 to-brand-700 p-12 text-center text-white sm:p-16">
          <div className="absolute inset-0 bg-mesh-1 opacity-60" />
          <div className="relative">
            <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {data.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-200">
              {data.subtitle}
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="mailto:portalservicesdigital@gmail.com?subject=Demo%20request"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-6 text-base font-semibold text-white shadow-[0_10px_30px_-8px_rgba(56,189,248,0.6)] transition hover:brightness-110"
              >
                {data.primary} <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="mailto:portalservicesdigital@gmail.com?subject=Sales%20inquiry"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-white/10 px-6 text-base font-semibold text-white ring-1 ring-inset ring-white/20 transition hover:bg-white/15"
              >
                {data.secondary}
              </a>
            </div>
          </div>
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
