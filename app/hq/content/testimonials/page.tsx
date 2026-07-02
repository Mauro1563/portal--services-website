import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getT } from '@/lib/i18n';
import { ArrowLeft } from 'lucide-react';
import { requireMarketingAdmin, getMarketingSection } from '@/lib/marketing';
import { saveMarketingSection } from '@/app/hq/actions';
import { HQShell } from '@/components/hq/Shell';
import {
  TestimonialsEditor,
  type TestimonialsContent,
} from './TestimonialsEditor';

export const dynamic = 'force-dynamic';

export default async function HQTestimonialsEditor() {
  const admin = await requireMarketingAdmin();
  if (!admin) redirect('/hq/login');
  const t = await getT();

  const stored = await getMarketingSection<TestimonialsContent>('testimonials');
  const initial: TestimonialsContent = stored ?? (await loadFromI18n());

  async function save(content: TestimonialsContent) {
    'use server';
    await saveMarketingSection('testimonials', content);
  }

  return (
    <HQShell
      active="content"
      email={admin.email}
      title="Editar testimonios"
      subtitle="Cambia las frases que aparecen en la sección de confianza social."
      actions={
        <Link
          href="/hq/content"
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-xs font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {t("common.backToContent")}
        </Link>
      }
    >
      <TestimonialsEditor initial={initial} saveAction={save} />
    </HQShell>
  );
}

async function loadFromI18n(): Promise<TestimonialsContent> {
  const t = await getTranslations('testimonials');
  return {
    eyebrow: t('eyebrow'),
    title: t('title'),
    quotes: [
      { quote: t('q1'), author: t('q1_author') },
      { quote: t('q2'), author: t('q2_author') },
      { quote: t('q3'), author: t('q3_author') },
    ],
  };
}
