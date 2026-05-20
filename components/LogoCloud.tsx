import { useTranslations } from 'next-intl';

export function LogoCloud() {
  const t = useTranslations();
  const logos = ['Aurora FM', 'Northwind', 'Helix Group', 'Vanta Estates', 'Loop Facilities', 'Spire'];
  return (
    <section className="border-y border-white/[0.06] bg-white/[0.03]/40 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-slate-500">
          {t('logos')}
        </p>
        <div className="mt-8 grid grid-cols-2 gap-8 opacity-50 sm:grid-cols-3 md:grid-cols-6">
          {logos.map((name) => (
            <div
              key={name}
              className="flex items-center justify-center font-display text-lg font-semibold tracking-tight text-slate-300"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
