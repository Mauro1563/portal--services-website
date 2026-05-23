import { useTranslations } from 'next-intl';
import {
  CreditCard,
  FileText,
  History,
  Lock,
  PauseCircle,
  RotateCw,
  Wallet,
} from 'lucide-react';

export function PaymentsSection() {
  const t = useTranslations('payments');

  const tiles = [
    { icon: RotateCw, title: t('recurring_title'), desc: t('recurring_desc') },
    { icon: Wallet, title: t('per_visit_title'), desc: t('per_visit_desc') },
    { icon: FileText, title: t('invoice_title'), desc: t('invoice_desc') },
    { icon: CreditCard, title: t('methods_title'), desc: t('methods_desc') },
    { icon: History, title: t('history_title'), desc: t('history_desc') },
    { icon: PauseCircle, title: t('control_title'), desc: t('control_desc') },
  ];

  return (
    <section id="payments" className="relative bg-cloud py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
            {t('eyebrow')}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-graphite-1 sm:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-graphite-3">{t('subtitle')}</p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tiles.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl bg-paper p-5 ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-20px_rgba(15,23,42,0.15)]"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-brand-600 ring-1 ring-inset ring-cyan-200">
                <Icon className="h-4 w-4" />
              </span>
              <p className="mt-4 font-display text-base font-semibold text-graphite-1">
                {title}
              </p>
              <p className="mt-1 text-sm text-graphite-3">{desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 inline-flex w-full items-center justify-center gap-2 text-xs text-graphite-3">
          <Lock className="h-3.5 w-3.5 text-emerald-500" /> {t('security_note')}
        </p>
      </div>
    </section>
  );
}
