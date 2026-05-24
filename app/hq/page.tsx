import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ArrowRight,
  FileText,
  Globe,
  Palette,
  LayoutGrid,
  Users,
  FileSignature,
  Inbox,
  Settings,
  TrendingUp,
} from 'lucide-react';
import { requireMarketingAdmin, getCollection } from '@/lib/marketing';
import { createAdminClient } from '@/lib/supabase/admin';
import { HQShell } from '@/components/hq/Shell';

export const dynamic = 'force-dynamic';

export default async function HQDashboard() {
  const admin = await requireMarketingAdmin();
  if (!admin) redirect('/hq/login');

  const client = createAdminClient();
  const [{ count: newLeads }, { data: lastEdits }, clients, sales, contracts] =
    await Promise.all([
      client
        .from('marketing_leads')
        .select('id', { head: true, count: 'exact' })
        .eq('status', 'new'),
      client
        .from('marketing_content')
        .select('section, updated_at')
        .order('updated_at', { ascending: false })
        .limit(5),
      getCollection<{ status?: string }>('clients'),
      getCollection<{ stage?: string; value?: string }>('sales'),
      getCollection<unknown>('contracts'),
    ]);

  const activeClients = clients.filter((c) => c.status === 'activo').length;
  const num = (v?: string) => {
    const n = parseFloat(String(v ?? '').replace(/[^\d.]/g, ''));
    return Number.isFinite(n) ? n : 0;
  };
  const openStages = ['nuevo', 'contactado', 'demo', 'propuesta'];
  const pipelineValue = sales
    .filter((s) => openStages.includes(s.stage ?? ''))
    .reduce((sum, s) => sum + num(s.value), 0);
  const wonValue = sales
    .filter((s) => s.stage === 'ganado')
    .reduce((sum, s) => sum + num(s.value), 0);

  const STAGES: { key: string; label: string }[] = [
    { key: 'nuevo', label: 'Nuevo' },
    { key: 'contactado', label: 'Contactado' },
    { key: 'demo', label: 'Demo' },
    { key: 'propuesta', label: 'Propuesta' },
    { key: 'ganado', label: 'Ganado' },
    { key: 'perdido', label: 'Perdido' },
  ];
  const stageCounts = STAGES.map((s) => ({
    ...s,
    count: sales.filter((x) => x.stage === s.key).length,
  }));
  const money = (n: number) => `£${n.toLocaleString('es-ES')}`;

  const cards = [
    {
      href: '/hq/site',
      icon: Globe,
      title: 'Textos y precios',
      desc: 'Editar el hero y los planes del sitio, por idioma.',
      accent: 'from-cyan-500 to-blue-500',
    },
    {
      href: '/hq/branding',
      icon: Palette,
      title: 'Branding',
      desc: 'Paleta de colores y logo del sitio público.',
      accent: 'from-violet-500 to-fuchsia-500',
    },
    {
      href: '/hq/portals',
      icon: LayoutGrid,
      title: 'Portales',
      desc: 'Editar los 7 portales que se muestran en el sitio.',
      accent: 'from-sky-500 to-indigo-500',
    },
    {
      href: '/hq/clients',
      icon: Users,
      title: 'Clientes',
      desc: 'Directorio de clientes con su portal asignado.',
      accent: 'from-emerald-500 to-teal-500',
    },
    {
      href: '/hq/sales',
      icon: TrendingUp,
      title: 'Ventas',
      desc: 'Pipeline de oportunidades y seguimiento comercial.',
      accent: 'from-amber-500 to-orange-500',
    },
    {
      href: '/hq/contracts',
      icon: FileSignature,
      title: 'Contratos',
      desc: 'Generar y exportar contratos por cliente.',
      accent: 'from-rose-500 to-pink-500',
    },
    {
      href: '/hq/leads',
      icon: Inbox,
      title: 'Leads y demos',
      desc: 'Solicitudes que entran desde la página pública.',
      accent: 'from-teal-500 to-cyan-500',
      badge: newLeads ?? 0,
    },
    {
      href: '/hq/content',
      icon: FileText,
      title: 'Contenido (clásico)',
      desc: 'Editores antiguos de hero, FAQ, testimonios y CTA.',
      accent: 'from-slate-500 to-slate-600',
    },
    {
      href: '/hq/settings',
      icon: Settings,
      title: 'Ajustes',
      desc: 'Dominio y administradores autorizados.',
      accent: 'from-graphite-3 to-graphite-2',
    },
  ];

  return (
    <HQShell
      active="dashboard"
      email={admin.email}
      title="Dashboard"
      subtitle="El centro de mando de portalservices.digital"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Stat label="Clientes" value={String(clients.length)} icon={Users} tone="emerald" />
        <Stat label="Clientes activos" value={String(activeClients)} icon={Users} tone="brand" />
        <Stat label="Contratos" value={String(contracts.length)} icon={FileSignature} tone="rose" />
        <Stat label="Pipeline abierto" value={money(pipelineValue)} icon={TrendingUp} tone="amber" />
        <Stat label="Ganado (£/mes)" value={money(wonValue)} icon={TrendingUp} tone="violet" />
        <Stat label="Leads nuevos" value={String(newLeads ?? 0)} icon={Inbox} tone="sky" />
      </div>

      {sales.length > 0 && (
        <section className="mt-6 rounded-2xl bg-paper p-6 ring-1 ring-line">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-graphite-3">
            Pipeline por etapa
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {stageCounts.map((s) => (
              <div key={s.key} className="rounded-xl bg-slate-50 p-3 ring-1 ring-inset ring-line">
                <p className="font-display text-2xl font-bold tabular-nums text-graphite-1">{s.count}</p>
                <p className="mt-0.5 text-[11px] font-medium text-graphite-3">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map(({ href, icon: Icon, title, desc, accent, badge }) => (
          <Link
            key={href}
            href={href}
            className="group relative overflow-hidden rounded-2xl bg-paper p-5 ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)] hover:ring-slate-300"
          >
            <div className="relative flex items-start justify-between gap-3">
              <span
                className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.4)]`}
              >
                <Icon className="h-5 w-5" />
              </span>
              {badge && badge > 0 ? (
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                  {badge > 9 ? '9+' : badge}
                </span>
              ) : null}
            </div>
            <p className="mt-4 font-display text-base font-semibold text-graphite-1">
              {title}
            </p>
            <p className="mt-1 text-sm text-graphite-3">{desc}</p>
            <p className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
              Abrir <ArrowRight className="h-3 w-3" />
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-10 rounded-2xl bg-paper p-6 ring-1 ring-line">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-graphite-3">
          Últimas ediciones
        </h2>
        {!lastEdits || lastEdits.length === 0 ? (
          <p className="mt-3 text-sm text-graphite-3">
            Aún no se ha editado nada desde el panel. Las secciones públicas
            muestran el contenido por defecto.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-line">
            {lastEdits.map((row) => (
              <li
                key={row.section}
                className="flex items-center justify-between py-3"
              >
                <p className="font-display text-sm font-medium capitalize text-graphite-1">
                  {row.section.replace('_', ' ')}
                </p>
                <p className="text-[11px] text-graphite-4">
                  {new Date(row.updated_at).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </HQShell>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof Inbox;
  tone: 'emerald' | 'brand' | 'violet' | 'amber' | 'rose' | 'sky';
}) {
  const map: Record<string, string> = {
    emerald: 'bg-emerald-50 ring-emerald-200 text-emerald-600',
    brand: 'bg-cyan-50 ring-cyan-200 text-brand-600',
    violet: 'bg-violet-50 ring-violet-200 text-violet-600',
    amber: 'bg-amber-50 ring-amber-200 text-amber-600',
    rose: 'bg-rose-50 ring-rose-200 text-rose-600',
    sky: 'bg-sky-50 ring-sky-200 text-sky-600',
  };
  const [bg, ring, text] = map[tone].split(' ');
  return (
    <div className={`rounded-2xl bg-paper p-5 ring-1 ring-line`}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-graphite-3">
          {label}
        </p>
        <span
          className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${bg} ${text} ring-1 ring-inset ${ring}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold tabular-nums text-graphite-1">
        {value}
      </p>
    </div>
  );
}
