'use client';

/**
 * Public preview of the AIRBNB-flavour Owner dashboard — clickable tour
 * targeting cleaning companies that serve Airbnb hosts. Parallel to
 * /owner/preview but tuned for short-let turnovers:
 *   - properties are iCal-synced Airbnb listings (not residential homes)
 *   - tasks are CHECKOUT events with a turnaround SLA, not manual bookings
 *   - there is no "client portal" — the host IS the client
 *   - the visual accent shifts from cyan/blue → orange/coral so the demo
 *     reads as Airbnb-adjacent at a glance
 *
 * Self-contained on purpose: we don't share the /owner/preview layout
 * (it would mount the wrong top-bar copy), so the topbar + bottom nav
 * are inlined here. No auth, no Supabase — every interactive piece is
 * a mock kept in lib/preview-airbnb.ts.
 */
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Flame,
  LayoutGrid,
  ListChecks,
  MessageCircle,
  PoundSterling,
  RefreshCw,
  Send,
  ShieldAlert,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wifi,
} from 'lucide-react';
import { RevenueChart } from '@/components/owner/RevenueChart';
import {
  AIRBNB_LISTINGS,
  AIRBNB_REVENUE_WEEK,
  AIRBNB_STATS,
  RESTOCK_ALERTS,
  TURNAROUND_TASKS,
  formatPence,
} from '@/lib/preview-airbnb';
import { PreviewFlavorToggle } from '@/components/preview/PreviewFlavorToggle';
import { useClientLocale, pickCopy } from '@/lib/use-locale-client';

const COPY = {
  en: {
    portalHomeAria: 'Portal Services Digital',
    demoLabel: 'Demo · Owner (Airbnb)',
    backToSite: 'Back to site',
    back: 'Back',
    minAgo2: '2 min ago',
    aFewSecondsAgo: 'a few seconds ago',
    home: 'Home',
    turnovers: 'Turnovers',
    team: 'Team',
    chat: 'Chat',
    listings: 'Listings',
    ownerPanel: 'Owner panel',
    hello: 'Hello, Alan',
    turnoversToday: 'Alan Cleaners · 4 turnovers scheduled today',
    airbnbSyncAria: 'Airbnb sync status',
    calendarSynced: 'Airbnb calendar synced',
    lastUpdate: (label: string) => `Last updated ${label} · 6 active iCal feeds`,
    syncing: 'Syncing…',
    syncBtn: 'Sync iCal',
    activeListings: 'Active listings',
    syncedWithAirbnb: 'synced with Airbnb',
    turnoversThisWeek: 'Turnovers this week',
    vsLastWeek: 'vs. last week',
    avgTurnaround: 'Avg turnaround time',
    checkoutToCheckin: 'checkout → check-in',
    monthRevenue: 'Monthly revenue',
    vsLastMonth: 'vs. last month',
    todaysTurnovers: 'Today’s turnovers',
    seeAll: 'See all',
    windowH: (h: number) => `${h}h window`,
    checkout: 'Checkout',
    cleaner: 'Cleaner',
    checkIn: 'Check-in',
    restockAlerts: 'Restock alerts',
    pending: 'pending',
    resolve: 'Resolve',
    markedToRestock: (name: string) => `Marked for restock: ${name}`,
    quickActions: 'Quick actions',
    syncIcal: 'Sync iCal',
    syncIcalHint: 'Refresh 6 Airbnb feeds',
    notifyHost: 'Notify host',
    notifyHostHint: 'Quick message to the owner',
    notifyHostFlash: 'Host message draft opened',
    reportDamage: 'Report damage to host',
    reportDamageHint: 'Attach cleaner photos',
    reportDamageFlash: 'Incident form opened',
    yourListings: 'Your listings',
    manage: 'Manage',
    syncedWithAirbnbBadge: 'Synced with Airbnb',
    perNight: '/night',
    manageTeam: 'Manage cleaner team',
    manageTeamHint: 'Assign turnovers, adjust availability and review performance.',
    fullAnalytics: 'See full analytics',
    analyticsHint: 'Occupancy, average rating and trends by listing.',
    syncedToast: 'Airbnb calendar synced · 6 listings up to date',
    statusPending: 'Pending',
    statusInProgress: 'In progress',
    statusDone: 'Done',
  },
  es: {
    portalHomeAria: 'Portal Services Digital',
    demoLabel: 'Demo · Owner (Airbnb)',
    backToSite: 'Volver al sitio',
    back: 'Volver',
    minAgo2: 'hace 2 min',
    aFewSecondsAgo: 'hace unos segundos',
    home: 'Inicio',
    turnovers: 'Turnovers',
    team: 'Equipo',
    chat: 'Chat',
    listings: 'Listings',
    ownerPanel: 'Panel del propietario',
    hello: 'Hola, Alan',
    turnoversToday: 'Alan Cleaners · 4 turnovers programados hoy',
    airbnbSyncAria: 'Estado de sincronización con Airbnb',
    calendarSynced: 'Calendario Airbnb sincronizado',
    lastUpdate: (label: string) => `Última actualización ${label} · 6 feeds iCal activos`,
    syncing: 'Sincronizando…',
    syncBtn: 'Sincronizar iCal',
    activeListings: 'Listings activos',
    syncedWithAirbnb: 'sincronizados con Airbnb',
    turnoversThisWeek: 'Turnovers esta semana',
    vsLastWeek: 'vs. semana pasada',
    avgTurnaround: 'Tiempo medio turnaround',
    checkoutToCheckin: 'checkout → check-in',
    monthRevenue: 'Revenue mes',
    vsLastMonth: 'vs. mes pasado',
    todaysTurnovers: 'Turnovers de hoy',
    seeAll: 'Ver todos',
    windowH: (h: number) => `ventana ${h}h`,
    checkout: 'Checkout',
    cleaner: 'Cleaner',
    checkIn: 'Check-in',
    restockAlerts: 'Restock alerts',
    pending: 'pendientes',
    resolve: 'Resolver',
    markedToRestock: (name: string) => `Marcado para reponer: ${name}`,
    quickActions: 'Acciones rápidas',
    syncIcal: 'Sincronizar iCal',
    syncIcalHint: 'Refrescar 6 feeds Airbnb',
    notifyHost: 'Notificar host',
    notifyHostHint: 'Mensaje rápido al propietario',
    notifyHostFlash: 'Borrador de mensaje al host abierto',
    reportDamage: 'Reportar daño al host',
    reportDamageHint: 'Adjunta fotos del cleaner',
    reportDamageFlash: 'Formulario de incidencia abierto',
    yourListings: 'Tus listings',
    manage: 'Gestionar',
    syncedWithAirbnbBadge: 'Sincronizado con Airbnb',
    perNight: '/noche',
    manageTeam: 'Gestionar equipo de cleaners',
    manageTeamHint: 'Asigna turnovers, ajusta disponibilidad y revisa rendimiento.',
    fullAnalytics: 'Ver analítica completa',
    analyticsHint: 'Ocupación, rating medio y tendencias por listing.',
    syncedToast: 'Calendario Airbnb sincronizado · 6 listings al día',
    statusPending: 'Pendiente',
    statusInProgress: 'En curso',
    statusDone: 'Hecho',
  },
  pt: {
    portalHomeAria: 'Portal Services Digital',
    demoLabel: 'Demo · Owner (Airbnb)',
    backToSite: 'Voltar ao site',
    back: 'Voltar',
    minAgo2: 'há 2 min',
    aFewSecondsAgo: 'há uns segundos',
    home: 'Início',
    turnovers: 'Turnovers',
    team: 'Equipa',
    chat: 'Chat',
    listings: 'Listings',
    ownerPanel: 'Painel do proprietário',
    hello: 'Olá, Alan',
    turnoversToday: 'Alan Cleaners · 4 turnovers agendados hoje',
    airbnbSyncAria: 'Estado de sincronização com Airbnb',
    calendarSynced: 'Calendário Airbnb sincronizado',
    lastUpdate: (label: string) => `Última atualização ${label} · 6 feeds iCal ativos`,
    syncing: 'A sincronizar…',
    syncBtn: 'Sincronizar iCal',
    activeListings: 'Listings ativos',
    syncedWithAirbnb: 'sincronizados com Airbnb',
    turnoversThisWeek: 'Turnovers esta semana',
    vsLastWeek: 'vs. semana passada',
    avgTurnaround: 'Tempo médio de turnaround',
    checkoutToCheckin: 'checkout → check-in',
    monthRevenue: 'Receita do mês',
    vsLastMonth: 'vs. mês passado',
    todaysTurnovers: 'Turnovers de hoje',
    seeAll: 'Ver todos',
    windowH: (h: number) => `janela ${h}h`,
    checkout: 'Checkout',
    cleaner: 'Cleaner',
    checkIn: 'Check-in',
    restockAlerts: 'Alertas de reposição',
    pending: 'pendentes',
    resolve: 'Resolver',
    markedToRestock: (name: string) => `Marcado para repor: ${name}`,
    quickActions: 'Ações rápidas',
    syncIcal: 'Sincronizar iCal',
    syncIcalHint: 'Atualizar 6 feeds Airbnb',
    notifyHost: 'Notificar host',
    notifyHostHint: 'Mensagem rápida ao proprietário',
    notifyHostFlash: 'Rascunho de mensagem ao host aberto',
    reportDamage: 'Reportar dano ao host',
    reportDamageHint: 'Anexa fotos do cleaner',
    reportDamageFlash: 'Formulário de incidente aberto',
    yourListings: 'Os teus listings',
    manage: 'Gerir',
    syncedWithAirbnbBadge: 'Sincronizado com Airbnb',
    perNight: '/noite',
    manageTeam: 'Gerir equipa de cleaners',
    manageTeamHint: 'Atribui turnovers, ajusta disponibilidade e revê desempenho.',
    fullAnalytics: 'Ver análise completa',
    analyticsHint: 'Ocupação, rating médio e tendências por listing.',
    syncedToast: 'Calendário Airbnb sincronizado · 6 listings em dia',
    statusPending: 'Pendente',
    statusInProgress: 'Em curso',
    statusDone: 'Feito',
  },
} as const;

type AirbnbCopy = (typeof COPY)['en'];

// --- Local UI helpers (kept inline so the page is self-contained) ----------

/**
 * Custom DEMO top-bar — same shape as components/preview/DemoTopBar but
 * with the orange/coral accent and a custom centre label so the preview
 * is clearly the Airbnb flavour. The component there hard-codes the
 * tone & label per portal, so we render our own variant here rather than
 * extend the shared API for a one-off.
 */
function AirbnbDemoTopBar({ t }: { t: AirbnbCopy }) {
  return (
    <div className="sticky top-0 z-50 border-b border-orange-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-md items-center justify-between gap-2 px-3 sm:max-w-2xl">
        <Link
          href="/"
          className="-ml-1 inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-slate-900 transition hover:bg-orange-50"
          aria-label={t.portalHomeAria}
        >
          <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-orange-400 to-rose-500 text-[10px] font-bold text-white">
            P
          </span>
          <span className="font-display text-[12px] font-semibold leading-none">
            Portal Services Digital
          </span>
        </Link>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-orange-300">
          <Sparkles className="h-2.5 w-2.5" />
          {t.demoLabel}
        </span>
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-700 transition hover:border-orange-300 hover:bg-orange-50/40"
        >
          <ArrowLeft className="h-3 w-3" />
          <span className="hidden sm:inline">{t.backToSite}</span>
          <span className="sm:hidden">{t.back}</span>
        </Link>
      </div>
    </div>
  );
}

type TabKey = 'home' | 'tasks' | 'cleaners' | 'chat' | 'listings';

/**
 * Bottom nav for the Airbnb preview — reuses the same DemoBottomTabBar
 * shape but relabels "Sitios" → "Listings" (per the brief). All hrefs
 * keep prospects inside /owner/preview-airbnb/* so the tour never leaks
 * into authed routes. None of the sub-routes exist yet, but Next will
 * 404 gracefully and the visible affordance still communicates the IA.
 */
function AirbnbBottomTabBar({ active, t }: { active: TabKey; t: AirbnbCopy }) {
  const items: Array<{
    key: TabKey;
    href: string;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
  }> = [
    { key: 'home', href: '/owner/preview-airbnb', label: t.home, Icon: LayoutGrid },
    { key: 'tasks', href: '/owner/preview-airbnb/tasks', label: t.turnovers, Icon: ListChecks },
    { key: 'cleaners', href: '/owner/preview-airbnb/cleaners', label: t.team, Icon: Users },
    { key: 'chat', href: '/owner/preview-airbnb/chat-hub', label: t.chat, Icon: MessageCircle },
    { key: 'listings', href: '/owner/preview-airbnb/listings', label: t.listings, Icon: Building2 },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {items.map(({ key, href, label, Icon }) => {
          const isActive = key === active;
          return (
            <li key={key} className="flex-1">
              <Link
                href={href}
                className={`relative flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition ${
                  isActive ? 'text-orange-700' : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive ? (
                  <span
                    aria-hidden
                    className="absolute top-0 h-[3px] w-10 rounded-b bg-orange-600"
                  />
                ) : null}
                <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.25]' : 'stroke-[1.75]'}`} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// "x min ago" string is sourced from locale copy now.

// --- Page ------------------------------------------------------------------

export default function OwnerPreviewAirbnbHome() {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  // `null` means "use the localized default label" (last 2 min). Once the
  // user triggers a sync we lock in the recent label.
  const [syncedOverride, setSyncedOverride] = useState<'recent' | null>(null);
  const syncedLabel = syncedOverride === 'recent' ? t.aFewSecondsAgo : t.minAgo2;
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }

  function handleSync() {
    if (syncing) return;
    setSyncing(true);
    window.setTimeout(() => {
      setSyncing(false);
      setSyncedOverride('recent');
      flash(t.syncedToast);
    }, 900);
  }

  return (
    <>
      <AirbnbDemoTopBar t={t} />
      <PreviewFlavorToggle
        active="airbnb"
        hogarHref="/owner/preview"
        airbnbHref="/owner/preview-airbnb"
      />
      <main className="relative min-h-screen overflow-hidden bg-slate-50 pb-20">
        {/* Orange ambient blob — the Airbnb-adjacent accent that replaces the
            blue/cyan glow used on the residential preview. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 z-0 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-orange-300 to-rose-400 opacity-30 blur-3xl"
        />

        <div className="relative z-10 mx-auto max-w-5xl px-3 pt-4 sm:px-4 sm:pt-5 lg:px-8 lg:pt-7">
          {/* Greeting */}
          <header className="mb-4">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-orange-700">
              {t.ownerPanel}
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              {t.hello}
            </h1>
            <p className="mt-1 text-[13px] text-slate-600">
              {t.turnoversToday}
            </p>
          </header>

          {/* iCal sync banner — the defining visual of the Airbnb flavour:
              prospects need to immediately understand that bookings come
              from Airbnb via iCal, not from manual scheduling. */}
          <section
            aria-label={t.airbnbSyncAria}
            className="mb-5 overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-rose-50 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),_0_8px_24px_-8px_rgba(249,115,22,0.25)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-sm">
                  <Calendar className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-slate-900">
                    {t.calendarSynced}
                  </p>
                  <p className="mt-0.5 inline-flex items-center gap-1.5 text-[12px] text-slate-600">
                    <Wifi className="h-3 w-3 text-emerald-600" />
                    {t.lastUpdate(syncedLabel)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSync}
                disabled={syncing}
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-[12px] font-semibold text-orange-200 transition hover:bg-slate-800 disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`}
                />
                {syncing ? t.syncing : t.syncBtn}
              </button>
            </div>
            {/* Mock iCal feed peek — gives credibility without showing real
                .ics syntax; cleaning companies recognise this pattern. */}
            <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {AIRBNB_LISTINGS.slice(0, 4).map((l) => (
                <li
                  key={l.id}
                  className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-1.5 text-[11.5px] text-slate-700 ring-1 ring-orange-100"
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  <span className="truncate font-mono text-[10.5px] text-slate-500">
                    airbnb.com/calendar/ical/{l.airbnbId}.ics
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Stat tiles — the four headline metrics for an Airbnb cleaner. */}
          <section className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
            <StatTile
              label={t.activeListings}
              value={String(AIRBNB_STATS.activeListings)}
              hint={t.syncedWithAirbnb}
              Icon={Building2}
              accent="orange"
            />
            <StatTile
              label={t.turnoversThisWeek}
              value={String(AIRBNB_STATS.turnoversThisWeek)}
              hint={t.vsLastWeek}
              delta={{ label: '+27%', positive: true }}
              Icon={CalendarDays}
              accent="amber"
            />
            <StatTile
              label={t.avgTurnaround}
              value={AIRBNB_STATS.avgTurnaroundLabel}
              hint={t.checkoutToCheckin}
              Icon={Flame}
              accent="rose"
            />
            <StatTile
              label={t.monthRevenue}
              value={formatPence(AIRBNB_STATS.monthlyRevenuePence)}
              hint={t.vsLastMonth}
              delta={{ label: '+18%', positive: true }}
              Icon={PoundSterling}
              accent="emerald"
            />
          </section>

          {/* Revenue chart — reused from the residential preview because the
              shape (7 bars, £-formatted tooltip) reads cleanly regardless of
              accent. The colours are baked into the chart component; we
              don't try to recolour it here. */}
          <div className="mt-6">
            <RevenueChart data={AIRBNB_REVENUE_WEEK} />
          </div>

          {/* Turnover queue — the "today" panel. Each row shows the three
              times that matter for an Airbnb turnaround: previous checkout,
              cleaner arrival, next check-in deadline. */}
          <section className="mt-6">
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="font-display text-base font-semibold text-slate-900">
                {t.todaysTurnovers}
              </h2>
              <Link
                href="/owner/preview-airbnb/tasks"
                className="text-[12px] font-semibold text-orange-700 hover:underline"
              >
                {t.seeAll}
              </Link>
            </div>
            <ul className="space-y-3">
              {TURNAROUND_TASKS.map((task) => (
                <li
                  key={task.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-slate-900">
                        {task.listingName}
                      </p>
                      <p className="mt-0.5 truncate text-[11.5px] text-slate-600">
                        {task.cleanerName} · {t.windowH(Math.round(task.windowMinutes / 60))}
                      </p>
                    </div>
                    <TurnaroundBadge status={task.status} t={t} />
                  </div>
                  {/* Three-stop timeline: checkout → cleaner → check-in. */}
                  <div className="grid grid-cols-3 divide-x divide-slate-100">
                    <TimelineCell
                      label={t.checkout}
                      time={task.checkoutAt}
                      tone="slate"
                    />
                    <TimelineCell
                      label={t.cleaner}
                      time={task.cleanerArrivesAt}
                      tone="orange"
                    />
                    <TimelineCell
                      label={t.checkIn}
                      time={task.nextCheckInAt}
                      tone="emerald"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Restock alerts — Airbnb hosts care about consumables (paper,
              coffee, water) because a missing roll = a bad review. This
              section is the demo's tell-tale Airbnb-specific feature. */}
          <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-100 text-amber-800">
                <Bell className="h-4 w-4" />
              </span>
              <h2 className="font-display text-base font-semibold text-slate-900">
                {t.restockAlerts}
              </h2>
              <span className="ml-auto rounded-full bg-amber-200/60 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-amber-900">
                {RESTOCK_ALERTS.length} {t.pending}
              </span>
            </div>
            <ul className="space-y-2">
              {RESTOCK_ALERTS.map((alert) => (
                <li
                  key={alert.id}
                  className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 ring-1 ring-amber-100"
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                      alert.severity === 'urgent'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <ShieldAlert className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-slate-900">
                      {alert.listingName}
                    </p>
                    <p className="mt-0.5 truncate text-[11.5px] text-slate-600">
                      {alert.message}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => flash(t.markedToRestock(alert.listingName))}
                    className="rounded-full border border-amber-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-amber-800 hover:bg-amber-50"
                  >
                    {t.resolve}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Quick actions — Airbnb-specific verbs. Notably absent: "Nuevo
              cliente" (the host IS the client) and "Reservas" (Airbnb owns
              the booking flow). */}
          <section className="mt-6">
            <h2 className="mb-3 px-1 font-display text-base font-semibold text-slate-900">
              {t.quickActions}
            </h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <QuickAction
                label={t.syncIcal}
                hint={t.syncIcalHint}
                Icon={RefreshCw}
                onClick={handleSync}
              />
              <QuickAction
                label={t.notifyHost}
                hint={t.notifyHostHint}
                Icon={Send}
                onClick={() => flash(t.notifyHostFlash)}
              />
              <QuickAction
                label={t.reportDamage}
                hint={t.reportDamageHint}
                Icon={ShieldAlert}
                onClick={() => flash(t.reportDamageFlash)}
              />
            </div>
          </section>

          {/* Listings management — the equivalent of "Propiedades" but
              showing Airbnb-side metadata (rating, nightly price, sync
              badge) so cleaning companies see exactly what each listing
              looks like to the guest. */}
          <section className="mt-8">
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="font-display text-base font-semibold text-slate-900">
                {t.yourListings}
              </h2>
              <Link
                href="/owner/preview-airbnb/listings"
                className="text-[12px] font-semibold text-orange-700 hover:underline"
              >
                {t.manage}
              </Link>
            </div>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {AIRBNB_LISTINGS.map((l) => (
                <li
                  key={l.id}
                  className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-orange-100 to-rose-100 text-orange-700">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[14px] font-semibold text-slate-900">
                        {l.name}
                      </p>
                      <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-orange-50 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-orange-700 ring-1 ring-orange-200">
                        <RefreshCw className="h-2.5 w-2.5" />
                        {t.syncedWithAirbnbBadge}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-[11.5px] text-slate-600">
                      {l.neighbourhood} · #{l.airbnbId}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-[12px] text-slate-700">
                      <span className="font-semibold">{formatPence(l.pricePence)}{t.perNight}</span>
                      <span aria-hidden className="text-slate-300">
                        ·
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{l.rating.toFixed(1)}</span>
                        <span className="text-slate-500">({l.reviewsCount})</span>
                      </span>
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-slate-500" />
                </li>
              ))}
            </ul>
          </section>

          {/* Cleaners management entry — same intent as residential preview,
              just the accent changes. */}
          <Link
            href="/owner/preview-airbnb/cleaners"
            className="group mt-6 flex items-center justify-between gap-3 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-rose-50 p-4 text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04),_0_8px_24px_-8px_rgba(249,115,22,0.25)] transition duration-200 hover:-translate-y-0.5 hover:border-orange-300"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-sm">
                <Users className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-slate-900">
                  {t.manageTeam}
                </p>
                <p className="mt-0.5 text-[12px] text-slate-600">
                  {t.manageTeamHint}
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-orange-600 transition group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/owner/preview-airbnb/analytics"
            className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04),_0_4px_12px_-2px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50/30"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-700">
                <BarChart3 className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-slate-900">
                  {t.fullAnalytics}
                </p>
                <p className="mt-0.5 text-[12px] text-slate-600">
                  {t.analyticsHint}
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-orange-600" />
          </Link>
        </div>

        {/* Toast — confirms quick-action clicks without a real backend. */}
        {toast ? (
          <div
            role="status"
            aria-live="polite"
            className="fixed inset-x-0 bottom-20 z-50 mx-auto flex max-w-md justify-center px-4"
          >
            <div className="rounded-full bg-slate-900 px-4 py-2 text-[12.5px] font-semibold text-orange-200 shadow-lg">
              {toast}
            </div>
          </div>
        ) : null}

        <AirbnbBottomTabBar active="home" t={t} />
      </main>
    </>
  );
}

// --- Small presentational sub-components -----------------------------------

type StatAccent = 'orange' | 'amber' | 'rose' | 'emerald';
const STAT_ACCENT: Record<
  StatAccent,
  { iconBg: string; iconText: string; ring: string }
> = {
  orange: {
    iconBg: 'bg-orange-50',
    iconText: 'text-orange-700',
    ring: 'ring-orange-100',
  },
  amber: {
    iconBg: 'bg-amber-50',
    iconText: 'text-amber-700',
    ring: 'ring-amber-100',
  },
  rose: {
    iconBg: 'bg-rose-50',
    iconText: 'text-rose-700',
    ring: 'ring-rose-100',
  },
  emerald: {
    iconBg: 'bg-emerald-50',
    iconText: 'text-emerald-700',
    ring: 'ring-emerald-100',
  },
};

function StatTile({
  label,
  value,
  hint,
  delta,
  Icon,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  delta?: { label: string; positive: boolean };
  Icon: React.ComponentType<{ className?: string }>;
  accent: StatAccent;
}) {
  const cls = STAT_ACCENT[accent];
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04),_0_4px_12px_-2px_rgba(15,23,42,0.06)] sm:gap-2 sm:p-4">
      <div className="flex items-start justify-between gap-1">
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg sm:h-9 sm:w-9 sm:rounded-xl ${cls.iconBg} ${cls.iconText} ring-1 ${cls.ring}`}
        >
          <Icon className="h-4 w-4" />
        </span>
        {delta ? (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums ${
              delta.positive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}
          >
            <TrendingUp className={`h-2.5 w-2.5 ${delta.positive ? '' : 'rotate-180'}`} />
            {delta.label}
          </span>
        ) : null}
      </div>
      <div className="min-w-0">
        <p className="text-[12px] font-medium text-slate-600 sm:text-[13px]">{label}</p>
        <p className="mt-1 font-display text-xl font-bold tabular-nums leading-none text-slate-900 sm:text-2xl">
          {value}
        </p>
        {hint ? (
          <p className="mt-1 text-[11.5px] text-slate-500 sm:text-[12px]">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}

function TurnaroundBadge({
  status,
  t,
}: {
  status: 'pending' | 'in-progress' | 'done';
  t: AirbnbCopy;
}) {
  const map = {
    pending: { label: t.statusPending, cls: 'bg-slate-100 text-slate-700' },
    'in-progress': { label: t.statusInProgress, cls: 'bg-orange-100 text-orange-800' },
    done: { label: t.statusDone, cls: 'bg-emerald-100 text-emerald-800' },
  } as const;
  const { label, cls } = map[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider ${cls}`}
    >
      {label}
    </span>
  );
}

function TimelineCell({
  label,
  time,
  tone,
}: {
  label: string;
  time: string;
  tone: 'slate' | 'orange' | 'emerald';
}) {
  const toneCls = {
    slate: 'text-slate-500',
    orange: 'text-orange-700',
    emerald: 'text-emerald-700',
  }[tone];
  return (
    <div className="px-3 py-2.5">
      <p
        className={`text-[10px] font-bold uppercase tracking-wider ${toneCls}`}
      >
        {label}
      </p>
      <p className="mt-0.5 font-display text-[15px] font-semibold tabular-nums text-slate-900">
        {time}
      </p>
    </div>
  );
}

function QuickAction({
  label,
  hint,
  Icon,
  onClick,
}: {
  label: string;
  hint: string;
  Icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-700">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold text-slate-900">{label}</p>
        <p className="mt-0.5 truncate text-[11.5px] text-slate-600">{hint}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-slate-500" />
    </button>
  );
}
