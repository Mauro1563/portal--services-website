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
    <section id="segments" className="relative bg-surface-1 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
            Two specialised portals · one platform
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-text-1 sm:text-5xl">
            Built for both sides of cleaning.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-text-2">
            Pick the one that fits — or use both. Same login, same team, the
            interface adapts to what you actually do.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {/* Airbnb panel */}
          <div className="group relative overflow-hidden rounded-3xl border border-surface-2 bg-surface-0 p-8 shadow-card transition hover:shadow-card-lg sm:p-10">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-100/50 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-brand-glow">
                  <Home className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-700">
                  Airbnb / Short-let
                </span>
              </div>

              <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-text-1 sm:text-3xl">
                Airbnb cleaning portal
              </h3>
              <p className="mt-3 text-base text-text-2">
                Plug in your Airbnb / Booking iCal once. Every guest checkout
                auto-creates a cleaning task — assigned, photographed and
                tracked end-to-end.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-text-1">
                <Feat icon={<Calendar className="h-4 w-4 text-brand-600" />}>
                  iCal sync from Airbnb / Booking
                </Feat>
                <Feat icon={<KeyRound className="h-4 w-4 text-brand-600" />}>
                  6-digit PIN for cleaners — no app store install
                </Feat>
                <Feat icon={<MapPin className="h-4 w-4 text-brand-600" />}>
                  GPS-verified check-in on every cleaning
                </Feat>
                <Feat icon={<Camera className="h-4 w-4 text-brand-600" />}>
                  Photo evidence after every visit
                </Feat>
              </ul>

              <a
                href="mailto:portalservicesdigital@gmail.com?subject=Airbnb%20demo"
                className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-brand-glow hover:bg-brand-700"
              >
                See Airbnb demo <ArrowRight className="h-4 w-4" />
              </a>
              <p className="mt-3 text-xs text-text-3">
                From £49 / month · ideal for 3 – 50 properties
              </p>
            </div>
          </div>

          {/* House cleaning panel */}
          <div className="group relative overflow-hidden rounded-3xl border border-surface-2 bg-surface-0 p-8 shadow-card transition hover:shadow-card-lg sm:p-10">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-warm-100/60 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-warm-500 text-white shadow-warm-glow">
                  <Building2 className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-warm-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-warm-600">
                  House cleaning company
                </span>
              </div>

              <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-text-1 sm:text-3xl">
                House-cleaning portal
              </h3>
              <p className="mt-3 text-base text-text-2">
                For Regular, Deep, Move-out and End-of-tenancy cleanings. Your
                clients get their own login to see visits and rate work —
                you get a public profile to attract new ones.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-text-1">
                <Feat icon={<Users className="h-4 w-4 text-warm-600" />}>
                  Each client gets a private portal
                </Feat>
                <Feat icon={<Star className="h-4 w-4 text-warm-600" />}>
                  Star ratings + testimonials per cleaner
                </Feat>
                <Feat icon={<Globe className="h-4 w-4 text-warm-600" />}>
                  Public business page to attract new customers
                </Feat>
                <Feat icon={<CheckCircle2 className="h-4 w-4 text-warm-600" />}>
                  Service catalogue with prices (Regular, Deep, Move-out…)
                </Feat>
              </ul>

              <a
                href="mailto:portalservicesdigital@gmail.com?subject=Cleaning%20company%20demo"
                className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-warm-500 px-5 text-sm font-semibold text-white shadow-warm-glow hover:bg-warm-600"
              >
                See cleaning demo <ArrowRight className="h-4 w-4" />
              </a>
              <p className="mt-3 text-xs text-text-3">
                From £150 / month · ideal for 1 – 50 cleaners
              </p>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-sm text-text-2">
          Do both?{' '}
          <a
            href="mailto:portalservicesdigital@gmail.com?subject=Hybrid%20plan"
            className="font-semibold text-brand-700 hover:text-brand-800"
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
