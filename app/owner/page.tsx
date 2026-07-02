import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import {
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  CreditCard,
  ListChecks,
  MessageSquare,
  Plus,
  Settings,
  Users,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getOwnerProfile, displayNameFrom } from '@/lib/owner-profile';
import { fetchOwnerNotifications } from '@/app/owner/notifications/actions';
import { signout } from '@/app/login/actions';
import { TasksAutoRefresh } from '@/components/owner/TasksAutoRefresh';
import { CorporateHeader } from '@/components/owner/CorporateHeader';
import { StatCardsRow } from '@/components/owner/StatCardsRow';
import { RevenueChart, type RevenuePoint } from '@/components/owner/RevenueChart';
import { CleanersField, type FieldCheckin } from '@/components/owner/CleanersField';
import { BottomTabBar } from '@/components/owner/BottomTabBar';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { getT } from '@/lib/i18n';

/**
 * Subset of `tasks` rows joined with their property + cleaner needed to
 * compute the rate-based revenue/profit formula from migration 0035:
 *
 *   revenue  = actual_hours * COALESCE(task.charge_rate, property.default_charge_rate, owner.default_charge_rate)
 *   cleaner_pay = actual_hours * COALESCE(task.cleaner_pay_rate, cleaner.default_hourly_pay) + task.tip_pence
 *   profit   = revenue - (actual_hours * COALESCE(task.cleaner_pay_rate, cleaner.default_hourly_pay))
 *              -- tips flow 100% to the cleaner, never to the owner.
 */
type RateTask = {
  scheduled_for: string;
  actual_hours: number | null;
  charge_rate_pence: number | null;
  cleaner_pay_rate_pence: number | null;
  tip_pence: number | null;
  property: { default_charge_rate_pence: number | null } | null;
  cleaner: { default_hourly_pay_pence: number | null } | null;
};

type FieldRow = {
  id: string;
  checkin_lat: number | null;
  checkin_lng: number | null;
  checked_in_at: string | null;
  cleaner: { name: string | null } | null;
  property: { name: string | null } | null;
  client: { name: string | null } | null;
};

const DAY_SHORT = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

/**
 * "mauro541423@gmail.com" → "Mauro". Strips digits, punctuation, and
 * the domain, capitalizes the first letter. Returns null if the email
 * doesn't yield anything alphabetic (e.g. "12345@foo.com").
 */
function prettyFromEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  const local = email.split('@')[0]?.replace(/[^a-zA-Z]/g, '');
  if (!local) return null;
  return local.charAt(0).toUpperCase() + local.slice(1).toLowerCase();
}

function toIsoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function deltaPct(curr: number, prev: number): { label: string; positive: boolean } | undefined {
  if (prev === 0 && curr === 0) return undefined;
  if (prev === 0) return { label: 'nuevo', positive: true };
  const pct = Math.round(((curr - prev) / prev) * 100);
  if (pct === 0) return { label: '0%', positive: true };
  return {
    label: `${pct > 0 ? '+' : ''}${pct}%`,
    positive: pct >= 0,
  };
}

export default async function OwnerHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');
  const t = await getT();

  const now = new Date();
  const today = toIsoDay(now);
  const monthStart = `${today.slice(0, 7)}-01`;

  // Previous-period boundaries for delta arrows.
  const sevenDaysAgo = toIsoDay(new Date(now.getTime() - 7 * 86_400_000));
  const fourteenDaysAgo = toIsoDay(new Date(now.getTime() - 14 * 86_400_000));
  const eightHoursAgo = new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString();
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthStart = toIsoDay(prevMonthDate);
  const prevMonthEnd = toIsoDay(
    new Date(now.getFullYear(), now.getMonth(), 0),
  );

  // Owner profile is folded into the same Promise.all — it used to run
  // sequentially after these 12 queries, adding a wasted serial round-trip
  // (sometimes two, since getOwnerProfile previously tried user+admin).
  const [
    propsRes,
    cleanersRes,
    clientsRes,
    pendingRes,
    requestedCountRes,
    todayCountRes,
    weekBookingsRes,
    lastWeekBookingsRes,
    monthPaidRes,
    prevMonthPaidRes,
    weekPaidRes,
    fieldRes,
    profile,
    notifications,
  ] = await Promise.all([
    supabase.from('properties').select('id', { count: 'exact', head: true }),
    supabase.from('cleaners').select('id', { count: 'exact', head: true }),
    supabase.from('clients').select('id', { count: 'exact', head: true }),
    supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .gte('scheduled_for', today)
      .neq('status', 'completed')
      .neq('status', 'cancelled'),
    supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'requested'),
    supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .eq('scheduled_for', today),
    supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo),
    supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', fourteenDaysAgo)
      .lt('created_at', sevenDaysAgo),
    // Rate-based revenue/profit for the current month. We now derive both
    // metrics from cleaner-reported actual_hours × the resolved hourly
    // rate (per migration 0035), so the payment_status flag is no longer
    // the gate — what matters is that the work actually happened, which
    // is signalled by actual_hours being non-null.
    supabase
      .from('tasks')
      .select(
        'scheduled_for, actual_hours, charge_rate_pence, cleaner_pay_rate_pence, tip_pence, property:properties (default_charge_rate_pence), cleaner:cleaners (default_hourly_pay_pence)',
      )
      .gte('scheduled_for', monthStart)
      .not('actual_hours', 'is', null),
    supabase
      .from('tasks')
      .select(
        'scheduled_for, actual_hours, charge_rate_pence, cleaner_pay_rate_pence, tip_pence, property:properties (default_charge_rate_pence), cleaner:cleaners (default_hourly_pay_pence)',
      )
      .gte('scheduled_for', prevMonthStart)
      .lte('scheduled_for', prevMonthEnd)
      .not('actual_hours', 'is', null),
    // Daily revenue for the chart — last 7 days. Same rate-based shape.
    supabase
      .from('tasks')
      .select(
        'scheduled_for, actual_hours, charge_rate_pence, cleaner_pay_rate_pence, tip_pence, property:properties (default_charge_rate_pence), cleaner:cleaners (default_hourly_pay_pence)',
      )
      .gte('scheduled_for', sevenDaysAgo)
      .not('actual_hours', 'is', null),
    // Recent check-ins for the "cleaners en campo" widget.
    supabase
      .from('tasks')
      .select(
        'id, checkin_lat, checkin_lng, checked_in_at, cleaner:cleaners (name), property:properties (name), client:clients (name)',
      )
      .not('checked_in_at', 'is', null)
      .gte('checked_in_at', eightHoursAgo)
      .order('checked_in_at', { ascending: false })
      .limit(6),
    getOwnerProfile(user.id),
    // Pre-fetch notifications so <NotificationsBell> hydrates with real
    // data instead of firing its own 4-query server action on mount.
    fetchOwnerNotifications().catch(() => ({ items: [], unreadCount: 0 })),
  ]);

  const propertiesCount = propsRes.count ?? 0;
  const cleanersCount = cleanersRes.count ?? 0;
  const clientsCount = clientsRes.count ?? 0;
  const pendingCount = pendingRes.count ?? 0;
  const requestedCount = requestedCountRes.count ?? 0;
  const todayCount = todayCountRes.count ?? 0;
  const weekBookings = weekBookingsRes.count ?? 0;
  const lastWeekBookings = lastWeekBookingsRes.count ?? 0;
  const monthPaid = (monthPaidRes.data ?? []) as unknown as RateTask[];
  const prevMonthPaid = (prevMonthPaidRes.data ?? []) as unknown as RateTask[];
  const weekPaid = (weekPaidRes.data ?? []) as unknown as RateTask[];
  const fieldRows = (fieldRes.data ?? []) as unknown as FieldRow[];

  if (propertiesCount === 0 && cleanersCount === 0) {
    redirect('/owner/onboarding');
  }

  const ownerDefaultChargePence = profile?.default_charge_rate_pence ?? 0;

  /**
   * Resolves the per-task charge rate per the migration-0035 cascade:
   *   task.charge_rate → property.default_charge_rate → owner default → 0
   */
  function resolveChargeRate(t: RateTask): number {
    if (t.charge_rate_pence != null && t.charge_rate_pence > 0) {
      return t.charge_rate_pence;
    }
    const prop = t.property?.default_charge_rate_pence ?? 0;
    if (prop > 0) return prop;
    return ownerDefaultChargePence;
  }

  function resolvePayRate(t: RateTask): number {
    if (t.cleaner_pay_rate_pence != null && t.cleaner_pay_rate_pence > 0) {
      return t.cleaner_pay_rate_pence;
    }
    return t.cleaner?.default_hourly_pay_pence ?? 0;
  }

  /** Per-row revenue (what the client owes us) in pence. */
  function revenueOf(t: RateTask): number {
    const hours = typeof t.actual_hours === 'number' ? t.actual_hours : 0;
    if (hours <= 0) return 0;
    return Math.round(hours * resolveChargeRate(t));
  }

  /** Per-row cleaner pay (hours × pay rate, excludes tip). Tips are
   *  cleaner-only and don't affect owner profit. */
  function payOf(t: RateTask): number {
    const hours = typeof t.actual_hours === 'number' ? t.actual_hours : 0;
    if (hours <= 0) return 0;
    return Math.round(hours * resolvePayRate(t));
  }

  const sumRevenue = (rows: RateTask[]) =>
    rows.reduce((sum, t) => sum + revenueOf(t), 0);
  const sumPay = (rows: RateTask[]) => rows.reduce((sum, t) => sum + payOf(t), 0);

  const monthRevenuePence = sumRevenue(monthPaid);
  const monthPayPence = sumPay(monthPaid);
  const monthProfitPence = monthRevenuePence - monthPayPence;

  const prevMonthRevenuePence = sumRevenue(prevMonthPaid);
  const prevMonthPayPence = sumPay(prevMonthPaid);
  const prevMonthProfitPence = prevMonthRevenuePence - prevMonthPayPence;

  // Daily revenue points for the 7-day chart (oldest → newest).
  const chartData: RevenuePoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86_400_000);
    const iso = toIsoDay(d);
    const dayRows = weekPaid.filter((t) => t.scheduled_for === iso);
    chartData.push({
      label: DAY_SHORT[d.getDay()],
      pence: sumRevenue(dayRows),
    });
  }

  const fieldCheckins: FieldCheckin[] = fieldRows.map((r) => ({
    taskId: r.id,
    cleanerName: r.cleaner?.name ?? null,
    propertyName: r.property?.name ?? null,
    clientName: r.client?.name ?? null,
    lat: r.checkin_lat,
    lng: r.checkin_lng,
    checkedInAt: r.checked_in_at,
  }));

  const metadataName = (user.user_metadata?.name as string | undefined)?.trim();
  const fullName =
    metadataName || displayNameFrom(profile, user.email ?? null);
  const firstName = fullName
    ? fullName.split(/\s+/)[0]
    : prettyFromEmail(user.email) ?? 'Owner';
  const businessName =
    profile?.business_name ||
    (user.user_metadata?.business as string | undefined) ||
    'Tu negocio';

  const subtitle =
    todayCount > 0
      ? `${todayCount} ${todayCount === 1 ? 'limpieza' : 'limpiezas'} hoy · ${pendingCount} ${pendingCount === 1 ? 'pendiente' : 'pendientes'}`
      : pendingCount > 0
      ? `${pendingCount} ${pendingCount === 1 ? 'limpieza pendiente' : 'limpiezas pendientes'}`
      : businessName;

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <div className="mx-auto max-w-md px-3 py-4 sm:max-w-2xl sm:px-4 sm:py-5 lg:max-w-5xl lg:px-8 lg:py-7">
        <CorporateHeader
          firstName={firstName}
          businessName={businessName}
          subtitle={subtitle}
          initialNotifications={notifications}
        />

        <TasksAutoRefresh ownerId={user.id} />

        {requestedCount > 0 ? (
          <Link
            href="/owner/tasks?status=requested"
            className="group mb-4 flex items-center gap-3 rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-violet-300"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-600 text-white">
              <Bell className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-700">
                Solicitudes nuevas
              </p>
              <p className="mt-0.5 text-[13px] font-semibold text-slate-900">
                {requestedCount}{' '}
                {requestedCount === 1
                  ? 'cliente esperando confirmación'
                  : 'clientes esperando confirmación'}
              </p>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-violet-700 transition group-hover:translate-x-0.5">
              Ver →
            </span>
          </Link>
        ) : null}

        {/* 3 big stat cards — Corporate Trust hero metrics */}
        <StatCardsRow
          cleanersActive={cleanersCount}
          bookingsWeek={weekBookings}
          revenueMonthPence={monthRevenuePence}
          bookingsDelta={deltaPct(weekBookings, lastWeekBookings)}
          revenueDelta={deltaPct(monthRevenuePence, prevMonthRevenuePence)}
          profitMonthPence={monthProfitPence}
          profitDelta={deltaPct(monthProfitPence, prevMonthProfitPence)}
        />

        {/* Chart + field cleaners — two columns on desktop, stacked mobile.
            Suspense around each so the cheap hero/stats above paint
            immediately while these heavier widgets stream in (RevenueChart
            pulls recharts; CleanersField waits on the wide tasks join). */}
        <div className="mt-3 grid grid-cols-1 gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Suspense fallback={<ChartSkeleton />}>
              <RevenueChart data={chartData} />
            </Suspense>
          </div>
          <div className="lg:col-span-2">
            <Suspense fallback={<FieldSkeleton />}>
              <CleanersField checkins={fieldCheckins} />
            </Suspense>
          </div>
        </div>

        {/* Quick links to operations */}
        <section className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3 sm:grid-cols-4">
          <QuickTile
            href="/owner/tasks/new"
            label="Nueva limpieza"
            sub="Programar"
            Icon={Plus}
            primary
          />
          <QuickTile
            href="/owner/tasks"
            label="Limpiezas"
            sub={`${todayCount} hoy`}
            Icon={ListChecks}
          />
          <QuickTile
            href="/owner/cleaners"
            label="Cleaners"
            sub={`${cleanersCount} activos`}
            Icon={Users}
          />
          <QuickTile
            href="/owner/clients"
            label="Clientes"
            sub={`${clientsCount} totales`}
            Icon={MessageSquare}
          />
        </section>

        {/* Secondary nav — keeps things reachable on mobile */}
        <section className="mt-3 grid grid-cols-4 gap-2 sm:mt-4 sm:gap-3">
          <SecondaryTile href="/owner/properties" label="Sitios" Icon={Building2} />
          <SecondaryTile href="/owner/calendar" label="Calendario" Icon={CalendarDays} />
          <SecondaryTile href="/owner/analytics" label="Analítica" Icon={BarChart3} />
          <SecondaryTile href="/owner/billing" label="Facturación" Icon={CreditCard} />
        </section>

        {/* Sign-out at the bottom — discreet */}
        <form action={signout} className="mt-8 flex justify-center">
          <SubmitButton
            pendingLabel={t('common.signingOut')}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-700 disabled:opacity-60"
          >
            {t('common.signOut')}
          </SubmitButton>
        </form>
      </div>

      <BottomTabBar active="home" />
    </main>
  );
}

function QuickTile({
  href,
  label,
  sub,
  Icon,
  primary,
}: {
  href: string;
  label: string;
  sub: string;
  Icon: React.ComponentType<{ className?: string }>;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-2 rounded-2xl p-2.5 transition sm:gap-2.5 sm:p-3 ${
        primary
          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-[0_10px_24px_-10px_rgba(37,99,235,0.55)] hover:brightness-110'
          : 'border border-slate-200 bg-white text-slate-900 hover:border-blue-300 hover:bg-blue-50/30'
      }`}
    >
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg sm:h-9 sm:w-9 sm:rounded-xl ${
          primary ? 'bg-white/15 text-white' : 'bg-blue-50 text-blue-700'
        }`}
      >
        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[12px] font-semibold sm:text-[13px]">{label}</span>
        <span
          className={`block truncate text-[9.5px] sm:text-[10.5px] ${
            primary ? 'text-white/75' : 'text-slate-500'
          }`}
        >
          {sub}
        </span>
      </span>
    </Link>
  );
}

function ChartSkeleton() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="h-3 w-32 animate-pulse rounded bg-slate-200/70" />
          <div className="h-4 w-40 animate-pulse rounded bg-slate-200/70" />
        </div>
        <div className="h-5 w-16 animate-pulse rounded bg-slate-200/70" />
      </div>
      <div className="h-40 w-full animate-pulse rounded-xl bg-slate-100" />
    </section>
  );
}

function FieldSkeleton() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5">
      <div className="space-y-2">
        <div className="h-3 w-32 animate-pulse rounded bg-slate-200/70" />
        <div className="h-4 w-40 animate-pulse rounded bg-slate-200/70" />
      </div>
      <ul className="mt-4 space-y-2">
        {[0, 1, 2].map((i) => (
          <li
            key={i}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2.5"
          >
            <span className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-slate-200/70" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200/70" />
              <div className="h-2.5 w-1/2 animate-pulse rounded bg-slate-200/70" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SecondaryTile({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-3 text-center transition hover:border-blue-300 hover:bg-blue-50/30"
    >
      <Icon className="h-4 w-4 text-slate-500 group-hover:text-blue-600" />
      <span className="text-[11px] font-semibold text-slate-700">{label}</span>
    </Link>
  );
}
