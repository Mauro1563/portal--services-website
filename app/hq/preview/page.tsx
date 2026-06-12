import { OpsDashboard } from '@/components/hq/ops/OpsDashboard';

export const metadata = { robots: 'noindex, nofollow' };

// Public, no-auth preview of the new HQ operations dashboard so the design
// can be reviewed without logging in. Uses a placeholder identity.
export default function HQPreview() {
  return <OpsDashboard email="demo@portalservices.digital" />;
}
