/**
 * PSDContactSection — final CTA + contact form.
 *
 * Left column: pitch + trust reassurance. Right column: form (client
 * component that talks to the psd-lead server action). Navy #0B2A6B
 * background so this block reads as the closing statement of the page.
 */

import { getTranslations } from 'next-intl/server';
import { ShieldCheck, Sparkles } from 'lucide-react';
import PSDContactForm from '@/components/marketing/PSDContactForm';

export default async function PSDContactSection() {
  const t = await getTranslations('psd.landing.contact');

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#0B2A6B] py-20 text-white sm:py-28"
      aria-labelledby="psd-contact-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-[#2563EB]/12 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-24 h-[26rem] w-[26rem] rounded-full bg-[#06B6D4]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/90 ring-1 ring-inset ring-white/20 backdrop-blur">
              <Sparkles className="h-3 w-3 text-[#06B6D4]" aria-hidden />
              {t('eyebrow')}
            </span>
            <h2
              id="psd-contact-heading"
              className="font-display mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              {t('title')}
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/70">
              {t('subtitle')}
            </p>
            <ul className="mt-8 space-y-3 text-sm text-white/80">
              {(['fast', 'noSpam', 'gdpr'] as const).map((k) => (
                <li key={k} className="flex items-start gap-2">
                  <ShieldCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#06B6D4]"
                    aria-hidden
                  />
                  <span>{t(`bullets.${k}`)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl ring-1 ring-white/5 backdrop-blur sm:p-8">
            <div className="rounded-2xl bg-white p-6 sm:p-7">
              <PSDContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
