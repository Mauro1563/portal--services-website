import { Button } from './ui';
import { ArrowRight, Building2, Home } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative bg-surface-0 pt-32 pb-20 sm:pt-44 sm:pb-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Small wordmark chip — clean, no image baked-in background */}
          <p className="mb-8 text-[11px] font-semibold uppercase tracking-[0.24em] text-text-3">
            Portal Services Digital
          </p>

          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-text-1 sm:text-5xl lg:text-6xl">
            Cleaning operations,{' '}
            <span className="text-brand-600">finally in one place.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-text-2">
            One platform for two ways of cleaning — your Airbnb turnovers and
            your clients&apos; homes. Same login. Same team. No more WhatsApp
            chaos, no more spreadsheets.
          </p>

          {/* Audience chips */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
              <Home className="h-3 w-3" /> Airbnb hosts
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-warm-100 bg-warm-50 px-3 py-1.5 text-xs font-semibold text-warm-600">
              <Building2 className="h-3 w-3" /> Cleaning companies
            </span>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              href="mailto:portalservicesdigital@gmail.com?subject=Demo%20request"
            >
              Start free trial
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="secondary" href="#segments">
              See both portals
            </Button>
          </div>

          <p className="mt-6 text-xs text-text-3">
            14-day free trial &middot; No credit card &middot; UK / EU
            GDPR-ready
          </p>
        </div>
      </div>
    </section>
  );
}
