import { getTranslations } from 'next-intl/server';
import { Quote } from 'lucide-react';
import { getMarketingSection } from '@/lib/marketing';
import type { TestimonialsContent } from '@/app/hq/content/testimonials/TestimonialsEditor';

export async function Testimonials() {
  const stored = await getMarketingSection<TestimonialsContent>('testimonials');
  const data: TestimonialsContent = stored ?? (await loadFromI18n());

  return (
    <section className="relative bg-canvas py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
            {data.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-graphite-1 sm:text-5xl">
            {data.title}
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {data.quotes.map((q, i) => (
            <figure
              key={i}
              className="relative rounded-3xl bg-paper p-7 ring-1 ring-line shadow-[0_10px_40px_-20px_rgba(15,23,42,0.15)]"
            >
              <Quote
                aria-hidden
                className="absolute right-5 top-5 h-7 w-7 text-cyan-200"
              />
              <blockquote className="relative font-display text-base leading-relaxed text-graphite-1">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-xs text-graphite-3">
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
