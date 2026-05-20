import { redirect } from 'next/navigation';
import { Mail, Shield, Globe } from 'lucide-react';
import { requireMarketingAdmin } from '@/lib/marketing';
import { createAdminClient } from '@/lib/supabase/admin';
import { HQShell } from '@/components/hq/Shell';

export const dynamic = 'force-dynamic';

export default async function HQSettings() {
  const admin = await requireMarketingAdmin();
  if (!admin) redirect('/hq/login');

  const client = createAdminClient();
  const { data: admins } = await client
    .from('marketing_admins')
    .select('email, name, created_at')
    .order('created_at', { ascending: true });

  return (
    <HQShell
      active="settings"
      email={admin.email}
      title="Ajustes"
      subtitle="Administradores autorizados y configuración de la cuenta."
    >
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <header className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300 ring-1 ring-inset ring-cyan-400/30">
            <Shield className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-lg font-semibold text-white">
              Administradores autorizados
            </h2>
            <p className="text-xs text-slate-400">
              Solo los correos en esta lista pueden entrar al panel.
            </p>
          </div>
        </header>

        <ul className="mt-5 divide-y divide-white/[0.04]">
          {(admins ?? []).map((a) => (
            <li
              key={a.email}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="min-w-0">
                <p className="inline-flex items-center gap-1.5 text-sm text-white">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {a.email}
                </p>
                {a.name ? (
                  <p className="mt-0.5 text-[11px] text-slate-500">{a.name}</p>
                ) : null}
              </div>
              <p className="shrink-0 text-[10px] text-slate-500">
                Desde{' '}
                {new Date(a.created_at).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-5 rounded-xl bg-white/[0.03] px-3 py-2 text-[11px] text-slate-400 ring-1 ring-inset ring-white/[0.06]">
          Para añadir otro administrador, corre este SQL en Supabase:
          <code className="mt-2 block break-all font-mono text-[10px] text-cyan-300">
            insert into marketing_admins (email) values (&apos;persona@empresa.com&apos;);
          </code>
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <header className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300 ring-1 ring-inset ring-violet-400/30">
            <Globe className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-lg font-semibold text-white">
              Sitio público
            </h2>
            <p className="text-xs text-slate-400">portalservices.digital</p>
          </div>
        </header>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {['en', 'es', 'pt'].map((l) => (
            <a
              key={l}
              href={`/${l}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-white/[0.03] px-3 py-2 text-center text-xs font-medium text-slate-300 ring-1 ring-inset ring-white/[0.06] hover:bg-white/[0.06] hover:text-white"
            >
              /{l}
            </a>
          ))}
        </div>
      </section>
    </HQShell>
  );
}
