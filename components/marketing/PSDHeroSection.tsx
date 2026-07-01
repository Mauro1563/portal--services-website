/**
 * PSDHeroSection — Portal Services Digital umbrella hero.
 *
 * Modern light hero: white / soft-blue gradient background, midnight
 * H1 with a blue→green gradient accent on the closing word, and two
 * dark solution cards (Workforce blue #2563EB / Home green #10B981)
 * that float over the light band so the composition still feels
 * layered without being oppressive. Ambient blue + green blobs plus a
 * subtle dot grid provide depth without visual weight.
 *
 * Palette:
 *   - Bg: white → slate-50 → blue-50 gradient (no more solid navy).
 *   - H1 body text: slate-900. Accent word: blue→green text gradient.
 *   - Cards: dark navy glass surface with the section palette accents.
 *   - No warm colors, no orange.
 */

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowRight, Users, Home as HomeIcon, Sparkles } from 'lucide-react';

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
        className="pointer-events-none absolute -top-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-[#2563EB]/12 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 h-[26rem] w-[26rem] rounded-full bg-[#10B981]/10 blur-3xl"
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
        {/* Eyebrow */}
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-700 shadow-sm backdrop-blur">
          <Sparkles className="h-3 w-3 text-[#10B981]" aria-hidden />
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#10B981]" />
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

        {/* Two solution cards — dark glass, still floats over light bg */}
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {/* Workforce (blue accent) */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#2563EB]/30 bg-gradient-to-br from-[#0F172A] to-[#0B2A6B] p-6 shadow-psd-blue-glow ring-1 ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:border-[#2563EB]/60 hover:shadow-[0_18px_40px_-12px_rgba(37,99,235,0.4)]">
            <div className="relative flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-[#2563EB]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#93C5FD]">
                Workforce
              </span>
              <Users className="h-5 w-5 text-[#2563EB]" aria-hidden />
            </div>
            <h2 className="font-display mt-6 text-2xl font-bold text-white">
              {t('workforce.title')}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              {t('workforce.body')}
            </p>
            <div className="mt-5">
              <Link
                href="#soluciones"
                className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2A6B]"
              >
                {t('workforce.cta')}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>

          {/* Home (green accent) */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#10B981]/30 bg-gradient-to-br from-[#0F172A] to-[#064E3B] p-6 shadow-psd-teal-glow ring-1 ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:border-[#10B981]/60 hover:shadow-[0_18px_40px_-12px_rgba(16,185,129,0.4)]">
            <div className="relative flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-[#10B981]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#6EE7B7]">
                Home
              </span>
              <HomeIcon className="h-5 w-5 text-[#10B981]" aria-hidden />
            </div>
            <h2 className="font-display mt-6 text-2xl font-bold text-white">
              {t('home.title')}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              {t('home.body')}
            </p>
            <div className="mt-5">
              <Link
                href="#home-solution"
                className="inline-flex items-center gap-2 rounded-full bg-[#10B981] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#059669] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2A6B]"
              >
                {t('home.cta')}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
