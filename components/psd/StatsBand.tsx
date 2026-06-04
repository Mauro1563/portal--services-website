import { getTranslations } from 'next-intl/server';

/** Dark navy band with 4 trust stats. Sits between Hero and Portals. */
export async function StatsBand() {
  const t = await getTranslations('psd.stats');
  const items: ('portals' | 'uptime' | 'trial' | 'langs')[] = [
    'portals',
    'uptime',
    'trial',
    'langs',
  ];
  return (
    <section className="stats-band" aria-label="key stats">
      <div className="container">
        <div className="stats-grid">
          {items.map((k) => (
            <div className="stats-item" key={k}>
              <div className="stats-v">{t(`${k}.value`)}</div>
              <div className="stats-l">{t(`${k}.label`)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
