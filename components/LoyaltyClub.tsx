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
    <section id="loyalty" className="relative py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_30%,rgba(251,191,36,0.08),transparent_70%)]"
      />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-300 ring-1 ring-inset ring-amber-400/30">
            <Award className="h-3 w-3" /> {t('eyebrow')}
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-slate-300">{t('subtitle')}</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {/* Earn */}
          <div className="relative overflow-hidden rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-500/[0.06] to-white/[0.02] p-7">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-amber-400/15 blur-3xl"
            />
            <div className="relative">
              <h3 className="font-display text-xl font-semibold text-white">
                {t('earn_title')}
              </h3>
              <ul className="mt-6 divide-y divide-white/[0.06]">
                {earn.map(({ label, pts }) => (
                  <li
                    key={label}
                    className="flex items-center justify-between gap-4 py-3.5"
                  >
                    <span className="text-sm text-slate-200">{label}</span>
                    <span className="inline-flex shrink-0 items-center rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-bold tabular-nums text-amber-200 ring-1 ring-inset ring-amber-400/30">
                      {pts}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Redeem */}
          <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/[0.06] to-white/[0.02] p-7">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl"
            />
            <div className="relative">
              <h3 className="font-display text-xl font-semibold text-white">
                {t('redeem_title')}
              </h3>
              <ul className="mt-6 space-y-3">
                {redeem.map((label) => (
                  <li
                    key={label}
                    className="flex items-start gap-3 rounded-xl bg-white/[0.02] px-3.5 py-2.5 ring-1 ring-inset ring-white/[0.06]"
                  >
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    <span className="text-sm text-slate-200">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
