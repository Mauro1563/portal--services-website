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
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    slug: 'testimonials',
    icon: MessageSquareQuote,
    title: 'Testimonios',
    desc: 'Las 3 frases destacadas en la pared social del sitio.',
    accent: 'from-amber-500 to-orange-500',
  },
  {
    slug: 'faq',
    icon: HelpCircle,
    title: 'FAQ',
    desc: 'Preguntas frecuentes mostradas en el sitio público.',
    accent: 'from-cyan-500 to-blue-500',
  },
  {
    slug: 'hero',
    icon: Sparkles,
    title: 'Hero principal',
    desc: 'Eyebrow, título, subtítulo, CTAs y línea de confianza.',
    accent: 'from-violet-500 to-fuchsia-500',
  },
  {
    slug: 'cta_banner',
    icon: Megaphone,
    title: 'Banner final (CTA)',
    desc: 'Llamada a la acción al final de la página pública.',
    accent: 'from-rose-500 to-pink-500',
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
            className="group relative overflow-hidden rounded-2xl bg-paper p-6 ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)] hover:ring-slate-300"
          >
            <span
              className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.4)]`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-5 font-display text-base font-semibold text-graphite-1">
              {title}
            </p>
            <p className="mt-1.5 text-sm text-graphite-3">{desc}</p>
            <p className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
              Editar <ArrowRight className="h-3 w-3" />
            </p>
          </Link>
        ))}
      </div>

      <p className="mt-10 rounded-2xl bg-cyan-50 p-4 text-xs text-graphite-2 ring-1 ring-inset ring-cyan-200">
        <span className="font-semibold text-brand-700">Próximamente:</span>{' '}
        editor visual de los 7 portales, VIP experience, Club Premium y la
        comparativa de funciones. Si necesitas tocar algo de eso ahora, dímelo
        y lo añado.
      </p>
    </HQShell>
  );
}
