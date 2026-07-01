/**
 * PSDContactSection — premium SaaS-style contact section.
 *
 * Two-column asymmetric grid on desktop, stacked on mobile. Left is the
 * pitch (Prussian navy #0F2042 with white heading + blue-gray body).
 * Right is a floating white card with the form, rounded-3xl with a
 * subtle shadow. Emerald #10B981 is the CTA accent (checks + submit
 * button), reserved to this section only.
 *
 * Rendered with `next-intl` server translations so copy travels in
 * `messages/{en,es,pt}.json psd.landing.contact.*`.
 */

import { getTranslations } from 'next-intl/server';
import { CheckCircle2, Sparkles } from 'lucide-react';
import PSDContactForm from '@/components/marketing/PSDContactForm';

export default async function PSDContactSection() {
  const t = await getTranslations('psd.landing.contact');

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#0F2042] py-20 sm:py-24"
      aria-labelledby="psd-contact-heading"
    >
      {/* Subtle depth washes — kept sparse so the pitch stays center-stage */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-32 h-[26rem] w-[26rem] rounded-full bg-white/[0.04] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-32 h-[24rem] w-[24rem] rounded-full bg-[#10B981]/[0.06] blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
          {/* Left — pitch + benefits */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#10B981]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#6EE7B7] ring-1 ring-inset ring-[#10B981]/30">
              <Sparkles className="h-3 w-3" aria-hidden />
              {t('eyebrow')}
            </span>

            <h2
              id="psd-contact-heading"
              className="font-display mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl"
            >
              {t('title')}
            </h2>

            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-300/85">
              {t('subtitle')}
            </p>

            <ul className="mt-10 space-y-4">
              {(['fast', 'noSpam', 'gdpr'] as const).map((k) => (
                <li key={k} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#10B981]"
                    aria-hidden
                  />
                  <span className="text-[15px] leading-relaxed text-slate-200/90">
                    {t(`bullets.${k}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — floating form card */}
          <div className="rounded-3xl bg-[#F4F7FC] p-6 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.4),_0_2px_4px_rgba(15,23,42,0.08)] sm:p-8 md:p-10">
            <PSDContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
