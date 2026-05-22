import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ArrowRight,
  FileText,
  Inbox,
  Settings,
  TrendingUp,
} from 'lucide-react';
import { requireMarketingAdmin } from '@/lib/marketing';
import { createAdminClient } from '@/lib/supabase/admin';
import { HQShell } from '@/components/hq/Shell';

export const dynamic = 'force-dynamic';

export default async function HQDashboard() {
  const admin = await requireMarketingAdmin();
  if (!admin) redirect('/hq/login');

  const client = createAdminClient();
  const [{ count: newLeads }, { count: totalLeads }, { data: lastEdits }] =
    await Promise.all([
      client
        .from('marketing_leads')
        .select('id', { head: true, count: 'exact' })
        .eq('status', 'new'),
      client.from('marketing_leads').select('id', { head: true, count: 'exact' }),
      client
        .from('marketing_content')
        .select('section, updated_at')
        .order('updated_at', { ascending: false })
        .limit(4),
    ]);

  const cards = [
    {
      href: '/hq/content',
      icon: FileText,
      title: 'Contenido del sitio',
      desc: 'Editar precios, testimonios, FAQ y copy del hero.',
      accent: 'from-cyan-500 to-blue-500',
    },
    {
      href: '/hq/leads',
      icon: Inbox,
      title: 'Leads y demos',
      desc: 'Solicitudes que entran desde la página pública.',
      accent: 'from-emerald-500 to-teal-500',
      badge: newLeads ?? 0,
    },
    {
      href: '/hq/settings',
      icon: Settings,
      title: 'Ajustes',
      desc: 'Branding, dominio, administradores autorizados.',
      accent: 'from-violet-500 to-fuchsia-500',
    },
  ];

  return (
    <HQShell
      active="dashboard"
      email={admin.email}
      title="Dashboard"
      subtitle="El centro de mando de portalservices.digital"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Leads nuevos"
          value={String(newLeads ?? 0)}
          icon={Inbox}
          tone="emerald"
        />
        <Stat
          label="Leads totales"
          value={String(totalLeads ?? 0)}
          icon={TrendingUp}
          tone="brand"
        />
        <Stat
          label="Secciones editadas"
          value={String(lastEdits?.length ?? 0)}
          icon={FileText}
          tone="violet"
        />
      </div>

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
  tone: 'emerald' | 'brand' | 'violet';
}) {
  const cls =
    tone === 'emerald'
      ? 'bg-emerald-50 ring-emerald-200 text-emerald-600'
      : tone === 'brand'
      ? 'bg-cyan-50 ring-cyan-200 text-brand-600'
      : 'bg-violet-50 ring-violet-200 text-violet-600';
  const [bg, ring, text] = cls.split(' ');
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
