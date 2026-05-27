import { getTranslations } from 'next-intl/server';
import { Icon } from './icons';
import { asArray } from './util';

export async function Platform() {
  const t = await getTranslations('psd');
  const activity = [
    { i: 'SM', n: 'Sofía M.', w: 'Check-in · Central Apartment', tt: '2m' },
    { i: 'CM', n: 'Carlos M.', w: 'Cleaning done · photo sent', tt: '9m' },
    { i: 'LV', n: 'Lucía V.', w: '5★ review received', tt: '14m' },
    { i: 'PK', n: 'Pedro K.', w: 'Airbnb turnover ready', tt: '22m' },
    { i: 'AC', n: 'Ana C.', w: 'Client message replied', tt: '28m' },
    { i: 'DP', n: 'Diego P.', w: 'Payment received', tt: '35m' },
  ];
  const bldgs = [
    { n: 'Soho Loft · Airbnb', q: 4.9, s: t('platform.shift') },
    { n: 'Apartamento Centro · Madrid', q: 4.8, s: t('platform.shift') },
    { n: 'Chiado Flat · Airbnb', q: 5.0, s: t('platform.inspection') },
    { n: 'Casa Norte · cliente fijo', q: 4.7, s: t('platform.shift') },
  ];
  return (
    <section className="section" id="platform">
      <div className="container">
        <div className="platform">
          <div className="bg-grid" style={{ opacity: 0.08 }} />
          <div className="sec-head" style={{ marginBottom: 24 }}>
            <div className="left">
              <span className="eyebrow">{t('platform.eyebrow')}</span>
              <h2 className="h-section">{t('platform.title_a')} <span className="serif">{t('platform.title_b')}</span></h2>
            </div>
            <div className="right">
              <p className="lede">{t('platform.sub')}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[t('platform.f1'), t('platform.f2'), t('platform.f3')].map((x, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, color: 'var(--on-dark-muted)', fontSize: 15 }}>
                    <span style={{ color: 'var(--accent-2)', marginTop: 3 }}><Icon.check /></span> {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="dashboard">
            <div className="dash-bar">
              <span className="dots"><span /><span /><span /></span>
              <span className="url">hq.portalservices.digital</span>
              <span style={{ marginLeft: 'auto', color: 'var(--accent-2)' }}>● LIVE</span>
            </div>
            <div className="dash-grid">
              <div className="kpi"><span className="l">{t('platform.kpi.buildings')}</span><span className="v tabular">24 <span className="d">+3</span></span></div>
              <div className="kpi"><span className="l">{t('platform.kpi.ops')}</span><span className="v tabular">96 <span className="d">+12</span></span></div>
              <div className="kpi"><span className="l">{t('platform.kpi.quality')}</span><span className="v tabular">4.9 <span className="d">+0.2</span></span></div>
              <div className="kpi"><span className="l">{t('platform.kpi.uptime')}</span><span className="v tabular">99.9%</span></div>
            </div>
            <div className="dash-body">
              <div className="dash-pane">
                <h4>{t('platform.activity')}</h4>
                <ul className="activity">
                  {activity.map((a, i) => (
                    <li key={i}>
                      <span className="avatar">{a.i}</span>
                      <span><div className="who">{a.n}</div><div className="what">{a.w}</div></span>
                      <span className="when">{a.tt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="dash-pane">
                <h4>{t('platform.buildings_active')}</h4>
                <ul className="bldgs">
                  {bldgs.map((b, i) => (
                    <li key={i}>
                      <div style={{ flex: 1 }}>
                        <div className="b-name">{b.n}</div>
                        <div className="b-sub mono">{b.s}</div>
                      </div>
                      <span className="b-rating tabular">★ {b.q}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 20, padding: '14px 16px', border: '1px dashed var(--dark-line)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--on-dark-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quality · 30 days</div>
                    <div style={{ fontSize: 18, fontWeight: 500, marginTop: 2 }}>+6.2%</div>
                  </div>
                  <svg width="120" height="36" viewBox="0 0 120 36">
                    <path d="M0 28 L20 24 L40 26 L60 18 L80 12 L100 14 L120 6" stroke="var(--accent-2)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const VIP_ICONS = [
  <svg key="1" width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M3 7l7 4 7-4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>,
  <svg key="2" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2.5l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 14.9l-4.8 2.5.9-5.4L2.2 8.2l5.4-.8L10 2.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>,
  <svg key="3" width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.4" /><path d="M3 17c0-3.3 3.1-5 7-5s7 1.7 7 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>,
  <svg key="4" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l1.8 3.7 4 .6-2.9 2.9.7 4L10 11.4l-3.6 1.9.7-4L4.2 6.3l4-.6L10 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M4 16l12-3M4 18l9-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>,
  <svg key="5" width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M3 8h14M7 2v4M13 2v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>,
  <svg key="6" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2a4 4 0 014 4v3l1 4H5l1-4V6a4 4 0 014-4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M8 16a2 2 0 004 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>,
];

export async function VIP() {
  const t = await getTranslations('psd');
  const items = asArray<{ t: string; d: string }>(t.raw('vip.items'));
  return (
    <section className="section" id="vip">
      <div className="container">
        <div className="sec-head">
          <div className="left">
            <span className="eyebrow">{t('vip.eyebrow')}</span>
            <h2 className="h-section">{t('vip.title_a')} <span className="serif">{t('vip.title_b')}</span></h2>
          </div>
          <div className="right"><p>{t('vip.sub')}</p></div>
        </div>
        <div className="feat-grid">
          {items.map((it, i) => (
            <div className="feat" key={i}>
              <div className="icon">{VIP_ICONS[i]}</div>
              <h3>{it.t}</h3>
              <p>{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function Loyalty() {
  const t = await getTranslations('psd');
  const earn = asArray<{ t: string; p: string }>(t.raw('loyalty.earn_items'));
  const redeem = asArray<string>(t.raw('loyalty.redeem_items'));
  const icons = ['✦', '◇', '❋', '%', '✿'];
  return (
    <section className="section-tight">
      <div className="container">
        <div className="sec-head">
          <div className="left">
            <span className="eyebrow">{t('loyalty.eyebrow')}</span>
            <h2 className="h-section">{t('loyalty.title_a')} <br /><span className="serif">{t('loyalty.title_b')}</span></h2>
          </div>
          <div className="right"><p>{t('loyalty.sub')}</p></div>
        </div>
        <div className="loyalty">
          <div className="points-card">
            <h3>{t('loyalty.earn')}</h3>
            <ul className="points-list">
              {earn.map((e, i) => (
                <li key={i}><span>{e.t}</span><span className="pts">{e.p}</span></li>
              ))}
            </ul>
          </div>
          <div className="rewards-card">
            <h3>{t('loyalty.redeem')}</h3>
            <ul className="rewards-list">
              {redeem.map((r, i) => (
                <li key={i}><span className="gift">{icons[i]}</span> {r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function Payments() {
  const t = await getTranslations('psd');
  const items = asArray<{ tag: string; t: string; d: string }>(t.raw('pay.items'));
  return (
    <section className="section-tight">
      <div className="container">
        <div className="sec-head">
          <div className="left">
            <span className="eyebrow">{t('pay.eyebrow')}</span>
            <h2 className="h-section">{t('pay.title_a')} <span className="serif">{t('pay.title_b')}</span></h2>
          </div>
          <div className="right"><p>{t('pay.sub')}</p></div>
        </div>
        <div className="pay-grid">
          {items.map((it, i) => (
            <div className="pay-card" key={i}>
              <span className="tag">{it.tag}</span>
              <h4>{it.t}</h4>
              <p>{it.d}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 28, padding: '24px 28px', background: 'var(--bg-elev)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div className="eyebrow">{t('pay.methods')}</div>
            <div className="pay-methods" style={{ marginTop: 10 }}>
              {['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Google Pay', 'BACS', 'SEPA'].map((m) => (
                <span className="pm" key={m}>{m}</span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--muted)' }}>
            <Icon.lock /> {t('pay.note')}
          </div>
        </div>
      </div>
    </section>
  );
}

export async function Testimonials() {
  const t = await getTranslations('psd');
  const items = asArray<{ q: string; n: string; c: string }>(t.raw('tst.items'));
  return (
    <section className="section-tight">
      <div className="container">
        <div className="sec-head">
          <div className="left">
            <span className="eyebrow">{t('tst.eyebrow')}</span>
            <h2 className="h-section">{t('tst.title_a')} <span className="serif">{t('tst.title_b')}</span></h2>
          </div>
          <div className="right">
            <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="stars" style={{ fontSize: 18 }}><Icon.star /><Icon.star /><Icon.star /><Icon.star /><Icon.star /></span>
              <span>{t('tst.rating')}</span>
            </p>
          </div>
        </div>
        <div className="tst-grid">
          {items.map((it, i) => (
            <div className="tst" key={i}>
              <div className="stars" style={{ fontSize: 15 }}>
                <Icon.star /><Icon.star /><Icon.star /><Icon.star /><Icon.star />
              </div>
              <div className="quote">&ldquo;{it.q}&rdquo;</div>
              <div className="who">
                <div className="avatar">{it.n[0]}</div>
                <div className="meta">
                  <b>{it.n}</b><br />
                  <span>{it.c}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
