/**
 * PSDHeroSection — Portal Services Digital umbrella hero.
 *
 * Deck-style corporate treatment: dark navy background with a faint
 * building/city silhouette layered under a navy→blue overlay, kicker
 * label with a leading bar, big display headline with a cyan→blue
 * gradient accent word, muted-white lead paragraph. Solution cards
 * (Workforce navy + Home emerald) sit below and keep their previous
 * hover choreography.
 *
 * i18n copy is unchanged (`psd.landing.hero.*`); only the visual
 * language of the hero shell changed.
 */

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import {
  ArrowRight,
  Users,
  Home as HomeIcon,
  Activity,
  TrendingUp,
} from 'lucide-react';

// Faint city-skyline silhouette used as a corporate photographic
// backdrop stand-in — self-contained SVG data URI so we don't take on
// an image asset and the whole hero stays CSP-safe.
const CITY_SKYLINE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 500' preserveAspectRatio='none'><defs><pattern id='w' x='0' y='0' width='14' height='18' patternUnits='userSpaceOnUse'><rect x='2' y='2' width='4' height='6' fill='%23fff' opacity='0.35'/><rect x='8' y='4' width='4' height='6' fill='%23fff' opacity='0.22'/></pattern></defs><g fill='%23fff' opacity='0.10'><rect x='0' y='320' width='120' height='180'/><rect x='120' y='260' width='90' height='240'/><rect x='210' y='300' width='140' height='200'/><rect x='350' y='210' width='80' height='290'/><rect x='430' y='260' width='120' height='240'/><rect x='550' y='170' width='110' height='330'/><rect x='660' y='230' width='90' height='270'/><rect x='750' y='140' width='140' height='360'/><rect x='890' y='210' width='100' height='290'/><rect x='990' y='260' width='120' height='240'/><rect x='1110' y='180' width='90' height='320'/><rect x='1200' y='240' width='140' height='260'/><rect x='1340' y='200' width='110' height='300'/><rect x='1450' y='280' width='150' height='220'/></g><g><rect x='350' y='210' width='80' height='290' fill='url(%23w)'/><rect x='550' y='170' width='110' height='330' fill='url(%23w)'/><rect x='750' y='140' width='140' height='360' fill='url(%23w)'/><rect x='1110' y='180' width='90' height='320' fill='url(%23w)'/></g></svg>\")";

export default async function PSDHeroSection() {
  const t = await getTranslations('psd.landing.hero');

  // Split the title so the trailing 3 words render inside the gradient
  // accent — keeps the current i18n string untouched.
  const words = t('title').split(' ');
  const titleLead = words.slice(0, -3).join(' ');
  const titleAccent = words.slice(-3).join(' ');

  return (
    <section
      id="hero"
      className="relative overflow-hidden text-white"
      style={{
        background:
          'radial-gradient(1100px 520px at 82% -8%, rgba(56,189,248,0.20), transparent 60%),' +
          'linear-gradient(155deg, #050f24 0%, #0B2148 55%, #103A8C 125%)',
      }}
    >
      {/* Building/city silhouette layer — anchors the hero to the
           bottom edge, muted so text remains fully legible. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
        style={{
          backgroundImage: CITY_SKYLINE,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center bottom',
          backgroundSize: '110% auto',
          maskImage:
            'linear-gradient(to top, black 30%, transparent 100%)',
        }}
      />
      {/* Fine grid texture — the deck's signature. Confined to the top
           of the hero so it fades out before the solution cards. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage:
            'radial-gradient(760px 420px at 80% 0%, black, transparent 72%)',
        }}
      />
      {/* Bottom-edge fade into the next section — softens the transition
           from dark hero to the light Trust bar band below. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#0B1327]"
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-14 pb-20 sm:pt-20 sm:pb-28">
        {/* Kicker — bar + label, deck-style */}
        <div className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-[#38BDF8]">
          <span className="h-[2px] w-7 bg-[#38BDF8]" />
          {t('eyebrow')}
        </div>

        {/* Headline — white body, cyan-blue gradient accent word */}
        <h1 className="font-display mt-6 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-[68px]">
          {titleLead}{' '}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                'linear-gradient(100deg, #38BDF8 0%, #7CB6FF 60%, #A7F3D0 110%)',
            }}
          >
            {titleAccent}
          </span>
        </h1>

        {/* Lead */}
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#C3D3F0]">
          {t('subtitle')}
        </p>

        {/* Micro-metrics — dark-theme variant of the three brand chips */}
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 backdrop-blur">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#2563EB]/25">
              <span className="h-2 w-2 rounded-full bg-[#60A5FA]" />
            </span>
            <span className="font-semibold tabular-nums text-white">+59</span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-white/70">
              operativos activos
            </span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 backdrop-blur">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#10B981]/25">
              <span className="h-2 w-2 rounded-full bg-[#34D399]" />
            </span>
            <span className="font-semibold tabular-nums text-white">7</span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-white/70">
              edificios gestionados
            </span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 backdrop-blur">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-[#2563EB]/25 to-[#10B981]/25">
              <span className="h-2 w-2 rounded-full bg-gradient-to-br from-[#60A5FA] to-[#34D399]" />
            </span>
            <span className="font-semibold tabular-nums text-white">3</span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-white/70">
              idiomas
            </span>
          </div>
        </div>

        {/* Two solution cards — dark surfaces, per-card accent */}
        <div className="mt-14 grid gap-5 md:grid-cols-2">
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
    cardBg: string;
    chipBg: string;
    chipText: string;
    chipDot: string;
    iconColor: string;
    ctaBg: string;
    ctaText: string;
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
      className={`group relative overflow-hidden rounded-2xl border border-white/10 p-6 text-white transition duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${p.cardBg}`}
      style={{
        boxShadow: `0 20px 40px -20px ${p.glow}, 0 1px 0 rgba(255,255,255,0.05) inset`,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-70 blur-3xl transition duration-500 group-hover:opacity-100"
        style={{ background: p.glow }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #FFFFFF 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

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

        <Icon
          className="h-6 w-6 transition duration-500 group-hover:scale-110 group-hover:rotate-[-6deg] motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0"
          style={{ color: p.iconColor }}
          aria-hidden
        />
      </div>

      <h2 className="font-display relative mt-8 text-2xl font-bold text-white sm:text-3xl">
        {title}
      </h2>

      <p className="relative mt-3 text-sm leading-relaxed text-white/70">
        {body}
      </p>

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
