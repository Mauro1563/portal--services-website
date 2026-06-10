import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';

export async function Hero() {
  const t = await getTranslations('hero');

  return (
    <section className="relative isolate overflow-hidden bg-ink-0 text-white">
      {/* The signature curved-white shape sweeping in from the right. Hidden
          on mobile where the layout stacks. Sits behind everything so text
          and product preview still render on top. */}
      <svg
        aria-hidden
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
      >
        <path
          d="M 1440 0 L 1440 900 L 700 900 Q 870 700 850 480 Q 830 250 1100 100 Q 1280 -30 1440 0 Z"
          fill="#FFFFFF"
        />
      </svg>

      {/* Cyan accent glow behind the product preview for depth on the curve. */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-8%] top-[18%] -z-0 hidden h-[42rem] w-[42rem] rounded-full bg-gradient-to-br from-cyan-400/30 via-blue-500/15 to-transparent blur-3xl lg:block"
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-14 sm:pt-20 lg:grid lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-12 lg:pb-28 lg:pt-28">
        {/* ====== Left: copy ====== */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_0_4px_rgba(34,211,238,0.2)]" />
            </span>
            {t('audience_chip')}
          </div>

          <h1 className="mt-7 font-display text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl lg:text-[4.5rem]">
            {t('title_a')}{' '}
            <span className="bg-gradient-to-br from-cyan-300 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              {t('title_b')}
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl">
            {t('subtitle')}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-7 text-[15px] font-bold text-ink-0 shadow-[0_18px_36px_-12px_rgba(255,255,255,0.25)] transition hover:scale-[1.02] active:scale-[0.98]"
            >
              {t('cta_primary')}
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink-0 text-white transition group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <a
              href="#portals"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 text-[15px] font-semibold text-white backdrop-blur transition hover:border-white/30 hover:bg-white/[0.08]"
            >
              {t('cta_secondary')}
            </a>
          </div>

          <p className="mt-10 hidden text-xs font-bold uppercase tracking-[0.18em] text-white/40 lg:block">
            <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-cyan-400" />
            {t('trust')}
          </p>
        </div>

        {/* ====== Right: real product screenshot ====== */}
        <div className="relative mt-16 lg:mt-0">
          <ProductPhone />
        </div>
      </div>
    </section>
  );
}

function ProductPhone() {
  return (
    <div className="relative mx-auto w-full max-w-[340px] lg:max-w-[380px]">
      {/* Phone shell — the device frame around the screenshot. */}
      <div className="relative overflow-hidden rounded-[44px] border border-slate-200/30 bg-slate-950 p-1.5 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.6),0_20px_40px_-12px_rgba(15,23,42,0.4)]">
        {/* Camera notch */}
        <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-slate-950" />
        <div className="relative overflow-hidden rounded-[38px] bg-white">
          {/* Real /client/preview screenshot — captured from the live app so
              the brand gradient hero, badges, KPIs and tool grid are exactly
              what a client actually sees in production. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-product.png"
            alt="Portal Home — vista del cliente en su portal personal"
            className="block h-auto w-full"
            width={780}
            height={1600}
          />
        </div>
      </div>
    </div>
  );
}
