import { redirect } from 'next/navigation';
import { requireMarketingAdmin, getDoc } from '@/lib/marketing';
import { HQShell } from '@/components/hq/Shell';
import { PortalsEditor, type Portal } from '@/components/hq/PortalsEditor';
import esMessages from '@/messages/es.json';
import enMessages from '@/messages/en.json';
import ptMessages from '@/messages/pt.json';

export const dynamic = 'force-dynamic';

type SiteDoc = { portals?: { list?: Portal[] } };

const BASE: Record<string, Portal[]> = {
  es: esMessages.psd.portals.list as Portal[],
  en: enMessages.psd.portals.list as Portal[],
  pt: ptMessages.psd.portals.list as Portal[],
};

export default async function HQPortals() {
  const admin = await requireMarketingAdmin();
  if (!admin) redirect('/hq/login');

  const [es, en, pt] = await Promise.all([
    getDoc<SiteDoc>('site_es'),
    getDoc<SiteDoc>('site_en'),
    getDoc<SiteDoc>('site_pt'),
  ]);

  const initial = {
    es: es?.portals?.list ?? BASE.es,
    en: en?.portals?.list ?? BASE.en,
    pt: pt?.portals?.list ?? BASE.pt,
  };

  return (
    <HQShell
      active="portals"
      email={admin.email}
      title="Portales"
      subtitle="Edita los portales que se muestran en el sitio, por idioma."
    >
      <PortalsEditor initial={initial} />
    </HQShell>
  );
}
