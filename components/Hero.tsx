import { Button } from './ui';
import { ArrowRight, Building2, Home } from 'lucide-react';
import { Logo } from './Logo';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-0 pt-32 pb-24 sm:pt-40 sm:pb-32">
      {/* Brand ambient glow + grid */}
      <div className="absolute inset-0 bg-mesh-1 opacity-90" />
      <div className="absolute inset-0 bg-grid" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Brand mark, big — same as Portal Services Digital identity */}
          <div className="mb-10 flex justify-center">
            <Logo size="lg" />
          </div>

          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Cleaning operations,{' '}
            <span className="bg-gradient-to-r from-accent-sky via-accent-soft to-brand-500 bg-clip-text text-transparent">
              finally in one place.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            One platform for two ways of cleaning — your Airbnb turnovers and
            your clients&apos; homes. Same login. Same team. No more WhatsApp
            chaos, no more spreadsheets.
          </p>

          {/* Audience chips */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-200">
              <Home className="h-3 w-3" /> Airbnb hosts
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-200">
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

          <p className="mt-6 text-xs text-slate-500">
            14-day free trial &middot; No credit card &middot; UK / EU
            GDPR-ready
          </p>
        </div>
      </div>
    </section>
  );
}
