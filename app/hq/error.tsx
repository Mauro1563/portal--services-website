'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { AlertTriangle, Building2, FileText, Globe, Inbox, Palette, Settings, Users } from 'lucide-react';

export default function HQError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('[hq] dashboard render failed', error);
  }, [error]);

  const sections = [
    { href: '/hq/leads', label: 'Leads', desc: 'Registros y solicitudes', Icon: Inbox },
    { href: '/hq/companies', label: 'Empresas', desc: 'Gestiona los tenants', Icon: Users },
    { href: '/hq/company', label: 'Empresa', desc: 'Stack, costos, socios y cuentas', Icon: Building2 },
    { href: '/hq/branding', label: 'Branding', desc: 'Logo y colores', Icon: Palette },
    { href: '/hq/site', label: 'Sitio web', desc: 'Textos del marketing', Icon: Globe },
    { href: '/hq/content', label: 'Contenido', desc: 'CMS del sitio', Icon: FileText },
    { href: '/hq/settings', label: 'Ajustes', desc: 'Configuración global', Icon: Settings },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">
              El dashboard principal no cargó.
            </p>
            <p className="mt-1 text-sm">
              Estás dentro del HQ — usa los accesos directos de abajo. Mientras
              tanto puedes pulsar &quot;Reintentar&quot; o ver el detalle
              técnico al final.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-3 inline-flex h-9 items-center rounded-lg bg-amber-900 px-3 text-xs font-semibold text-white transition hover:bg-amber-800"
            >
              Reintentar
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Zapli HQ
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Panel administrativo · Atajos a las secciones disponibles.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map(({ href, label, desc, Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#00D8C7] hover:shadow"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#00D8C7]/15 text-[#0A0D18]">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-slate-900 group-hover:text-[#0A0D18]">
                  {label}
                </p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <details className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-slate-500">
            Detalle técnico
          </summary>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-3 text-[11px] leading-relaxed text-slate-100">
            {error.message}
            {error.digest ? `\n\nDigest: ${error.digest}` : ''}
            {error.stack ? `\n\n${error.stack}` : ''}
          </pre>
        </details>
      </div>
    </main>
  );
}
