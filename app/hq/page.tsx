import { redirect } from 'next/navigation';
import { requireMarketingAdmin } from '@/lib/marketing';
import { createAdminClient } from '@/lib/supabase/admin';
import { OpsDashboard } from '@/components/hq/ops/OpsDashboard';

export const dynamic = 'force-dynamic';

export default async function HQDashboard() {
  const admin = await requireMarketingAdmin();
  if (!admin) redirect('/hq/login');

  // Real leads/signups data for the dashboard's Signups card.
  // Wrapped in try/catch so a missing/empty marketing_leads table (e.g.
  // before the migration runs) doesn't take down the entire dashboard.
  const client = createAdminClient();
  let recent: any[] = [];
  let totalNew = 0;
  try {
    const r = await client
      .from('marketing_leads')
      .select('id, name, email, company, phone, source, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    recent = r.data ?? [];
    const c = await client
      .from('marketing_leads')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new');
    totalNew = c.count ?? 0;
  } catch (err) {
    console.error('[hq] marketing_leads query failed', err);
  }

  return (
    <OpsDashboard
      email={admin.email}
      leadsData={{
        newCount: totalNew,
        recent,
      }}
    />
  );
}
