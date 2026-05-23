import { useTranslations } from 'next-intl';

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
    <section id="loyalty" className="relative bg-paper py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-graphite-1 sm:text-5xl lg:text-6xl">
            {t('title')}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-graphite-3">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-20 grid gap-16 md:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-graphite-4">
              {t('earn_title')}
            </p>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {earn.map(({ label, pts }) => (
                <li
                  key={label}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <span className="text-sm text-graphite-2">{label}</span>
                  <span className="text-sm font-semibold tabular-nums text-graphite-1">
                    {pts}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-graphite-4">
              {t('redeem_title')}
            </p>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {redeem.map((label) => (
                <li key={label} className="py-4 text-sm text-graphite-2">
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
