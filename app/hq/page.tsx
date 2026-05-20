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
      accent: 'from-cyan-400 to-blue-500',
    },
    {
      href: '/hq/leads',
      icon: Inbox,
      title: 'Leads y demos',
      desc: 'Solicitudes que entran desde la página pública.',
      accent: 'from-emerald-400 to-teal-500',
      badge: newLeads ?? 0,
    },
    {
      href: '/hq/settings',
      icon: Settings,
      title: 'Ajustes',
      desc: 'Branding, dominio, administradores autorizados.',
      accent: 'from-violet-400 to-fuchsia-500',
    },
  ];

  return (
    <HQShell
      active="dashboard"
      email={admin.email}
      title="Dashboard"
      subtitle="El centro de mando de portalservices.digital"
    >
      {/* Stats row */}
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
          tone="cyan"
        />
        <Stat
          label="Secciones editadas"
          value={String(lastEdits?.length ?? 0)}
          icon={FileText}
          tone="violet"
        />
      </div>

      {/* Quick action cards */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map(({ href, icon: Icon, title, desc, accent, badge }) => (
          <Link
            key={href}
            href={href}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition hover:border-white/[0.16] hover:bg-white/[0.05]"
          >
            <div
              aria-hidden
              className={`pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${accent} opacity-15 blur-2xl transition group-hover:opacity-25`}
            />
            <div className="relative flex items-start justify-between gap-3">
              <span
                className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg`}
              >
                <Icon className="h-5 w-5" />
              </span>
              {badge && badge > 0 ? (
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                  {badge > 9 ? '9+' : badge}
                </span>
              ) : null}
            </div>
            <p className="relative mt-4 font-display text-base font-semibold text-white">
              {title}
            </p>
            <p className="relative mt-1 text-sm text-slate-400">{desc}</p>
            <p className="relative mt-4 inline-flex items-center gap-1 text-xs font-semibold text-cyan-300">
              Abrir <ArrowRight className="h-3 w-3" />
            </p>
          </Link>
        ))}
      </div>

      {/* Recent edits */}
      <section className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Últimas ediciones
        </h2>
        {!lastEdits || lastEdits.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            Aún no se ha editado nada desde el panel. Las secciones públicas
            muestran el contenido por defecto.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-white/[0.04]">
            {lastEdits.map((row) => (
              <li
                key={row.section}
                className="flex items-center justify-between py-3"
              >
                <p className="font-display text-sm font-medium text-white capitalize">
                  {row.section.replace('_', ' ')}
                </p>
                <p className="text-[11px] text-slate-500">
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
  tone: 'emerald' | 'cyan' | 'violet';
}) {
  const ring =
    tone === 'emerald'
      ? 'ring-emerald-400/30 bg-emerald-500/[0.06]'
      : tone === 'cyan'
      ? 'ring-cyan-400/30 bg-cyan-500/[0.06]'
      : 'ring-violet-400/30 bg-violet-500/[0.06]';
  const iconColor =
    tone === 'emerald'
      ? 'text-emerald-300'
      : tone === 'cyan'
      ? 'text-cyan-300'
      : 'text-violet-300';
  return (
    <div
      className={`rounded-2xl border border-white/[0.06] p-5 ring-1 ring-inset ${ring}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <p className="mt-3 font-display text-3xl font-bold tabular-nums text-white">
        {value}
      </p>
    </div>
  );
}
