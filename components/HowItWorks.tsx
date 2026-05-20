import { useTranslations } from 'next-intl';
import { ClipboardList, UserCheck, CircleCheckBig } from 'lucide-react';

export function HowItWorks() {
  const t = useTranslations('how');

  const steps = [
    {
      icon: ClipboardList,
      number: '01',
      title: t('step1_title'),
      body: t('step1_body'),
    },
    {
      icon: UserCheck,
      number: '02',
      title: t('step2_title'),
      body: t('step2_body'),
    },
    {
      icon: CircleCheckBig,
      number: '03',
      title: t('step3_title'),
      body: t('step3_body'),
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            {t('eyebrow')}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight">
            {t('title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">{t('subtitle')}</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, number, title, body }) => (
            <div
              key={number}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 transition hover:border-cyan-400/20 hover:bg-cyan-500/[0.04]"
            >
              <div className="absolute -right-2 -top-2 select-none font-display text-7xl font-bold leading-none text-white/[0.04]">
                {number}
              </div>
              <div className="relative">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 ring-1 ring-inset ring-cyan-400/20">
                  <Icon className="h-5 w-5 text-cyan-300" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
