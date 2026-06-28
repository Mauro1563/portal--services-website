import Link from 'next/link';
import { Quote } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { type Locale } from '@/lib/i18n';

type Story = { quote: string; name: string; role: string };
type Copy = {
  eyebrow: string;
  title: string;
  lead: string;
  segmentsTitle: string;
  segments: string[];
  storiesTitle: string;
  stories: Story[];
  cta: string;
};

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: 'Customers',
    title: 'Trusted by cleaning teams across Europe',
    lead: 'From single-operator businesses to multi-site facilities companies, Zapli runs the day-to-day for teams who care about quality.',
    segmentsTitle: 'Who uses Zapli',
    segments: [
      'Independent cleaning companies coordinating recurring contracts.',
      'Short-stay and holiday-rental managers turning over flats between guests.',
      'Facility teams keeping offices, gyms and clinics on schedule.',
      'Property managers tracking maintenance across portfolios.',
    ],
    storiesTitle: 'What teams tell us',
    stories: [
      {
        quote:
          'We replaced three spreadsheets and a WhatsApp group with one app. Our cleaners actually use it.',
        name: 'Operations lead',
        role: 'Cleaning company, Spain',
      },
      {
        quote:
          'Photo evidence and GPS check-ins ended the "was it done?" arguments with clients.',
        name: 'Owner',
        role: 'Short-stay manager, Portugal',
      },
    ],
    cta: 'Sign up',
  },
  es: {
    eyebrow: 'Clientes',
    title: 'La confianza de equipos de limpieza por toda Europa',
    lead: 'Desde autónomos hasta empresas con varios centros, Zapli gestiona el día a día de equipos que cuidan la calidad.',
    segmentsTitle: 'Quién usa Zapli',
    segments: [
      'Empresas de limpieza independientes que coordinan contratos recurrentes.',
      'Gestores de alquiler vacacional que rotan pisos entre huéspedes.',
      'Equipos de facility que mantienen oficinas, gimnasios y clínicas al día.',
      'Property managers que controlan mantenimientos en sus carteras.',
    ],
    storiesTitle: 'Lo que nos cuentan',
    stories: [
      {
        quote:
          'Sustituimos tres Excel y un grupo de WhatsApp por una sola app. Nuestras limpiadoras de verdad la usan.',
        name: 'Responsable de operaciones',
        role: 'Empresa de limpieza, España',
      },
      {
        quote:
          'Las fotos y el fichaje con GPS acabaron con las discusiones de "¿se hizo o no?" con los clientes.',
        name: 'Propietaria',
        role: 'Gestora de alquiler vacacional, Portugal',
      },
    ],
    cta: 'Regístrate',
  },
  pt: {
    eyebrow: 'Clientes',
    title: 'A confiança de equipas de limpeza por toda a Europa',
    lead: 'De negócios individuais a empresas com vários locais, o Zapli gere o dia-a-dia de equipas que se preocupam com a qualidade.',
    segmentsTitle: 'Quem usa o Zapli',
    segments: [
      'Empresas de limpeza independentes que coordenam contratos recorrentes.',
      'Gestores de alojamento local que rodam apartamentos entre hóspedes.',
      'Equipas de facility que mantêm escritórios, ginásios e clínicas no prazo.',
      'Property managers que acompanham manutenções em vários imóveis.',
    ],
    storiesTitle: 'O que nos contam',
    stories: [
      {
        quote:
          'Substituímos três folhas de Excel e um grupo de WhatsApp por uma só app. As nossas limpadoras usam-na mesmo.',
        name: 'Responsável de operações',
        role: 'Empresa de limpeza, Espanha',
      },
      {
        quote:
          'As fotos e o check-in por GPS acabaram com a discussão de "foi feito?" com os clientes.',
        name: 'Proprietária',
        role: 'Gestora de alojamento local, Portugal',
      },
    ],
    cta: 'Registar',
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

export default async function CustomersPage({
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
        <div className="mx-auto max-w-3xl space-y-10 px-6">
          <section>
            <h2 className="font-display text-2xl font-semibold text-white">
              {c.segmentsTitle}
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {c.segments.map((s) => (
                <li
                  key={s}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  {s}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-white">
              {c.storiesTitle}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {c.stories.map((s) => (
                <figure
                  key={s.quote}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
                >
                  <Quote className="h-5 w-5 text-cyan-300" />
                  <blockquote className="mt-3 text-sm leading-relaxed text-slate-200">
                    &ldquo;{s.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 text-xs text-slate-400">
                    <span className="font-semibold text-slate-200">{s.name}</span> —{' '}
                    {s.role}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <div className="pt-4">
            <Link
              href="/signup"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-400 hover:to-cyan-400"
            >
              {c.cta}
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
