import { redirect } from 'next/navigation';
import { requireMarketingAdmin } from '@/lib/marketing';
import { getBranding } from '@/lib/branding';
import { HQShell } from '@/components/hq/Shell';
import { BrandingEditor } from '@/components/hq/BrandingEditor';

export const dynamic = 'force-dynamic';

export default async function HQBranding() {
  const admin = await requireMarketingAdmin();
  if (!admin) redirect('/hq/login');
  const branding = await getBranding();

  return (
    <HQShell
      active="branding"
      email={admin.email}
      title="Branding"
      subtitle="Paleta de colores y logo del sitio público."
    >
      <BrandingEditor initial={branding} />
    </HQShell>
  );
}
