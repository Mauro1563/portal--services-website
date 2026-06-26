import { redirect } from 'next/navigation';
import {
  Inbox,
  Mail,
  Phone,
  Building,
  Calendar,
  MessageCircle,
  Send,
} from 'lucide-react';
import { requireMarketingAdmin } from '@/lib/marketing';
import { createAdminClient } from '@/lib/supabase/admin';
import { HQShell } from '@/components/hq/Shell';
import { ApproveSignupButton } from './ApproveSignupButton';
import { LeadStatusPicker } from './LeadStatusPicker';
import { ExportLeadsButton } from './ExportLeadsButton';

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
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-paper p-5 ring-1 ring-line">
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
        <ExportLeadsButton leads={rows} />
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
                    <LeadStatusPicker leadId={l.id} initial={l.status} />
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
                    {l.source ? (
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-700">
                        {l.source === 'signup_self_serve' ? 'Auto-registro' : l.source}
                      </p>
                    ) : null}
                  </div>
                </div>
                <ContactRow lead={l} />
                {l.source === 'signup_self_serve' && l.status === 'new' ? (
                  <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-cyan-200 bg-cyan-50/60 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
                        Auto-registro pendiente
                      </p>
                      <p className="mt-0.5 text-[12px] text-graphite-2">
                        Al autorizar, se crea la cuenta y se le envía la contraseña temporal por email.
                      </p>
                    </div>
                    <ApproveSignupButton leadId={l.id} />
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

    </HQShell>
  );
}

function ContactRow({ lead }: { lead: Lead }) {
  // Build a WhatsApp link with a sensible default opener message.
  const wa = lead.phone
    ? `https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Hola ${lead.name?.split(' ')[0] ?? ''}, soy Mauricio de Portal Home. Vi tu registro de ${lead.company ?? 'tu empresa'} — ¿podemos charlar 10 min sobre cómo te puede ayudar la plataforma?`,
      )}`
    : null;
  const subj = encodeURIComponent(
    `Sobre tu registro en Portal Home${lead.company ? ` — ${lead.company}` : ''}`,
  );
  const body = encodeURIComponent(
    `Hola ${lead.name?.split(' ')[0] ?? ''},\n\nGracias por registrarte en Portal Home. Quería presentarme y ver cómo te podemos ayudar a sacar el máximo provecho de la plataforma.\n\n¿Tendrías 10 min esta semana para una llamada corta?\n\nUn saludo,\nMauricio`,
  );
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <a
        href={`mailto:${lead.email}?subject=${subj}&body=${body}`}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-[11px] font-semibold text-white transition hover:bg-slate-700"
      >
        <Send className="h-3 w-3" /> Email
      </a>
      {lead.phone ? (
        <>
          <a
            href={`tel:${lead.phone.replace(/\s+/g, '')}`}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-[11px] font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            <Phone className="h-3 w-3" /> Llamar
          </a>
          <a
            href={wa!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            <MessageCircle className="h-3 w-3" /> WhatsApp
          </a>
        </>
      ) : (
        <span className="text-[11px] text-graphite-4">Sin teléfono registrado</span>
      )}
    </div>
  );
}

