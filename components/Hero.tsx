import { Badge, Button } from './ui';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-32 pb-24">
      <div className="absolute inset-0 bg-mesh-1 opacity-90" />
      <div className="absolute inset-0 bg-grid" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Badge tone="info" className="mb-6">
            <Sparkles className="h-3 w-3" />
            New · Real-time operations engine
          </Badge>

          <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            The Operational OS for
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              modern facility teams.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300">
            One platform. One place. Everyone connected.
            <br className="hidden sm:block" />
            Run cleaning, facilities and field operations from a single intelligent system.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg">
              Get a demo
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="secondary">
              See it live
            </Button>
          </div>

          <p className="mt-6 text-xs text-slate-500">
            14-day pilot · No credit card · Enterprise SLAs available
          </p>
        </div>
      </div>
    </section>
  );
}
