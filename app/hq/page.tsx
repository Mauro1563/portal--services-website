import { redirect } from 'next/navigation';
import { requireMarketingAdmin } from '@/lib/marketing';
import { OpsDashboard } from '@/components/hq/ops/OpsDashboard';

export const dynamic = 'force-dynamic';

export default async function HQDashboard() {
  const admin = await requireMarketingAdmin();
  if (!admin) redirect('/hq/login');

  return <OpsDashboard email={admin.email} />;
}
