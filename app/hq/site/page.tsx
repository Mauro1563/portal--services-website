import { redirect } from 'next/navigation';
import { requireMarketingAdmin, getDoc } from '@/lib/marketing';
import { HQShell } from '@/components/hq/Shell';
import { SiteEditor } from '@/components/hq/SiteEditor';
import { deepMerge, type Json } from '@/lib/deep-merge';
import esMessages from '@/messages/es.json';
import enMessages from '@/messages/en.json';
import ptMessages from '@/messages/pt.json';

export const dynamic = 'force-dynamic';

const BASE: Record<string, Json> = {
  es: esMessages.psd as unknown as Json,
  en: enMessages.psd as unknown as Json,
  pt: ptMessages.psd as unknown as Json,
};

async function forLocale(loc: string) {
  const override = (await getDoc<Json>(`site_${loc}`)) ?? {};
  const merged = deepMerge(BASE[loc], override);
  return { hero: merged.hero, pricing: merged.pricing };
}

export default async function HQSite() {
  const admin = await requireMarketingAdmin();
  if (!admin) redirect('/hq/login');

  const [es, en, pt] = await Promise.all([forLocale('es'), forLocale('en'), forLocale('pt')]);

  return (
    <HQShell
      active="site"
      email={admin.email}
      title="Textos y precios"
      subtitle="Edita el hero y los planes del sitio nuevo, por idioma. Se publica al guardar."
    >
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <SiteEditor initial={{ es, en, pt } as any} />
    </HQShell>
  );
}
