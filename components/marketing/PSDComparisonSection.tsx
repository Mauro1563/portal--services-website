/**
 * PSDComparisonSection — "¿Cuál es para ti?" money slide.
 *
 * Second dark punctuation of the landing (Trust bar is the first).
 * Instead of a light table, the two solutions face off as glowing
 * side-by-side cards on a navy gradient: Workforce (blue #2563EB) and
 * Home (green #10B981). Both accents pop against the dark surface, and
 * the "both include" band underneath sits as a glass strip.
 */

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Users, Home, Check, ArrowRight } from 'lucide-react';

type Accent = 'blue' | 'green';

const rows = ['audience', 'core', 'size', 'integrations', 'price'] as const;
type RowKey = (typeof rows)[number];

export default async function PSDComparisonSection() {
  const t = await getTranslations('psd.landing.comparison');

  return (
    <section
      id="which"
      className="relative overflow-hidden bg-gradient-to-b from-[#0B1327] via-[#111C3D] to-[#0B1327] py-24 sm:py-32"
      aria-labelledby="psd-comparison-heading"
    >
      {/* Ambient blobs — one blue, one green — brand tints on the dark surface */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/4 h-[28rem] w-[28rem] rounded-full bg-[#2563EB]/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-1/4 h-[26rem] w-[26rem] rounded-full bg-[#10B981]/18 blur-3xl"
      />
      {/* Grid pattern texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage:
            'radial-gradient(ellipse at center, black 40%, transparent 85%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white/80 backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#2563EB] opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
            </span>
            {t('eyebrow')}
          </span>
          <h2
            id="psd-comparison-heading"
            className="font-display mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/70">
            {t('subtitle')}
          </p>
        </div>

        {/* Two-column showdown */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <ComparisonCard accent="blue" rows={rows} t={t} />
          <ComparisonCard accent="green" rows={rows} t={t} />
        </div>

        {/* Both include — glass strip */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/50">
            {t('bothLabel')}
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(['multiLang', 'realtime', 'pwa', 'security'] as const).map(
              (k, i) => (
                <li
                  key={k}
                  className="flex items-start gap-2 text-sm text-white/85"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0"
                    style={{
                      color: i % 2 === 0 ? '#60A5FA' : '#34D399',
                    }}
                    aria-hidden
                  />
                  <span>{t(`both.${k}`)}</span>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Section-level CTAs */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="#soluciones"
            className="group inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_32px_rgba(37,99,235,0.35)] transition hover:bg-[#1D4ED8]"
          >
            {t('ctaWorkforce')}
            <ArrowRight
              className="h-4 w-4 transition group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
          <Link
            href="#home-solution"
            className="group inline-flex items-center gap-2 rounded-full bg-[#10B981] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_32px_rgba(16,185,129,0.35)] transition hover:bg-[#059669]"
          >
            {t('ctaHome')}
            <ArrowRight
              className="h-4 w-4 transition group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

const ACCENTS: Record<
  Accent,
  {
    Icon: typeof Users;
    title: string;
    hex: string;
    hexSoft: string;
    glow: string;
  }
> = {
  blue: {
    Icon: Users,
    title: 'Portal Services: Workforce',
    hex: '#2563EB',
    hexSoft: '#60A5FA',
    glow: 'rgba(37,99,235,0.28)',
  },
  green: {
    Icon: Home,
    title: 'Portal Services: Home',
    hex: '#10B981',
    hexSoft: '#34D399',
    glow: 'rgba(16,185,129,0.28)',
  },
};

function ComparisonCard({
  accent,
  rows,
  t,
}: {
  accent: Accent;
  rows: readonly RowKey[];
  t: (key: string) => string;
}) {
  const cfg = ACCENTS[accent];
  const columnKey = accent === 'blue' ? 'workforce' : 'home';

  return (
    <div
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 backdrop-blur transition-shadow"
      style={{ boxShadow: `0 20px 60px -30px ${cfg.glow}` }}
    >
      {/* Top accent stripe */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${cfg.hex} 50%, transparent 100%)`,
        }}
      />
      {/* Corner glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl"
        style={{ background: cfg.glow }}
      />

      <div className="relative flex items-center gap-3">
        <span
          className="grid h-12 w-12 place-items-center rounded-xl"
          style={{
            backgroundColor: `${cfg.hex}22`,
            color: cfg.hexSoft,
            boxShadow: `inset 0 0 0 1px ${cfg.hex}55`,
          }}
        >
          <cfg.Icon className="h-6 w-6" aria-hidden />
        </span>
        <p className="font-display text-xl font-bold text-white">{cfg.title}</p>
      </div>

      <ul className="relative mt-8 space-y-4">
        {rows.map((row) => (
          <li key={row} className="border-b border-white/10 pb-4 last:border-0">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.22em]"
              style={{ color: cfg.hexSoft }}
            >
              {t(`rows.${row}.label`)}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-white/85">
              {t(`rows.${row}.${columnKey}`)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
