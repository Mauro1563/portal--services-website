import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getT } from '@/lib/i18n';
import { ArrowLeft } from 'lucide-react';
import { requireMarketingAdmin, getMarketingSection } from '@/lib/marketing';
import { saveMarketingSection } from '@/app/hq/actions';
import { HQShell } from '@/components/hq/Shell';
import { SimpleEditor, type FieldSpec } from '../SimpleEditor';

export const dynamic = 'force-dynamic';

export type CTABannerContent = {
  title: string;
  subtitle: string;
  primary: string;
  secondary: string;
};

const FIELDS: FieldSpec<CTABannerContent>[] = [
  { key: 'title', label: 'Título' },
  { key: 'subtitle', label: 'Subtítulo', multiline: true },
  { key: 'primary', label: 'Botón primario' },
  { key: 'secondary', label: 'Botón secundario' },
];

export default async function HQCTAEditor() {
  const admin = await requireMarketingAdmin();
  if (!admin) redirect('/hq/login');
  const t = await getT();

  const stored = await getMarketingSection<CTABannerContent>('cta_banner');
  const initial: CTABannerContent = stored ?? (await loadFromI18n());

  async function save(content: CTABannerContent) {
    'use server';
    await saveMarketingSection('cta_banner', content);
  }

  return (
    <HQShell
      active="content"
      email={admin.email}
      title="Editar banner final"
      subtitle="El bloque destacado de cierre antes del footer."
      actions={
        <Link
          href="/hq/content"
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-xs font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {t("common.backToContent")}
        </Link>
      }
    >
      <SimpleEditor initial={initial} fields={FIELDS} saveAction={save} />
    </HQShell>
  );
}

async function loadFromI18n(): Promise<CTABannerContent> {
  const t = await getTranslations('cta_banner');
  return {
    title: t('title'),
    subtitle: t('subtitle'),
    primary: t('primary'),
    secondary: t('secondary'),
  };
}
