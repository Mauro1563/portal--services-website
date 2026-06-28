import Link from 'next/link';
import {
  ArrowRight,
  House,
  Building2,
  Users,
  CalendarClock,
  Clock,
  Bell,
  Camera,
  CheckSquare,
  Wallet,
  Star,
} from 'lucide-react';
import { getLocale, type Locale } from '@/lib/i18n';

/**
 * Per-locale copy for the Airbnb mode marketing section.
 *
 * This section is the Zapli-palette counterpart to the residential hero: it
 * pitches the *same* platform reshaped for short-let hosts. There are only
 * two portal cards on purpose — for Airbnb turnovers the host IS the client,
 * and the actual guest interacts with Airbnb, not us. The callout at the
 * bottom calls that out so visitors don't think a portal is missing.
 */
type PortalCopy = {
  badge: string;
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
    headline: string;
    sub: string;
    owner: PortalCopy;
    cleaner: PortalCopy;
    calloutTitle: string;
    calloutBody: string;
  }
> = {
  es: {
    eyebrow: 'MODO AIRBNB',
    headline: 'Lo mismo, pero para hosts.',
    sub: 'Para Airbnb solo hacen falta dos portales: el host (que también es el cliente) y el operario que entra entre check-out y check-in. El huésped pasa por Airbnb, no por nosotros.',
    owner: {
      badge: 'OWNER',
      title: 'Panel del host',
      desc: 'Calendarios sincronizados y turnovers organizados solos.',
      cta: 'Ver panel del host',
      features: [
        'Sincronización iCal con Airbnb',
        'Agenda de turnovers automática',
        'Alertas de reposición de stock',
      ],
      kpis: [
        { label: 'Turnovers/sem', value: '14' },
        { label: 'Tiempo medio', value: '2h45m' },
      ],
    },
    cleaner: {
      badge: 'CLEANER',
      title: 'App del operario Airbnb',
      desc: 'Cuenta atrás al check-in y checklist sin saltos.',
      cta: 'Ver app del operario',
      features: [
        'Cuenta atrás al check-in',
        'Checklist obligatorio por turnover',
        'Foto obligatoria por habitación',
      ],
      kpis: [
        { label: 'Pago/turnover', value: '£35' },
        { label: 'Rating', value: '4.9★' },
      ],
    },
    calloutTitle: '¿Y el portal del cliente?',
    calloutBody:
      'En Airbnb el host es el cliente — gestiona él mismo sus propiedades. El huésped no necesita portal: reserva, paga y se comunica por Airbnb. Dos portales, cero fricción.',
  },
  en: {
    eyebrow: 'AIRBNB MODE',
    headline: 'Same platform, built for hosts.',
    sub: 'For Airbnb you only need two portals: the host (who is also the client) and the operative who runs the turnover between check-out and check-in. The guest stays on Airbnb, not on us.',
    owner: {
      badge: 'OWNER',
      title: 'Host dashboard',
      desc: 'Synced calendars and turnovers that organise themselves.',
      cta: 'Open host dashboard',
      features: [
        'iCal sync with Airbnb',
        'Auto-built turnover schedule',
        'Restock alerts before guests arrive',
      ],
      kpis: [
        { label: 'Turnovers/wk', value: '14' },
        { label: 'Avg time', value: '2h45m' },
      ],
    },
    cleaner: {
      badge: 'CLEANER',
      title: 'Airbnb operative app',
      desc: 'Check-in countdown with a step-by-step checklist.',
      cta: 'Open operative app',
      features: [
        'Countdown to next check-in',
        'Mandatory turnover checklist',
        'Required photo per room',
      ],
      kpis: [
        { label: 'Pay/turnover', value: '£35' },
        { label: 'Rating', value: '4.9★' },
      ],
    },
    calloutTitle: 'Why no customer portal?',
    calloutBody:
      'On Airbnb the host IS the customer — they own and manage their listings. The guest never needs a portal: they book, pay and chat inside Airbnb. Two portals, zero friction.',
  },
  pt: {
    eyebrow: 'MODO AIRBNB',
    headline: 'A mesma plataforma, feita para hosts.',
    sub: 'Para Airbnb só precisa de dois portais: o host (que também é o cliente) e o operário que faz o turnover entre check-out e check-in. O hóspede fica no Airbnb, não em nós.',
    owner: {
      badge: 'OWNER',
      title: 'Painel do host',
      desc: 'Calendários sincronizados e turnovers que se organizam sozinhos.',
      cta: 'Abrir painel do host',
      features: [
        'Sincronização iCal com Airbnb',
        'Agenda de turnovers automática',
        'Alertas de reposição de stock',
      ],
      kpis: [
        { label: 'Turnovers/sem', value: '14' },
        { label: 'Tempo médio', value: '2h45m' },
      ],
    },
    cleaner: {
      badge: 'CLEANER',
      title: 'App do operário Airbnb',
      desc: 'Contagem decrescente ao check-in e checklist passo-a-passo.',
      cta: 'Abrir app do operário',
      features: [
        'Contagem decrescente ao check-in',
        'Checklist obrigatório por turnover',
        'Foto obrigatória por divisão',
      ],
      kpis: [
        { label: 'Pago/turnover', value: '£35' },
        { label: 'Rating', value: '4.9★' },
      ],
    },
    calloutTitle: 'E o portal do cliente?',
    calloutBody:
      'No Airbnb o host é o cliente — gere ele próprio as propriedades. O hóspede não precisa de portal: reserva, paga e fala pelo Airbnb. Dois portais, zero fricção.',
  },
};

export default async function AirbnbModeSection() {
  const locale = await getLocale();
  const t = COPY[locale];

  return (
    <section className="relative overflow-hidden bg-slate-50">
      {/* Soft teal ambient blob — keeps the section grounded in the Zapli palette */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-[#00D8C7]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 -right-32 h-96 w-96 rounded-full bg-[#00D8C7]/[0.08] blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Eyebrow + headline */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#00D8C7]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#0A0D18] ring-1 ring-[#00D8C7]/30">
            <House className="h-3 w-3" />
            {t.eyebrow}
          </span>
          <h2 className="mt-6 font-display text-3xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {t.headline}
          </h2>
          <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            {t.sub}
          </p>
        </div>

        {/* Two portal cards — host (dark midnight) + operative (light platinum) */}
        <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2">
          <PortalCardDark
            label={t.owner.badge}
            title={t.owner.title}
            description={t.owner.desc}
            cta={t.owner.cta}
            features={t.owner.features}
            kpis={t.owner.kpis}
            featureIcons={[CalendarClock, Clock, Bell]}
            icon={<Building2 className="h-4 w-4" />}
            href="/owner/preview-airbnb"
          />
          <PortalCardLight
            label={t.cleaner.badge}
            title={t.cleaner.title}
            description={t.cleaner.desc}
            cta={t.cleaner.cta}
            features={t.cleaner.features}
            kpis={t.cleaner.kpis}
            featureIcons={[Clock, CheckSquare, Camera]}
            icon={<Users className="h-4 w-4" />}
            href="/operative/preview-airbnb"
          />
        </div>

        {/* Why only two portals callout — neutral slate, teal icon tile */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#00D8C7]/15 text-[#0A0D18] ring-1 ring-[#00D8C7]/30">
              <House className="h-4 w-4" />
            </span>
            <div>
              <p className="font-display text-sm font-semibold text-slate-900 sm:text-base">
                {t.calloutTitle}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-600 sm:text-sm">
                {t.calloutBody}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type IconLike = typeof Wallet;

type PortalCardProps = {
  label: string;
  title: string;
  description: string;
  cta: string;
  features: string[];
  kpis: { label: string; value: string }[];
  featureIcons: IconLike[];
  icon: React.ReactNode;
  href: string;
};

/**
 * Dark midnight card — used for the OWNER (host) portal. Teal accents on a
 * #0A0D18 base mirror the brand's "control center" feel.
 */
function PortalCardDark({
  label,
  title,
  description,
  cta,
  features,
  kpis,
  featureIcons,
  icon,
  href,
}: PortalCardProps) {
  return (
    <Link
      href={href}
      aria-label={cta}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A0D18] via-[#0A0D18] to-[#111524] p-5 shadow-[0_18px_34px_-18px_rgba(10,13,24,0.55)] ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:shadow-[0_24px_40px_-18px_rgba(10,13,24,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D8C7]/60"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#00D8C7]/15 blur-2xl"
      />
      <div className="relative flex items-start justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00D8C7]/40 bg-[#00D8C7]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#00D8C7]">
          {label}
        </span>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white ring-1 ring-white/15">
          {icon}
        </span>
      </div>

      <div className="relative mt-5">
        <p className="font-display text-base font-semibold text-white">
          {title}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-white/70">
          {description}
        </p>
      </div>

      {/* KPI mini-stats */}
      <div className="relative mt-4 grid grid-cols-2 gap-2">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-xl bg-white/[0.06] px-3 py-2 ring-1 ring-white/10 backdrop-blur-sm"
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/55">
              {k.label}
            </p>
            <p className="mt-0.5 text-sm font-bold tabular-nums text-[#00D8C7]">
              {k.value}
            </p>
          </div>
        ))}
      </div>

      {/* Feature bullets */}
      <ul className="relative mt-4 space-y-2">
        {features.map((f, i) => {
          const Icon = featureIcons[i] ?? Star;
          return (
            <li
              key={f}
              className="flex items-center gap-2 text-[12px] text-white/85"
            >
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#00D8C7]/15 text-[#00D8C7] ring-1 ring-inset ring-[#00D8C7]/25">
                <Icon className="h-2.5 w-2.5" />
              </span>
              <span className="leading-tight">{f}</span>
            </li>
          );
        })}
      </ul>

      {/* CTA pill */}
      <div className="relative mt-5 flex items-center justify-between rounded-xl bg-white/[0.08] px-3 py-2 ring-1 ring-white/15 transition group-hover:bg-[#00D8C7]/15 group-hover:ring-[#00D8C7]/40 group-hover:shadow-[0_0_24px_rgba(0,216,199,0.35)]">
        <span className="text-[11px] font-bold uppercase tracking-wider text-white">
          {cta}
        </span>
        <ArrowRight className="h-4 w-4 text-white transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

/**
 * Light platinum card — used for the CLEANER (operative) portal. White surface
 * with a teal accent border and chip keeps it visually distinct from the dark
 * owner card while staying inside the Zapli palette.
 */
function PortalCardLight({
  label,
  title,
  description,
  cta,
  features,
  kpis,
  featureIcons,
  icon,
  href,
}: PortalCardProps) {
  return (
    <Link
      href={href}
      aria-label={cta}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-[0_18px_34px_-22px_rgba(15,23,42,0.25)] ring-1 ring-[#00D8C7]/30 transition hover:-translate-y-0.5 hover:shadow-[0_24px_40px_-22px_rgba(0,216,199,0.35)] hover:ring-[#00D8C7]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D8C7]/60"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#00D8C7]/10 blur-2xl"
      />
      <div className="relative flex items-start justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00D8C7]/30 bg-[#00D8C7]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#0A0D18]">
          {label}
        </span>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#00D8C7]/15 text-[#0A0D18] ring-1 ring-[#00D8C7]/30">
          {icon}
        </span>
      </div>

      <div className="relative mt-5">
        <p className="font-display text-base font-semibold text-[#1A1A1A]">
          {title}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          {description}
        </p>
      </div>

      {/* KPI mini-stats */}
      <div className="relative mt-4 grid grid-cols-2 gap-2">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200"
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
              {k.label}
            </p>
            <p className="mt-0.5 text-sm font-bold tabular-nums text-[#0A0D18]">
              {k.value}
            </p>
          </div>
        ))}
      </div>

      {/* Feature bullets */}
      <ul className="relative mt-4 space-y-2">
        {features.map((f, i) => {
          const Icon = featureIcons[i] ?? Star;
          return (
            <li
              key={f}
              className="flex items-center gap-2 text-[12px] text-slate-700"
            >
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#00D8C7]/15 text-[#0A0D18] ring-1 ring-inset ring-[#00D8C7]/30">
                <Icon className="h-2.5 w-2.5" />
              </span>
              <span className="leading-tight">{f}</span>
            </li>
          );
        })}
      </ul>

      {/* CTA pill */}
      <div className="relative mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200 transition group-hover:bg-[#00D8C7]/15 group-hover:ring-[#00D8C7]/40">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A0D18]">
          {cta}
        </span>
        <ArrowRight className="h-4 w-4 text-[#0A0D18] transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
