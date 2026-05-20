import { getTranslations } from 'next-intl/server';
import { Quote } from 'lucide-react';
import { getMarketingSection } from '@/lib/marketing';
import type { TestimonialsContent } from '@/app/hq/content/testimonials/TestimonialsEditor';

export async function Testimonials() {
  const stored = await getMarketingSection<TestimonialsContent>('testimonials');
  const data: TestimonialsContent =
    stored ?? (await loadFromI18n());

  return (
    <section className="relative py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_50%,rgba(61,197,240,0.08),transparent_70%)]"
      />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            {data.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {data.title}
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {data.quotes.map((q, i) => (
            <figure
              key={i}
              className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-7 backdrop-blur-sm"
            >
              <Quote
                aria-hidden
                className="absolute right-4 top-4 h-7 w-7 text-cyan-300/30"
              />
              <blockquote className="relative font-display text-base leading-relaxed text-white">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-xs text-slate-400">
                — {q.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

async function loadFromI18n(): Promise<TestimonialsContent> {
  const t = await getTranslations('testimonials');
  return {
    eyebrow: t('eyebrow'),
    title: t('title'),
    quotes: [
      { quote: t('q1'), author: t('q1_author') },
      { quote: t('q2'), author: t('q2_author') },
      { quote: t('q3'), author: t('q3_author') },
    ],
  };
}
