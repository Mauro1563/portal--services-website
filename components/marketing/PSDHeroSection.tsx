/**
 * PSDHeroSection — Portal Services Digital umbrella hero.
 *
 * Light modern hero: soft blue gradient bg, gradient headline, and
 * two LIGHT solution cards with per-card accent (Workforce blue,
 * Home green). Cards are interactive:
 *   - Persistent CSS-only pulses on the "live" indicator dot.
 *   - Soft accent-color ring that appears on hover.
 *   - Icon tile pops (scale + rotate) on hover.
 *   - Arrow in the CTA slides right on hover.
 *   - Chip glows when the parent card is hovered.
 * All animations respect prefers-reduced-motion via media queries
 * baked into Tailwind's `motion-reduce:` variant.
 */

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import {
  ArrowRight,
  Users,
  Home as HomeIcon,
  Sparkles,
  TrendingUp,
  Activity,
} from 'lucide-react';

export default async function PSDHeroSection() {
  const t = await getTranslations('psd.landing.hero');

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-[#EFF6FF]"
    >
      {/* Ambient depth — cool blobs bring life without darkening */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-[#2563EB]/12 blur-3xl motion-safe:animate-pulse"
        style={{ animationDuration: '6s' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 h-[26rem] w-[26rem] rounded-full bg-[#10B981]/10 blur-3xl motion-safe:animate-pulse"
        style={{ animationDuration: '7s', animationDelay: '1s' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #0F172A 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage:
            'radial-gradient(ellipse at center, black 45%, transparent 90%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-10 pb-16 sm:pt-16 sm:pb-24">
        {/* Eyebrow — no longer the brand wordmark (which lives in the navbar
             right above). Now it's a category tag with dual dot preview of
             the two solutions Workforce (blue) + Home (green), acting as a
             visual promise of the two cards that land below the headline. */}
        <span className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white/85 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-800 shadow-sm backdrop-blur">
          <Sparkles className="h-3 w-3 text-[#2563EB]" aria-hidden />
          <span className="flex items-center gap-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#2563EB] opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
            </span>
            <span
              className="relative flex h-1.5 w-1.5"
              style={{ animationDelay: '0.6s' }}
            >
              <span
                className="absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-60 motion-safe:animate-ping"
                style={{ animationDelay: '0.6s' }}
              />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10B981]" />
            </span>
          </span>
          {t('eyebrow')}
        </span>

        {/* Headline — slate body, gradient accent word */}
        <h1 className="font-display mt-5 max-w-4xl text-3xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          {t('title').split(' ').slice(0, -3).join(' ')}{' '}
          <span className="bg-gradient-to-r from-[#2563EB] via-[#0EA5A4] to-[#10B981] bg-clip-text text-transparent">
            {t('title').split(' ').slice(-3).join(' ')}
          </span>
        </h1>

        {/* Sub */}
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
          {t('subtitle')}
        </p>

        {/* Micro-metrics strip — three anonymous stats bringing brand colors
             into the top of the fold before the solution cards land. */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#EFF6FF]">
              <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
            </span>
            <span className="font-semibold tabular-nums text-slate-900">
              +59
            </span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
              operativos activos
            </span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#ECFDF5]">
              <span className="h-2 w-2 rounded-full bg-[#10B981]" />
            </span>
            <span className="font-semibold tabular-nums text-slate-900">7</span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
              edificios gestionados
            </span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-[#EFF6FF] to-[#ECFDF5]">
              <span className="h-2 w-2 rounded-full bg-gradient-to-br from-[#2563EB] to-[#10B981]" />
            </span>
            <span className="font-semibold tabular-nums text-slate-900">3</span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
              idiomas
            </span>
          </div>
        </div>

        {/* Two solution cards — LIGHT surfaces with per-accent interactivity */}
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <SolutionCard
            accent="blue"
            eyebrow="Workforce"
            title={t('workforce.title')}
            body={t('workforce.body')}
            cta={t('workforce.cta')}
            href="#soluciones"
            Icon={Users}
            LiveIcon={Activity}
            liveText="+59 live"
          />
          <SolutionCard
            accent="green"
            eyebrow="Home"
            title={t('home.title')}
            body={t('home.body')}
            cta={t('home.cta')}
            href="#home-solution"
            Icon={HomeIcon}
            LiveIcon={TrendingUp}
            liveText="+12 hoy"
          />
        </div>
      </div>
    </section>
  );
}

type Accent = 'blue' | 'green';

const PALETTE: Record<
  Accent,
  {
    // Card surface — deep saturated gradient (previous dark treatment
    // the user asked to restore).
    cardBg: string;
    // Chip on the dark card.
    chipBg: string;
    chipText: string;
    chipDot: string;
    // Icon in the top-right corner of the card.
    iconColor: string;
    // Bottom CTA pill.
    ctaBg: string;
    ctaText: string;
    ctaHover: string;
    // Ambient corner glow.
    glow: string;
  }
> = {
  blue: {
    cardBg:
      'bg-gradient-to-br from-[#0B1327] via-[#0F1B3D] to-[#0B2A6B]',
    chipBg: 'rgba(37,99,235,0.22)',
    chipText: '#93C5FD',
    chipDot: '#60A5FA',
    iconColor: '#60A5FA',
    ctaBg: '#2563EB',
    ctaText: '#FFFFFF',
    ctaHover: '#1D4ED8',
    glow: 'rgba(37,99,235,0.32)',
  },
  green: {
    cardBg:
      'bg-gradient-to-br from-[#052E2A] via-[#064E3B] to-[#065F46]',
    chipBg: 'rgba(16,185,129,0.22)',
    chipText: '#A7F3D0',
    chipDot: '#34D399',
    iconColor: '#34D399',
    ctaBg: '#A7F3D0',
    ctaText: '#065F46',
    ctaHover: '#6EE7B7',
    glow: 'rgba(16,185,129,0.32)',
  },
};

function SolutionCard({
  accent,
  eyebrow,
  title,
  body,
  cta,
  href,
  Icon,
  LiveIcon,
  liveText,
}: {
  accent: Accent;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  Icon: typeof Users;
  LiveIcon: typeof Activity;
  liveText: string;
}) {
  const p = PALETTE[accent];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/5 p-6 text-white transition duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${p.cardBg}`}
      style={{
        boxShadow: `0 20px 40px -20px ${p.glow}, 0 1px 0 rgba(255,255,255,0.05) inset`,
      }}
    >
      {/* Accent corner glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-70 blur-3xl transition duration-500 group-hover:opacity-100"
        style={{ background: p.glow }}
      />
      {/* Subtle noise/pattern overlay for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #FFFFFF 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      {/* Row 1: chip + live pulse + icon */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
            style={{ backgroundColor: p.chipBg, color: p.chipText }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-70 motion-safe:animate-ping"
                style={{ backgroundColor: p.chipDot }}
              />
              <span
                className="relative inline-flex h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: p.chipDot }}
              />
            </span>
            {eyebrow}
          </span>
          {/* Live counter chip — muted white surface on dark card */}
          <span
            className="hidden items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/85 backdrop-blur sm:inline-flex"
            title="Live activity"
          >
            <LiveIcon
              className="h-3 w-3 transition motion-safe:group-hover:animate-pulse"
              style={{ color: p.chipDot }}
            />
            {liveText}
          </span>
        </div>

        {/* Icon — top-right, colored outline style (matches mockup) */}
        <Icon
          className="h-6 w-6 transition duration-500 group-hover:scale-110 group-hover:rotate-[-6deg] motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0"
          style={{ color: p.iconColor }}
          aria-hidden
        />
      </div>

      {/* Title */}
      <h2 className="font-display relative mt-8 text-2xl font-bold text-white sm:text-3xl">
        {title}
      </h2>

      {/* Body */}
      <p className="relative mt-3 text-sm leading-relaxed text-white/70">
        {body}
      </p>

      {/* CTA — arrow slides right on hover */}
      <div className="relative mt-8">
        <Link
          href={href}
          className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-lg transition duration-200 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          style={{
            backgroundColor: p.ctaBg,
            color: p.ctaText,
          }}
        >
          {cta}
          <ArrowRight
            className="h-4 w-4 transition duration-300 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
            aria-hidden
          />
        </Link>
      </div>
    </div>
  );
}
