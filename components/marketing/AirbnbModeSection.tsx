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
  Sparkles,
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
 *
 * Palette discipline (professional Zapli):
 *  - Section bg: pure white. No teal wash, no ambient teal blobs.
 *  - Headline: solid slate-900 (no teal text).
 *  - Eyebrow chip: slate-100 + slate-700 + tiny teal sparkle dot.
 *  - Portal cards (BOTH): dark midnight gradient with bright teal chips
 *    (rule 2: bright teal floods are only allowed on dark surfaces).
 *  - Callout: white + slate-200 border + small teal accent dot.
 *  - Teal (#10B981) reserved for micro-accents: dots, sparkles, focus rings,
 *    chip text inside dark cards, KPI values inside dark cards.
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
    <section className="relative overflow-hidden bg-white">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Eyebrow + headline — slate-100 chip with a tiny teal sparkle dot */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-700">
            <Sparkles className="h-3 w-3 text-[#10B981]" />
            {t.eyebrow}
          </span>
          <h2 className="mt-6 font-display text-3xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {t.headline}
          </h2>
          <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            {t.sub}
          </p>
        </div>

        {/* Two portal cards — BOTH dark midnight (rule 2: bright teal only floods on dark surfaces) */}
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
          <PortalCardDark
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

        {/* Why only two portals callout — white card, slate-200 border, tiny teal dot */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 ring-1 ring-slate-200">
              <House className="h-4 w-4" />
              <span
                aria-hidden
                className="absolute -mt-5 ml-5 h-1.5 w-1.5 rounded-full bg-[#10B981]"
              />
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
 * Dark midnight card — used for BOTH the OWNER (host) and CLEANER (operative)
 * portals. Per palette rule 2, bright teal floods are only allowed on dark
 * surfaces, so both cards stay on the midnight family for consistency.
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
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A0D18] via-[#0A0D18] to-[#111524] p-5 shadow-[0_18px_34px_-18px_rgba(10,13,24,0.55)] ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:shadow-[0_24px_40px_-18px_rgba(10,13,24,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/60"
    >
      <div className="relative flex items-start justify-between">
        {/* Bright teal chip — allowed flood per rule 2 (dark surface) */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#10B981] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#0A0D18]">
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

      {/* KPI mini-stats — teal-300 for readability on dark per rule 8 */}
      <div className="relative mt-4 grid grid-cols-2 gap-2">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-xl bg-white/[0.06] px-3 py-2 ring-1 ring-white/10 backdrop-blur-sm"
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/55">
              {k.label}
            </p>
            <p className="mt-0.5 text-sm font-bold tabular-nums text-[#5EEAD4]">
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
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#10B981]/15 text-[#5EEAD4] ring-1 ring-inset ring-[#10B981]/25">
                <Icon className="h-2.5 w-2.5" />
              </span>
              <span className="leading-tight">{f}</span>
            </li>
          );
        })}
      </ul>

      {/* CTA pill — primary CTA on dark = bright teal fill, midnight text (rule 2) */}
      <div className="relative mt-5 flex items-center justify-between rounded-xl bg-[#10B981] px-3 py-2 transition group-hover:shadow-[0_0_24px_rgba(0,216,199,0.45)]">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A0D18]">
          {cta}
        </span>
        <ArrowRight className="h-4 w-4 text-[#0A0D18] transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
