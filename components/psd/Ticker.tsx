import { getTranslations } from 'next-intl/server';

/**
 * Orange marquee banner above the page. Loops the 5 trust items so the strip
 * is always full no matter the viewport width. Pure CSS animation, no JS.
 */
export async function Ticker() {
  const t = await getTranslations('psd');
  const items = [
    t('ticker.trial'),
    t('ticker.noCard'),
    t('ticker.cancel'),
    t('ticker.support'),
    t('ticker.portals'),
  ];

  const Strip = () => (
    <div className="ticker-strip" aria-hidden="false">
      {items.map((s, i) => (
        <span key={i} className="ticker-item">
          {s}
        </span>
      ))}
    </div>
  );

  return (
    <div className="ticker" role="region" aria-label="trust">
      <div className="ticker-track">
        <Strip />
        <Strip />
      </div>
    </div>
  );
}
