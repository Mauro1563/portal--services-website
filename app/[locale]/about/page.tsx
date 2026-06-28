import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { type Locale } from '@/lib/i18n';

type Copy = {
  eyebrow: string;
  title: string;
  lead: string;
  storyTitle: string;
  story: string;
  missionTitle: string;
  mission: string;
  forWhomTitle: string;
  forWhom: string;
  cta: string;
};

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: 'About',
    title: 'Built for the people who keep buildings working',
    lead: 'Zapli is the operations platform we wished existed when we managed cleaning rounds ourselves.',
    storyTitle: 'Our story',
    story:
      'We started Zapli after watching small cleaning teams juggle WhatsApp groups, paper checklists and spreadsheets. The work is hard enough without the tooling getting in the way — so we set out to build something that feels modern, calm and genuinely useful on a phone in the field.',
    missionTitle: 'Mission',
    mission:
      'Give independent cleaning, facilities and property-management teams the same operational quality the biggest brands enjoy — without a six-figure software budget.',
    forWhomTitle: 'Who it is for',
    forWhom:
      'Owner-operators with one site, growing teams with twenty cleaners, and property managers coordinating dozens of homes. If you schedule cleans, send invoices and want proof the job was done well, Zapli is for you.',
    cta: 'Sign up',
  },
  es: {
    eyebrow: 'Sobre nosotros',
    title: 'Hecho para quienes mantienen los edificios en marcha',
    lead: 'Zapli es la plataforma operativa que nos habría gustado tener cuando gestionábamos rondas de limpieza nosotros mismos.',
    storyTitle: 'Nuestra historia',
    story:
      'Empezamos Zapli tras ver a pequeños equipos de limpieza haciendo malabares con grupos de WhatsApp, listas en papel y hojas de cálculo. El trabajo ya es duro como para que las herramientas estorben — así que decidimos crear algo moderno, tranquilo y realmente útil en el móvil sobre el terreno.',
    missionTitle: 'Misión',
    mission:
      'Dar a equipos independientes de limpieza, facility y property management la misma calidad operativa que las grandes marcas — sin un presupuesto de software de seis cifras.',
    forWhomTitle: 'Para quién es',
    forWhom:
      'Autónomos con un solo local, equipos en crecimiento con veinte limpiadoras y property managers que coordinan decenas de viviendas. Si planificas limpiezas, emites facturas y quieres pruebas de que el trabajo se hizo bien, Zapli es para ti.',
    cta: 'Regístrate',
  },
  pt: {
    eyebrow: 'Sobre nós',
    title: 'Feito para quem mantém os edifícios a funcionar',
    lead: 'Zapli é a plataforma operacional que gostávamos de ter quando geríamos rondas de limpeza nós próprios.',
    storyTitle: 'A nossa história',
    story:
      'Começámos o Zapli depois de vermos pequenas equipas de limpeza a fazer malabarismos com grupos de WhatsApp, listas em papel e folhas de cálculo. O trabalho já é difícil sem as ferramentas atrapalharem — por isso decidimos criar algo moderno, calmo e genuinamente útil no telemóvel, em campo.',
    missionTitle: 'Missão',
    mission:
      'Dar a equipas independentes de limpeza, facility e property management a mesma qualidade operacional que as grandes marcas — sem um orçamento de software de seis dígitos.',
    forWhomTitle: 'Para quem é',
    forWhom:
      'Operadores com um único local, equipas em crescimento com vinte limpadoras e property managers que coordenam dezenas de casas. Se agendas limpezas, emites faturas e queres prova de que o trabalho foi bem feito, o Zapli é para ti.',
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

export default async function AboutPage({
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
        <div className="mx-auto max-w-3xl space-y-10 px-6 text-slate-300">
          <Section title={c.storyTitle}>{c.story}</Section>
          <Section title={c.missionTitle}>{c.mission}</Section>
          <Section title={c.forWhomTitle}>{c.forWhom}</Section>

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed">{children}</p>
    </section>
  );
}
