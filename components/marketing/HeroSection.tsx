import Link from 'next/link';
import { ArrowRight, Sparkles, Building2, Users, UserRound } from 'lucide-react';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { getLocale, type Locale } from '@/lib/i18n';

/**
 * Per-locale copy. Kept inline here so the marketing landing stays
 * self-contained and we don't have to seed messages JSON for every tweak.
 * Add a key here when adding new copy; the type catches missing locales.
 */
const COPY: Record<
  Locale,
  {
    eyebrow: string;
    headlineA: string;
    headlineB: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    note: string;
    signIn: string;
    portals: {
      owner: { title: string; desc: string };
      cleaner: { title: string; desc: string };
      client: { title: string; desc: string };
    };
  }
> = {
  es: {
    eyebrow: 'Plataforma todo en uno',
    headlineA: 'Gestiona tu empresa de limpieza',
    headlineB: 'sin papeles ni hojas de cálculo.',
    sub: 'Reservas, equipos y cobros conectados en un mismo sitio. Tus operarios fichan, tus clientes reservan online y tú lo controlas todo desde un panel claro.',
    ctaPrimary: 'Prueba gratis',
    ctaSecondary: 'Iniciar sesión',
    note: 'Sin tarjeta de crédito. Cancelas cuando quieras.',
    signIn: 'Iniciar sesión',
    portals: {
      owner: {
        title: 'Panel del dueño',
        desc: 'Reservas, equipo e ingresos en tiempo real.',
      },
      cleaner: {
        title: 'App del operario',
        desc: 'Agenda del día y ganancias al instante.',
      },
      client: {
        title: 'Portal del cliente',
        desc: 'Tus clientes reservan en menos de un minuto.',
      },
    },
  },
  en: {
    eyebrow: 'The all-in-one platform',
    headlineA: 'Run your cleaning business',
    headlineB: 'without paperwork or spreadsheets.',
    sub: 'Bookings, teams and payments in one place. Your cleaners clock in, your customers book online, and you stay on top with a clear dashboard.',
    ctaPrimary: 'Start free',
    ctaSecondary: 'Sign in',
    note: 'No credit card. Cancel anytime.',
    signIn: 'Sign in',
    portals: {
      owner: {
        title: 'Owner dashboard',
        desc: 'Bookings, team and revenue in real time.',
      },
      cleaner: {
        title: 'Cleaner app',
        desc: "Today's schedule and earnings at a glance.",
      },
      client: {
        title: 'Customer portal',
        desc: 'Your customers book in under a minute.',
      },
    },
  },
  pt: {
    eyebrow: 'A plataforma tudo-em-um',
    headlineA: 'Gere a sua empresa de limpeza',
    headlineB: 'sem papelada nem folhas de cálculo.',
    sub: 'Reservas, equipas e cobranças num só lugar. As suas limpadoras fazem check-in, os clientes reservam online e você controla tudo num painel claro.',
    ctaPrimary: 'Experimentar grátis',
    ctaSecondary: 'Entrar',
    note: 'Sem cartão de crédito. Cancele quando quiser.',
    signIn: 'Entrar',
    portals: {
      owner: {
        title: 'Painel do dono',
        desc: 'Reservas, equipa e receita em tempo real.',
      },
      cleaner: {
        title: 'App do operário',
        desc: 'Agenda do dia e ganhos em tempo real.',
      },
      client: {
        title: 'Portal do cliente',
        desc: 'Os seus clientes reservam em menos de um minuto.',
      },
    },
  },
};

export default async function HeroSection() {
  const locale = await getLocale();
  const t = COPY[locale];
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-sky-50/40 to-white">
      {/* Soft decorative blobs — warm + airy instead of dark navy */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-32 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-blue-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-100/40 blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top nav — same brand mark, now dark-on-light */}
        <nav className="flex items-center justify-between py-5 sm:py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5"
            aria-label="Portal Home"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold text-white shadow-[0_8px_18px_-8px_rgba(34,211,238,0.6)]">
              P
            </span>
            <span className="font-display text-base font-semibold leading-tight text-slate-900">
              Portal Home
              <span className="block text-[9.5px] font-medium uppercase tracking-[0.18em] text-blue-600">
                Cleaning &amp; Facilities
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <LocaleSwitcher current={locale} variant="onLight" />
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/40"
            >
              {t.signIn}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </nav>

        {/* Hero content */}
        <div className="pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-700">
              <Sparkles className="h-3 w-3" />
              {t.eyebrow}
            </span>

            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {t.headlineA}
              <span className="block bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 bg-clip-text text-transparent">
                {t.headlineB}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base text-slate-600 sm:text-lg">
              {t.sub}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(37,99,235,0.45)] transition hover:from-blue-500 hover:to-blue-600"
              >
                {t.ctaPrimary}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/40"
              >
                {t.ctaSecondary}
              </Link>
            </div>

            <p className="mt-4 text-xs text-slate-500">{t.note}</p>
          </div>

          {/* Three portal palette echoes — each in its real portal color */}
          <div className="mt-14 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-3 sm:gap-5">
            <PortalCard
              label="Owner"
              title={t.portals.owner.title}
              description={t.portals.owner.desc}
              icon={<Building2 className="h-4 w-4" />}
              gradient="from-slate-800 via-slate-900 to-blue-900"
              chip="text-cyan-300 border-cyan-300/30 bg-cyan-300/10"
            />
            <PortalCard
              label="Cleaner"
              title={t.portals.cleaner.title}
              description={t.portals.cleaner.desc}
              icon={<Users className="h-4 w-4" />}
              gradient="from-emerald-500 via-emerald-600 to-teal-700"
              chip="text-emerald-50 border-emerald-200/40 bg-emerald-100/10"
            />
            <PortalCard
              label="Client"
              title={t.portals.client.title}
              description={t.portals.client.desc}
              icon={<UserRound className="h-4 w-4" />}
              gradient="from-sky-500 via-blue-600 to-blue-700"
              chip="text-sky-100 border-sky-200/40 bg-sky-200/10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function PortalCard({
  label,
  title,
  description,
  icon,
  gradient,
  chip,
}: {
  label: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  chip: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 shadow-[0_18px_34px_-18px_rgba(15,23,42,0.45)] ring-1 ring-white/10`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"
      />
      <div className="relative flex items-start justify-between">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.22em] ${chip}`}
        >
          {label}
        </span>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white ring-1 ring-white/20">
          {icon}
        </span>
      </div>
      <div className="relative mt-10">
        <p className="font-display text-base font-semibold text-white">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-white/75">{description}</p>
      </div>
    </div>
  );
}
