import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { requireMarketingAdmin, getMarketingSection } from '@/lib/marketing';
import { saveMarketingSection } from '@/app/hq/actions';
import { HQShell } from '@/components/hq/Shell';
import { SimpleEditor, type FieldSpec } from '../SimpleEditor';

export const dynamic = 'force-dynamic';

export type HeroContent = {
  eyebrow: string;
  title_a: string;
  title_b: string;
  subtitle: string;
  cta_primary: string;
  cta_secondary: string;
  trust: string;
  audience_corporate: string;
  audience_property: string;
  audience_facility: string;
  tagline_a: string;
  tagline_b: string;
  tagline_c: string;
  audience_chip: string;
};

const FIELDS: FieldSpec<HeroContent>[] = [
  { key: 'tagline_a', label: 'Tagline (parte 1)' },
  { key: 'tagline_b', label: 'Tagline (parte 2, en cyan)' },
  { key: 'tagline_c', label: 'Tagline (parte 3)' },
  { key: 'audience_chip', label: 'Chip con sparkle ✨' },
  { key: 'eyebrow', label: 'Eyebrow' },
  { key: 'title_a', label: 'Título (primera parte)' },
  { key: 'title_b', label: 'Título (parte con gradiente)' },
  { key: 'subtitle', label: 'Subtítulo', multiline: true },
  { key: 'cta_primary', label: 'Botón primario' },
  { key: 'cta_secondary', label: 'Botón secundario' },
  { key: 'trust', label: 'Línea de confianza (debajo)' },
  { key: 'audience_corporate', label: 'Chip 1 — Corporativo' },
  { key: 'audience_property', label: 'Chip 2 — Property managers' },
  { key: 'audience_facility', label: 'Chip 3 — Facility services' },
];

export default async function HQHeroEditor() {
  const admin = await requireMarketingAdmin();
  if (!admin) redirect('/hq/login');

  const stored = await getMarketingSection<HeroContent>('hero');
  const initial: HeroContent = stored ?? (await loadFromI18n());

  async function save(content: HeroContent) {
    'use server';
    await saveMarketingSection('hero', content);
  }

  return (
    <HQShell
      active="content"
      email={admin.email}
      title="Editar Hero principal"
      subtitle="El primer bloque que ven los visitantes."
      actions={
        <Link
          href="/hq/content"
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-xs font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Volver a contenido
        </Link>
      }
    >
      <SimpleEditor initial={initial} fields={FIELDS} saveAction={save} />
    </HQShell>
  );
}

async function loadFromI18n(): Promise<HeroContent> {
  const t = await getTranslations('hero');
  return {
    eyebrow: t('eyebrow'),
    title_a: t('title_a'),
    title_b: t('title_b'),
    subtitle: t('subtitle'),
    cta_primary: t('cta_primary'),
    cta_secondary: t('cta_secondary'),
    trust: t('trust'),
    audience_corporate: t('audience_corporate'),
    audience_property: t('audience_property'),
    audience_facility: t('audience_facility'),
    tagline_a: t('tagline_a'),
    tagline_b: t('tagline_b'),
    tagline_c: t('tagline_c'),
    audience_chip: t('audience_chip'),
  };
}
