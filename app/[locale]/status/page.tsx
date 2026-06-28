import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { type Locale } from '@/lib/i18n';

type Copy = {
  eyebrow: string;
  title: string;
  lead: string;
  allOk: string;
  components: { name: string; desc: string }[];
  realtimeTitle: string;
  realtimeBody: string;
  back: string;
};

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: 'Status',
    title: 'All systems operational',
    lead: 'A snapshot of how Zapli is running right now.',
    allOk: 'Operational',
    components: [
      { name: 'Web app', desc: 'portalservices.digital and hq subdomain' },
      { name: 'API', desc: 'Read and write endpoints' },
      { name: 'Database', desc: 'Supabase Postgres (EU-West)' },
      { name: 'File storage', desc: 'Photo uploads and evidence' },
      { name: 'Payments', desc: 'Stripe integration' },
    ],
    realtimeTitle: 'Need real-time status?',
    realtimeBody:
      'This page reflects our latest manual check. If something feels off, email hola@portalservices.digital and we will look immediately.',
    back: 'Back to home',
  },
  es: {
    eyebrow: 'Estado',
    title: 'Todos los sistemas funcionan',
    lead: 'Una foto de cómo está funcionando Zapli ahora mismo.',
    allOk: 'Operativo',
    components: [
      { name: 'Aplicación web', desc: 'portalservices.digital y subdominio hq' },
      { name: 'API', desc: 'Endpoints de lectura y escritura' },
      { name: 'Base de datos', desc: 'Supabase Postgres (EU-West)' },
      { name: 'Almacenamiento de archivos', desc: 'Subida de fotos y evidencias' },
      { name: 'Pagos', desc: 'Integración con Stripe' },
    ],
    realtimeTitle: '¿Necesitas estado en tiempo real?',
    realtimeBody:
      'Esta página refleja nuestra última comprobación manual. Si algo falla, escríbenos a hola@portalservices.digital y lo miramos al momento.',
    back: 'Volver al inicio',
  },
  pt: {
    eyebrow: 'Estado',
    title: 'Todos os sistemas operacionais',
    lead: 'Uma fotografia de como o Zapli está a correr agora.',
    allOk: 'Operacional',
    components: [
      { name: 'Aplicação web', desc: 'portalservices.digital e subdomínio hq' },
      { name: 'API', desc: 'Endpoints de leitura e escrita' },
      { name: 'Base de dados', desc: 'Supabase Postgres (EU-West)' },
      { name: 'Armazenamento de ficheiros', desc: 'Upload de fotos e evidências' },
      { name: 'Pagamentos', desc: 'Integração com Stripe' },
    ],
    realtimeTitle: 'Precisas de estado em tempo real?',
    realtimeBody:
      'Esta página reflete a nossa última verificação manual. Se algo parecer fora do normal, escreve para hola@portalservices.digital e vemos de imediato.',
    back: 'Voltar ao início',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = COPY[(locale as Locale) in COPY ? (locale as Locale) : 'en'];
  return { title: `${c.eyebrow} — Zapli`, description: c.lead };
}

export default async function StatusPage({
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
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            {c.allOk}
          </div>
        </div>
      </section>

      <article className="relative py-12">
        <div className="mx-auto max-w-3xl space-y-3 px-6">
          {c.components.map((cmp) => (
            <div
              key={cmp.name}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur"
            >
              <div>
                <p className="font-semibold text-white">{cmp.name}</p>
                <p className="text-xs text-slate-400">{cmp.desc}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {c.allOk}
              </span>
            </div>
          ))}

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-display text-lg font-semibold text-white">
              {c.realtimeTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              {c.realtimeBody.split('hola@portalservices.digital')[0]}
              <a
                href="mailto:hola@portalservices.digital"
                className="text-cyan-300 hover:text-cyan-200"
              >
                hola@portalservices.digital
              </a>
              {c.realtimeBody.split('hola@portalservices.digital')[1]}
            </p>
          </div>

          <div className="pt-4">
            <Link
              href={`/${locale}`}
              className="text-sm text-cyan-300 hover:text-cyan-200"
            >
              ← {c.back}
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
