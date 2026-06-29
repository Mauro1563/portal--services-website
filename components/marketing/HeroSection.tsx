import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Building2,
  Users,
  UserRound,
  Calendar,
  DollarSign,
  Bell,
  MapPin,
  Camera,
  Wallet,
  Star,
  MessageSquare,
  CreditCard,
  PlayCircle,
} from 'lucide-react';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { getLocale, type Locale } from '@/lib/i18n';

/**
 * Per-locale copy. Kept inline here so the marketing landing stays
 * self-contained and we don't have to seed messages JSON for every tweak.
 * Add a key here when adding new copy; the type catches missing locales.
 */
type PortalCopy = {
  title: string;
  desc: string;
  cta: string;
  features: string[];
  kpis: { label: string; value: string }[];
};

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
    demoBadge: string;
    portalsTitle: string;
    portalsSub: string;
    modeResidential: string;
    modeAirbnb: string;
    portals: {
      owner: PortalCopy;
      cleaner: PortalCopy;
      client: PortalCopy;
    };
  }
> = {
  es: {
    eyebrow: 'Plataforma todo en uno',
    headlineA: 'Gestiona tu empresa de limpieza',
    headlineB: 'sin papeles ni hojas de cálculo.',
    sub: 'Reservas, equipos y cobros conectados en un mismo sitio. Sirve tanto limpieza residencial recurrente como turnovers de Airbnb.',
    ctaPrimary: 'Prueba gratis',
    ctaSecondary: 'Iniciar sesión',
    note: 'Sin tarjeta de crédito. Cancelas cuando quieras.',
    signIn: 'Iniciar sesión',
    demoBadge: 'Probar demo',
    portalsTitle: 'Tres apps, un mismo sistema.',
    portalsSub: 'Toca cualquiera para entrar a su demo en vivo — sin registro.',
    modeResidential: 'Residencial',
    modeAirbnb: 'Airbnb',
    portals: {
      owner: {
        title: 'Panel del dueño',
        desc: 'Reservas, equipo e ingresos en tiempo real.',
        cta: 'Ver panel del dueño',
        features: [
          'Agenda diaria con asignaciones',
          'Ingresos y facturación al instante',
          'Equipo, clientes y propiedades',
        ],
        kpis: [
          { label: 'Hoy', value: '12 tareas' },
          { label: 'Semana', value: '€2.4k' },
        ],
      },
      cleaner: {
        title: 'App del operario',
        desc: 'Agenda del día y ganancias al instante.',
        cta: 'Ver app del operario',
        features: [
          'Check-in con GPS y fotos',
          'Ruta optimizada del día',
          'Ganancias visibles en vivo',
        ],
        kpis: [
          { label: 'Hoy', value: '€40' },
          { label: 'Semana', value: '€280' },
        ],
      },
      client: {
        title: 'Portal del cliente',
        desc: 'Tus clientes reservan en menos de un minuto.',
        cta: 'Ver portal del cliente',
        features: [
          'Reserva en 30 segundos',
          'Mensajería directa con su limpiador',
          'Pago seguro y recibos al email',
        ],
        kpis: [
          { label: 'Reserva', value: '30 seg' },
          { label: 'Rating', value: '4.8★' },
        ],
      },
    },
  },
  en: {
    eyebrow: 'The all-in-one platform',
    headlineA: 'Run your cleaning business',
    headlineB: 'without paperwork or spreadsheets.',
    sub: 'Bookings, teams and payments in one place. Works for recurring residential cleaning and short-let Airbnb turnovers.',
    ctaPrimary: 'Start free',
    ctaSecondary: 'Sign in',
    note: 'No credit card. Cancel anytime.',
    signIn: 'Sign in',
    demoBadge: 'Try the demo',
    portalsTitle: 'Three apps, one system.',
    portalsSub: 'Tap any to enter the live demo — no sign-up.',
    modeResidential: 'Residential',
    modeAirbnb: 'Airbnb',
    portals: {
      owner: {
        title: 'Owner dashboard',
        desc: 'Bookings, team and revenue in real time.',
        cta: 'Open owner dashboard',
        features: [
          'Daily schedule with assignments',
          'Revenue and invoicing at a glance',
          'Team, clients and properties',
        ],
        kpis: [
          { label: 'Today', value: '12 jobs' },
          { label: 'Week', value: '£2.4k' },
        ],
      },
      cleaner: {
        title: 'Cleaner app',
        desc: "Today's schedule and earnings at a glance.",
        cta: 'Open cleaner app',
        features: [
          'GPS check-in with photos',
          'Optimised daily route',
          'Live earnings tracker',
        ],
        kpis: [
          { label: 'Today', value: '£40' },
          { label: 'Week', value: '£280' },
        ],
      },
      client: {
        title: 'Customer portal',
        desc: 'Your customers book in under a minute.',
        cta: 'Open customer portal',
        features: [
          'Book in 30 seconds',
          'Direct chat with their cleaner',
          'Secure payment + email receipts',
        ],
        kpis: [
          { label: 'Booking', value: '30 sec' },
          { label: 'Rating', value: '4.8★' },
        ],
      },
    },
  },
  pt: {
    eyebrow: 'A plataforma tudo-em-um',
    headlineA: 'Gere a sua empresa de limpeza',
    headlineB: 'sem papelada nem folhas de cálculo.',
    sub: 'Reservas, equipas e cobranças num só lugar. Funciona para limpeza residencial recorrente e turnovers de alojamento local.',
    ctaPrimary: 'Experimentar grátis',
    ctaSecondary: 'Entrar',
    note: 'Sem cartão de crédito. Cancele quando quiser.',
    signIn: 'Entrar',
    demoBadge: 'Experimentar demo',
    portalsTitle: 'Três apps, um sistema.',
    portalsSub: 'Toque em qualquer uma para abrir o demo — sem registo.',
    modeResidential: 'Residencial',
    modeAirbnb: 'Airbnb',
    portals: {
      owner: {
        title: 'Painel do dono',
        desc: 'Reservas, equipa e receita em tempo real.',
        cta: 'Abrir painel do dono',
        features: [
          'Agenda diária com atribuições',
          'Receita e faturação instantânea',
          'Equipa, clientes e propriedades',
        ],
        kpis: [
          { label: 'Hoje', value: '12 tarefas' },
          { label: 'Semana', value: '€2.4k' },
        ],
      },
      cleaner: {
        title: 'App do operário',
        desc: 'Agenda do dia e ganhos em tempo real.',
        cta: 'Abrir app do operário',
        features: [
          'Check-in com GPS e fotos',
          'Rota do dia otimizada',
          'Ganhos visíveis ao vivo',
        ],
        kpis: [
          { label: 'Hoje', value: '€40' },
          { label: 'Semana', value: '€280' },
        ],
      },
      client: {
        title: 'Portal do cliente',
        desc: 'Os seus clientes reservam em menos de um minuto.',
        cta: 'Abrir portal do cliente',
        features: [
          'Reserva em 30 segundos',
          'Chat direto com o seu limpador',
          'Pagamento seguro e recibos',
        ],
        kpis: [
          { label: 'Reserva', value: '30 seg' },
          { label: 'Rating', value: '4.8★' },
        ],
      },
    },
  },
};

export default async function HeroSection() {
  const locale = await getLocale();
  const t = COPY[locale];
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Subtle dot grid for depth — almost invisible but kills the flat feeling */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #0A0D18 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top nav — same brand mark, now dark-on-light */}
        <nav className="flex items-center justify-between py-5 sm:py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5"
            aria-label="Zapli"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#0A0D18] text-sm font-bold text-[#00D8C7] ring-1 ring-[#00D8C7]/40 shadow-[0_8px_18px_-8px_rgba(0,216,199,0.55)]">
              Z
            </span>
            <span className="font-display text-base font-semibold leading-tight text-slate-900">
              Zapli
              <span className="block text-[9.5px] font-medium uppercase tracking-[0.18em] text-[#00B8A8]">
                Smart Turnover &amp; Home Management
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <LocaleSwitcher current={locale} variant="premium" />
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              {t.signIn}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </nav>

        {/* Hero content */}
        <div className="pt-6 pb-10 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-700 ring-1 ring-inset ring-slate-200">
              <Sparkles className="h-3 w-3 text-[#00D8C7]" />
              {t.eyebrow}
            </span>

            <h1 className="mt-6 font-display text-3xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {t.headlineA}
              <span className="block text-slate-900">
                {t.headlineB}
              </span>
            </h1>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-50 ring-1 ring-inset ring-slate-200 px-1 py-1 text-[12px]">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 font-semibold text-slate-900 shadow-sm">
                <span aria-hidden>🏠</span>
                {t.modeResidential}
                <span
                  aria-hidden
                  className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-[#00D8C7] shadow-[0_0_6px_rgba(0,216,199,0.7)]"
                />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-transparent px-3 py-1 text-slate-600">
                <span aria-hidden>🏨</span>
                {t.modeAirbnb}
              </span>
            </div>

            <p className="mt-4 max-w-2xl text-base text-slate-600 sm:mt-6 sm:text-lg">
              {t.sub}
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#00D8C7] px-6 py-3 text-sm font-semibold text-[#0A0D18] shadow-[0_8px_24px_-6px_rgba(0,216,199,0.55),_inset_0_1px_0_rgba(255,255,255,0.35)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#2BF0DE] hover:shadow-[0_12px_28px_-6px_rgba(0,216,199,0.65),_inset_0_1px_0_rgba(255,255,255,0.45)]"
              >
                {t.ctaPrimary}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                {t.ctaSecondary}
              </Link>
            </div>

            <p className="mt-4 text-xs text-slate-500">{t.note}</p>
          </div>

          {/* Three portal cards — now fully clickable demos */}
          <div className="mt-8 sm:mt-16">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-semibold text-slate-900 sm:text-xl">
                  {t.portalsTitle}
                </h2>
                <p className="mt-1 text-sm text-slate-600">{t.portalsSub}</p>
              </div>
              <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-[#00D8C7]/30 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#0A0D18] sm:inline-flex">
                <PlayCircle className="h-3 w-3" />
                {t.demoBadge}
              </span>
            </div>
            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto -mx-4 px-4 pb-2 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0">
              <PortalCard
                label="Owner"
                title={t.portals.owner.title}
                description={t.portals.owner.desc}
                cta={t.portals.owner.cta}
                features={t.portals.owner.features}
                kpis={t.portals.owner.kpis}
                featureIcons={[Calendar, DollarSign, Building2]}
                icon={<Building2 className="h-4 w-4" />}
                href="/owner/preview"
                gradient="from-[#0A0D18] via-[#0A0D18] to-[#15151F]"
                chip="text-[#00D8C7] border-[#00D8C7]/40 bg-[#00D8C7]/10"
                accent="text-[#00D8C7]"
                bullet="bg-[#00D8C7]/15 text-[#00D8C7] ring-[#00D8C7]/30"
              />
              <PortalCard
                label="Cleaner"
                title={t.portals.cleaner.title}
                description={t.portals.cleaner.desc}
                cta={t.portals.cleaner.cta}
                features={t.portals.cleaner.features}
                kpis={t.portals.cleaner.kpis}
                featureIcons={[MapPin, Camera, Wallet]}
                icon={<Users className="h-4 w-4" />}
                href="/operative/preview"
                gradient="from-[#0A0D18] via-[#0F1925] to-[#0A2522]"
                chip="text-[#00D8C7] border-[#00D8C7]/50 bg-[#00D8C7]/15"
                accent="text-[#4FFFE5]"
                bullet="bg-[#00D8C7]/20 text-[#4FFFE5] ring-[#00D8C7]/40"
              />
              <PortalCard
                label="Client"
                title={t.portals.client.title}
                description={t.portals.client.desc}
                cta={t.portals.client.cta}
                features={t.portals.client.features}
                kpis={t.portals.client.kpis}
                featureIcons={[Bell, MessageSquare, CreditCard]}
                icon={<UserRound className="h-4 w-4" />}
                href="/client/preview"
                gradient="from-[#15151F] via-[#0A0D18] to-[#1A1F2E]"
                chip="text-[#00D8C7] border-[#00D8C7]/30 bg-[#00D8C7]/10"
                accent="text-[#A1A6BA]"
                bullet="bg-[#00D8C7]/10 text-[#00D8C7] ring-[#00D8C7]/20"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type IconLike = typeof Calendar;

function PortalCard({
  label,
  title,
  description,
  cta,
  features,
  kpis,
  featureIcons,
  icon,
  href,
  gradient,
  chip,
  accent,
  bullet,
}: {
  label: string;
  title: string;
  description: string;
  cta: string;
  features: string[];
  kpis: { label: string; value: string }[];
  featureIcons: IconLike[];
  icon: React.ReactNode;
  href: string;
  gradient: string;
  chip: string;
  accent: string;
  bullet: string;
}) {
  return (
    <Link
      href={href}
      aria-label={cta}
      className={`group relative flex min-w-[78%] snap-start flex-col overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-4 shadow-[0_22px_44px_-20px_rgba(10,13,24,0.6),_inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_56px_-18px_rgba(0,216,199,0.35),_inset_0_1px_0_rgba(255,255,255,0.1)] hover:ring-[#00D8C7]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D8C7]/60 sm:min-w-0 sm:p-5`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 hidden h-32 w-32 rounded-full bg-[#00D8C7]/15 blur-2xl transition duration-500 group-hover:bg-[#00D8C7]/25 sm:block"
      />
      <div className="relative flex items-start justify-between">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.22em] ${chip}`}
        >
          {label}
        </span>
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-white ring-1 ring-white/20 sm:h-8 sm:w-8">
          {icon}
        </span>
      </div>

      <div className="relative mt-5 sm:mt-8">
        <p className="font-display text-sm font-semibold text-white sm:text-base">{title}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-white/75 sm:text-xs">{description}</p>
      </div>

      {/* KPI mini-stats — gives buyers a glance at the kind of data each panel handles */}
      <div className="relative mt-3 hidden grid-cols-2 gap-2 sm:mt-4 sm:grid">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-xl bg-white/10 px-3 py-2 ring-1 ring-white/15 backdrop-blur-sm"
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/60">
              {k.label}
            </p>
            <p className={`mt-0.5 text-sm font-bold tabular-nums ${accent}`}>
              {k.value}
            </p>
          </div>
        ))}
      </div>

      {/* Feature bullets — what's inside */}
      <ul className="relative mt-3 space-y-2 sm:mt-4">
        {features.map((f, i) => {
          const Icon = featureIcons[i] ?? Star;
          return (
            <li
              key={f}
              className={`${i >= 2 ? 'hidden sm:flex' : 'flex'} items-center gap-2 text-[11px] text-white/85 sm:text-[12px]`}
            >
              <span
                className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md ring-1 ring-inset ${bullet}`}
              >
                <Icon className="h-2.5 w-2.5" />
              </span>
              <span className="leading-tight">{f}</span>
            </li>
          );
        })}
      </ul>

      {/* CTA — makes the whole card visibly clickable */}
      <div className="relative mt-4 flex items-center justify-between rounded-xl bg-white/12 px-3 py-1.5 ring-1 ring-white/15 transition group-hover:bg-white/20 sm:mt-5 sm:py-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-white sm:text-[11px]">
          {cta}
        </span>
        <ArrowRight className="h-4 w-4 text-white transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
