import { useTranslations } from 'next-intl';
import { Award, Globe, Lock, MapPin, ShieldCheck } from 'lucide-react';

export function TrustedBy() {
  const t = useTranslations('trusted');

  const badges = [
    { Icon: ShieldCheck, label: 'GDPR' },
    { Icon: Lock, label: 'SSL · PCI DSS' },
    { Icon: Award, label: 'SOC 2 (en curso)' },
    { Icon: MapPin, label: 'UK · ES · PT' },
    { Icon: Globe, label: '3 idiomas' },
  ];

  return (
    <section className="relative bg-canvas py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="mx-auto max-w-2xl text-xs font-medium uppercase tracking-[0.18em] text-graphite-3 sm:text-sm">
          {t('label')}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          {badges.map(({ Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full bg-paper px-3.5 py-2 text-xs font-semibold text-graphite-2 ring-1 ring-inset ring-line"
            >
              <Icon className="h-3.5 w-3.5 text-brand-600" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
