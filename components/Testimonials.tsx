import { getTranslations } from 'next-intl/server';
import { Quote, Star } from 'lucide-react';
import { getMarketingSection } from '@/lib/marketing';
import type { TestimonialsContent } from '@/app/hq/content/testimonials/TestimonialsEditor';

const AVATAR_TONES = [
  'from-cyan-400 to-blue-500',
  'from-violet-400 to-fuchsia-500',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-teal-500',
  'from-rose-400 to-pink-500',
];

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
          {data.quotes.map((q, i) => {
            const initial =
              q.author?.replace(/^—\s*/, '').trim().charAt(0).toUpperCase() ?? '·';
            const tone = AVATAR_TONES[i % AVATAR_TONES.length];
            return (
              <figure
                key={i}
                className="group relative flex flex-col rounded-3xl bg-paper p-7 ring-1 ring-line shadow-[0_10px_40px_-20px_rgba(15,23,42,0.15)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)]"
              >
                <Quote
                  aria-hidden
                  className="absolute right-5 top-5 h-7 w-7 text-cyan-200"
                />

                {/* 5-star header */}
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className="h-3.5 w-3.5 fill-amber-400" />
                  ))}
                </div>

                <blockquote className="mt-4 flex-1 font-display text-base leading-relaxed text-graphite-1">
                  &ldquo;{q.quote}&rdquo;
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span
                    className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${tone} text-sm font-bold text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.4)]`}
                  >
                    {initial}
                  </span>
                  <span className="text-xs text-graphite-3">{q.author}</span>
                </figcaption>
              </figure>
            );
          })}
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
