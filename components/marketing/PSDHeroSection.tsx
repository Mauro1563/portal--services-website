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

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
        {/* Eyebrow with a live pulse dot */}
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-700 shadow-sm backdrop-blur">
          <Sparkles className="h-3 w-3 text-[#10B981]" aria-hidden />
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10B981]" />
          </span>
          {t('eyebrow')}
        </span>

        {/* Headline — slate body, gradient accent word */}
        <h1 className="font-display mt-6 max-w-4xl text-3xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          {t('title').split(' ').slice(0, -3).join(' ')}{' '}
          <span className="bg-gradient-to-r from-[#2563EB] via-[#0EA5A4] to-[#10B981] bg-clip-text text-transparent">
            {t('title').split(' ').slice(-3).join(' ')}
          </span>
        </h1>

        {/* Sub */}
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
          {t('subtitle')}
        </p>

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
    dot: string;
    chipBg: string;
    chipText: string;
    ring: string;
    iconTileBg: string;
    iconTileText: string;
    ctaBg: string;
    ctaHover: string;
    glow: string;
  }
> = {
  blue: {
    dot: '#2563EB',
    chipBg: '#2563EB1a', // 10% alpha
    chipText: '#1D4ED8',
    ring: '#2563EB',
    iconTileBg: '#EFF6FF',
    iconTileText: '#2563EB',
    ctaBg: '#2563EB',
    ctaHover: '#1D4ED8',
    glow: 'rgba(37,99,235,0.18)',
  },
  green: {
    dot: '#10B981',
    chipBg: '#10B9811a',
    chipText: '#059669',
    ring: '#10B981',
    iconTileBg: '#ECFDF5',
    iconTileText: '#10B981',
    ctaBg: '#10B981',
    ctaHover: '#059669',
    glow: 'rgba(16,185,129,0.18)',
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
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      style={{
        // Custom hover ring + shadow tinted with the accent
        // (Tailwind arbitrary values would inflate the class name)
        boxShadow: `0 1px 2px rgba(15,23,42,0.04)`,
      }}
    >
      {/* Accent halo that appears on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          boxShadow: `0 22px 60px -20px ${p.glow}, inset 0 0 0 1px ${p.ring}66`,
        }}
      />

      {/* Row 1: chip + live pulse + icon */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest transition group-hover:brightness-110"
            style={{ backgroundColor: p.chipBg, color: p.chipText }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping"
                style={{ backgroundColor: p.dot }}
              />
              <span
                className="relative inline-flex h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: p.dot }}
              />
            </span>
            {eyebrow}
          </span>
          {/* Live counter chip — gives the card a heartbeat */}
          <span
            className="hidden items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 sm:inline-flex"
            title="Live activity"
          >
            <LiveIcon
              className="h-3 w-3 transition motion-safe:group-hover:animate-pulse"
              style={{ color: p.dot }}
            />
            {liveText}
          </span>
        </div>

        {/* Icon tile — scales and rotates on hover */}
        <span
          className="grid h-11 w-11 place-items-center rounded-xl transition duration-500 group-hover:scale-110 group-hover:rotate-[-6deg] motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0"
          style={{ backgroundColor: p.iconTileBg, color: p.iconTileText }}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>

      {/* Title */}
      <h2 className="font-display mt-6 text-2xl font-bold text-slate-900">
        {title}
      </h2>

      {/* Body */}
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>

      {/* CTA — arrow slides right on hover */}
      <div className="mt-6">
        <Link
          href={href}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
          style={{
            backgroundColor: p.ctaBg,
            // The style prop can't do :hover — the group-hover on the
            // arrow below handles the visible interaction.
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
