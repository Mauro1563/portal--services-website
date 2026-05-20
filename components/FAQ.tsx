import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';

export function FAQ() {
  const t = useTranslations('faq');
  const items = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') },
  ];

  return (
    <section id="faq" className="relative py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-white">
            {t('title')}
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {items.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.03] transition hover:border-white/[0.12] open:border-cyan-400/20 open:bg-cyan-500/[0.04]"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left text-sm font-medium text-white">
                <span>{q}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-cyan-300 transition group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-slate-300">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
