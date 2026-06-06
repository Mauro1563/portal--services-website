import { redirect } from 'next/navigation';
import { requireMarketingAdmin } from '@/lib/marketing';
import { createAdminClient } from '@/lib/supabase/admin';
import { OpsDashboard } from '@/components/hq/ops/OpsDashboard';

export const dynamic = 'force-dynamic';

export default async function HQDashboard() {
  const admin = await requireMarketingAdmin();
  if (!admin) redirect('/hq/login');

  // Real leads/signups data for the dashboard's Signups card.
  const client = createAdminClient();
  const { data: recent } = await client
    .from('marketing_leads')
    .select('id, name, email, company, phone, source, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);
  const { count: totalNew } = await client
    .from('marketing_leads')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'new');

  return (
    <OpsDashboard
      email={admin.email}
      leadsData={{
        newCount: totalNew ?? 0,
        recent: recent ?? [],
      }}
    />
  );
}
