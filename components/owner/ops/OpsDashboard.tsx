'use client';

import { useState } from 'react';
import Link from 'next/link';
import { I } from './icons';

type IconFn = (p?: { size?: number; sw?: number }) => React.ReactNode;

export type OpsJob = {
  id: string;
  title: string;
  sub: string;
  status: string;
};

export type OpsTeamMember = {
  i: string;
  n: string;
  s: string;
  status: 'on' | 'away' | 'off';
  pill: 'on' | 'warn' | 'off';
  t: string;
};

export type OpsChartPoint = { d: string; a: number; b: number };

export type OpsMapPoint = {
  label: string;
  who: string;
  k: 'live' | 'assigned' | 'warn' | 'done';
};

export type OpsProps = {
  ownerName: string;
  kpis: { today: number; completed: number; active: number; sla: string };
  jobs: OpsJob[];
  team: OpsTeamMember[];
  map: OpsMapPoint[];
  chart: OpsChartPoint[];
};

function KPI({
  label,
  value,
  icon,
  kind,
  sparkColor,
}: {
  label: string;
  value: string;
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

const POSITIONS = [
  { x: 22, y: 28 }, { x: 55, y: 32 }, { x: 71, y: 50 }, { x: 36, y: 44 },
  { x: 44, y: 66 }, { x: 80, y: 26 }, { x: 28, y: 72 }, { x: 64, y: 76 },
];
const LEGEND: Record<string, string> = { live: 'En sitio', assigned: 'Asignado', warn: 'Atención', done: 'Completado' };

function LiveMap({ points }: { points: OpsMapPoint[] }) {
  const live = points.findIndex((p) => p.k === 'live');
  const [active, setActive] = useState(live >= 0 ? live : 0);

  if (points.length === 0) {
    return (
      <div className="ops-map" style={{ display: 'grid', placeItems: 'center' }}>
        <p style={{ color: 'var(--muted)', fontSize: 14, textAlign: 'center', padding: 24 }}>
          Sin servicios para hoy.
        </p>
      </div>
    );
  }

  const a = points[active];
  const ap = POSITIONS[active % POSITIONS.length];
  return (
    <div className="ops-map">
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }} viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0 30 Q 30 32, 60 28 T 100 35" stroke="#CBD5E1" strokeWidth="0.4" fill="none" />
        <path d="M0 60 Q 40 65, 70 58 T 100 65" stroke="#CBD5E1" strokeWidth="0.4" fill="none" />
        <path d="M25 0 Q 28 30, 30 60 T 35 100" stroke="#CBD5E1" strokeWidth="0.4" fill="none" />
        <path d="M65 0 Q 70 35, 68 60 T 72 100" stroke="#CBD5E1" strokeWidth="0.4" fill="none" />
      </svg>
      {points.map((p, i) => {
        const pos = POSITIONS[i % POSITIONS.length];
        return (
          <div key={i} className={`pin ${p.k}`} style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%,-50%)' }} onMouseEnter={() => setActive(i)}>
            {p.k === 'done' ? '✓' : i + 1}
          </div>
        );
      })}
      {a && (
        <div className="map-tooltip" style={{ left: `calc(${ap.x}% + 18px)`, top: `calc(${ap.y}% - 20px)` }}>
          <h4>{a.label}</h4>
          <div className="row"><span>Equipo</span><strong>{a.who}</strong></div>
          <div className="row"><span>Estado</span><strong style={{ color: a.k === 'live' ? 'var(--brand-cyan)' : a.k === 'warn' ? 'var(--warn)' : a.k === 'done' ? 'var(--ok)' : 'var(--brand-blue)' }}>{LEGEND[a.k] ?? a.k}</strong></div>
        </div>
      )}
      <div className="map-legend">
        <div className="li"><span className="dot" style={{ background: '#06B6D4' }} />En sitio</div>
        <div className="li"><span className="dot" style={{ background: '#2563EB' }} />Asignado</div>
        <div className="li"><span className="dot" style={{ background: '#F59E0B' }} />Atención</div>
        <div className="li"><span className="dot" style={{ background: '#10B981' }} />Completado</div>
      </div>
    </div>
  );
}

const statusPill: Record<string, { lbl: string; cls: string }> = {
  scheduled: { lbl: 'Programado', cls: 'prio-med' },
  in_progress: { lbl: 'En curso', cls: 'prio-high' },
  completed: { lbl: 'Completado', cls: 'prio-low' },
  cancelled: { lbl: 'Cancelado', cls: 'prio-low' },
};

function JobsPanel({ jobs }: { jobs: OpsJob[] }) {
  return (
    <div className="card">
      <div className="card-h">
        <h3>Servicios de hoy</h3>
        <Link className="more" href="/owner/tasks">Ver todos <I.chev_r size={12} /></Link>
      </div>
      <div className="jobs">
        {jobs.length === 0 ? (
          <p style={{ padding: '18px 4px', color: 'var(--muted)', fontSize: 14 }}>
            No hay servicios programados para hoy.
          </p>
        ) : (
          jobs.map((j) => {
            const done = j.status === 'completed';
            const pill = statusPill[j.status] ?? statusPill.scheduled;
            return (
              <div className={'job ' + (done ? 'done' : '')} key={j.id}>
                <div className="job-check">{done && <I.check size={12} sw={2.5} />}</div>
                <div className="job-meta">
                  <div className="job-title">{j.title}</div>
                  <div className="job-sub">{j.sub}</div>
                </div>
                <span className={'job-prio ' + pill.cls}>{pill.lbl}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const AVATARS = ['', 'alt', 'alt2', 'alt3', '', 'alt2'];

function TeamPanel({ team }: { team: OpsTeamMember[] }) {
  return (
    <div className="card">
      <div className="card-h">
        <h3>Estado del equipo</h3>
        <Link className="more" href="/owner/cleaners">Ver todos <I.chev_r size={12} /></Link>
      </div>
      <div className="team-list">
        {team.length === 0 ? (
          <p style={{ padding: '18px 4px', color: 'var(--muted)', fontSize: 14 }}>
            Aún no tienes equipo. Añade tu primer limpiador.
          </p>
        ) : (
          team.map((p, i) => (
            <div className="team-row" key={i}>
              <div className={`team-avatar ${AVATARS[i % AVATARS.length]}`}>{p.i}<span className={`status ${p.status}`} /></div>
              <div className="team-meta">
                <div className="team-name">{p.n}</div>
                <div className="team-site">
                  <span className={`pill ${p.pill}`}>{p.pill === 'on' ? 'En sitio' : p.pill === 'warn' ? 'Asignado' : 'Fuera'}</span>
                  {p.s}
                </div>
              </div>
              <div className="team-time">{p.t}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ChartPanel({ data }: { data: OpsChartPoint[] }) {
  const CHART = data.length > 0 ? data : [{ d: '', a: 0, b: 0 }];
  const max = Math.max(6, ...CHART.map((d) => Math.max(d.a, d.b)));
  const w = 350, h = 160;
  const step = CHART.length > 1 ? w / (CHART.length - 1) : w;
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
            {CHART.map((d, i) => <text key={i} x={i * step} y="178" textAnchor="middle" fontSize="11" fill="#94A3B8">{d.d}</text>)}
          </svg>
        </div>
      </div>
    </div>
  );
}

export function OpsDashboard({ ownerName, kpis, jobs, team, map, chart }: OpsProps) {
  return (
    <div className="hqx">
      <div className="page-h">
        <div>
          <h1>Buenos días, {ownerName}</h1>
          <div className="greeting">Hoy hay {kpis.today} servicio(s) programado(s).</div>
        </div>
        <div className="actions">
          <Link className="btn btn-ghost" href="/owner/analytics"><I.download size={13} /> Exportar</Link>
          <Link className="btn btn-solid" href="/owner/tasks/new"><I.plus size={13} /> Nuevo servicio</Link>
        </div>
      </div>

      <div className="kpis">
        <KPI label="Servicios hoy" value={String(kpis.today)} icon={I.clipboard} sparkColor="#2563EB" />
        <KPI label="Completados" value={String(kpis.completed)} icon={I.check} kind="green" sparkColor="#10B981" />
        <KPI label="Operativos" value={String(kpis.active)} icon={I.users} kind="cyan" sparkColor="#06B6D4" />
        <KPI label="SLA cumplido" value={kpis.sla} icon={I.shield} kind="warn" sparkColor="#F59E0B" />
      </div>

      <div className="grid">
        <div className="card">
          <div className="card-h">
            <h3><I.pin size={15} /> Operaciones en vivo <span className="live"><span className="pulse" />LIVE</span></h3>
            <div className="seg"><button className="active">Hoy</button><button>Semana</button></div>
          </div>
          <div className="card-b" style={{ paddingTop: 14 }}><LiveMap points={map} /></div>
        </div>
        <TeamPanel team={team} />
      </div>

      <div className="grid"><JobsPanel jobs={jobs} /><ChartPanel data={chart} /></div>
    </div>
  );
}
