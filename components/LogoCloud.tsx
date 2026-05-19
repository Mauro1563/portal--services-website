import { useTranslations } from 'next-intl';

export function LogoCloud() {
  const t = useTranslations();
  const logos = ['Aurora FM', 'Northwind', 'Helix Group', 'Vanta Estates', 'Loop Facilities', 'Spire'];
  return (
    <section className="border-y border-surface-2 bg-surface-1/40 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-text-3">
          {t('logos')}
        </p>
        <div className="mt-8 grid grid-cols-2 gap-8 opacity-50 sm:grid-cols-3 md:grid-cols-6">
          {logos.map((name) => (
            <div
              key={name}
              className="flex items-center justify-center font-display text-lg font-semibold tracking-tight text-text-2"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
