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
      <div className="rounded-2xl bg-paper p-5 ring-1 ring-line">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-200">
            <Inbox className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-graphite-3">
              Resumen
            </p>
            <p className="mt-0.5 text-sm text-graphite-1">
              <span className="font-bold text-emerald-600">{newCount}</span>{' '}
              nuevos ·{' '}
              <span className="font-bold text-graphite-1">{rows.length}</span>{' '}
              en total
            </p>
          </div>
        </div>
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl bg-paper ring-1 ring-line">
        {rows.length === 0 ? (
          <div className="p-10 text-center">
            <Inbox className="mx-auto h-7 w-7 text-graphite-4" />
            <p className="mt-3 font-display text-base font-semibold text-graphite-1">
              Aún no hay leads
            </p>
            <p className="mt-1 text-sm text-graphite-3">
              Cuando los visitantes envíen el formulario de contacto, aparecerán
              aquí.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {rows.map((l) => (
              <li key={l.id} className="px-5 py-4 hover:bg-slate-50">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-semibold text-graphite-1">
                      {l.name || l.email}
                    </p>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-graphite-3">
                      <Mail className="h-3 w-3" /> {l.email}
                    </p>
                    {l.phone ? (
                      <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-graphite-3">
                        <Phone className="h-3 w-3" /> {l.phone}
                      </p>
                    ) : null}
                    {l.company ? (
                      <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-graphite-3">
                        <Building className="h-3 w-3" /> {l.company}
                      </p>
                    ) : null}
                    {l.message ? (
                      <p className="mt-2 max-w-2xl rounded-lg bg-slate-50 px-3 py-2 text-xs text-graphite-2 ring-1 ring-inset ring-line">
                        {l.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="shrink-0 text-right">
                    <StatusBadge status={l.status} />
                    <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-graphite-4">
                      <Calendar className="h-3 w-3" />
                      {new Date(l.created_at).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    {l.interest ? (
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-graphite-4">
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

      <p className="mt-6 rounded-2xl bg-cyan-50 p-4 text-xs text-graphite-2 ring-1 ring-inset ring-cyan-200">
        <span className="font-semibold text-brand-700">Próximamente:</span>{' '}
        formulario de contacto en el sitio público que escribe directo aquí,
        cambio de estado (contactado / cualificado), y exportar a CSV.
      </p>
    </HQShell>
  );
}

function StatusBadge({ status }: { status: Lead['status'] }) {
  const map: Record<Lead['status'], string> = {
    new: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    contacted: 'bg-amber-50 text-amber-700 ring-amber-200',
    qualified: 'bg-cyan-50 text-brand-700 ring-cyan-200',
    archived: 'bg-slate-100 text-graphite-3 ring-slate-200',
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
