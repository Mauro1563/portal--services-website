import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getT } from '@/lib/i18n';
import { ArrowLeft } from 'lucide-react';
import { requireMarketingAdmin, getMarketingSection } from '@/lib/marketing';
import { saveMarketingSection } from '@/app/hq/actions';
import { HQShell } from '@/components/hq/Shell';
import { FAQEditor, type FAQContent } from './FAQEditor';

export const dynamic = 'force-dynamic';

export default async function HQFAQEditor() {
  const admin = await requireMarketingAdmin();
  if (!admin) redirect('/hq/login');
  const t = await getT();

  const stored = await getMarketingSection<FAQContent>('faq');
  const initial: FAQContent = stored ?? (await loadFromI18n());

  async function save(content: FAQContent) {
    'use server';
    await saveMarketingSection('faq', content);
  }

  return (
    <HQShell
      active="content"
      email={admin.email}
      title="Editar FAQ"
      subtitle="Añade, edita o elimina las preguntas frecuentes del sitio."
      actions={
        <Link
          href="/hq/content"
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-xs font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {t("common.backToContent")}
        </Link>
      }
    >
      <FAQEditor initial={initial} saveAction={save} />
    </HQShell>
  );
}

async function loadFromI18n(): Promise<FAQContent> {
  const t = await getTranslations('faq');
  return {
    title: t('title'),
    items: [1, 2, 3, 4].map((i) => ({
      q: t(`q${i}` as 'q1'),
      a: t(`a${i}` as 'a1'),
    })),
  };
}
