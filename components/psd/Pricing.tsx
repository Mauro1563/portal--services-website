'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Icon } from './icons';
import { asArray } from './util';

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
  const plans = asArray<Plan>(t.raw('pricing.home_plans'));

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
                {asArray<string>(p.features).map((f, j) => (
                  <li key={j}><Icon.check /> <span>{f}</span></li>
                ))}
              </ul>
              <a className={p.featured ? 'btn btn-accent btn-lg' : 'btn btn-secondary btn-lg'} href={`mailto:hola@portalservices.digital?subject=Portal%20Services%20${encodeURIComponent(p.name)}`}>
                {p.cta} <Icon.arrow />
              </a>
            </div>
          ))}
        </div>

        <div className="pricing-trust-row">
          <span>{t('pricing_trustRow.i1')}</span>
          <span>{t('pricing_trustRow.i2')}</span>
          <span>{t('pricing_trustRow.i3')}</span>
        </div>
        <p className="muted" style={{ fontSize: 13, marginTop: 18, textAlign: 'center' }}>{t('pricing_vatNote')}</p>
        <p className="muted" style={{ fontSize: 12, marginTop: 8, textAlign: 'center', opacity: 0.7 }}>{t('pricing.footer_note')}</p>
      </div>
    </section>
  );
}

export function FAQ() {
  const t = useTranslations('psd');
  const items = asArray<{ q: string; a: string }>(t.raw('faq.items'));
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
