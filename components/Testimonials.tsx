import { getTranslations } from 'next-intl/server';
import { getMarketingSection } from '@/lib/marketing';
import type { TestimonialsContent } from '@/app/hq/content/testimonials/TestimonialsEditor';

export async function Testimonials() {
  const stored = await getMarketingSection<TestimonialsContent>('testimonials');
  const data: TestimonialsContent = stored ?? (await loadFromI18n());

  return (
    <section className="relative bg-canvas py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-graphite-1 sm:text-5xl lg:text-6xl">
          {data.title}
        </h2>

        <div className="mt-20 grid gap-x-12 gap-y-16 md:grid-cols-3">
          {data.quotes.map((q, i) => (
            <figure key={i} className="flex flex-col">
              <blockquote className="font-display text-lg leading-relaxed text-graphite-1">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 text-xs uppercase tracking-[0.15em] text-graphite-4">
                {q.author}
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
