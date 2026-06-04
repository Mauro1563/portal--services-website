import { getTranslations } from 'next-intl/server';
import { asArray } from './util';

type Item = { icon: string; title: string; desc: string };

/** Honest 8-item technology section. Only features the product actually ships. */
export async function TechSection() {
  const t = await getTranslations('psd');
  const items = asArray<Item>(t.raw('tech.items'));
  return (
    <section className="section tech-section" id="tech">
      <div className="container">
        <div className="sec-head">
          <div className="left">
            <span className="eyebrow">{t('tech.eyebrow')}</span>
            <h2 className="h-section">
              {t('tech.title_a')} <span className="serif">{t('tech.title_b')}</span>
            </h2>
          </div>
          <div className="right">
            <p>{t('tech.sub')}</p>
          </div>
        </div>
        <div className="tech-grid">
          {items.map((it, i) => (
            <div className="tech-card" key={i}>
              <div className="tech-icon" aria-hidden="true">
                {it.icon}
              </div>
              <h3 className="tech-title">{it.title}</h3>
              <p className="tech-desc">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
