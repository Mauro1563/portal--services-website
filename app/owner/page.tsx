import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  BarChart3,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  CreditCard,
  ListChecks,
  MapPin,
  MessageSquare,
  Moon,
  Plus,
  Settings,
  Sun,
  Users,
  UserPlus,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getOwnerProfile, displayNameFrom } from '@/lib/owner-profile';
import { getT } from '@/lib/i18n';
import { signout } from '@/app/login/actions';
import { OnboardingChecklist } from '@/components/owner/OnboardingChecklist';
import { TasksAutoRefresh } from '@/components/owner/TasksAutoRefresh';
import {
  CorporateBanner,
  PortalHero,
  PortalShell,
  StatRow,
  ToolCard,
  ToolGrid,
} from '@/components/portal/PortalDashboardShell';

type TaskListItem = {
  id: string;
  scheduled_for: string;
  start_time: string | null;
  status: string;
  property: { name: string } | null;
  cleaner: { name: string } | null;
  client: { name: string } | null;
};

type RatingRow = { stars: number };
type PaidRow = { paid_amount_pence: number | null; price_pence: number | null };

type T = (k: string) => string;

export default async function OwnerHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const t = await getT();
  const tx = (k: string) => t(`ownerHome.${k}`);

  const today = new Date().toISOString().split('T')[0];
  const monthStart = `${today.slice(0, 7)}-01`;

  const [
    propsRes,
    cleanersRes,
    clientsRes,
    pendingRes,
    tasksTotalRes,
    todayTasksRes,
    ratingsRes,
    monthPaidRes,
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
    supabase.from('tasks').select('id', { count: 'exact', head: true }),
    supabase
      .from('tasks')
      .select(
        'id, scheduled_for, start_time, status, property:properties(name), cleaner:cleaners(name), client:clients(name)',
      )
      .eq('scheduled_for', today)
      .order('start_time', { ascending: true, nullsFirst: false })
      .limit(5),
    supabase
      .from('task_ratings')
      .select('stars')
      .gte('created_at', monthStart),
    supabase
      .from('tasks')
      .select('paid_amount_pence, price_pence')
      .gte('scheduled_for', monthStart)
      .in('payment_status', ['paid', 'partial']),
  ]);

  const propertiesCount = propsRes.count ?? 0;
  const cleanersCount = cleanersRes.count ?? 0;
  const clientsCount = clientsRes.count ?? 0;
  const pendingCount = pendingRes.count ?? 0;
  const tasksTotal = tasksTotalRes.count ?? 0;
  const todayTasks = (todayTasksRes.data ?? []) as unknown as TaskListItem[];
  const ratings = (ratingsRes.data ?? []) as RatingRow[];
  const paid = (monthPaidRes.data ?? []) as PaidRow[];

  if (propertiesCount === 0 && cleanersCount === 0) {
    redirect('/owner/onboarding');
  }

  const todayCount = todayTasks.length;
  const monthRevenuePence = paid.reduce(
    (s, t) => s + (t.paid_amount_pence ?? t.price_pence ?? 0),
    0,
  );
  const avgRating =
    ratings.length === 0
      ? null
      : (ratings.reduce((s, r) => s + r.stars, 0) / ratings.length).toFixed(1);

  const profile = await getOwnerProfile(user.id);
  const metadataName = (user.user_metadata?.name as string | undefined)?.trim();
  const fullName =
    metadataName || displayNameFrom(profile, user.email ?? null);
  // Greet by first name when we know it; otherwise just "Bienvenido" — never
  // fall back to the email local-part, which is impersonal and exposes
  // credentials in a screenshot.
  const firstName = fullName ? fullName.split(/\s+/)[0] : tx('welcomeFallback');

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? tx('greetingMorning')
      : hour < 18
      ? tx('greetingAfternoon')
      : tx('greetingEvening');
  const isDay = hour < 18;

  const fmtPrice = (p: number) =>
    `£${(p / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;

  return (
    <PortalShell
      badge={{ label: tx('portalLabel'), icon: Briefcase }}
      settingsHref="/owner/settings"
      rightSlot={
        <form action={signout}>
          <button
            type="submit"
            className="text-[11px] font-semibold text-text-3 hover:text-text-1"
          >
            {tx('signOut')}
          </button>
        </form>
      }
    >
      <PortalHero
        portalLabel={tx('portalLabel')}
        portalIcon={Briefcase}
        topRightChip={{
          label: isDay ? tx('dayChip') : tx('nightChip'),
          icon: isDay ? Sun : Moon,
        }}
        greeting={greeting}
        displayName={firstName}
        brandColor={profile?.brand_color}
        chips={[
          {
            kind: 'text',
            label:
              profile?.business_name ||
              (user.user_metadata?.business as string | undefined) ||
              tx('yourBusiness'),
            icon: Building2,
          },
          { kind: 'status', status: 'online', label: tx('online') },
        ]}
      />

      <QuickActions tx={tx} />

      <StatRow
        items={[
          { label: tx('kpiToday'), value: todayCount, sub: tx('subCleanings') },
          {
            label: tx('kpiPending'),
            value: pendingCount,
            sub: tx('subToComplete'),
          },
          {
            label: tx('kpiRevenue'),
            value: monthRevenuePence > 0 ? fmtPrice(monthRevenuePence) : '£0',
            sub: tx('subThisMonth'),
          },
          {
            label: tx('kpiRating'),
            value: avgRating ?? '—',
            sub:
              ratings.length > 0
                ? `${ratings.length} ${tx('subRatingsThisMonth')}`
                : tx('subNoData'),
          },
        ]}
      />

      <TasksAutoRefresh ownerId={user.id} />

      <OnboardingChecklist
        propertiesCount={propertiesCount}
        cleanersCount={cleanersCount}
        clientsCount={clientsCount}
        tasksTotal={tasksTotal}
      />

      <TodayTasksPanel tasks={todayTasks} tx={tx} />

      <ToolGrid>
        <ToolCard
          href="/owner/tasks"
          icon={ListChecks}
          title={tx('toolCleanings')}
          subtitle={tx('subToday').replace('{n}', String(todayCount))}
          accent="brand"
        />
        <ToolCard
          href="/owner/properties"
          icon={Building2}
          title={tx('toolProperties')}
          subtitle={tx('subTotal').replace('{n}', String(propertiesCount))}
          accent="emerald"
        />
        <ToolCard
          href="/owner/cleaners"
          icon={Users}
          title={tx('toolCleaners')}
          subtitle={tx('subTeam').replace('{n}', String(cleanersCount))}
          accent="amber"
        />
        <ToolCard
          href="/owner/clients"
          icon={MessageSquare}
          title={tx('toolClients')}
          subtitle={tx('subActive').replace('{n}', String(clientsCount))}
          accent="navy"
        />
        <ToolCard
          href="/owner/calendar"
          icon={CalendarDays}
          title={tx('toolCalendar')}
          subtitle={tx('subScheduleView')}
          accent="brand"
        />
        <ToolCard
          href="/owner/analytics"
          icon={BarChart3}
          title={tx('toolAnalytics')}
          subtitle={tx('subOpsDashboard')}
          accent="emerald"
        />
        <ToolCard
          href="/owner/billing"
          icon={CreditCard}
          title={tx('toolBilling')}
          subtitle={tx('subPlanInvoices')}
          accent="rose"
        />
        <ToolCard
          href="/owner/settings"
          icon={Settings}
          title={tx('toolSettings')}
          subtitle={tx('subBusinessProfile')}
          accent="navy"
        />
      </ToolGrid>

      <CorporateBanner
        href="/owner/analytics"
        eyebrow={tx('bannerEyebrow')}
        title={tx('bannerTitle')}
        subtitle={tx('bannerSubtitle')}
      />
    </PortalShell>
  );
}

function QuickActions({ tx }: { tx: T }) {
  const actions = [
    { href: '/owner/tasks/new', label: tx('qaNewCleaning'), Icon: Plus, primary: true },
    { href: '/owner/clients/new', label: tx('qaNewClient'), Icon: UserPlus },
    { href: '/owner/properties/new', label: tx('qaNewProperty'), Icon: Building2 },
    { href: '/owner/cleaners/new', label: tx('qaNewCleaner'), Icon: Users },
  ];
  return (
    <section className="my-5">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
        {tx('quickActionsTitle')}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {actions.map((a) => {
          const Icon = a.Icon;
          return (
            <Link
              key={a.href}
              href={a.href}
              className={`group flex items-center gap-2 rounded-2xl px-3.5 py-3 text-sm font-semibold transition ${
                a.primary
                  ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-[0_10px_28px_-12px_rgba(37,99,235,0.6)] hover:brightness-110'
                  : 'border border-surface-2 bg-surface-0 text-text-1 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{a.label}</span>
              <ChevronRight
                className={`ml-auto h-4 w-4 shrink-0 transition group-hover:translate-x-0.5 ${
                  a.primary ? 'text-white/80' : 'text-text-3'
                }`}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function TodayTasksPanel({ tasks, tx }: { tasks: TaskListItem[]; tx: T }) {
  const statusChip: Record<
    string,
    { label: string; cls: string; Icon: typeof Circle }
  > = {
    pending: {
      label: tx('statusPending'),
      cls: 'bg-slate-100 text-slate-700',
      Icon: Circle,
    },
    in_progress: {
      label: tx('statusInProgress'),
      cls: 'bg-amber-100 text-amber-800',
      Icon: Clock,
    },
    completed: {
      label: tx('statusCompleted'),
      cls: 'bg-emerald-100 text-emerald-800',
      Icon: CheckCircle2,
    },
    cancelled: {
      label: tx('statusCancelled'),
      cls: 'bg-rose-100 text-rose-700',
      Icon: Circle,
    },
  };

  const countLabel =
    tasks.length === 0
      ? tx('todayEmpty')
      : tasks.length === 1
      ? tx('todayCountOne')
      : tx('todayCountMany').replace('{n}', String(tasks.length));

  return (
    <section className="mt-5 rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold text-text-1">
            {tx('todayPanelTitle')}
          </h2>
          <p className="text-[11px] text-text-3">{countLabel}</p>
        </div>
        <Link
          href="/owner/tasks"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
        >
          {tx('viewAll')} <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-xl border border-dashed border-surface-2 px-4 py-6 text-center">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 text-brand-600">
            <ListChecks className="h-5 w-5" />
          </span>
          <p className="text-sm text-text-2">{tx('todayEnjoy')}</p>
          <Link
            href="/owner/tasks/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-3 text-xs font-semibold text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.5)]"
          >
            <Plus className="h-3.5 w-3.5" /> {tx('createCleaning')}
          </Link>
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {tasks.map((task) => {
            const st = statusChip[task.status] ?? statusChip.pending;
            const Icon = st.Icon;
            return (
              <li key={task.id}>
                <Link
                  href={`/owner/tasks/${task.id}`}
                  className="group flex items-center gap-3 rounded-xl border border-surface-2 px-3 py-2.5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow"
                >
                  <div className="flex h-10 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50">
                    <span className="text-[10px] font-bold text-brand-700">
                      {task.start_time?.slice(0, 5) ?? '—'}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text-1">
                      {task.property?.name ?? '—'}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-text-3">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {task.cleaner?.name ?? tx('unassigned')}
                      {task.client?.name ? ` · ${task.client.name}` : ''}
                    </p>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${st.cls}`}
                  >
                    <Icon className="h-3 w-3" /> {st.label}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-text-3 transition group-hover:text-text-1" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
