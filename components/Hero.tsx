import { Badge, Button } from './ui';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

export function Hero() {
  return (
    <section className="relative pt-32 pb-24">
      <div className="absolute inset-0 bg-mesh-1 opacity-90" />
      <div className="absolute inset-0 bg-grid" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-12 flex justify-center">
            <Logo size="lg" />
          </div>

          <Badge tone="info" className="mb-6">
            <Sparkles className="h-3 w-3" />
            Built for cleaning, facilities & property teams
          </Badge>

          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Replace WhatsApp and Excel
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              with one operational platform.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Shift control by building. Supervisor inbox. Absence reports. Community portal. Live
            communication from HQ to supervisors to operatives — all in one place.
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
            14-day free trial · No credit card · From £49/month
          </p>
        </div>
      </div>
    </section>
  );
}
