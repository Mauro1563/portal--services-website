import Link from 'next/link';
import {
  Inbox,
  Users,
  TrendingUp,
  UserPlus,
  Sparkles,
  ClipboardList,
  ArrowRight,
  MapPin,
  Camera,
  Eye,
} from 'lucide-react';
import { HQShell } from './Shell';
import { ApproveSignupButton } from '@/app/hq/leads/ApproveSignupButton';

export type FunnelCounts = {
  new: number;
  contacted: number;
  qualified: number;
  archived: number;
};

export type PendingLead = {
  id: string;
  name: string | null;
  email: string;
  company: string | null;
  source: string | null;
  created_at: string;
};

export type CleanerSummary = {
  id: string;
  name: string;
  owner_id: string;
};

export type CheckinSummary = {
  id: string;
  checkin_lat: number | null;
  checkin_lng: number | null;
  checked_in_at: string | null;
  cleaner: { name: string | null } | null;
  property: { name: string | null } | null;
};

export type PhotoSummary = {
  id: string;
  url: string;
  created_at: string;
  task_id: string | null;
};

type Props = {
  email: string;
  kpis: {
    pendingLeads: number;
    ownersTotal: number;
    conversionPct: number;
    signups7d: number;
    cleanersTotal: number;
    tasksToday: number;
    tasksDoneToday: number;
  };
  funnel: FunnelCounts;
  pendingLeadsList: PendingLead[];
  recentCleaners: CleanerSummary[];
  recentCheckins: CheckinSummary[];
  recentPhotos: PhotoSummary[];
  propertiesCount: number;
};

const RELATIVE = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
function relative(iso: string | null): string {
  if (!iso) return '—';
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return 'justo ahora';
  if (minutes < 60) return RELATIVE.format(-minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (hours < 24) return RELATIVE.format(-hours, 'hour');
  const days = Math.round(hours / 24);
  return RELATIVE.format(-days, 'day');
}

function initials(name?: string | null): string {
  if (!name) return '—';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function HQDashboard({
  email,
  kpis,
  funnel,
  pendingLeadsList,
  recentCleaners,
  recentCheckins,
  recentPhotos,
  propertiesCount,
}: Props) {
  const username = email.split('@')[0];
  const hour = new Date().getHours();
  const greeting =
    hour < 6 ? 'Buenas noches'
    : hour < 13 ? 'Buenos días'
    : hour < 21 ? 'Buenas tardes'
    : 'Buenas noches';

  const totalFunnel =
    funnel.new + funnel.contacted + funnel.qualified + funnel.archived || 1;
  const pct = (n: number) => Math.round((n / totalFunnel) * 100);

  return (
    <HQShell
      active="dashboard"
      email={email}
      title={`${greeting}, ${username}`}
      subtitle={
        kpis.pendingLeads > 0
          ? `Tienes ${kpis.pendingLeads} ${kpis.pendingLeads === 1 ? 'registro nuevo' : 'registros nuevos'} por revisar.`
          : 'Todo al día — no hay registros pendientes.'
      }
      actions={
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/hq/leads"
            className="rounded-lg border border-line bg-paper px-3 py-2 text-sm font-semibold text-graphite-1 transition hover:border-brand-400"
          >
            Ver leads
          </Link>
          <Link
            href="/hq/vistas"
            className="rounded-lg bg-brand-gradient px-3 py-2 text-sm font-semibold text-white shadow-brand-glow"
          >
            Vistas / Preview
          </Link>
        </div>
      }
    >
      {/* KPI grid */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard
          tone="alert"
          label="Leads pendientes"
          value={kpis.pendingLeads}
          hint={kpis.pendingLeads > 0 ? 'por contactar' : 'al día'}
        />
        <KpiCard
          label="Owners activos"
          value={kpis.ownersTotal}
          hint="total en la red"
        />
        <KpiCard
          label="Cleaners"
          value={kpis.cleanersTotal}
          hint="dados de alta"
        />
        <KpiCard
          label="Propiedades"
          value={propertiesCount}
          hint="en cartera"
        />
        <KpiCard
          label="Tareas hoy"
          value={kpis.tasksToday}
          hint={
            kpis.tasksToday > 0
              ? `${kpis.tasksDoneToday} completadas`
              : 'sin servicios'
          }
        />
        <KpiCard
          label="Conversión 30d"
          value={`${kpis.conversionPct}%`}
          hint={`${kpis.signups7d} signups 7d`}
        />
      </section>

      {/* Pipeline + pending lead */}
      <section className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-line bg-paper p-5">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-graphite-1">
                Pipeline de leads
              </h2>
              <p className="text-xs text-graphite-3">
                Distribución por estado · <code className="text-[11px]">marketing_leads</code>
              </p>
            </div>
            <Link
              href="/hq/leads"
              className="text-xs font-semibold text-brand-500 hover:text-brand-600"
            >
              Ver todos →
            </Link>
          </header>
          <div className="mt-4 space-y-2.5">
            <FunnelRow label="Nuevos" count={funnel.new} pct={pct(funnel.new)} color="from-brand-400 to-brand-600" />
            <FunnelRow label="Contactados" count={funnel.contacted} pct={pct(funnel.contacted)} color="from-cyan-400 to-cyan-600" />
            <FunnelRow label="Cualificados" count={funnel.qualified} pct={pct(funnel.qualified)} color="from-emerald-400 to-emerald-600" />
            <FunnelRow label="Archivados" count={funnel.archived} pct={pct(funnel.archived)} color="from-slate-300 to-slate-400" muted />
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-paper p-5">
          <header className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-graphite-1">
              Por contactar
            </h2>
            {kpis.pendingLeads > 0 ? (
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600">
                {kpis.pendingLeads} nuevo{kpis.pendingLeads === 1 ? '' : 's'}
              </span>
            ) : null}
          </header>
          {pendingLeadsList.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="Sin leads pendientes"
              hint="Cuando alguien se registre desde el sitio aparecerá aquí."
            />
          ) : (
            <ul className="mt-3 space-y-2.5">
              {pendingLeadsList.slice(0, 3).map((lead) => (
                <li
                  key={lead.id}
                  className="rounded-xl border border-rose-100 bg-rose-50/60 p-3"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-200 text-xs font-bold text-rose-800">
                      {initials(lead.name ?? lead.email)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-graphite-1">
                        {lead.name ?? lead.email.split('@')[0]}
                      </div>
                      <div className="truncate text-[11px] text-graphite-3">
                        {lead.email}
                        {lead.company ? ` · ${lead.company}` : ''}
                      </div>
                      <div className="mt-0.5 text-[10px] text-graphite-3">
                        {relative(lead.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <ApproveSignupButton leadId={lead.id} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Cleaners + check-ins */}
      <section className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="rounded-2xl border border-line bg-paper p-5 lg:col-span-2">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-graphite-1">
                Cleaners de la red
              </h2>
              <p className="text-xs text-graphite-3">
                {kpis.cleanersTotal} totales · {recentCleaners.length} mostrados
              </p>
            </div>
          </header>
          {recentCleaners.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Aún no hay cleaners"
              hint="Los owners los crean desde su portal."
            />
          ) : (
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {recentCleaners.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center gap-2.5 rounded-xl border border-line bg-surface-1 px-3 py-2.5"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-[11px] font-bold text-white">
                    {initials(c.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-graphite-1">
                      {c.name}
                    </div>
                    <div className="truncate text-[10px] text-graphite-3">
                      ID {c.id.slice(0, 8)}…
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-paper p-5">
          <header className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-graphite-1">
              Check-ins GPS · 24h
            </h2>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              {recentCheckins.length} live
            </span>
          </header>
          {recentCheckins.length === 0 ? (
            <EmptyState
              icon={MapPin}
              title="Sin check-ins recientes"
              hint="Aparecen cuando un cleaner ficha en una tarea."
            />
          ) : (
            <ul className="mt-3 space-y-2">
              {recentCheckins.slice(0, 5).map((ck) => (
                <li
                  key={ck.id}
                  className="flex items-start gap-2.5 rounded-lg border border-line bg-surface-1 px-2.5 py-2"
                >
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] font-semibold text-graphite-1">
                      {ck.cleaner?.name ?? 'Cleaner'}
                      <span className="font-normal text-graphite-3">
                        {' · '}
                        {ck.property?.name ?? 'propiedad'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-graphite-3">
                      <span>{relative(ck.checked_in_at)}</span>
                      {ck.checkin_lat && ck.checkin_lng ? (
                        <a
                          href={`https://www.google.com/maps?q=${ck.checkin_lat},${ck.checkin_lng}`}
                          target="_blank"
                          rel="noopener"
                          className="font-semibold text-brand-500 hover:text-brand-600"
                        >
                          ver mapa →
                        </a>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Photos gallery */}
      <section className="mt-6 rounded-2xl border border-line bg-paper p-5">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-graphite-1">
              Últimas fotos de tareas
            </h2>
            <p className="text-xs text-graphite-3">
              Evidencia subida por cleaners · <code className="text-[11px]">task_photos</code>
            </p>
          </div>
          <Camera className="h-4 w-4 text-graphite-3" />
        </header>
        {recentPhotos.length === 0 ? (
          <EmptyState
            icon={Camera}
            title="Sin fotos aún"
            hint="Cuando un cleaner suba evidencia de tarea aparecerán aquí."
          />
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {recentPhotos.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener"
                className="group relative aspect-square overflow-hidden rounded-lg border border-line bg-surface-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url}
                  alt=""
                  className="h-full w-full object-cover transition group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 py-1 text-[9px] font-semibold text-white">
                  {relative(p.created_at)}
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Quick actions */}
      <section className="mt-6 rounded-2xl bg-gradient-to-r from-ink-1 to-ink-2 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white">
              Acciones rápidas
            </h2>
            <p className="text-xs text-slate-400">
              Lo que más usas desde el HQ
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <QuickAction href="/hq/leads" icon={Inbox} primary>
              Revisar leads ({kpis.pendingLeads})
            </QuickAction>
            <QuickAction href="/hq/site" icon={Sparkles}>
              Editar sitio
            </QuickAction>
            <QuickAction href="/hq/branding" icon={UserPlus}>
              Branding
            </QuickAction>
            <QuickAction href="/hq/vistas" icon={Eye}>
              Vistas
            </QuickAction>
          </div>
        </div>
      </section>
    </HQShell>
  );
}

function KpiCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: number | string;
  hint?: string;
  tone?: 'alert';
}) {
  const isAlert = tone === 'alert' && Number(value) > 0;
  return (
    <div
      className={[
        'rounded-2xl border bg-paper p-4',
        isAlert ? 'border-rose-200 bg-rose-50/40' : 'border-line',
      ].join(' ')}
    >
      <div
        className={[
          'text-[10px] font-bold uppercase tracking-wider',
          isAlert ? 'text-rose-600' : 'text-graphite-3',
        ].join(' ')}
      >
        {label}
      </div>
      <div className="mt-1.5 text-2xl font-bold text-graphite-1">{value}</div>
      {hint ? (
        <div className="mt-0.5 text-[11px] text-graphite-3">{hint}</div>
      ) : null}
    </div>
  );
}

function FunnelRow({
  label,
  count,
  pct,
  color,
  muted,
}: {
  label: string;
  count: number;
  pct: number;
  color: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 text-xs font-semibold text-graphite-2">{label}</div>
      <div className="h-7 flex-1 overflow-hidden rounded-md bg-surface-2">
        <div
          className={[
            'h-full bg-gradient-to-r flex items-center justify-end px-2 text-[11px] font-bold',
            color,
            muted ? 'text-graphite-2' : 'text-white',
          ].join(' ')}
          style={{ width: `${Math.max(pct, count > 0 ? 8 : 0)}%` }}
        >
          {count > 0 ? count : ''}
        </div>
      </div>
      <div className="w-10 text-right text-xs tabular-nums text-graphite-3">
        {count}
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  hint: string;
}) {
  return (
    <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-line py-8 text-center">
      <Icon className="h-6 w-6 text-graphite-4" />
      <div className="mt-2 text-sm font-semibold text-graphite-2">{title}</div>
      <div className="mt-1 max-w-xs text-xs text-graphite-3">{hint}</div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  children,
  primary,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition',
        primary
          ? 'bg-white text-ink-1 hover:bg-slate-100'
          : 'border border-white/20 bg-white/10 text-white hover:bg-white/15',
      ].join(' ')}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
      <ArrowRight className="h-3 w-3 opacity-70" />
    </Link>
  );
}
