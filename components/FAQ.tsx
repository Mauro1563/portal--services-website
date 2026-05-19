import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';

export function FAQ() {
  const t = useTranslations('faq');
  const items = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') },
    { q: t('q5'), a: t('a5') },
    { q: t('q6'), a: t('a6') },
    { q: t('q7'), a: t('a7') },
    { q: t('q8'), a: t('a8') },
  ];

  return (
    <section id="faq" className="relative py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
            {t('eyebrow')}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight">
            {t('title')}
          </h2>
          <p className="mt-4 text-text-2">{t('subtitle')}</p>
        </div>

        <div className="mt-12 space-y-3">
          {items.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-2xl border border-surface-2 bg-surface-1 transition hover:border-white/[0.12] open:border-cyan-400/20 open:bg-cyan-500/[0.04]"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left text-sm font-medium text-text-1">
                <span>{q}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-brand-600 transition group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-text-2">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
