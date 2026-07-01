/**
 * PSDHeroSection — Portal Services Digital umbrella hero.
 *
 * Server component. Dark navy surface (#0B2A6B) with two solution cards:
 * Workforce (blue #2563EB) and Home (cool teal #0EA5A4). Trust hints
 * strip below reads TRUST_METRICS from lib/marketing-config so anonymous
 * metrics can be edited without touching this file.
 *
 * Palette rules:
 *   - Only navy + blue + cyan/teal accents. No orange, amber, emerald.
 *   - Bright teal appears only as small chip + button on the Home card.
 *   - No client names, no invented testimonials — anonymous only.
 */

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowRight, Users, Home as HomeIcon, Sparkles } from 'lucide-react';
export default async function PSDHeroSection() {
  const t = await getTranslations('psd.landing.hero');

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[#0B2A6B] text-white"
    >
      {/* Ambient depth — cool accents only, no warm colors */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-[#06B6D4]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 h-[26rem] w-[26rem] rounded-full bg-[#2563EB]/12 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #F8FAFC 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
        {/* Eyebrow */}
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/90 ring-1 ring-inset ring-white/20 backdrop-blur">
          <Sparkles className="h-3 w-3 text-[#06B6D4]" aria-hidden />
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#06B6D4]" />
          {t('eyebrow')}
        </span>

        {/* Headline */}
        <h1 className="font-display mt-6 max-w-4xl text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
          {t('title')}
        </h1>

        {/* Sub */}
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">
          {t('subtitle')}
        </p>

        {/* Two solution cards */}
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {/* Workforce (blue accent) */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#2563EB]/40 bg-white/5 p-6 shadow-psd-blue-glow ring-1 ring-white/10 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#2563EB]/70">
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

          {/* Home (teal-cold accent, kept in blue family) */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#0EA5A4]/40 bg-white/5 p-6 shadow-psd-teal-glow ring-1 ring-white/10 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#0EA5A4]/70">
            <div className="relative flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-[#0EA5A4]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#5EEAD4]">
                Home
              </span>
              <HomeIcon className="h-5 w-5 text-[#0EA5A4]" aria-hidden />
            </div>
            <h2 className="font-display mt-6 text-2xl font-bold text-white">
              {t('home.title')}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              {t('home.body')}
            </p>
            <div className="mt-5">
              <Link
                href="#soluciones"
                className="inline-flex items-center gap-2 rounded-full bg-[#0EA5A4] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F766E] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2A6B]"
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
