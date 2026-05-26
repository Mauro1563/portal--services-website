import { getTranslations } from 'next-intl/server';
import { Icon } from './icons';

function PhoneMockup({
  activity,
  ops,
  quality,
}: {
  activity: string;
  ops: string;
  quality: string;
}) {
  const checkins = [
    { n: 'María R.', s: 'On site · 08:02', c: '#06B6D4' },
    { n: 'Carlos M.', s: 'On site · 08:05', c: '#06B6D4' },
    { n: 'Lucía V.', s: 'On site · 08:11', c: '#06B6D4' },
    { n: 'Pedro K.', s: 'Pending', c: '#F59E0B' },
  ];
  return (
    <div className="phone" aria-hidden="true">
      <div className="phone-screen">
        <div className="status">
          <span>9:41</span>
          <span className="right">
            <svg width="14" height="9" viewBox="0 0 14 9" fill="currentColor"><rect y="6" width="3" height="3" rx="0.5" /><rect x="4" y="4" width="3" height="5" rx="0.5" /><rect x="8" y="2" width="3" height="7" rx="0.5" /></svg>
            <svg width="22" height="10" viewBox="0 0 22 10" fill="none"><rect x="0.5" y="0.5" width="18" height="9" rx="2" stroke="currentColor" /><rect x="2" y="2" width="14" height="6" rx="1" fill="currentColor" /><rect x="19.5" y="3.5" width="1.5" height="3" rx="0.5" fill="currentColor" /></svg>
          </span>
        </div>

        <div style={{ padding: '10px 18px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Supervisor</div>
              <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.02em', marginTop: 2 }}>Atlas Tower</div>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600 }}>MR</div>
          </div>
        </div>

        <div style={{ margin: '0 14px 12px', borderRadius: 14, background: 'var(--ink)', color: 'var(--bg)', padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>{activity}</div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--accent-2)' }}>● LIVE</div>
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 10, alignItems: 'baseline' }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.025em' }}>12 / 14</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{ops}</div>
            </div>
            <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(255,255,255,0.12)' }} />
            <div>
              <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.025em', color: 'var(--accent-2)' }}>4.9</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{quality}</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 18px' }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Check-in</div>
          {checkins.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 3 ? '1px solid var(--line)' : 'none' }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 600 }}>{p.n.split(' ').map((x) => x[0]).join('')}</div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{p.n}</div>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: p.c }}>● {p.s}</div>
            </div>
          ))}
        </div>

        <div style={{ position: 'absolute', left: 14, right: 14, bottom: 16, display: 'flex', gap: 8 }}>
          <button style={{ flex: 1, height: 44, borderRadius: 12, background: 'var(--ink)', color: 'var(--bg)', fontWeight: 500, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Icon.check /> Inspección
          </button>
          <button style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'grid', placeItems: 'center' }}>
            <Icon.plus />
          </button>
        </div>
      </div>
    </div>
  );
}

export async function Hero() {
  const t = await getTranslations('psd');
  return (
    <section className="hero">
      <div className="bg-grid" />
      <div className="container">
        <div className="hero-grid">
          <div>
            <div className="hero-meta">
              <span className="eyebrow">{t('hero.eyebrow')}</span>
            </div>
            <h1 className="h-display hero-headline">
              {t('hero.title_a')}<br />
              <span className="serif">{t('hero.title_b')}</span><br />
              {t('hero.title_c')}
            </h1>
            <p className="lede hero-sub">{t('hero.sub')}</p>
            <div className="hero-cta">
              <a className="btn btn-primary btn-lg" href="mailto:portalservicesdigital@gmail.com?subject=Demo%20request">
                {t('hero.cta_primary')} <Icon.arrow />
              </a>
              <a className="btn btn-secondary btn-lg" href="#portals">
                {t('hero.cta_secondary')}
              </a>
            </div>
            <div className="hero-trust">
              <span>✓ {t('hero.trust_a')}</span>
              <span className="sep" />
              <span>{t('hero.trust_b')}</span>
              <span className="sep" />
              <span>{t('hero.trust_c')}</span>
            </div>
          </div>

          <div className="hero-art">
            <PhoneMockup activity={t('platform.activity')} ops={t('platform.kpi.ops')} quality={t('platform.kpi.quality')} />

            <div className="float-card" style={{ top: 30, left: -10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'grid', placeItems: 'center' }}>
                <Icon.zap />
              </div>
              <div>
                <div className="label">{t('platform.kpi.uptime')}</div>
                <div className="value tabular">99.9%</div>
              </div>
            </div>

            <div className="float-card" style={{ bottom: 80, right: -16 }}>
              <div>
                <div className="label">{t('platform.kpi.quality')} · 30d</div>
                <div className="value tabular" style={{ color: 'var(--accent)' }}>+6.2%</div>
              </div>
              <svg width="48" height="20" viewBox="0 0 48 20" fill="none">
                <path d="M2 16 L10 14 L18 11 L26 8 L34 6 L46 3" stroke="var(--accent)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>

            <div className="float-card" style={{ bottom: -10, left: 0 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--ink)', color: 'var(--bg)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600 }}>CM</div>
              <div>
                <div className="label">Inspection</div>
                <div className="value" style={{ fontSize: 14 }}>4.9 <span className="stars"><Icon.star /><Icon.star /><Icon.star /><Icon.star /><Icon.star /></span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-stats">
          <div className="hero-stat"><span className="num tabular">2</span><span className="lbl">{t('hero.stat_portals')}</span></div>
          <div className="hero-stat"><span className="num tabular">99.9%</span><span className="lbl">{t('hero.stat_uptime')}</span></div>
          <div className="hero-stat"><span className="num tabular">30d</span><span className="lbl">{t('hero.stat_trial')}</span></div>
          <div className="hero-stat"><span className="num tabular">3</span><span className="lbl">{t('hero.stat_lang')}</span></div>
        </div>
      </div>
    </section>
  );
}

export async function LogoStrip() {
  const t = await getTranslations('psd');
  const logos = [
    { name: 'Atlas Tower', style: 'wordmark' },
    { name: 'RIVERSIDE', style: 'spaced' },
    { name: 'Westwood', style: 'serif' },
    { name: 'Cleanly Co.', style: 'wordmark' },
    { name: 'HOST/Madrid', style: 'spaced' },
    { name: 'Northgate FM', style: 'wordmark' },
  ];
  return (
    <section className="logos">
      <div className="container">
        <div className="logos-head">{t('logos.head')}</div>
        <div className="logos-row">
          {logos.map((l, i) => (
            <div
              key={i}
              className="logo-mark"
              style={{
                fontFamily: l.style === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)',
                letterSpacing: l.style === 'spaced' ? '0.18em' : '-0.01em',
                fontStyle: l.style === 'serif' ? 'italic' : 'normal',
                fontSize: l.style === 'spaced' ? 14 : 18,
              }}
            >
              {l.style === 'wordmark' && (
                <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" fill="none" /></svg>
              )}
              {l.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
