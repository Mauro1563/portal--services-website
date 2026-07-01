/**
 * PSDContactSection — light modern closing block.
 *
 * Mirrors the hero: soft white/blue gradient background, slate-900
 * headline, green #10B981 as the single loud accent (chip, bullets,
 * submit button). Form card floats over the light band with a subtle
 * green halo instead of the previous dark Prussian navy surface, so
 * the whole landing reads as one calm light composition top-to-bottom.
 */

import { getTranslations } from 'next-intl/server';
import { CheckCircle2, Sparkles } from 'lucide-react';
import PSDContactForm from '@/components/marketing/PSDContactForm';

export default async function PSDContactSection() {
  const t = await getTranslations('psd.landing.contact');

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-gradient-to-b from-[#ECFDF5] via-white to-[#EFF6FF] py-20 sm:py-24"
      aria-labelledby="psd-contact-heading"
    >
      {/* Ambient blobs — same rhythm as the hero, mirrored orientation */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-32 h-[26rem] w-[26rem] rounded-full bg-[#10B981]/12 blur-3xl motion-safe:animate-pulse"
        style={{ animationDuration: '7s' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-32 h-[24rem] w-[24rem] rounded-full bg-[#2563EB]/10 blur-3xl motion-safe:animate-pulse"
        style={{ animationDuration: '8s', animationDelay: '1s' }}
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

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
          {/* Left — pitch + benefits */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/30 bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#059669] shadow-sm backdrop-blur">
              <Sparkles className="h-3 w-3" aria-hidden />
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10B981]" />
              </span>
              {t('eyebrow')}
            </span>

            <h2
              id="psd-contact-heading"
              className="font-display mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl"
            >
              {t('title')}
            </h2>

            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
              {t('subtitle')}
            </p>

            <ul className="mt-10 space-y-4">
              {(['fast', 'noSpam', 'gdpr'] as const).map((k) => (
                <li key={k} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#10B981]"
                    aria-hidden
                  />
                  <span className="text-[15px] leading-relaxed text-slate-700">
                    {t(`bullets.${k}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — floating white form card with a green halo */}
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-1 rounded-[28px] bg-gradient-to-br from-[#10B981]/20 to-[#2563EB]/15 blur-xl"
            />
            <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8 md:p-10">
              <PSDContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
