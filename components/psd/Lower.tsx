import { getTranslations } from 'next-intl/server';
import { Icon } from './icons';

export async function Comparison() {
  const t = await getTranslations('psd');
  const headers = t.raw('cmp.headers') as string[];
  const rows = t.raw('cmp.rows') as (string | boolean)[][];
  return (
    <section className="section-tight">
      <div className="container">
        <div className="sec-head">
          <div className="left">
            <span className="eyebrow">{t('cmp.eyebrow')}</span>
            <h2 className="h-section">{t('cmp.title_a')} <span className="serif">{t('cmp.title_b')}</span></h2>
          </div>
          <div className="right"><p>{t('cmp.sub')}</p></div>
        </div>
        <div className="card" style={{ padding: '8px 24px', overflowX: 'auto' }}>
          <table className="cmp-table">
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className={i > 0 ? 'plan-h' : ''} style={{ textAlign: i === 0 ? 'left' : 'center' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className="feat-label">{row[0] as string}</td>
                  {row.slice(1).map((c, j) => (
                    <td key={j} className={c ? 'cell-check' : 'cell-empty'}>
                      {c ? <Icon.check /> : '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export async function Security() {
  const t = await getTranslations('psd');
  const items = t.raw('sec.items') as { t: string; d: string }[];
  const icons = [<Icon.shield key="s" />, <Icon.globe key="g" />, <Icon.lock key="l" />, <Icon.zap key="z" />];
  return (
    <section className="section" id="security">
      <div className="container">
        <div className="sec-head">
          <div className="left">
            <span className="eyebrow">{t('sec.eyebrow')}</span>
            <h2 className="h-section">{t('sec.title_a')} <span className="serif">{t('sec.title_b')}</span></h2>
          </div>
          <div className="right"><p>{t('sec.sub')}</p></div>
        </div>
        <div className="sec-grid">
          {items.map((it, i) => (
            <div className="sec-cell" key={i}>
              <div className="icon">{icons[i]}</div>
              <h4>{it.t}</h4>
              <p>{it.d}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {['GDPR', 'SSL', 'PCI DSS', 'SOC 2 (in progress)', 'UK · ES · PT', '3 languages'].map((s) => (
            <span className="tag" key={s}>{s}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
