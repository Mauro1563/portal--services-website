import { useTranslations } from 'next-intl';

export function StatsBand() {
  const t = useTranslations('stats');

  const items = [
    { value: '7', label: t('portals') },
    { value: '99.9%', label: t('uptime') },
    { value: '30', label: t('trial') },
    { value: '3', label: t('languages') },
  ];

  return (
    <section className="relative border-y border-line bg-canvas">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-px overflow-hidden bg-line lg:grid-cols-4">
          {items.map(({ value, label }) => (
            <div
              key={label}
              className="bg-canvas px-6 py-10 sm:py-14"
            >
              <p className="font-display text-5xl font-semibold tabular-nums tracking-tight text-graphite-1 sm:text-6xl">
                {value}
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.15em] text-graphite-4">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
