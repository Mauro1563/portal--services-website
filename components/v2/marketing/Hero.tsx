import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowRight, Radio, Smartphone, Building2 } from 'lucide-react';

export async function Hero() {
  const t = await getTranslations('psdSite.hero');

  return (
    <section id="top" className="relative isolate overflow-hidden text-white">
      {/* Real building photo — full-bleed backdrop. */}
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

      {/* Navy → blue tint overlay — legibility layer per spec. Densest
          on the left where the headline lives, softer on the right so
          the building's texture reads through. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(115deg, rgba(15,32,68,0.94) 0%, rgba(15,32,68,0.78) 45%, rgba(37,99,235,0.55) 100%)',
        }}
      />

      {/* Ambient warm accent — echoes the orange CTA and adds depth
          against the cool building photo. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 -z-10 h-[520px] w-[520px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(255,107,53,0.55), transparent 70%)',
        }}
      />

      {/* Bottom fade → next section. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-psd-bg"
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 pb-24 pt-14 md:pt-20 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-12 lg:pb-32 lg:pt-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.08] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/85 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-psd-orange opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-psd-orange" />
            </span>
            {t('eyebrow')}
          </div>

          <h1 className="mt-7 font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-5xl lg:text-[64px]">
            {t('titleA')}{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(100deg, #FF6B35 0%, #F59E0B 40%, #FBBF24 90%)',
              }}
            >
              {t('titleB')}
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl">
            {t('subtitle')}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#contact"
              className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-psd-orange px-7 text-[15px] font-bold text-white shadow-[0_18px_40px_-12px_rgba(255,107,53,0.65)] transition hover:brightness-105 active:scale-[0.98]"
            >
              {t('ctaPrimary')}
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/25 transition group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
            <a
              href="#roles"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/[0.08] px-7 text-[15px] font-semibold text-white backdrop-blur transition hover:border-white/50 hover:bg-white/[0.14]"
            >
              {t('ctaSecondary')}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-semibold text-white/75">
            <Chip icon={<Radio className="h-3.5 w-3.5" />}>
              {t('chipRealtime')}
            </Chip>
            <Chip icon={<Smartphone className="h-3.5 w-3.5" />}>
              {t('chipMobile')}
            </Chip>
            <Chip icon={<Building2 className="h-3.5 w-3.5" />}>
              {t('chipMulti')}
            </Chip>
          </div>
        </div>

        <ProductPreview />
      </div>
    </section>
  );
}

function Chip({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.06] px-3 py-1 backdrop-blur">
      <span className="text-psd-orange">{icon}</span>
      {children}
    </span>
  );
}

function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[380px]">
      {/* Cyan/blue halo behind the device for depth. */}
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 rounded-[48px] bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-transparent blur-3xl"
      />
      <div className="relative overflow-hidden rounded-[40px] border border-white/20 bg-slate-950 p-1.5 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.6),0_20px_40px_-12px_rgba(15,32,68,0.5)]">
        <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-slate-950" />
        <div className="relative overflow-hidden rounded-[34px] bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-product.png"
            alt="Portal Services Digital — vista del operativo en su móvil"
            className="block h-auto w-full"
            width={780}
            height={1600}
          />
        </div>
      </div>
    </div>
  );
}
