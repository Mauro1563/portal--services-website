import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';

export async function Cta() {
  const t = await getTranslations('psdSite.finalCta');

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-psd-navy py-24 text-white sm:py-32"
    >
      {/* Subtle mesh — matches the deck-style corporate ambient. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(600px 320px at 15% 20%, rgba(37,99,235,0.35), transparent 60%),' +
            'radial-gradient(700px 380px at 90% 100%, rgba(255,107,53,0.28), transparent 60%)',
        }}
      />
      {/* Fine grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage:
            'radial-gradient(760px 420px at 50% 40%, black, transparent 72%)',
        }}
      />

      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {t('title')}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
          {t('subtitle')}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="mailto:hello@portalservices.digital"
            className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-psd-orange px-8 text-[15px] font-bold text-white shadow-[0_20px_50px_-16px_rgba(255,107,53,0.7)] transition hover:brightness-105 active:scale-[0.98]"
          >
            {t('cta')}
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/25 transition group-hover:translate-x-0.5">
              <ArrowRight className="h-4 w-4" />
            </span>
          </a>
          <a
            href="mailto:sales@portalservices.digital"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/[0.08] px-7 text-[15px] font-semibold text-white backdrop-blur transition hover:border-white/50 hover:bg-white/[0.14]"
          >
            {t('secondary')}
          </a>
        </div>
      </div>
    </section>
  );
}
