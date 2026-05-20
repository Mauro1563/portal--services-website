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
    <section className="relative bg-white/[0.02] py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
            {t('eyebrow')}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-slate-300">{t('subtitle')}</p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:px-6">
                  {t('col_feature')}
                </th>
                <th className="px-3 py-4 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {t('col_starter')}
                </th>
                <th className="px-3 py-4 text-center text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                  {t('col_pro')}
                </th>
                <th className="px-3 py-4 text-center text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
                  {t('col_premium')}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={
                    i % 2
                      ? 'border-t border-white/[0.04] bg-white/[0.01]'
                      : 'border-t border-white/[0.04]'
                  }
                >
                  <td className="px-4 py-3.5 text-sm text-slate-200 sm:px-6">
                    {row.label}
                  </td>
                  <Cell on={row.tiers.starter} />
                  <Cell on={row.tiers.pro} tone="emerald" />
                  <Cell on={row.tiers.premium} tone="cyan" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Cell({ on, tone }: { on: boolean; tone?: 'emerald' | 'cyan' }) {
  if (!on) {
    return (
      <td className="px-3 py-3.5 text-center">
        <Minus className="mx-auto h-4 w-4 text-slate-600" />
      </td>
    );
  }
  const color =
    tone === 'cyan'
      ? 'text-cyan-300'
      : tone === 'emerald'
      ? 'text-emerald-300'
      : 'text-slate-200';
  return (
    <td className="px-3 py-3.5 text-center">
      <Check className={`mx-auto h-4 w-4 ${color}`} />
    </td>
  );
}
