import { useTranslations } from 'next-intl';
import { Award, Sparkles } from 'lucide-react';

export function LoyaltyClub() {
  const t = useTranslations('loyalty');

  const earn = [
    { label: t('earn_visit'), pts: t('earn_visit_pts') },
    { label: t('earn_rating'), pts: t('earn_rating_pts') },
    { label: t('earn_refer'), pts: t('earn_refer_pts') },
    { label: t('earn_signup'), pts: t('earn_signup_pts') },
    { label: t('earn_birthday'), pts: t('earn_birthday_pts') },
  ];

  const redeem = [
    t('redeem_visit'),
    t('redeem_windows'),
    t('redeem_aroma'),
    t('redeem_discount'),
    t('redeem_surprise'),
  ];

  return (
    <section id="loyalty" className="relative bg-canvas py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-700">
            <Award className="h-3 w-3" /> {t('eyebrow')}
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-graphite-1 sm:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-graphite-3">{t('subtitle')}</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-paper to-paper p-7 ring-1 ring-amber-200/60">
            <h3 className="font-display text-xl font-semibold text-graphite-1">
              {t('earn_title')}
            </h3>
            <ul className="mt-6 divide-y divide-line">
              {earn.map(({ label, pts }) => (
                <li
                  key={label}
                  className="flex items-center justify-between gap-4 py-3.5"
                >
                  <span className="text-sm text-graphite-2">{label}</span>
                  <span className="inline-flex shrink-0 items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold tabular-nums text-amber-700 ring-1 ring-inset ring-amber-200">
                    {pts}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-cyan-50 via-paper to-paper p-7 ring-1 ring-cyan-200/60">
            <h3 className="font-display text-xl font-semibold text-graphite-1">
              {t('redeem_title')}
            </h3>
            <ul className="mt-6 space-y-3">
              {redeem.map((label) => (
                <li
                  key={label}
                  className="flex items-start gap-3 rounded-xl bg-white px-3.5 py-2.5 ring-1 ring-inset ring-line"
                >
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                  <span className="text-sm text-graphite-2">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
