'use client';

import { useState } from 'react';
import Link from 'next/link';
import { I } from './icons';
import { signOut } from '@/app/hq/actions';

type IconFn = (p?: { size?: number; sw?: number }) => React.ReactNode;

const NAV_MAIN: { id: string; icon: IconFn; label: string; badge?: string; badgeKind?: string }[] = [
  { id: 'overview', icon: I.grid, label: 'Resumen' },
  { id: 'jobs', icon: I.clipboard, label: 'Servicios', badge: '12' },
  { id: 'sites', icon: I.pin, label: 'Sitios' },
  { id: 'team', icon: I.users, label: 'Equipo' },
  { id: 'schedule', icon: I.calendar, label: 'Calendario' },
  { id: 'messages', icon: I.msg, label: 'Mensajes', badge: '3', badgeKind: 'warn' },
];

const NAV_MANAGE: { href: string; icon: IconFn; label: string }[] = [
  { href: '/hq/site', icon: I.grid, label: 'Sitio web' },
  { href: '/hq/branding', icon: I.sparkle, label: 'Branding' },
  { href: '/hq/clients', icon: I.users, label: 'Clientes' },
  { href: '/hq/sales', icon: I.chart, label: 'Ventas' },
  { href: '/hq/contracts', icon: I.clipboard, label: 'Contratos' },
  { href: '/hq/leads', icon: I.msg, label: 'Leads' },
  { href: '/hq/settings', icon: I.cog, label: 'Ajustes' },
];

function Sidebar({
  active,
  setActive,
  email,
}: {
  active: string;
  setActive: (v: string) => void;
  email: string;
}) {
  const initials = email.slice(0, 2).toUpperCase();
  return (
    <aside className="side">
      <div className="side-top">
        <div className="brand-mark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/portal-home-logo-v2.png" alt="Portal Services Digital" />
        </div>
        <div className="name">Portal HQ<span className="sub">v 4.2 · Pro</span></div>
      </div>

      <div className="workspace">
        <div className="ws-avatar">PC</div>
        <div className="ws-meta">
          <div className="ws-name">Portal Cleaning Ltd.</div>
          <div className="ws-sub">Plan Pro · Madrid</div>
        </div>
        <I.chev_d size={14} />
      </div>

      <div className="nav-group">
        <div className="nav-label">Operación</div>
        {NAV_MAIN.map((it) => {
          const Ic = it.icon;
          return (
            <div
              key={it.id}
              className={'nav-item ' + (active === it.id ? 'active' : '')}
              onClick={() => setActive(it.id)}
            >
              <Ic size={17} />
              <span>{it.label}</span>
              {it.badge && <span className={'badge ' + (it.badgeKind || '')}>{it.badge}</span>}
            </div>
          );
        })}
      </div>

      <div className="nav-group">
        <div className="nav-label">Gestión</div>
        {NAV_MANAGE.map((it) => {
          const Ic = it.icon;
          return (
            <Link key={it.href} href={it.href} className="nav-item">
              <Ic size={17} />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="side-bottom">
        <div className="user-card">
          <div className="user-avatar">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name">{email.split('@')[0]}</div>
            <div className="user-role">Owner · Admin</div>
          </div>
          <form action={signOut}>
            <button type="submit" className="icon-btn" aria-label="Cerrar sesión" title="Cerrar sesión">
              <I.logout size={15} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}

function KPI({
  label,
  value,
  delta,
  deltaDir,
  icon,
  kind,
  sparkColor,
}: {
  label: string;
  value: string;
  delta: string;
  deltaDir?: string;
  icon: IconFn;
  kind?: string;
  sparkColor: string;
}) {
  const Ic = icon;
  const gid = `g-${label.replace(/\s+/g, '')}`;
  return (
    <div className="kpi">
      <div className="kpi-h">
        <div className="kpi-l">{label}</div>
        <div className={'kpi-icon ' + (kind || '')}><Ic size={14} /></div>
      </div>
      <div className="kpi-v">{value}</div>
      <div className="kpi-d">
        <span className={'delta ' + (deltaDir === 'down' ? 'down' : '')}>
          {deltaDir === 'down' ? '▾' : '▴'} {delta}
        </span>
        <span>vs. ayer</span>
      </div>
      <svg className="kpi-spark" viewBox="0 0 80 28" width="80" height="28">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={sparkColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={sparkColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 22 L10 18 L20 20 L30 12 L40 14 L50 8 L60 11 L70 6 L80 8 L80 28 L0 28 Z" fill={`url(#${gid})`} />
        <path d="M0 22 L10 18 L20 20 L30 12 L40 14 L50 8 L60 11 L70 6 L80 8" stroke={sparkColor} strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  );
}

const MAP_PINS = [
  { x: 22, y: 28, k: 'live', label: 'Hotel Sol', who: 'María R.', time: '08:02', n: '12' },
  { x: 36, y: 44, k: 'live', label: 'Apto Gran Vía', who: 'Carlos M.', time: '08:05', n: '7' },
  { x: 55, y: 32, k: 'live', label: 'Oficinas K12', who: 'Equipo · 3', time: '07:48', n: '21' },
  { x: 71, y: 50, k: 'assigned', label: 'Loft Chueca', who: 'Lucía V.', time: '09:00', n: '3' },
  { x: 44, y: 62, k: 'warn', label: 'Coworking Atocha', who: 'Pedro K.', time: '08:30', n: '2' },
  { x: 80, y: 24, k: 'done', label: 'Suite Plaza', who: 'Ana L.', time: '07:30', n: '✓' },
  { x: 28, y: 70, k: 'done', label: 'Apto Malasaña', who: 'Equipo · 2', time: '07:00', n: '✓' },
  { x: 62, y: 76, k: 'assigned', label: 'Hotel Norte', who: 'Diego R.', time: '10:00', n: '4' },
  { x: 16, y: 56, k: 'idle', label: 'Almacén', who: '—', time: '—', n: '·' },
];

const LEGEND: Record<string, string> = { live: 'En sitio', assigned: 'Asignado', warn: 'Retraso', done: 'Completado' };

function LiveMap() {
  const [active, setActive] = useState(2);
  const a = MAP_PINS[active];
  return (
    <div className="ops-map">
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }} viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0 30 Q 30 32, 60 28 T 100 35" stroke="#CBD5E1" strokeWidth="0.4" fill="none" />
        <path d="M0 60 Q 40 65, 70 58 T 100 65" stroke="#CBD5E1" strokeWidth="0.4" fill="none" />
        <path d="M25 0 Q 28 30, 30 60 T 35 100" stroke="#CBD5E1" strokeWidth="0.4" fill="none" />
        <path d="M65 0 Q 70 35, 68 60 T 72 100" stroke="#CBD5E1" strokeWidth="0.4" fill="none" />
      </svg>
      {MAP_PINS.map((p, i) => (
        <div key={i} className={`pin ${p.k}`} style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%,-50%)' }} onMouseEnter={() => setActive(i)}>
          {p.n}
        </div>
      ))}
      {a && (
        <div className="map-tooltip" style={{ left: `calc(${a.x}% + 18px)`, top: `calc(${a.y}% - 20px)` }}>
          <h4>{a.label}</h4>
          <div className="row"><span>Equipo</span><strong>{a.who}</strong></div>
          <div className="row"><span>Inicio</span><strong>{a.time}</strong></div>
          <div className="row"><span>Estado</span><strong style={{ color: a.k === 'live' ? 'var(--brand-cyan)' : a.k === 'warn' ? 'var(--warn)' : a.k === 'done' ? 'var(--ok)' : 'var(--brand-blue)' }}>{LEGEND[a.k] ?? a.k}</strong></div>
        </div>
      )}
      <div className="map-legend">
        <div className="li"><span className="dot" style={{ background: '#06B6D4' }} />En sitio</div>
        <div className="li"><span className="dot" style={{ background: '#2563EB' }} />Asignado</div>
        <div className="li"><span className="dot" style={{ background: '#F59E0B' }} />Retraso</div>
        <div className="li"><span className="dot" style={{ background: '#10B981' }} />Completado</div>
      </div>
    </div>
  );
}

const TEAM = [
  { i: 'MR', n: 'María Romero', s: 'Hotel Sol · suite 412', status: 'on', pill: 'on', t: '2h 14m', avatar: '' },
  { i: 'CM', n: 'Carlos Mendes', s: 'Apto Gran Vía 32', status: 'on', pill: 'on', t: '1h 48m', avatar: 'alt' },
  { i: 'AL', n: 'Ana López', s: 'Ruta · 4 sitios', status: 'away', pill: 'warn', t: '10 min', avatar: 'alt2' },
  { i: 'PK', n: 'Pedro Kovač', s: 'Coworking Atocha · retraso', status: 'on', pill: 'warn', t: '47 min', avatar: 'alt3' },
  { i: 'LV', n: 'Lucía Vega', s: 'Loft Chueca', status: 'away', pill: 'off', t: 'Comienza 09:00', avatar: '' },
  { i: 'DR', n: 'Diego Reyes', s: 'Off duty', status: 'off', pill: 'off', t: '—', avatar: 'alt2' },
];

const TeamPanel = () => (
  <div className="card">
    <div className="card-h">
      <h3>Estado del equipo</h3>
      <a className="more" href="#">Ver todos <I.chev_r size={12} /></a>
    </div>
    <div className="team-list">
      {TEAM.map((p, i) => (
        <div className="team-row" key={i}>
          <div className={`team-avatar ${p.avatar}`}>{p.i}<span className={`status ${p.status}`} /></div>
          <div className="team-meta">
            <div className="team-name">{p.n}</div>
            <div className="team-site">
              <span className={`pill ${p.pill}`}>{p.pill === 'on' ? 'En sitio' : p.pill === 'warn' ? 'En ruta' : 'Fuera'}</span>
              {p.s}
            </div>
          </div>
          <div className="team-time">{p.t}</div>
        </div>
      ))}
    </div>
  </div>
);

const JOBS = [
  { d: false, t: 'Limpieza completa · Suite 412', s: 'Hotel Sol · María R. · 08:00', p: 'high' },
  { d: false, t: 'Check-out turnover · Apto Gran Vía', s: 'Short-let · Carlos M. · 09:30', p: 'high' },
  { d: false, t: 'Mantenimiento oficinas planta 4', s: 'K12 · Equipo de 3 · 10:00', p: 'med' },
  { d: false, t: 'Limpieza profunda · Coworking', s: 'Atocha · Pedro K. · 11:00', p: 'med' },
  { d: true, t: 'Turnover · Suite Plaza', s: 'Completado · Ana L. · 07:30', p: 'low' },
  { d: true, t: 'Check-in prep · Apto Malasaña', s: 'Completado · 07:00', p: 'low' },
];

const JobsPanel = () => (
  <div className="card">
    <div className="card-h">
      <h3>Servicios de hoy</h3>
      <div className="seg">
        <button className="active">Todos</button>
        <button>Mis sitios</button>
        <button>Urgentes</button>
      </div>
    </div>
    <div className="jobs">
      {JOBS.map((j, i) => (
        <div className={'job ' + (j.d ? 'done' : '')} key={i}>
          <div className="job-check">{j.d && <I.check size={12} sw={2.5} />}</div>
          <div className="job-meta">
            <div className="job-title">{j.t}</div>
            <div className="job-sub">{j.s}</div>
          </div>
          <span className={'job-prio prio-' + j.p}>{j.p === 'high' ? 'Urgente' : j.p === 'med' ? 'Media' : 'Normal'}</span>
        </div>
      ))}
    </div>
  </div>
);

const CHART = [
  { d: 'L', a: 38, b: 6 }, { d: 'M', a: 42, b: 4 }, { d: 'X', a: 35, b: 8 },
  { d: 'J', a: 47, b: 5 }, { d: 'V', a: 52, b: 3 }, { d: 'S', a: 28, b: 9 }, { d: 'D', a: 18, b: 2 },
];

function ChartPanel() {
  const max = 60;
  const w = 350, h = 160;
  const step = w / (CHART.length - 1);
  const pts = CHART.map((d, i) => [i * step, h - (d.a / max) * h] as const);
  const line = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p[0]} ${p[1]}`;
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = p;
    const cx = (x0 + x1) / 2;
    return acc + ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }, '');
  return (
    <div className="card">
      <div className="card-h">
        <h3>Servicios completados · 7 días</h3>
        <div className="seg"><button>4s</button><button className="active">7d</button><button>24h</button></div>
      </div>
      <div className="chart-wrap">
        <div className="chart-legend">
          <div className="li"><span className="sw" style={{ background: '#2563EB' }} />Completados</div>
          <div className="li"><span className="sw" style={{ background: '#06B6D4', opacity: 0.5 }} />Pendientes</div>
        </div>
        <div className="chart" style={{ padding: '0 24px 18px' }}>
          <svg viewBox="0 0 350 180" width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="chartG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3].map((g) => <line key={g} x1="0" x2="350" y1={g * 45} y2={g * 45} stroke="#E2E8F0" strokeDasharray="2 4" />)}
            <path d={`${line} L ${w} ${h} L 0 ${h} Z`} fill="url(#chartG)" />
            <path d={line} stroke="#2563EB" strokeWidth="2.5" fill="none" />
            {CHART.map((d, i) => <circle key={i} cx={i * step} cy={h - (d.a / max) * h} r="4" fill="white" stroke="#2563EB" strokeWidth="2" />)}
            {CHART.map((d, i) => {
              const bh = (d.b / max) * h;
              return <rect key={i} x={i * step - 8} y={h - bh} width="16" height={bh} rx="3" fill="#06B6D4" opacity="0.55" />;
            })}
            {CHART.map((d, i) => <text key={i} x={i * step} y="178" textAnchor="middle" fontSize="11" fill="#94A3B8" fontFamily="Poppins">{d.d}</text>)}
          </svg>
        </div>
      </div>
    </div>
  );
}

const ACTIVITY = [
  { t: '08:12', k: 'cyan', who: 'María R.', what: 'Fichó entrada · Hotel Sol' },
  { t: '08:08', k: 'ok', who: 'Ana L.', what: 'Completó turnover · Suite Plaza · 28 fotos subidas' },
  { t: '08:05', k: 'cyan', who: 'Carlos M.', what: 'Fichó entrada · Apto Gran Vía' },
  { t: '07:55', k: 'warn', who: 'Pedro K.', what: 'Retraso reportado · Coworking Atocha · +15 min' },
  { t: '07:42', k: '', who: 'Mauro A.', what: 'Asignó 4 nuevos servicios a equipo Norte' },
  { t: '07:30', k: 'ok', who: 'Ana L.', what: 'Iniciado servicio · Suite Plaza' },
];

const ActivityPanel = () => (
  <div className="card">
    <div className="card-h">
      <h3>Actividad reciente</h3>
      <button className="more"><I.more /></button>
    </div>
    <div className="timeline">
      {ACTIVITY.map((a, i) => (
        <div className="tl-row" key={i}>
          <span className="t">{a.t}</span>
          <span className={`tl-dot ${a.k}`} />
          <div className="tl-body">
            <div className="who">{a.who}</div>
            <div className="what">{a.what}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SITES = [
  { i: I.building, n: 'Hotel Sol', team: '5 ops', prog: 78, sla: '98%', st: 'green', lbl: 'Activo' },
  { i: I.bed, n: 'Apto Gran Vía 32', team: '1 op', prog: 50, sla: '100%', st: 'blue', lbl: 'En curso' },
  { i: I.building, n: 'Oficinas K12', team: '3 ops', prog: 22, sla: '94%', st: 'blue', lbl: 'En curso' },
  { i: I.bed, n: 'Loft Chueca', team: '1 op', prog: 0, sla: '—', st: 'amber', lbl: 'Programado' },
  { i: I.sparkle, n: 'Coworking Atocha', team: '1 op', prog: 12, sla: '82%', st: 'red', lbl: 'Retraso' },
  { i: I.building, n: 'Hotel Norte', team: '4 ops', prog: 0, sla: '—', st: 'amber', lbl: 'Programado' },
];

const SitesTable = () => (
  <div className="card">
    <div className="card-h">
      <h3>Sitios y rendimiento</h3>
      <a className="more" href="#">Ver todos <I.chev_r size={12} /></a>
    </div>
    <table className="sites-table">
      <thead>
        <tr><th>Sitio</th><th>Equipo</th><th>Progreso</th><th>SLA</th><th>Estado</th></tr>
      </thead>
      <tbody>
        {SITES.map((s, i) => {
          const Ic = s.i;
          return (
            <tr key={i}>
              <td><div className="site-name"><div className="ic"><Ic size={14} /></div>{s.n}</div></td>
              <td style={{ color: 'var(--muted)' }}>{s.team}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="progress"><div style={{ width: `${s.prog}%` }} /></div>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>{s.prog}%</span>
                </div>
              </td>
              <td style={{ fontWeight: 500 }}>{s.sla}</td>
              <td><span className={`tag ${s.st}`}>{s.lbl}</span></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

function SignupsCard({
  data,
}: {
  data: { newCount: number; recent: SignupLead[] };
}) {
  const hasLeads = data.recent.length > 0;
  return (
    <div
      style={{
        margin: '16px 24px 0',
        padding: '20px',
        background:
          'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
        border: '1px solid #e0f2fe',
        borderRadius: 18,
        boxShadow:
          '0 12px 32px -16px rgba(15,23,42,0.10), 0 2px 8px -4px rgba(15,23,42,0.05)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: hasLeads ? 16 : 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #22d3ee, #2563eb)',
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              boxShadow: '0 8px 20px -8px rgba(37,99,235,0.5)',
            }}
          >
            <I.msg size={18} />
          </div>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#64748b',
              }}
            >
              Registros desde el sitio
            </p>
            <p
              style={{
                margin: '2px 0 0',
                fontSize: 18,
                fontWeight: 600,
                color: '#0f172a',
                letterSpacing: '-0.01em',
              }}
            >
              {data.newCount > 0 ? (
                <>
                  <span style={{ color: '#0284c7' }}>{data.newCount}</span>{' '}
                  por contactar
                </>
              ) : (
                'Sin pendientes'
              )}
            </p>
          </div>
        </div>
        <Link
          href="/hq/leads"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            background: '#0f172a',
            color: '#fff',
            textDecoration: 'none',
            fontSize: 12,
            fontWeight: 600,
            borderRadius: 10,
            whiteSpace: 'nowrap',
          }}
        >
          Ver todos <I.chev_r size={11} />
        </Link>
      </div>

      {hasLeads ? (
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'grid',
            gap: 8,
          }}
        >
          {data.recent.slice(0, 3).map((l) => {
            const firstName = (l.name ?? l.email).split(' ')[0];
            const wa = l.phone
              ? `https://wa.me/${l.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Hola ${firstName}, soy Mauricio de Portal Home. Vi tu registro de ${l.company ?? 'tu empresa'} — ¿podemos charlar 10 min?`,
                )}`
              : null;
            return (
              <li
                key={l.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: '#ecfeff',
                    color: '#0e7490',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {(l.name ?? l.email).slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#0f172a',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {l.name ?? l.email}
                    {l.company ? (
                      <span style={{ color: '#94a3b8', fontWeight: 400 }}>
                        {' · '}
                        {l.company}
                      </span>
                    ) : null}
                  </p>
                  <p
                    style={{
                      margin: '2px 0 0',
                      fontSize: 11,
                      color: '#64748b',
                    }}
                  >
                    {l.email}
                    {l.phone ? ` · ${l.phone}` : ''}
                    {' · '}
                    {new Date(l.created_at).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <a
                    href={`mailto:${l.email}`}
                    title="Email"
                    style={iconBtnStyle}
                  >
                    <I.msg size={13} />
                  </a>
                  {l.phone ? (
                    <>
                      <a
                        href={`tel:${l.phone.replace(/\s+/g, '')}`}
                        title="Llamar"
                        style={iconBtnStyle}
                      >
                        <I.help size={13} />
                      </a>
                      <a
                        href={wa!}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="WhatsApp"
                        style={{
                          ...iconBtnStyle,
                          background: '#ecfdf5',
                          color: '#047857',
                          border: '1px solid #a7f3d0',
                        }}
                      >
                        <I.msg size={13} />
                      </a>
                    </>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p
          style={{
            margin: 0,
            padding: '16px 0',
            textAlign: 'center',
            fontSize: 12,
            color: '#94a3b8',
          }}
        >
          Cuando alguien rellene el formulario de “Pedir demo” / “Crear cuenta”,
          aparecerá aquí — y te llegará un email a la vez.
        </p>
      )}
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: 8,
  background: '#f1f5f9',
  color: '#475569',
  display: 'grid',
  placeItems: 'center',
  textDecoration: 'none',
  border: '1px solid #e2e8f0',
};

export type SignupLead = {
  id: string;
  name: string | null;
  email: string;
  company: string | null;
  phone: string | null;
  source: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'archived';
  created_at: string;
};

export function OpsDashboard({
  email,
  leadsData,
}: {
  email: string;
  leadsData?: { newCount: number; recent: SignupLead[] };
}) {
  const [active, setActive] = useState('overview');
  return (
    <div className="hqx">
      <div className="dash">
        <Sidebar active={active} setActive={setActive} email={email} />
        <main className="main">
          <div className="topbar">
            <div className="crumbs">HQ <I.chev_r size={11} /> <strong>Panel general</strong></div>
            <div className="search"><I.search size={14} /> Buscar sitios, operativos, servicios... <kbd>⌘K</kbd></div>
            <div className="right">
              <button className="icon-btn"><I.bell /><span className="dot" /></button>
              <Link href="/hq/settings" className="icon-btn"><I.cog /></Link>
            </div>
          </div>

          <div className="page-h">
            <div>
              <h1>Buenos días, {email.split('@')[0]}</h1>
              <div className="greeting">
                {leadsData && leadsData.newCount > 0
                  ? `Tienes ${leadsData.newCount} ${leadsData.newCount === 1 ? 'registro nuevo' : 'registros nuevos'} por revisar.`
                  : 'Hoy hay 47 servicios programados en 12 sitios.'}
              </div>
            </div>
            <div className="actions">
              <button className="btn btn-ghost"><I.download size={13} /> Exportar</button>
              <button className="btn btn-solid"><I.plus size={13} /> Nuevo servicio</button>
            </div>
          </div>

          {leadsData ? <SignupsCard data={leadsData} /> : null}

          <div className="kpis">
            <KPI label="Servicios hoy" value="47" delta="+8%" deltaDir="up" icon={I.clipboard} sparkColor="#2563EB" />
            <KPI label="Operativos activos" value="14" delta="+2" deltaDir="up" icon={I.users} kind="cyan" sparkColor="#06B6D4" />
            <KPI label="Ingresos · mes" value="€38.2K" delta="+12%" deltaDir="up" icon={I.euro} kind="green" sparkColor="#10B981" />
            <KPI label="SLA cumplido" value="98.2%" delta="-0.3%" deltaDir="down" icon={I.shield} kind="warn" sparkColor="#F59E0B" />
          </div>

          <div className="grid">
            <div className="card">
              <div className="card-h">
                <h3><I.pin size={15} /> Operaciones en vivo <span className="live"><span className="pulse" />LIVE</span></h3>
                <div className="seg"><button className="active">Hoy</button><button>Semana</button></div>
              </div>
              <div className="card-b" style={{ paddingTop: 14 }}><LiveMap /></div>
            </div>
            <TeamPanel />
          </div>

          <div className="grid"><JobsPanel /><ActivityPanel /></div>
          <div className="grid"><ChartPanel /><SitesTable /></div>
        </main>
      </div>
    </div>
  );
}
