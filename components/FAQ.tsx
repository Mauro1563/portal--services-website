import { getTranslations } from 'next-intl/server';
import { ChevronDown } from 'lucide-react';
import { getMarketingSection } from '@/lib/marketing';
import type { FAQContent } from '@/app/hq/content/faq/FAQEditor';

export async function FAQ() {
  const stored = await getMarketingSection<FAQContent>('faq');
  const data: FAQContent = stored ?? (await loadFromI18n());

  return (
    <section id="faq" className="relative bg-canvas py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-graphite-1">
            {data.title}
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {data.items.map((it, i) => (
            <details
              key={i}
              className="group rounded-2xl bg-paper ring-1 ring-line transition open:ring-cyan-300"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left text-sm font-medium text-graphite-1">
                <span>{it.q}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-brand-600 transition group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-graphite-3">
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
