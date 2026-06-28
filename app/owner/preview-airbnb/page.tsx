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

// --- Local UI helpers (kept inline so the page is self-contained) ----------

/**
 * Custom DEMO top-bar — same shape as components/preview/DemoTopBar but
 * with the orange/coral accent and a custom centre label so the preview
 * is clearly the Airbnb flavour. The component there hard-codes the
 * tone & label per portal, so we render our own variant here rather than
 * extend the shared API for a one-off.
 */
function AirbnbDemoTopBar() {
  return (
    <div className="sticky top-0 z-50 border-b border-orange-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-md items-center justify-between gap-2 px-3 sm:max-w-2xl">
        <Link
          href="/"
          className="-ml-1 inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-slate-900 transition hover:bg-orange-50"
          aria-label="Portal Home"
        >
          <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-orange-400 to-rose-500 text-[10px] font-bold text-white">
            P
          </span>
          <span className="font-display text-[12px] font-semibold leading-none">
            Portal Home
          </span>
        </Link>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-orange-300">
          <Sparkles className="h-2.5 w-2.5" />
          Demo · Owner (Airbnb)
        </span>
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-700 transition hover:border-orange-300 hover:bg-orange-50/40"
        >
          <ArrowLeft className="h-3 w-3" />
          <span className="hidden sm:inline">Volver al sitio</span>
          <span className="sm:hidden">Volver</span>
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
function AirbnbBottomTabBar({ active }: { active: TabKey }) {
  const items: Array<{
    key: TabKey;
    href: string;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
  }> = [
    { key: 'home', href: '/owner/preview-airbnb', label: 'Inicio', Icon: LayoutGrid },
    { key: 'tasks', href: '/owner/preview-airbnb/tasks', label: 'Turnovers', Icon: ListChecks },
    { key: 'cleaners', href: '/owner/preview-airbnb/cleaners', label: 'Equipo', Icon: Users },
    { key: 'chat', href: '/owner/preview-airbnb/chat-hub', label: 'Chat', Icon: MessageCircle },
    { key: 'listings', href: '/owner/preview-airbnb/listings', label: 'Listings', Icon: Building2 },
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

/** "x min ago" helper for the iCal sync banner. Static for the demo. */
function relativeSync() {
  return 'hace 2 min';
}

// --- Page ------------------------------------------------------------------

export default function OwnerPreviewAirbnbHome() {
  const [syncedLabel, setSyncedLabel] = useState(relativeSync());
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
      setSyncedLabel('hace unos segundos');
      flash('Calendario Airbnb sincronizado · 6 listings al día');
    }, 900);
  }

  return (
    <>
      <AirbnbDemoTopBar />
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
              Panel del propietario
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Hola, Alan
            </h1>
            <p className="mt-1 text-[13px] text-slate-600">
              Alan Cleaners · 4 turnovers programados hoy
            </p>
          </header>

          {/* iCal sync banner — the defining visual of the Airbnb flavour:
              prospects need to immediately understand that bookings come
              from Airbnb via iCal, not from manual scheduling. */}
          <section
            aria-label="Estado de sincronización con Airbnb"
            className="mb-5 overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-rose-50 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),_0_8px_24px_-8px_rgba(249,115,22,0.25)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-sm">
                  <Calendar className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-slate-900">
                    Calendario Airbnb sincronizado
                  </p>
                  <p className="mt-0.5 inline-flex items-center gap-1.5 text-[12px] text-slate-600">
                    <Wifi className="h-3 w-3 text-emerald-600" />
                    Última actualización {syncedLabel} · 6 feeds iCal activos
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
                {syncing ? 'Sincronizando…' : 'Sincronizar iCal'}
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
              label="Listings activos"
              value={String(AIRBNB_STATS.activeListings)}
              hint="sincronizados con Airbnb"
              Icon={Building2}
              accent="orange"
            />
            <StatTile
              label="Turnovers esta semana"
              value={String(AIRBNB_STATS.turnoversThisWeek)}
              hint="vs. semana pasada"
              delta={{ label: '+27%', positive: true }}
              Icon={CalendarDays}
              accent="amber"
            />
            <StatTile
              label="Tiempo medio turnaround"
              value={AIRBNB_STATS.avgTurnaroundLabel}
              hint="checkout → check-in"
              Icon={Flame}
              accent="rose"
            />
            <StatTile
              label="Revenue mes"
              value={formatPence(AIRBNB_STATS.monthlyRevenuePence)}
              hint="vs. mes pasado"
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
                Turnovers de hoy
              </h2>
              <Link
                href="/owner/preview-airbnb/tasks"
                className="text-[12px] font-semibold text-orange-700 hover:underline"
              >
                Ver todos
              </Link>
            </div>
            <ul className="space-y-3">
              {TURNAROUND_TASKS.map((t) => (
                <li
                  key={t.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-slate-900">
                        {t.listingName}
                      </p>
                      <p className="mt-0.5 truncate text-[11.5px] text-slate-600">
                        {t.cleanerName} · ventana {Math.round(t.windowMinutes / 60)}h
                      </p>
                    </div>
                    <TurnaroundBadge status={t.status} />
                  </div>
                  {/* Three-stop timeline: checkout → cleaner → check-in. */}
                  <div className="grid grid-cols-3 divide-x divide-slate-100">
                    <TimelineCell
                      label="Checkout"
                      time={t.checkoutAt}
                      tone="slate"
                    />
                    <TimelineCell
                      label="Cleaner"
                      time={t.cleanerArrivesAt}
                      tone="orange"
                    />
                    <TimelineCell
                      label="Check-in"
                      time={t.nextCheckInAt}
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
                Restock alerts
              </h2>
              <span className="ml-auto rounded-full bg-amber-200/60 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-amber-900">
                {RESTOCK_ALERTS.length} pendientes
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
                    onClick={() => flash(`Marcado para reponer: ${alert.listingName}`)}
                    className="rounded-full border border-amber-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-amber-800 hover:bg-amber-50"
                  >
                    Resolver
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
              Acciones rápidas
            </h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <QuickAction
                label="Sincronizar iCal"
                hint="Refrescar 6 feeds Airbnb"
                Icon={RefreshCw}
                onClick={handleSync}
              />
              <QuickAction
                label="Notificar host"
                hint="Mensaje rápido al propietario"
                Icon={Send}
                onClick={() => flash('Borrador de mensaje al host abierto')}
              />
              <QuickAction
                label="Reportar daño al host"
                hint="Adjunta fotos del cleaner"
                Icon={ShieldAlert}
                onClick={() => flash('Formulario de incidencia abierto')}
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
                Tus listings
              </h2>
              <Link
                href="/owner/preview-airbnb/listings"
                className="text-[12px] font-semibold text-orange-700 hover:underline"
              >
                Gestionar
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
                        Sincronizado con Airbnb
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-[11.5px] text-slate-600">
                      {l.neighbourhood} · #{l.airbnbId}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-[12px] text-slate-700">
                      <span className="font-semibold">{formatPence(l.pricePence)}/noche</span>
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
                  Gestionar equipo de cleaners
                </p>
                <p className="mt-0.5 text-[12px] text-slate-600">
                  Asigna turnovers, ajusta disponibilidad y revisa rendimiento.
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
                  Ver analítica completa
                </p>
                <p className="mt-0.5 text-[12px] text-slate-600">
                  Ocupación, rating medio y tendencias por listing.
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

        <AirbnbBottomTabBar active="home" />
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

function TurnaroundBadge({ status }: { status: 'pending' | 'in-progress' | 'done' }) {
  const map = {
    pending: { label: 'Pendiente', cls: 'bg-slate-100 text-slate-700' },
    'in-progress': { label: 'En curso', cls: 'bg-orange-100 text-orange-800' },
    done: { label: 'Hecho', cls: 'bg-emerald-100 text-emerald-800' },
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
