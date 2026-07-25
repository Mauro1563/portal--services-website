import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';

export async function Hero() {
  const t = await getTranslations('hero');

  return (
    <section className="relative isolate overflow-hidden text-white">
      {/* Real building photograph — full-bleed backdrop. Sits behind
          every other layer so the tint overlay and content compose on
          top of it. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
        <Image
          src="/hero-building.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Navy tint overlay — matches the /hq/login palette (#0b1d3a).
          Densest on the left where the headline lives, fading to
          reveal more of the building on the right. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(115deg, rgba(11,29,58,0.90) 0%, rgba(11,29,58,0.72) 40%, rgba(11,29,58,0.35) 100%)',
        }}
      />

      {/* The signature curved-white shape sweeping in from the right,
          preserved so the product phone still sits on a white surface.
          Hidden on mobile where the layout stacks. */}
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

      {/* Cyan accent glow behind the product preview for depth on the
          curve — echoes the login screen's ambient accent. */}
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
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(100deg, #22D3EE 0%, #2563EB 55%, #1D4ED8 100%)',
              }}
            >
              {t('title_b')}
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-200 sm:text-xl">
            {t('subtitle')}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-7 text-[15px] font-bold text-[#0B1D3A] shadow-[0_18px_36px_-12px_rgba(15,23,42,0.35)] transition hover:scale-[1.02] active:scale-[0.98]"
            >
              {t('cta_primary')}
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0B1D3A] text-white transition group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <a
              href="#portals"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-7 text-[15px] font-semibold text-white backdrop-blur transition hover:border-white/40 hover:bg-white/[0.12]"
            >
              {t('cta_secondary')}
            </a>
          </div>

          <p className="mt-10 hidden text-xs font-bold uppercase tracking-[0.18em] text-white/50 lg:block">
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
