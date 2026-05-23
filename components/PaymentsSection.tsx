import { useTranslations } from 'next-intl';
import {
  CreditCard,
  FileText,
  History,
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
    <section id="payments" className="relative bg-canvas py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-graphite-1 sm:text-5xl lg:text-6xl">
            {t('title')}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-graphite-3">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-20 grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {tiles.map(({ icon: Icon, title, desc }) => (
            <div key={title}>
              <Icon
                className="h-6 w-6 text-graphite-1"
                strokeWidth={1.5}
              />
              <p className="mt-6 font-display text-lg font-semibold text-graphite-1">
                {title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-graphite-3">
                {desc}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-16 text-xs text-graphite-4">{t('security_note')}</p>
      </div>
    </section>
  );
}
