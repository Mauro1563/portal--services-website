import { redirect } from 'next/navigation';
import { Inbox, Mail, Phone, Building, Calendar } from 'lucide-react';
import { requireMarketingAdmin } from '@/lib/marketing';
import { createAdminClient } from '@/lib/supabase/admin';
import { HQShell } from '@/components/hq/Shell';

export const dynamic = 'force-dynamic';

type Lead = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  interest: string | null;
  message: string | null;
  source: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'archived';
  created_at: string;
};

export default async function HQLeads() {
  const admin = await requireMarketingAdmin();
  if (!admin) redirect('/hq/login');

  const client = createAdminClient();
  const { data: leads } = await client
    .from('marketing_leads')
    .select(
      'id, name, email, phone, company, interest, message, source, status, created_at',
    )
    .order('created_at', { ascending: false })
    .limit(100);

  const rows = (leads ?? []) as Lead[];
  const newCount = rows.filter((l) => l.status === 'new').length;

  return (
    <HQShell
      active="leads"
      email={admin.email}
      title="Leads"
      subtitle="Solicitudes de demo y contacto desde el sitio público."
    >
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-400/30">
            <Inbox className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Resumen
            </p>
            <p className="mt-0.5 text-sm text-white">
              <span className="font-bold text-emerald-300">{newCount}</span>{' '}
              nuevos · <span className="font-bold text-white">{rows.length}</span>{' '}
              en total
            </p>
          </div>
        </div>
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        {rows.length === 0 ? (
          <div className="p-10 text-center">
            <Inbox className="mx-auto h-7 w-7 text-slate-500" />
            <p className="mt-3 font-display text-base font-semibold text-white">
              Aún no hay leads
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Cuando los visitantes envíen el formulario de contacto, aparecerán
              aquí.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-white/[0.04]">
            {rows.map((l) => (
              <li key={l.id} className="px-5 py-4 hover:bg-white/[0.02]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-semibold text-white">
                      {l.name || l.email}
                    </p>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-slate-400">
                      <Mail className="h-3 w-3" /> {l.email}
                    </p>
                    {l.phone ? (
                      <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-slate-400">
                        <Phone className="h-3 w-3" /> {l.phone}
                      </p>
                    ) : null}
                    {l.company ? (
                      <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-slate-400">
                        <Building className="h-3 w-3" /> {l.company}
                      </p>
                    ) : null}
                    {l.message ? (
                      <p className="mt-2 max-w-2xl rounded-lg bg-white/[0.03] px-3 py-2 text-xs text-slate-300">
                        {l.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="shrink-0 text-right">
                    <StatusBadge status={l.status} />
                    <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-slate-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(l.created_at).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    {l.interest ? (
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
                        Interés: {l.interest}
                      </p>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-500/[0.04] p-4 text-xs text-slate-300">
        <span className="font-semibold text-cyan-300">Próximamente:</span>{' '}
        formulario de contacto en el sitio público que escribe directo aquí,
        cambio de estado (contactado / cualificado), y exportar a CSV.
      </p>
    </HQShell>
  );
}

function StatusBadge({ status }: { status: Lead['status'] }) {
  const map: Record<Lead['status'], string> = {
    new: 'bg-emerald-500/10 text-emerald-300 ring-emerald-400/30',
    contacted: 'bg-amber-500/10 text-amber-300 ring-amber-400/30',
    qualified: 'bg-cyan-500/10 text-cyan-300 ring-cyan-400/30',
    archived: 'bg-white/[0.04] text-slate-400 ring-white/[0.08]',
  };
  const labels: Record<Lead['status'], string> = {
    new: 'Nuevo',
    contacted: 'Contactado',
    qualified: 'Cualificado',
    archived: 'Archivado',
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset ${map[status]}`}
    >
      {labels[status]}
    </span>
  );
}
