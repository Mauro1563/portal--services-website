import Link from 'next/link';
import { Users, Heart } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { type Locale } from '@/lib/i18n';

type Copy = {
  eyebrow: string;
  title: string;
  lead: string;
  status: string;
  statusBody: string;
  valuesTitle: string;
  values: string[];
  introduceTitle: string;
  introduceBody: string;
  cta: string;
  back: string;
};

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: 'Careers',
    title: "We're a small team",
    lead: 'Zapli is built by a handful of people who care a lot about the craft. We are not hiring at the moment.',
    status: 'Current openings',
    statusBody:
      'No openings right now. If that changes, this page will be the first to know.',
    valuesTitle: 'How we work',
    values: [
      'Ship small, talk to users every week.',
      'Write boring, robust software — operations cannot tolerate flakiness.',
      'Remote by default, with quarterly meet-ups in Europe.',
    ],
    introduceTitle: 'Want to introduce yourself anyway?',
    introduceBody:
      'If you would love to work on this kind of product — operations, mobile-first, real-world workflows — drop us a line. We keep a list and reach out when we open roles.',
    cta: 'Email us',
    back: 'Back',
  },
  es: {
    eyebrow: 'Carreras',
    title: 'Somos un equipo pequeño',
    lead: 'Zapli lo construye un puñado de personas que cuidan mucho el oficio. Ahora mismo no estamos contratando.',
    status: 'Ofertas abiertas',
    statusBody:
      'No hay vacantes ahora mismo. Si eso cambia, esta página será la primera en enterarse.',
    valuesTitle: 'Cómo trabajamos',
    values: [
      'Iteramos en pequeño y hablamos con usuarios cada semana.',
      'Escribimos software aburrido y robusto — operaciones no tolera fallos.',
      'En remoto por defecto, con encuentros trimestrales en Europa.',
    ],
    introduceTitle: '¿Quieres presentarte igualmente?',
    introduceBody:
      'Si te encantaría trabajar en este tipo de producto — operaciones, mobile-first, flujos del mundo real — escríbenos. Guardamos una lista y contactamos cuando abrimos posiciones.',
    cta: 'Escríbenos',
    back: 'Volver',
  },
  pt: {
    eyebrow: 'Carreiras',
    title: 'Somos uma equipa pequena',
    lead: 'O Zapli é construído por um punhado de pessoas que se preocupam muito com o ofício. De momento não estamos a contratar.',
    status: 'Vagas abertas',
    statusBody:
      'Não há vagas neste momento. Se isso mudar, esta página será a primeira a saber.',
    valuesTitle: 'Como trabalhamos',
    values: [
      'Iteramos em pequeno e falamos com utilizadores todas as semanas.',
      'Escrevemos software aborrecido e robusto — operações não tolera falhas.',
      'Remoto por defeito, com encontros trimestrais na Europa.',
    ],
    introduceTitle: 'Queres apresentar-te à mesma?',
    introduceBody:
      'Se adorarias trabalhar neste tipo de produto — operações, mobile-first, fluxos do mundo real — escreve-nos. Guardamos uma lista e contactamos quando abrimos vagas.',
    cta: 'Escreve-nos',
    back: 'Voltar',
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

export default async function CareersPage({
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
        <div className="mx-auto max-w-3xl space-y-8 px-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-cyan-300" />
              <h2 className="font-display text-lg font-semibold text-white">
                {c.status}
              </h2>
            </div>
            <p className="mt-3 text-sm text-slate-300">{c.statusBody}</p>
          </div>

          <section>
            <h2 className="font-display text-2xl font-semibold text-white">
              {c.valuesTitle}
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {c.values.map((v) => (
                <li
                  key={v}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  {v}
                </li>
              ))}
            </ul>
          </section>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-cyan-300" />
              <h2 className="font-display text-lg font-semibold text-white">
                {c.introduceTitle}
              </h2>
            </div>
            <p className="mt-3 text-sm text-slate-300">{c.introduceBody}</p>
            <a
              href="mailto:hola@portalservices.digital"
              className="mt-4 inline-flex items-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-400 hover:to-cyan-400"
            >
              {c.cta}
            </a>
          </div>

          <div className="pt-2">
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
