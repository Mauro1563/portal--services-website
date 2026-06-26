import { redirect } from 'next/navigation';
import {
  BarChart3,
  Briefcase,
  Building2,
  CalendarDays,
  CreditCard,
  ListChecks,
  MessageSquare,
  Moon,
  Settings,
  Sun,
  Users,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getOwnerProfile, displayNameFrom } from '@/lib/owner-profile';
import { getT } from '@/lib/i18n';
import { signout } from '@/app/login/actions';
import { TasksAutoRefresh } from '@/components/owner/TasksAutoRefresh';
import {
  CorporateBanner,
  PortalHero,
  PortalShell,
  StatRow,
  ToolCard,
  ToolGrid,
} from '@/components/portal/PortalDashboardShell';

type RatingRow = { stars: number };
type PaidRow = { paid_amount_pence: number | null; price_pence: number | null };

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
    todayCountRes,
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
    supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .eq('scheduled_for', today),
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
  const todayCount = todayCountRes.count ?? 0;
  const ratings = (ratingsRes.data ?? []) as RatingRow[];
  const paid = (monthPaidRes.data ?? []) as PaidRow[];

  if (propertiesCount === 0 && cleanersCount === 0) {
    redirect('/owner/onboarding');
  }
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
  // Friendly first-name greeting. If we have a real name (from user
  // metadata or owner_profiles.business_name), use it. Otherwise pull a
  // capitalized first-word from the email local-part — "mauro541423"
  // → "Mauro" feels personal without looking like the raw login.
  const firstName = fullName
    ? fullName.split(/\s+/)[0]
    : prettyFromEmail(user.email) ?? tx('welcomeFallback');

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
        ]}
      />

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
