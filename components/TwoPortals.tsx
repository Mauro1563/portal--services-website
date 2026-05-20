import {
  ArrowRight,
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  Globe,
  Home,
  KeyRound,
  MapPin,
  Star,
  Users,
} from 'lucide-react';

export function TwoPortals() {
  return (
    <section id="segments" className="relative bg-ink-0 py-24 sm:py-32">
      {/* Subtle ambient lift */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Two verticals · one platform
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Built for both sides of cleaning.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
            Whether you clean Airbnbs or homes — or both — the platform adapts.
            Same team, same login, different workflows.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {/* Airbnb panel — cyan */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-cyan-500/[0.04] sm:p-10">
            <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-cyan-500/15 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-brand-glow">
                  <Home className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-200 ring-1 ring-inset ring-cyan-400/30">
                  Airbnb / Short-let
                </span>
              </div>

              <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Airbnb cleaning workflow
              </h3>
              <p className="mt-3 text-base text-slate-300">
                Plug in your Airbnb / Booking iCal once. Every guest checkout
                auto-creates a cleaning task — assigned, photographed and
                tracked end-to-end.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-200">
                <Feat icon={<Calendar className="h-4 w-4 text-cyan-300" />}>
                  iCal sync from Airbnb / Booking
                </Feat>
                <Feat icon={<KeyRound className="h-4 w-4 text-cyan-300" />}>
                  6-digit PIN for cleaners — no app store install
                </Feat>
                <Feat icon={<MapPin className="h-4 w-4 text-cyan-300" />}>
                  GPS-verified check-in on every cleaning
                </Feat>
                <Feat icon={<Camera className="h-4 w-4 text-cyan-300" />}>
                  Photo evidence after every visit
                </Feat>
              </ul>

              <a
                href="mailto:portalservicesdigital@gmail.com?subject=Airbnb%20demo"
                className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-5 text-sm font-semibold text-white shadow-brand-glow hover:brightness-110"
              >
                See Airbnb demo <ArrowRight className="h-4 w-4" />
              </a>
              <p className="mt-3 text-xs text-slate-500">
                From £49 / month · ideal for 3 – 50 properties
              </p>
            </div>
          </div>

          {/* House cleaning panel — deeper blue */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-xl transition hover:border-blue-400/30 hover:bg-blue-500/[0.04] sm:p-10">
            <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-brand-glow">
                  <Building2 className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-blue-500/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-200 ring-1 ring-inset ring-blue-400/30">
                  House cleaning company
                </span>
              </div>

              <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                House-cleaning workflow
              </h3>
              <p className="mt-3 text-base text-slate-300">
                For Regular, Deep, Move-out and End-of-tenancy cleanings. Your
                clients get their own login to see visits and rate work — you
                get a public profile to attract new ones.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-200">
                <Feat icon={<Users className="h-4 w-4 text-blue-300" />}>
                  Each client gets a private portal
                </Feat>
                <Feat icon={<Star className="h-4 w-4 text-blue-300" />}>
                  Star ratings + testimonials per cleaner
                </Feat>
                <Feat icon={<Globe className="h-4 w-4 text-blue-300" />}>
                  Public business page to attract new customers
                </Feat>
                <Feat icon={<CheckCircle2 className="h-4 w-4 text-blue-300" />}>
                  Service catalogue with prices (Regular, Deep, Move-out…)
                </Feat>
              </ul>

              <a
                href="mailto:portalservicesdigital@gmail.com?subject=Cleaning%20company%20demo"
                className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 px-5 text-sm font-semibold text-white shadow-brand-glow hover:brightness-110"
              >
                See cleaning demo <ArrowRight className="h-4 w-4" />
              </a>
              <p className="mt-3 text-xs text-slate-500">
                From £150 / month · ideal for 1 – 50 cleaners
              </p>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-sm text-slate-400">
          Do both?{' '}
          <a
            href="mailto:portalservicesdigital@gmail.com?subject=Hybrid%20plan"
            className="font-semibold text-cyan-300 hover:text-cyan-200"
          >
            Run them side-by-side
          </a>{' '}
          — one account, both workflows.
        </p>
      </div>
    </section>
  );
}

function Feat({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span>{children}</span>
    </li>
  );
}
