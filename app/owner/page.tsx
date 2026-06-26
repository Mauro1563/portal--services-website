import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  CreditCard,
  ListChecks,
  MessageSquare,
  Plus,
  Users,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getOwnerProfile, displayNameFrom } from '@/lib/owner-profile';
import { signout } from '@/app/login/actions';
import { TasksAutoRefresh } from '@/components/owner/TasksAutoRefresh';
import { CorporateHeader } from '@/components/owner/CorporateHeader';
import { StatCardsRow } from '@/components/owner/StatCardsRow';
import { RevenueChart, type RevenuePoint } from '@/components/owner/RevenueChart';
import { CleanersField, type FieldCheckin } from '@/components/owner/CleanersField';
import { BottomTabBar } from '@/components/owner/BottomTabBar';

type PaidTask = {
  scheduled_for: string;
  paid_amount_pence: number | null;
  price_pence: number | null;
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

  // Profile fetch is cheap (single row) and the chrome needs it for the
  // greeting + business name. Everything else is in the streamed block.
  const profile = await getOwnerProfile(user.id);
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

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <div className="mx-auto max-w-md px-3 py-4 sm:max-w-2xl sm:px-4 sm:py-5 lg:max-w-5xl lg:px-8 lg:py-7">
        <CorporateHeader
          firstName={firstName}
          businessName={businessName}
          subtitle={businessName}
        />

        <TasksAutoRefresh ownerId={user.id} />

        {/* Heavy data section streams in — chrome above renders in <100ms
            so the user always sees something instantly. */}
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardSections userId={user.id} />
        </Suspense>

        {/* Secondary nav — static, no DB. Renders immediately. */}
        <section className="mt-3 grid grid-cols-4 gap-2 sm:mt-4 sm:gap-3">
          <SecondaryTile href="/owner/properties" label="Sitios" Icon={Building2} />
          <SecondaryTile href="/owner/calendar" label="Calendario" Icon={CalendarDays} />
          <SecondaryTile href="/owner/analytics" label="Analítica" Icon={BarChart3} />
          <SecondaryTile href="/owner/billing" label="Facturación" Icon={CreditCard} />
        </section>

        <form action={signout} className="mt-8 flex justify-center">
          <button
            type="submit"
            className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-700"
          >
            Cerrar sesión
          </button>
        </form>
      </div>

      <BottomTabBar active="home" />
    </main>
  );
}

/**
 * Heavy server component — 12 parallel Supabase queries. Lives inside a
 * <Suspense> on the home so the page chrome never waits for the slowest
 * one. The fallback below shows skeleton blocks that match the layout
 * so the page doesn't jump when the real data arrives.
 */
async function DashboardSections({ userId }: { userId: string }) {
  const supabase = await createClient();

  const now = new Date();
  const today = toIsoDay(now);
  const monthStart = `${today.slice(0, 7)}-01`;

  const sevenDaysAgo = toIsoDay(new Date(now.getTime() - 7 * 86_400_000));
  const fourteenDaysAgo = toIsoDay(new Date(now.getTime() - 14 * 86_400_000));
  const eightHoursAgo = new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString();
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthStart = toIsoDay(prevMonthDate);
  const prevMonthEnd = toIsoDay(
    new Date(now.getFullYear(), now.getMonth(), 0),
  );

  const [
    propsRes,
    cleanersRes,
    clientsRes,
    requestedCountRes,
    todayCountRes,
    weekBookingsRes,
    lastWeekBookingsRes,
    monthPaidRes,
    prevMonthPaidRes,
    weekPaidRes,
    fieldRes,
  ] = await Promise.all([
    supabase.from('properties').select('id', { count: 'exact', head: true }),
    supabase.from('cleaners').select('id', { count: 'exact', head: true }),
    supabase.from('clients').select('id', { count: 'exact', head: true }),
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
    supabase
      .from('tasks')
      .select('paid_amount_pence, price_pence, scheduled_for')
      .gte('scheduled_for', monthStart)
      .in('payment_status', ['paid', 'partial']),
    supabase
      .from('tasks')
      .select('paid_amount_pence, price_pence')
      .gte('scheduled_for', prevMonthStart)
      .lte('scheduled_for', prevMonthEnd)
      .in('payment_status', ['paid', 'partial']),
    supabase
      .from('tasks')
      .select('paid_amount_pence, price_pence, scheduled_for')
      .gte('scheduled_for', sevenDaysAgo)
      .in('payment_status', ['paid', 'partial']),
    supabase
      .from('tasks')
      .select(
        'id, checkin_lat, checkin_lng, checked_in_at, cleaner:cleaners (name), property:properties (name), client:clients (name)',
      )
      .not('checked_in_at', 'is', null)
      .gte('checked_in_at', eightHoursAgo)
      .order('checked_in_at', { ascending: false })
      .limit(6),
  ]);
  void userId; // RLS already scopes everything to the current user

  const propertiesCount = propsRes.count ?? 0;
  const cleanersCount = cleanersRes.count ?? 0;
  const clientsCount = clientsRes.count ?? 0;
  const requestedCount = requestedCountRes.count ?? 0;
  const todayCount = todayCountRes.count ?? 0;
  const weekBookings = weekBookingsRes.count ?? 0;
  const lastWeekBookings = lastWeekBookingsRes.count ?? 0;
  const monthPaid = (monthPaidRes.data ?? []) as PaidTask[];
  const prevMonthPaid = (prevMonthPaidRes.data ?? []) as PaidTask[];
  const weekPaid = (weekPaidRes.data ?? []) as PaidTask[];
  const fieldRows = (fieldRes.data ?? []) as unknown as FieldRow[];

  if (propertiesCount === 0 && cleanersCount === 0) {
    redirect('/owner/onboarding');
  }

  const sumPaid = (rows: PaidTask[]) =>
    rows.reduce((sum, t) => sum + (t.paid_amount_pence ?? t.price_pence ?? 0), 0);
  const monthRevenuePence = sumPaid(monthPaid);
  const prevMonthRevenuePence = sumPaid(prevMonthPaid);

  const chartData: RevenuePoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86_400_000);
    const iso = toIsoDay(d);
    const dayRows = weekPaid.filter((t) => t.scheduled_for === iso);
    chartData.push({
      label: DAY_SHORT[d.getDay()],
      pence: sumPaid(dayRows),
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

  return (
    <>
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

      <StatCardsRow
        cleanersActive={cleanersCount}
        bookingsWeek={weekBookings}
        revenueMonthPence={monthRevenuePence}
        bookingsDelta={deltaPct(weekBookings, lastWeekBookings)}
        revenueDelta={deltaPct(monthRevenuePence, prevMonthRevenuePence)}
      />

      <div className="mt-3 grid grid-cols-1 gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RevenueChart data={chartData} />
        </div>
        <div className="lg:col-span-2">
          <CleanersField checkins={fieldCheckins} />
        </div>
      </div>

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
    </>
  );
}

/**
 * Skeleton that mirrors the real layout of DashboardSections so the page
 * doesn't shift when the data arrives. Pulses softly so the user knows
 * something is loading without it feeling broken.
 */
function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-[88px] rounded-2xl bg-white ring-1 ring-inset ring-slate-100"
          />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-5">
        <div className="h-44 rounded-2xl bg-white ring-1 ring-inset ring-slate-100 lg:col-span-3" />
        <div className="h-44 rounded-2xl bg-white ring-1 ring-inset ring-slate-100 lg:col-span-2" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[60px] rounded-2xl bg-white ring-1 ring-inset ring-slate-100"
          />
        ))}
      </div>
    </div>
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
