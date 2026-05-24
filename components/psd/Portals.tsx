'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Icon } from './icons';

type Portal = {
  name: string;
  sub: string;
  title: string;
  tag: string;
  for: string;
  features: string[];
};

const mono = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontSize: 10,
  color: 'var(--on-dark-muted)',
  fontFamily: 'var(--font-mono)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  ...extra,
});

const SupervisorDemo = () => (
  <div>
    <div className="demo-head"><span>shifts / atlas-tower</span><span className="demo-pill"><span className="dot" />live</span></div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--dark-line)', borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
      {[{ l: 'Operatives', v: '12/14' }, { l: 'Areas', v: '8/8' }, { l: 'Quality', v: '4.9' }, { l: 'Incidents', v: '0' }].map((k, i) => (
        <div key={i} style={{ background: '#0F1311', padding: '12px 14px' }}>
          <div style={mono()}>{k.l}</div>
          <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', marginTop: 4 }}>{k.v}</div>
        </div>
      ))}
    </div>
    <div style={mono({ marginBottom: 10 })}>Zone inspection</div>
    {[{ z: 'Lobby + reception', s: 4.9 }, { z: 'Floors 1-3 · common', s: 4.8 }, { z: 'Restrooms · north wing', s: 4.7 }, { z: 'Pantries · all floors', s: 5.0 }].map((r, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px dashed var(--dark-line)' }}>
        <div style={{ flex: 1, fontSize: 13 }}>{r.z}</div>
        <div style={{ width: 80, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ width: `${(r.s / 5) * 100}%`, height: '100%', background: 'var(--accent-2)' }} />
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-2)', width: 28, textAlign: 'right' }}>{r.s.toFixed(1)}</div>
      </div>
    ))}
  </div>
);

const ManagerDemo = () => (
  <div>
    <div className="demo-head"><span>manager / overview</span><span className="demo-pill"><span className="dot" />4 buildings</span></div>
    {[
      { n: 'Atlas Tower · Mayfair', q: 4.9, s: 'On shift', c: 'var(--accent-2)' },
      { n: 'Riverside Coworking', q: 4.7, s: 'On shift', c: 'var(--accent-2)' },
      { n: 'Hospital Westwood', q: 4.8, s: 'Inspection', c: '#F0B341' },
      { n: 'Northgate Plaza', q: 4.6, s: 'On shift', c: 'var(--accent-2)' },
    ].map((b, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 14px', border: '1px solid var(--dark-line)', borderRadius: 10, marginBottom: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: 99, background: b.c }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{b.n}</div>
          <div style={mono({ fontSize: 11, letterSpacing: '0.05em' })}>{b.s}</div>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--accent-2)' }}>★ {b.q}</div>
      </div>
    ))}
    <div style={{ marginTop: 14, padding: 12, border: '1px dashed var(--dark-line)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 12 }}>3 reports pending approval</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-2)' }}>REVIEW →</span>
    </div>
  </div>
);

const OperativeDemo = () => (
  <div>
    <div className="demo-head"><span>operative · today</span><span className="demo-pill"><span className="dot" />shift live</span></div>
    <div style={{ padding: 16, background: '#0F1311', borderRadius: 12, marginBottom: 12 }}>
      <div style={mono()}>Today&apos;s shift</div>
      <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', margin: '4px 0' }}>Atlas Tower — Floors 4–7</div>
      <div style={{ display: 'flex', gap: 18, fontSize: 12, color: 'var(--on-dark-muted)' }}>
        <span>08:00 — 16:00</span><span>4 areas</span><span style={{ color: 'var(--accent-2)' }}>● Checked in 08:02</span>
      </div>
    </div>
    <div style={mono({ marginBottom: 10 })}>Floors assigned</div>
    {['Floor 4 · North + South', 'Floor 5 · Pantry + WC', 'Floor 6 · Open plan', 'Floor 7 · Boardroom'].map((f, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < 3 ? '1px dashed var(--dark-line)' : 'none' }}>
        <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${i < 2 ? 'var(--accent-2)' : 'var(--dark-line-strong)'}`, background: i < 2 ? 'var(--accent-2)' : 'transparent', display: 'grid', placeItems: 'center' }}>
          {i < 2 && <svg width="9" height="9" viewBox="0 0 9 9"><path d="M1.5 4.5l2 2 4-4" stroke="var(--dark)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        </div>
        <div style={{ fontSize: 13, flex: 1, opacity: i < 2 ? 0.55 : 1, textDecoration: i < 2 ? 'line-through' : 'none' }}>{f}</div>
      </div>
    ))}
    <div style={{ marginTop: 14, padding: '10px 12px', background: 'rgba(6,182,212,0.10)', borderRadius: 8, fontSize: 12, color: 'var(--accent-2)', fontFamily: 'var(--font-mono)' }}>
      💬 1 message from supervisor
    </div>
  </div>
);

const DirectorDemo = () => (
  <div>
    <div className="demo-head"><span>director · global view</span><span className="demo-pill"><span className="dot" />all regions</span></div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
      {[{ l: 'Buildings', v: '47', d: '+4' }, { l: 'Operatives', v: '312', d: '+18' }, { l: 'Quality', v: '4.8', d: '+0.2' }].map((k, i) => (
        <div key={i} style={{ padding: 12, background: '#0F1311', borderRadius: 10 }}>
          <div style={mono()}>{k.l}</div>
          <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.02em', marginTop: 2 }}>{k.v}</div>
          <div style={{ fontSize: 11, color: 'var(--accent-2)', fontFamily: 'var(--font-mono)' }}>{k.d}</div>
        </div>
      ))}
    </div>
    <div style={mono({ marginBottom: 10 })}>Quality — last 30 days</div>
    <svg width="100%" height="110" viewBox="0 0 320 110" style={{ marginBottom: 10 }}>
      <defs>
        <linearGradient id="qgrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-2)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[20, 40, 60, 80].map((y) => <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="rgba(255,255,255,0.05)" />)}
      <path d="M0 80 L40 70 L80 78 L120 60 L160 50 L200 56 L240 40 L280 38 L320 28 L320 110 L0 110 Z" fill="url(#qgrad)" />
      <path d="M0 80 L40 70 L80 78 L120 60 L160 50 L200 56 L240 40 L280 38 L320 28" stroke="var(--accent-2)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="320" cy="28" r="3" fill="var(--accent-2)" />
    </svg>
    <div style={{ display: 'flex', justifyContent: 'space-between', ...mono({ fontSize: 10, letterSpacing: '0.05em' }) }}>
      <span>Apr 25</span><span>May 25</span>
    </div>
  </div>
);

const HQDemo = () => (
  <div>
    <div className="demo-head"><span>hq · control centre</span><span className="demo-pill"><span className="dot" />admin</span></div>
    <div style={mono({ marginBottom: 10 })}>Users · permissions</div>
    {[
      { n: 'Sarah Johnson', r: 'Director', s: 'active' },
      { n: 'Marco Silva', r: 'Manager', s: 'active' },
      { n: 'Anna Costa', r: 'Supervisor', s: 'active' },
      { n: 'Daniel Pereira', r: 'Operative', s: 'pending' },
    ].map((u, i) => (
      <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto auto', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px dashed var(--dark-line)' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'grid', placeItems: 'center', fontSize: 11, fontFamily: 'var(--font-mono)' }}>{u.n.split(' ').map((x) => x[0]).join('')}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{u.n}</div>
          <div style={{ fontSize: 11, color: 'var(--on-dark-muted)', fontFamily: 'var(--font-mono)' }}>{u.r}</div>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: u.s === 'active' ? 'var(--accent-2)' : '#F0B341' }}>● {u.s}</div>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4l5 4 5-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
      </div>
    ))}
    <div style={{ marginTop: 14, padding: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 10, fontSize: 11, color: 'var(--on-dark-muted)', fontFamily: 'var(--font-mono)' }}>
      🔒 SSO · SAML enabled · MFA required for all admins
    </div>
  </div>
);

const AirbnbDemo = () => (
  <div>
    <div className="demo-head"><span>airbnb · turnovers today</span><span className="demo-pill"><span className="dot" />3 properties</span></div>
    {[
      { n: 'Soho Loft · London', tt: 'Check-out 11:00 → Check-in 16:00', s: 'Cleaning', c: 'var(--accent-2)' },
      { n: 'Malasaña Studio · Madrid', tt: 'Check-out 10:00 → Check-in 15:00', s: 'Ready ✓', c: 'var(--accent-2)' },
      { n: 'Chiado Flat · Lisbon', tt: 'Check-out 11:00 → Check-in 14:00', s: 'Pending', c: '#F0B341' },
    ].map((p, i) => (
      <div key={i} style={{ padding: 14, border: '1px solid var(--dark-line)', borderRadius: 10, marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{p.n}</div>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: p.c, textTransform: 'uppercase', letterSpacing: '0.05em' }}>● {p.s}</div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--on-dark-muted)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>{p.tt}</div>
      </div>
    ))}
    <div style={mono({ margin: '16px 0 10px' })}>Checklist · Soho Loft</div>
    {[
      { z: 'Bedroom — linens, dust', d: true },
      { z: 'Bathroom — deep clean', d: true },
      { z: 'Kitchen — appliances', d: false },
      { z: 'Living — vacuum, restock', d: false },
    ].map((r, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 3 ? '1px dashed var(--dark-line)' : 'none', fontSize: 13 }}>
        <div style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${r.d ? 'var(--accent-2)' : 'var(--dark-line-strong)'}`, background: r.d ? 'var(--accent-2)' : 'transparent' }} />
        <span style={{ opacity: r.d ? 0.55 : 1, textDecoration: r.d ? 'line-through' : 'none' }}>{r.z}</span>
      </div>
    ))}
  </div>
);

const HomeDemo = () => (
  <div>
    <div className="demo-head"><span>home cleaning · client view</span><span className="demo-pill"><span className="dot" />premium</span></div>
    <div style={{ padding: 16, background: '#0F1311', borderRadius: 12, marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <div style={mono()}>Next visit</div>
          <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.02em', margin: '4px 0' }}>Friday · 14:00</div>
          <div style={{ fontSize: 12, color: 'var(--on-dark-muted)' }}>Sofia M. — your usual cleaner</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'grid', placeItems: 'center', fontWeight: 600 }}>SM</div>
          <div className="stars"><Icon.star /><Icon.star /><Icon.star /><Icon.star /><Icon.star /></div>
        </div>
      </div>
    </div>
    <div style={mono({ marginBottom: 10 })}>Loyalty · 340 pts</div>
    <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 99, marginBottom: 14, overflow: 'hidden' }}>
      <div style={{ width: '68%', height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--accent-2))' }} />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      <div style={{ padding: 12, border: '1px solid var(--dark-line)', borderRadius: 10 }}>
        <div style={{ fontSize: 18 }}>🎁</div>
        <div style={{ fontSize: 12, fontWeight: 500, marginTop: 4 }}>Free window clean</div>
        <div style={{ fontSize: 11, color: 'var(--on-dark-muted)', fontFamily: 'var(--font-mono)' }}>500 pts</div>
      </div>
      <div style={{ padding: 12, border: '1px solid var(--dark-line)', borderRadius: 10 }}>
        <div style={{ fontSize: 18 }}>✦</div>
        <div style={{ fontSize: 12, fontWeight: 500, marginTop: 4 }}>Aromatising</div>
        <div style={{ fontSize: 11, color: 'var(--on-dark-muted)', fontFamily: 'var(--font-mono)' }}>250 pts</div>
      </div>
    </div>
  </div>
);

const DEMOS = [SupervisorDemo, ManagerDemo, OperativeDemo, DirectorDemo, HQDemo, AirbnbDemo, HomeDemo];

export function Portals() {
  const t = useTranslations('psd');
  const raw = t.raw('portals.list');
  const portals = (Array.isArray(raw) ? raw : []) as Portal[];
  const [active, setActive] = useState(0);

  if (portals.length === 0) return null;
  const current = portals[active] ?? portals[0];
  const Demo = DEMOS[active] || DEMOS[0];

  return (
    <section className="section" id="portals">
      <div className="container">
        <div className="sec-head">
          <div className="left">
            <span className="eyebrow">{t('portals.eyebrow')}</span>
            <h2 className="h-section">{t('portals.title_a')} <span className="serif">{t('portals.title_b')}</span></h2>
          </div>
          <div className="right"><p>{t('portals.sub')}</p></div>
        </div>

        <div className="portals-shell">
          <div className="portal-list" role="tablist">
            {portals.map((p, i) => (
              <button
                key={p.name}
                role="tab"
                aria-selected={active === i}
                className={`portal-tab ${active === i ? 'active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="ptab-num">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <div className="ptab-name">{p.title}</div>
                  <div className="ptab-sub">{p.sub}</div>
                </span>
              </button>
            ))}
          </div>

          <div className="portal-view">
            <div key={active} className="fade-up">
              <span className="tag tag-accent">{current.name}</span>
              <h3 style={{ marginTop: 14 }}>{current.title}</h3>
              <p className="quote">&ldquo;{current.tag}&rdquo;</p>
              <p className="for">{current.for}</p>
              <ul className="portal-features">
                {(Array.isArray(current.features) ? current.features : []).map((f, i) => (
                  <li key={i}><Icon.check /> <span>{f}</span></li>
                ))}
              </ul>
            </div>
            <div className="portal-demo" key={`demo-${active}`}>
              <Demo />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
