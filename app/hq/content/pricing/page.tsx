import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requireMarketingAdmin, getMarketingSection } from '@/lib/marketing';
import { saveMarketingSection } from '@/app/hq/actions';
import { HQShell } from '@/components/hq/Shell';
import { DEFAULT_PRICING } from '@/lib/pricing-defaults';
import {
  PricingEditor,
  type PricingContent,
} from './PricingEditor';

export const dynamic = 'force-dynamic';

export default async function HQPricingEditor() {
  const admin = await requireMarketingAdmin();
  if (!admin) redirect('/hq/login');

  const stored = await getMarketingSection<PricingContent>('pricing');
  const initial = stored ?? DEFAULT_PRICING;

  async function save(content: PricingContent) {
    'use server';
    await saveMarketingSection('pricing', content);
  }

  return (
    <HQShell
      active="content"
      email={admin.email}
      title="Editar tabla de precios"
      subtitle="Cambia precios, rangos, features y CTAs. Los cambios aparecen al instante en el sitio público."
      actions={
        <Link
          href="/hq/content"
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-xs font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Volver a contenido
        </Link>
      }
    >
      <PricingEditor initial={initial} saveAction={save} />
    </HQShell>
  );
}
