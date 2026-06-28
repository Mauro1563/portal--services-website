import Link from 'next/link';
import {
  ArrowRight,
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
    headlineEmphasis: string; // the italicised word — gets a mandarin underline
    headlineB: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    note: string;
    signIn: string;
    demoBadge: string;
    portalsTitle: string;
    portalsSub: string;
    portals: {
      owner: PortalCopy;
      cleaner: PortalCopy;
      client: PortalCopy;
    };
  }
> = {
  es: {
    eyebrow: "hoy en producción",
    headlineA: 'Gestiona tu empresa de limpieza',
    headlineEmphasis: 'sin',
    headlineB: ' papeles ni hojas de cálculo.',
    sub: 'Reservas, equipos y cobros conectados en un mismo sitio. Tus operarios fichan, tus clientes reservan online y tú lo controlas todo desde un panel claro.',
    ctaPrimary: 'Prueba gratis',
    ctaSecondary: 'Iniciar sesión',
    note: 'Sin tarjeta de crédito. Cancelas cuando quieras.',
    signIn: 'Iniciar sesión',
    demoBadge: 'demo en vivo',
    portalsTitle: 'Tres apps, un mismo sistema.',
    portalsSub: 'Toca cualquiera para entrar a su demo en vivo — sin registro.',
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
    eyebrow: 'now shipping',
    headlineA: 'Run your cleaning business',
    headlineEmphasis: 'without',
    headlineB: ' paperwork or spreadsheets.',
    sub: 'Bookings, teams and payments in one place. Your cleaners clock in, your customers book online, and you stay on top with a clear dashboard.',
    ctaPrimary: 'Start free',
    ctaSecondary: 'Sign in',
    note: 'No credit card. Cancel anytime.',
    signIn: 'Sign in',
    demoBadge: 'live demo',
    portalsTitle: 'Three apps, one system.',
    portalsSub: 'Tap any to enter the live demo — no sign-up.',
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
    eyebrow: 'agora em produção',
    headlineA: 'Gere a sua empresa de limpeza',
    headlineEmphasis: 'sem',
    headlineB: ' papelada nem folhas de cálculo.',
    sub: 'Reservas, equipas e cobranças num só lugar. As suas limpadoras fazem check-in, os clientes reservam online e você controla tudo num painel claro.',
    ctaPrimary: 'Experimentar grátis',
    ctaSecondary: 'Entrar',
    note: 'Sem cartão de crédito. Cancele quando quiser.',
    signIn: 'Entrar',
    demoBadge: 'demo ao vivo',
    portalsTitle: 'Três apps, um sistema.',
    portalsSub: 'Toque em qualquer uma para abrir o demo — sem registo.',
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
    <section className="relative overflow-hidden bg-[#F4EFE6] ps-paper-grain">
      <div className="relative max-w-[1280px] mx-auto px-6 md:px-12">
        {/* Top nav — Instrument Serif wordmark with mandarin period.
            Replaces the cyan→blue gradient square. */}
        <nav className="flex items-center justify-between py-6 md:py-8">
          <Link
            href="/"
            className="inline-flex items-baseline gap-0 text-[#141414]"
            aria-label="Portal Services"
          >
            <span
              className="font-serif text-[18px] leading-none tracking-[-0.01em]"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Portal
            </span>
            <span className="mx-[3px] text-[18px] leading-none text-[#FF5B1F]">.</span>
            <span
              className="font-serif text-[18px] leading-none tracking-[-0.01em]"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Services
            </span>
            <span className="ml-3 hidden text-[13px] text-[#54524D] sm:inline">
              Cleaning &amp; Facilities
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <LocaleSwitcher current={locale} variant="onLight" />
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#1414141A] bg-transparent px-4 py-2 text-sm font-medium text-[#141414] transition-colors hover:bg-[#E4DACA]"
              style={{ transitionDuration: '160ms' }}
            >
              {t.signIn}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </nav>

        {/* Hero — 7/5 asymmetric magazine layout */}
        <div className="grid grid-cols-1 gap-12 pt-12 pb-24 md:pt-24 md:pb-40 lg:grid-cols-12 lg:gap-10 lg:pt-32 lg:pb-48">
          {/* Left column — magazine type, 7 of 12 */}
          <div className="lg:col-span-7 ps-set">
            {/* Mono micro-line with mandarin underline — replaces the eyebrow pill */}
            <p
              className="text-[12px] text-[#141414]"
              style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace", letterSpacing: 0 }}
            >
              <span
                className="pb-1"
                style={{
                  backgroundImage: 'linear-gradient(#FF5B1F, #FF5B1F)',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '100% 1px',
                  backgroundPosition: '0 calc(100% + 4px)',
                }}
              >
                {t.eyebrow}
              </span>
            </p>

            <h1
              className="mt-8 text-[44px] leading-[0.92] tracking-[-0.04em] text-[#141414] md:mt-10 md:text-[88px] lg:text-[112px]"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400 }}
            >
              {t.headlineA}{' '}
              <em
                className="not-italic"
                style={{ fontStyle: 'italic' }}
              >
                <span
                  className="pb-1"
                  style={{
                    backgroundImage: 'linear-gradient(#FF5B1F, #FF5B1F)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% 1px',
                    backgroundPosition: '0 calc(100% - 2px)',
                  }}
                >
                  {t.headlineEmphasis}
                </span>
              </em>
              {t.headlineB}
            </h1>

            <p className="mt-8 max-w-[62ch] text-[18px] leading-[1.45] text-[#54524D] md:text-[22px]">
              {t.sub}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF5B1F] px-7 py-3.5 text-sm font-semibold text-[#1A0A04] transition-colors hover:bg-[#E84D14]"
                style={{ transitionDuration: '160ms' }}
              >
                {t.ctaPrimary}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1414141A] bg-transparent px-7 py-3.5 text-sm font-semibold text-[#141414] transition-colors hover:bg-[#E4DACA]"
                style={{ transitionDuration: '160ms' }}
              >
                {t.ctaSecondary}
              </Link>
            </div>

            <p
              className="mt-6 text-[12px] text-[#54524D]"
              style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace" }}
            >
              {t.note}
            </p>
          </div>

          {/* Right column — three portal cards stacked, 5 of 12.
              Cleaner card is the "expanded" highlight (ink). */}
          <div className="lg:col-span-5">
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2
                className="text-[24px] leading-[1] tracking-[-0.02em] text-[#141414] md:text-[28px]"
                style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400 }}
              >
                {t.portalsTitle}
              </h2>
              <span
                className="hidden shrink-0 text-[12px] text-[#141414] sm:inline"
                style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace" }}
              >
                <span
                  className="pb-1"
                  style={{
                    backgroundImage: 'linear-gradient(#FF5B1F, #FF5B1F)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% 1px',
                    backgroundPosition: '0 calc(100% + 4px)',
                  }}
                >
                  {t.demoBadge}
                </span>
              </span>
            </div>
            <p className="mb-6 text-[15px] leading-[1.55] text-[#54524D]">{t.portalsSub}</p>

            {/* Horizontal snap row on mobile, stacked column on desktop */}
            <div className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 md:mx-0 md:flex-col md:gap-4 md:overflow-visible md:px-0 md:pb-0">
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
                variant="standard"
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
                variant="highlight"
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
                variant="standard"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hairline divider at the foot of the section — small mandarin notch */}
      <div className="relative mx-auto max-w-[1280px] px-6 md:px-12">
        <div className="relative h-px bg-[#1414141A]">
          <span
            aria-hidden
            className="absolute left-0 top-1/2 h-[6px] w-[3px] -translate-y-1/2 bg-[#FF5B1F]"
          />
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
  variant,
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
  variant: 'standard' | 'highlight';
}) {
  // Editorial paper cards. Standard = clay on paper. Highlight = ink card,
  // the "one important card per screen" inversion that replaces the old
  // gradient tiles. Hairline border only, no shadows. 12px radius.
  const isHighlight = variant === 'highlight';
  const surface = isHighlight
    ? 'bg-[#141414] text-[#F4EFE6] border-0'
    : 'bg-[#E4DACA] text-[#141414] border border-[#1414141A]';
  const meta = isHighlight ? 'text-[#F4EFE6]/65' : 'text-[#54524D]';
  const ctaBg = isHighlight
    ? 'bg-[#FF5B1F] text-[#1A0A04]'
    : 'bg-[#141414] text-[#F4EFE6]';

  return (
    <Link
      href={href}
      aria-label={cta}
      className={`group relative flex min-w-[78%] snap-start flex-col overflow-hidden rounded-[12px] p-7 transition-transform md:min-w-0 md:p-8 ${surface}`}
      style={{ transitionDuration: '280ms', transitionTimingFunction: 'cubic-bezier(0.2,0.8,0.2,1)' }}
    >
      <div className="flex items-start justify-between">
        <span
          className="text-[12px]"
          style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace" }}
        >
          <span
            className="pb-1"
            style={{
              backgroundImage: 'linear-gradient(#FF5B1F, #FF5B1F)',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100% 1px',
              backgroundPosition: '0 calc(100% + 4px)',
            }}
          >
            {label.toLowerCase()}
          </span>
        </span>
        <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${isHighlight ? 'bg-[#F4EFE6]/10' : 'bg-[#141414]/5'}`}>
          {icon}
        </span>
      </div>

      <div className="mt-8">
        <p
          className="text-[24px] leading-[1] tracking-[-0.02em] md:text-[28px]"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400 }}
        >
          {title}
        </p>
        <p className={`mt-3 text-[14px] leading-[1.5] ${meta}`}>{description}</p>
      </div>

      {/* KPI mini-stats — printed-receipt setting, no glass, no gradient */}
      <div className="mt-6 hidden grid-cols-2 gap-px overflow-hidden rounded-[12px] sm:grid">
        {kpis.map((k) => (
          <div
            key={k.label}
            className={`px-4 py-3 ${isHighlight ? 'bg-[#F4EFE6]/[0.06]' : 'bg-[#141414]/[0.04]'}`}
          >
            <p
              className={`text-[12px] ${meta}`}
              style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace" }}
            >
              {k.label.toLowerCase()}
            </p>
            <p
              className="mt-1 text-[22px] leading-[1] tabular-nums"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400 }}
            >
              {k.value}
            </p>
          </div>
        ))}
      </div>

      <ul className="mt-6 space-y-2.5">
        {features.map((f, i) => {
          const Icon = featureIcons[i] ?? Star;
          return (
            <li
              key={f}
              className={`${i >= 2 ? 'hidden sm:flex' : 'flex'} items-center gap-2.5 text-[13px] leading-[1.4] ${meta}`}
            >
              <Icon className="h-3 w-3 shrink-0" />
              <span>{f}</span>
            </li>
          );
        })}
      </ul>

      <div className={`mt-7 inline-flex items-center justify-between rounded-full px-4 py-2 ${ctaBg}`}>
        <span
          className="text-[12px]"
          style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace" }}
        >
          {cta.toLowerCase()}
        </span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" style={{ transitionDuration: '280ms' }} />
      </div>
    </Link>
  );
}
