import { useTranslations } from 'next-intl';
import { Badge, Button } from './ui';
import { ArrowRight, Sparkles, Building2, Home } from 'lucide-react';
import { Logo } from './Logo';

export function Hero() {
  const t = useTranslations('hero');
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="absolute inset-0 bg-mesh-1" />
      <div className="absolute inset-0 bg-grid opacity-70" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-12 flex justify-center">
            <Logo size="lg" />
          </div>

          <Badge tone="info" className="mb-6">
            <Sparkles className="h-3 w-3" />
            {t('badge')}
          </Badge>

          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-text-1 sm:text-5xl lg:text-[3.5rem]">
            The operating system for{' '}
            <span className="relative whitespace-nowrap">
              <span className="bg-gradient-to-r from-brand-600 to-ink-1 bg-clip-text text-transparent">
                modern cleaning
              </span>
            </span>
            <br />
            businesses.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-2 sm:text-xl">
            Whether you manage Airbnb properties or run a house-cleaning
            company, replace WhatsApp and spreadsheets with one platform — built
            for the way cleaning operations actually work.
          </p>

          {/* Two segment chips */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              <Home className="h-3 w-3" /> Airbnb hosts
            </span>
            <span className="text-text-3">+</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-warm-100 bg-warm-50 px-3 py-1 text-xs font-semibold text-warm-600">
              <Building2 className="h-3 w-3" /> Cleaning companies
            </span>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" href="mailto:portalservicesdigital@gmail.com?subject=Demo%20request">
              Start free trial
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="secondary" href="#segments">
              See both portals
            </Button>
          </div>

          <p className="mt-6 text-xs text-text-3">
            14-day free trial · No card required · UK / EU GDPR-ready
          </p>
        </div>
      </div>
    </section>
  );
}
