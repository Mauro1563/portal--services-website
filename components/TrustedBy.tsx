import { useTranslations } from 'next-intl';

export function TrustedBy() {
  const t = useTranslations('trusted');

  const badges = ['GDPR', 'SSL · PCI DSS', 'SOC 2 (en curso)', 'UK · ES · PT', '3 idiomas'];

  return (
    <section className="relative bg-canvas py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-graphite-4">
          {t('label')}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium uppercase tracking-[0.18em] text-graphite-3">
          {badges.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
