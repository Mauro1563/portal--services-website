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
 * This section is the warm-toned counterpart to the residential hero: it
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
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/40 to-white">
      {/* Warm decorative blobs — sets this section apart from the cool residential hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-orange-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 -right-32 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Eyebrow + headline */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-700 ring-1 ring-orange-200">
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

        {/* Two portal cards — host + operative */}
        <div className="mt-8 grid gap-5 sm:mt-12 md:grid-cols-2">
          <PortalCard
            label={t.owner.badge}
            title={t.owner.title}
            description={t.owner.desc}
            cta={t.owner.cta}
            features={t.owner.features}
            kpis={t.owner.kpis}
            featureIcons={[CalendarClock, Clock, Bell]}
            icon={<Building2 className="h-4 w-4" />}
            href="/owner/preview-airbnb"
            gradient="from-slate-800 via-slate-900 to-orange-900"
            chip="text-orange-200 border-orange-200/40 bg-orange-200/10"
            accent="text-orange-100"
            bullet="bg-orange-400/15 text-orange-100 ring-orange-200/20"
          />
          <PortalCard
            label={t.cleaner.badge}
            title={t.cleaner.title}
            description={t.cleaner.desc}
            cta={t.cleaner.cta}
            features={t.cleaner.features}
            kpis={t.cleaner.kpis}
            featureIcons={[Clock, CheckSquare, Camera]}
            icon={<Users className="h-4 w-4" />}
            href="/operative/preview-airbnb"
            gradient="from-orange-500 via-orange-600 to-amber-700"
            chip="text-orange-50 border-orange-100/40 bg-orange-100/10"
            accent="text-orange-50"
            bullet="bg-amber-400/20 text-orange-50 ring-orange-100/30"
          />
        </div>

        {/* Why only two portals callout */}
        <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50/70 px-5 py-4 sm:mt-8 sm:px-6 sm:py-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-700 ring-1 ring-orange-200">
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
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 shadow-[0_18px_34px_-18px_rgba(15,23,42,0.45)] ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:shadow-[0_24px_40px_-18px_rgba(15,23,42,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60`}
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

      <div className="relative mt-6 sm:mt-8">
        <p className="font-display text-base font-semibold text-white">
          {title}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-white/75">
          {description}
        </p>
      </div>

      {/* KPI mini-stats */}
      <div className="relative mt-4 grid grid-cols-2 gap-2">
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

      {/* Feature bullets */}
      <ul className="relative mt-4 space-y-2">
        {features.map((f, i) => {
          const Icon = featureIcons[i] ?? Star;
          return (
            <li
              key={f}
              className="flex items-center gap-2 text-[12px] text-white/85"
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

      {/* CTA pill */}
      <div className="relative mt-5 flex items-center justify-between rounded-xl bg-white/12 px-3 py-2 ring-1 ring-white/15 transition group-hover:bg-white/20">
        <span className="text-[11px] font-bold uppercase tracking-wider text-white">
          {cta}
        </span>
        <ArrowRight className="h-4 w-4 text-white transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
