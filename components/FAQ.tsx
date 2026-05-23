import { getTranslations } from 'next-intl/server';
import { Plus } from 'lucide-react';
import { getMarketingSection } from '@/lib/marketing';
import type { FAQContent } from '@/app/hq/content/faq/FAQEditor';

export async function FAQ() {
  const stored = await getMarketingSection<FAQContent>('faq');
  const data: FAQContent = stored ?? (await loadFromI18n());

  return (
    <section id="faq" className="relative bg-canvas py-32 sm:py-40">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-graphite-1 sm:text-5xl">
          {data.title}
        </h2>

        <div className="mt-16 divide-y divide-line border-y border-line">
          {data.items.map((it, i) => (
            <details key={i} className="group py-6">
              <summary className="flex cursor-pointer items-center justify-between gap-6 text-left">
                <span className="font-display text-base font-medium text-graphite-1 sm:text-lg">
                  {it.q}
                </span>
                <Plus className="h-4 w-4 shrink-0 text-graphite-3 transition group-open:rotate-45" />
              </summary>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-graphite-3">
                {it.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

async function loadFromI18n(): Promise<FAQContent> {
  const t = await getTranslations('faq');
  return {
    title: t('title'),
    items: [1, 2, 3, 4].map((i) => ({
      q: t(`q${i}` as 'q1'),
      a: t(`a${i}` as 'a1'),
    })),
  };
}
