import { redirect } from 'next/navigation';
import { requireMarketingAdmin } from '@/lib/marketing';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  HQDashboard,
  type FunnelCounts,
  type PendingLead,
  type CleanerSummary,
  type CheckinSummary,
  type PhotoSummary,
} from '@/components/hq/HQDashboard';

export const dynamic = 'force-dynamic';

export default async function HQDashboardPage() {
  const admin = await requireMarketingAdmin();
  if (!admin) redirect('/hq/login');

  const client = createAdminClient();
  const now = Date.now();
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();
  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  // Run all reads in parallel. Each is wrapped in catch so a missing table
  // doesn't blow up the dashboard before its migration lands.
  const safe = async <T,>(p: PromiseLike<T>, fallback: T): Promise<T> => {
    try {
      return await p;
    } catch (err) {
      console.error('[hq dashboard query failed]', err);
      return fallback;
    }
  };

  const [
    leadsAll,
    pendingLeadsRaw,
    leads30dRaw,
    leads7dCount,
    ownersCount,
    cleanersCount,
    propertiesCount,
    tasksTodayRaw,
    cleanersRecent,
    checkinsRecent,
    photosRecent,
  ] = await Promise.all([
    safe(
      client.from('marketing_leads').select('status'),
      { data: [] as { status: string }[], error: null } as any,
    ),
    safe(
      client
        .from('marketing_leads')
        .select('id, name, email, company, source, created_at')
        .eq('status', 'new')
        .order('created_at', { ascending: false })
        .limit(5),
      { data: [] as PendingLead[], error: null } as any,
    ),
    safe(
      client
        .from('marketing_leads')
        .select('id, status')
        .gte('created_at', thirtyDaysAgo),
      { data: [] as { id: string; status: string }[], error: null } as any,
    ),
    safe(
      client
        .from('marketing_leads')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo),
      { count: 0 } as any,
    ),
    safe(
      client.from('owner_profiles').select('owner_id', { count: 'exact', head: true }),
      { count: 0 } as any,
    ),
    safe(
      client.from('cleaners').select('id', { count: 'exact', head: true }),
      { count: 0 } as any,
    ),
    safe(
      client.from('properties').select('id', { count: 'exact', head: true }),
      { count: 0 } as any,
    ),
    safe(
      client
        .from('tasks')
        .select('id, status')
        .gte('scheduled_for', todayStart.toISOString())
        .lt('scheduled_for', todayEnd.toISOString()),
      { data: [] as { id: string; status: string }[], error: null } as any,
    ),
    safe(
      client
        .from('cleaners')
        .select('id, name, owner_id')
        .order('created_at', { ascending: false })
        .limit(8),
      { data: [] as CleanerSummary[], error: null } as any,
    ),
    safe(
      client
        .from('tasks')
        .select(
          'id, checkin_lat, checkin_lng, checked_in_at, cleaner:cleaners(name), property:properties(name)',
        )
        .not('checkin_lat', 'is', null)
        .gte('checked_in_at', oneDayAgo)
        .order('checked_in_at', { ascending: false })
        .limit(8),
      { data: [] as CheckinSummary[], error: null } as any,
    ),
    safe(
      client
        .from('task_photos')
        .select('id, url, created_at, task_id')
        .order('created_at', { ascending: false })
        .limit(8),
      { data: [] as PhotoSummary[], error: null } as any,
    ),
  ]);

  const funnel: FunnelCounts = {
    new: 0,
    contacted: 0,
    qualified: 0,
    archived: 0,
  };
  for (const row of (leadsAll.data ?? []) as { status: string }[]) {
    if (row.status in funnel) funnel[row.status as keyof FunnelCounts]++;
  }

  const total30d = leads30dRaw.data?.length ?? 0;
  const qualified30d =
    (leads30dRaw.data ?? []).filter(
      (l: { status: string }) => l.status === 'qualified',
    ).length;
  const conversionPct =
    total30d > 0 ? Math.round((qualified30d / total30d) * 100) : 0;

  const tasksToday = tasksTodayRaw.data ?? [];
  const tasksDoneToday = tasksToday.filter(
    (t: { status: string }) => t.status === 'completed' || t.status === 'done',
  ).length;

  return (
    <HQDashboard
      email={admin.email}
      kpis={{
        pendingLeads: funnel.new,
        ownersTotal: ownersCount.count ?? 0,
        conversionPct,
        signups7d: leads7dCount.count ?? 0,
        cleanersTotal: cleanersCount.count ?? 0,
        tasksToday: tasksToday.length,
        tasksDoneToday,
      }}
      funnel={funnel}
      pendingLeadsList={(pendingLeadsRaw.data ?? []) as PendingLead[]}
      recentCleaners={(cleanersRecent.data ?? []) as CleanerSummary[]}
      recentCheckins={(checkinsRecent.data ?? []) as CheckinSummary[]}
      recentPhotos={(photosRecent.data ?? []) as PhotoSummary[]}
      propertiesCount={propertiesCount.count ?? 0}
    />
  );
}
