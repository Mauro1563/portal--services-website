'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Icon } from './icons';

type Plan = {
  name: string;
  scope: string;
  price: string;
  features: string[];
  cta: string;
  featured?: boolean;
  from?: boolean;
};

export function Pricing() {
  const t = useTranslations('psd');
  const [product, setProduct] = useState<'corp' | 'home'>('corp');
  const plans = (product === 'corp' ? t.raw('pricing.corp_plans') : t.raw('pricing.home_plans')) as Plan[];
  const addons = t.raw('pricing.addons') as { name: string; desc: string; price: string }[];

  return (
    <section className="section" id="pricing">
      <div className="container">
        <div className="sec-head">
          <div className="left">
            <span className="eyebrow">{t('pricing.eyebrow')}</span>
            <h2 className="h-section">{t('pricing.title_a')} <br /><span className="serif">{t('pricing.title_b')}</span></h2>
          </div>
          <div className="right">
            <p>{t('pricing.sub')}</p>
            <p className="muted" style={{ fontSize: 14, marginTop: 8 }}>✓ {t('pricing.trial')}</p>
          </div>
        </div>

        <div className="product-toggle" role="tablist">
          <button className={product === 'corp' ? 'active' : ''} onClick={() => setProduct('corp')}>{t('pricing.toggle_corp')}</button>
          <button className={product === 'home' ? 'active' : ''} onClick={() => setProduct('home')}>{t('pricing.toggle_home')}</button>
        </div>

        <div className="plans">
          {plans.map((p) => (
            <div className={`plan ${p.featured ? 'featured' : ''}`} key={p.name}>
              {p.featured && <span className="plan-popular">{t('pricing.popular')}</span>}
              <div>
                <h3>{p.name}</h3>
                <p className="muted" style={{ fontSize: 13, marginTop: 6 }}>{p.scope}</p>
              </div>
              <div className="price-amount tabular">
                {p.from && <small style={{ marginRight: 4 }}>{t('pricing.from')} </small>}
                {p.price}<small>{t('pricing.month')}</small>
              </div>
              <ul>
                {p.features.map((f, j) => (
                  <li key={j}><Icon.check /> <span>{f}</span></li>
                ))}
              </ul>
              <a className={p.featured ? 'btn btn-accent btn-lg' : 'btn btn-secondary btn-lg'} href={`mailto:portalservicesdigital@gmail.com?subject=Portal%20Services%20${encodeURIComponent(p.name)}`}>
                {p.cta} <Icon.arrow />
              </a>
            </div>
          ))}
        </div>

        {product === 'corp' && (
          <div className="addon-row">
            {addons.map((a, i) => (
              <div className="addon" key={i}>
                <div>
                  <h4>{a.name}</h4>
                  <p>{a.desc}</p>
                </div>
                <div className="a-price tabular">{a.price}</div>
              </div>
            ))}
          </div>
        )}

        <p className="muted" style={{ fontSize: 13, marginTop: 28, textAlign: 'center' }}>{t('pricing.footer_note')}</p>
      </div>
    </section>
  );
}

export function FAQ() {
  const t = useTranslations('psd');
  const items = t.raw('faq.items') as { q: string; a: string }[];
  const [open, setOpen] = useState(0);
  return (
    <section className="section">
      <div className="container">
        <div className="sec-head">
          <div className="left">
            <span className="eyebrow">{t('faq.eyebrow')}</span>
            <h2 className="h-section">{t('faq.title')}</h2>
          </div>
          <div className="right" />
        </div>
        <div className="faq-list">
          {items.map((it, i) => (
            <div className={`faq-item ${open === i ? 'open' : ''}`} key={i}>
              <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                <h4>{it.q}</h4>
                <span className="ic"><Icon.plus /></span>
              </button>
              <div className="faq-a">{it.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
