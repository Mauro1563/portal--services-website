import { useTranslations } from 'next-intl';
import { Button } from './ui';
import { ArrowRight, Building2, Home, Briefcase } from 'lucide-react';
import { Logo } from './Logo';

export function Hero() {
  const t = useTranslations('hero');

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
            {t('eyebrow')}
          </p>

          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t('title_a')}{' '}
            <span className="bg-gradient-to-r from-accent-sky via-accent-soft to-brand-500 bg-clip-text text-transparent">
              {t('title_b')}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            {t('subtitle')}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-200">
              <Building2 className="h-3 w-3" /> {t('audience_corporate')}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-200">
              <Briefcase className="h-3 w-3" /> {t('audience_property')}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-200">
              <Home className="h-3 w-3" /> {t('audience_facility')}
            </span>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              href="mailto:portalservicesdigital@gmail.com?subject=Demo%20request"
            >
              {t('cta_primary')}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="secondary" href="#portals">
              {t('cta_secondary')}
            </Button>
          </div>

          <p className="mt-6 text-xs text-slate-500">{t('trust')}</p>
        </div>
      </div>
    </section>
  );
}
