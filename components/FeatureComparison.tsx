import { useTranslations } from 'next-intl';
import { Check, Minus } from 'lucide-react';

type Tier = 'starter' | 'pro' | 'premium';

export function FeatureComparison() {
  const t = useTranslations('comparison');

  const rows: { label: string; tiers: Record<Tier, boolean> }[] = [
    { label: t('row_portal'), tiers: { starter: true, pro: true, premium: true } },
    { label: t('row_chat'), tiers: { starter: true, pro: true, premium: true } },
    { label: t('row_feedback'), tiers: { starter: true, pro: true, premium: true } },
    { label: t('row_reviews'), tiers: { starter: true, pro: true, premium: true } },
    { label: t('row_notifications'), tiers: { starter: true, pro: true, premium: true } },
    { label: t('row_history'), tiers: { starter: true, pro: true, premium: true } },
    { label: t('row_refer'), tiers: { starter: false, pro: true, premium: true } },
    { label: t('row_loyalty'), tiers: { starter: false, pro: true, premium: true } },
    { label: t('row_payments'), tiers: { starter: false, pro: false, premium: true } },
    { label: t('row_branding'), tiers: { starter: false, pro: false, premium: true } },
    { label: t('row_support'), tiers: { starter: false, pro: false, premium: true } },
  ];

  return (
    <section className="relative bg-cloud py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            {t('eyebrow')}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-graphite-1 sm:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-graphite-3">{t('subtitle')}</p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl bg-paper ring-1 ring-line shadow-[0_10px_40px_-20px_rgba(15,23,42,0.15)]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line bg-slate-50">
                <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-wider text-graphite-3 sm:px-6">
                  {t('col_feature')}
                </th>
                <th className="px-3 py-4 text-center text-[11px] font-semibold uppercase tracking-wider text-graphite-3">
                  {t('col_starter')}
                </th>
                <th className="px-3 py-4 text-center text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                  {t('col_pro')}
                </th>
                <th className="px-3 py-4 text-center text-[11px] font-semibold uppercase tracking-wider text-brand-600">
                  {t('col_premium')}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={
                    i % 2 ? 'border-t border-line bg-slate-50/50' : 'border-t border-line'
                  }
                >
                  <td className="px-4 py-3.5 text-sm text-graphite-1 sm:px-6">
                    {row.label}
                  </td>
                  <Cell on={row.tiers.starter} />
                  <Cell on={row.tiers.pro} tone="emerald" />
                  <Cell on={row.tiers.premium} tone="brand" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Cell({ on, tone }: { on: boolean; tone?: 'emerald' | 'brand' }) {
  if (!on) {
    return (
      <td className="px-3 py-3.5 text-center">
        <Minus className="mx-auto h-4 w-4 text-slate-300" />
      </td>
    );
  }
  const color =
    tone === 'brand'
      ? 'text-brand-600'
      : tone === 'emerald'
      ? 'text-emerald-600'
      : 'text-graphite-2';
  return (
    <td className="px-3 py-3.5 text-center">
      <Check className={`mx-auto h-4 w-4 ${color}`} />
    </td>
  );
}
