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
      <section className="rounded-2xl bg-paper p-6 ring-1 ring-line">
        <header className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-brand-600 ring-1 ring-inset ring-cyan-200">
            <Shield className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-lg font-semibold text-graphite-1">
              Administradores autorizados
            </h2>
            <p className="text-xs text-graphite-3">
              Solo los correos en esta lista pueden entrar al panel.
            </p>
          </div>
        </header>

        <ul className="mt-5 divide-y divide-line">
          {(admins ?? []).map((a) => (
            <li
              key={a.email}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="min-w-0">
                <p className="inline-flex items-center gap-1.5 text-sm text-graphite-1">
                  <Mail className="h-3.5 w-3.5 text-graphite-3" />
                  {a.email}
                </p>
                {a.name ? (
                  <p className="mt-0.5 text-[11px] text-graphite-4">{a.name}</p>
                ) : null}
              </div>
              <p className="shrink-0 text-[10px] text-graphite-4">
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

        <p className="mt-5 rounded-xl bg-slate-50 px-3 py-2 text-[11px] text-graphite-3 ring-1 ring-inset ring-line">
          Para añadir otro administrador, corre este SQL en Supabase:
          <code className="mt-2 block break-all font-mono text-[10px] text-brand-700">
            insert into marketing_admins (email) values
            (&apos;persona@empresa.com&apos;);
          </code>
        </p>
      </section>

      <section className="mt-6 rounded-2xl bg-paper p-6 ring-1 ring-line">
        <header className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 ring-1 ring-inset ring-violet-200">
            <Globe className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-lg font-semibold text-graphite-1">
              Sitio público
            </h2>
            <p className="text-xs text-graphite-3">portalservices.digital</p>
          </div>
        </header>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {['en', 'es', 'pt'].map((l) => (
            <a
              key={l}
              href={`/${l}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-slate-50 px-3 py-2 text-center text-xs font-medium text-graphite-2 ring-1 ring-inset ring-line hover:bg-slate-100 hover:text-graphite-1"
            >
              /{l}
            </a>
          ))}
        </div>
      </section>
    </HQShell>
  );
}
