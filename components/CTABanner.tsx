import { useTranslations } from 'next-intl';
import { Button } from './ui';
import { ArrowRight } from 'lucide-react';

export function CTABanner() {
  const t = useTranslations('cta');
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-blue-600/[0.15] via-cyan-500/[0.08] to-transparent p-12 text-center">
          <div className="absolute inset-0 bg-mesh-1 opacity-50" />
          <div className="relative">
            <h2 className="font-display text-4xl font-semibold tracking-tight">{t('title')}</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">{t('subtitle')}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" href="mailto:portalservicesdigital@gmail.com?subject=Demo%20request">
                {t('primary')} <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="secondary" href="mailto:portalservicesdigital@gmail.com?subject=Sales%20inquiry">
                {t('secondary')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
