import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ArrowRight,
  DollarSign,
  HelpCircle,
  Megaphone,
  MessageSquareQuote,
  Sparkles,
} from 'lucide-react';
import { requireMarketingAdmin } from '@/lib/marketing';
import { HQShell } from '@/components/hq/Shell';

export const dynamic = 'force-dynamic';

const sections = [
  {
    slug: 'pricing',
    icon: DollarSign,
    title: 'Tabla de precios',
    desc: 'Planes Corporativo y Limpiezas de Hogar — precios, rangos, features y CTAs.',
    accent: 'from-emerald-400 to-teal-500',
  },
  {
    slug: 'testimonials',
    icon: MessageSquareQuote,
    title: 'Testimonios',
    desc: 'Las 3 frases destacadas en la pared social del sitio.',
    accent: 'from-amber-400 to-orange-500',
  },
  {
    slug: 'faq',
    icon: HelpCircle,
    title: 'FAQ',
    desc: 'Preguntas frecuentes mostradas en el sitio público.',
    accent: 'from-cyan-400 to-blue-500',
  },
  {
    slug: 'hero',
    icon: Sparkles,
    title: 'Hero principal',
    desc: 'Eyebrow, título, subtítulo, CTAs y línea de confianza.',
    accent: 'from-violet-400 to-fuchsia-500',
  },
  {
    slug: 'cta_banner',
    icon: Megaphone,
    title: 'Banner final (CTA)',
    desc: 'Llamada a la acción al final de la página pública.',
    accent: 'from-rose-400 to-pink-500',
  },
];

export default async function HQContentIndex() {
  const admin = await requireMarketingAdmin();
  if (!admin) redirect('/hq/login');

  return (
    <HQShell
      active="content"
      email={admin.email}
      title="Contenido"
      subtitle="Edita lo que ven los visitantes. Los cambios aparecen en vivo en cuanto guardas."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map(({ slug, icon: Icon, title, desc, accent }) => (
          <Link
            key={slug}
            href={`/hq/content/${slug}`}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 transition hover:border-white/[0.16] hover:bg-white/[0.05]"
          >
            <div
              aria-hidden
              className={`pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-gradient-to-br ${accent} opacity-15 blur-3xl transition group-hover:opacity-25`}
            />
            <span
              className={`relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <p className="relative mt-5 font-display text-base font-semibold text-white">
              {title}
            </p>
            <p className="relative mt-1.5 text-sm text-slate-400">{desc}</p>
            <p className="relative mt-5 inline-flex items-center gap-1 text-xs font-semibold text-cyan-300">
              Editar <ArrowRight className="h-3 w-3" />
            </p>
          </Link>
        ))}
      </div>

      <p className="mt-10 rounded-2xl border border-cyan-400/20 bg-cyan-500/[0.04] p-4 text-xs text-slate-300">
        <span className="font-semibold text-cyan-300">Próximamente:</span>{' '}
        editor visual de los 7 portales, VIP experience, Club Premium y la
        comparativa de funciones. Si necesitas tocar algo de eso ahora, dímelo
        y lo añado.
      </p>
    </HQShell>
  );
}
