import { getTranslations } from 'next-intl/server';
import { ArrowRight, MessageCircle } from 'lucide-react';

export async function Cta() {
  const t = await getTranslations('cta_banner');

  return (
    <section id="cta" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 px-8 py-16 text-center text-white sm:px-12 sm:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(at_30%_20%,rgba(6,182,212,0.25)_0px,transparent_50%),radial-gradient(at_70%_80%,rgba(37,99,235,0.25)_0px,transparent_50%)]"
          />

          <div className="relative">
            <h2 className="mx-auto max-w-3xl font-display text-3xl font-semibold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
              {t('title')}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              {t('subtitle')}
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="mailto:hola@portalservices.digital?subject=Solicitud%20de%20demo"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 px-6 text-sm font-semibold text-white shadow-[0_12px_30px_-10px_rgba(6,182,212,0.6)] transition hover:brightness-110"
              >
                {t('primary')}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="mailto:hola@portalservices.digital"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />
                {t('secondary')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
