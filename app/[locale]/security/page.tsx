import Link from 'next/link';
import { Lock, ShieldCheck, KeyRound, FileCheck } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { type Locale } from '@/lib/i18n';

type Item = { title: string; body: string };
type Copy = {
  eyebrow: string;
  title: string;
  lead: string;
  items: Item[];
  responsibleTitle: string;
  responsibleBody: string;
  cta: string;
};

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: 'Security',
    title: 'Boring infrastructure, on purpose',
    lead: 'Cleaning operations data is not glamorous, but losing it would ruin someone\'s month. We treat it accordingly.',
    items: [
      {
        title: 'Encrypted in transit and at rest',
        body: 'Every request is served over TLS. Data is encrypted at rest by our database provider (Supabase) and file storage backend.',
      },
      {
        title: 'Row-level security on every table',
        body: 'Each tenant\'s data is isolated by Postgres row-level security policies. Even if application code had a bug, the database refuses cross-tenant reads.',
      },
      {
        title: 'Magic-link auth for clients',
        body: 'Property owners and clients receive single-use, short-lived links instead of passwords. Nothing to remember, nothing to leak.',
      },
      {
        title: 'GDPR-friendly by default',
        body: 'EU-region hosting, an explicit sub-processor list, and a data-export and erase flow built in. See the Privacy Policy for the full breakdown.',
      },
    ],
    responsibleTitle: 'Reporting a vulnerability',
    responsibleBody:
      'Found something? Email hola@portalservices.digital and we will reply within one business day. We do not run a paid bounty, but we are grateful and will credit you if you would like.',
    cta: 'Sign up',
  },
  es: {
    eyebrow: 'Seguridad',
    title: 'Infraestructura aburrida, a propósito',
    lead: 'Los datos de operaciones de limpieza no son glamurosos, pero perderlos arruinaría el mes a alguien. Los tratamos en consecuencia.',
    items: [
      {
        title: 'Cifrado en tránsito y en reposo',
        body: 'Cada petición se sirve por TLS. Los datos se cifran en reposo en nuestra base de datos (Supabase) y en el almacenamiento de archivos.',
      },
      {
        title: 'Row-level security en cada tabla',
        body: 'Los datos de cada tenant están aislados por políticas de row-level security de Postgres. Aunque el código tuviera un bug, la base de datos rechaza lecturas entre tenants.',
      },
      {
        title: 'Magic links para clientes',
        body: 'Propietarios y clientes reciben enlaces de un solo uso y corta duración en vez de contraseñas. Nada que recordar, nada que filtrar.',
      },
      {
        title: 'Pensado para el RGPD',
        body: 'Hospedaje en la UE, lista explícita de subencargados y flujos integrados de exportación y borrado. Detalles en la Política de Privacidad.',
      },
    ],
    responsibleTitle: 'Reportar una vulnerabilidad',
    responsibleBody:
      '¿Has encontrado algo? Escríbenos a hola@portalservices.digital y respondemos en un día laborable. No tenemos bug bounty pagado, pero te lo agradecemos y te damos crédito si quieres.',
    cta: 'Regístrate',
  },
  pt: {
    eyebrow: 'Segurança',
    title: 'Infraestrutura aborrecida, de propósito',
    lead: 'Os dados de operações de limpeza não são glamorosos, mas perdê-los arruinaria o mês de alguém. Tratamos disso em conformidade.',
    items: [
      {
        title: 'Cifrado em trânsito e em repouso',
        body: 'Cada pedido é servido por TLS. Os dados são cifrados em repouso pelo nosso fornecedor de base de dados (Supabase) e no armazenamento de ficheiros.',
      },
      {
        title: 'Row-level security em cada tabela',
        body: 'Os dados de cada tenant são isolados por políticas de row-level security do Postgres. Mesmo com um bug na aplicação, a base de dados recusa leituras entre tenants.',
      },
      {
        title: 'Magic links para clientes',
        body: 'Proprietários e clientes recebem links de uso único e curta duração em vez de palavras-passe. Nada para memorizar, nada para vazar.',
      },
      {
        title: 'Pensado para o RGPD',
        body: 'Alojamento na UE, lista explícita de subcontratantes e fluxos integrados de exportação e eliminação. Detalhes na Política de Privacidade.',
      },
    ],
    responsibleTitle: 'Reportar uma vulnerabilidade',
    responsibleBody:
      'Encontraste algo? Escreve para hola@portalservices.digital e respondemos num dia útil. Não temos bug bounty pago, mas agradecemos e damos crédito se quiseres.',
    cta: 'Registar',
  },
};

const ICONS = [Lock, ShieldCheck, KeyRound, FileCheck];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = COPY[(locale as Locale) in COPY ? (locale as Locale) : 'en'];
  return { title: `${c.eyebrow} — Zapli`, description: c.lead };
}

export default async function SecurityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = COPY[(locale as Locale) in COPY ? (locale as Locale) : 'en'];

  return (
    <main className="relative overflow-hidden">
      <Nav />
      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0 bg-mesh-1 opacity-90" />
        <div className="absolute inset-0 bg-grid" />
        <div className="relative mx-auto max-w-3xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            {c.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {c.title}
          </h1>
          <p className="mt-5 text-lg text-slate-300">{c.lead}</p>
        </div>
      </section>

      <article className="relative py-12">
        <div className="mx-auto max-w-3xl space-y-6 px-6">
          {c.items.map((it, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={it.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-cyan-300" />
                  <h2 className="font-display text-lg font-semibold text-white">
                    {it.title}
                  </h2>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{it.body}</p>
              </div>
            );
          })}

          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6">
            <h2 className="font-display text-lg font-semibold text-white">
              {c.responsibleTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              {c.responsibleBody}
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-400 hover:to-cyan-400"
            >
              {c.cta}
            </Link>
            <Link
              href={`/${locale}/privacy`}
              className="text-sm text-cyan-300 hover:text-cyan-200"
            >
              Privacy Policy →
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
