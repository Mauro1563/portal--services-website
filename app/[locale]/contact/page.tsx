import Link from 'next/link';
import { Mail, MessageCircle, Clock } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { type Locale } from '@/lib/i18n';

type Copy = {
  eyebrow: string;
  title: string;
  lead: string;
  emailTitle: string;
  emailBody: string;
  responseTitle: string;
  responseBody: string;
  salesTitle: string;
  salesBody: string;
  cta: string;
};

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: 'Contact',
    title: "Talk to a human",
    lead: "We read every message ourselves — no ticket queues, no chatbots first.",
    emailTitle: 'Email',
    emailBody:
      'The fastest way to reach us. Tell us what you are trying to do and a quick note about your team.',
    responseTitle: 'Response time',
    responseBody:
      'Weekdays, replies usually arrive within a few hours (CET). Weekends, allow a little longer.',
    salesTitle: 'Demo or onboarding',
    salesBody:
      'Want a guided walkthrough or help migrating from another tool? Mention it in your email and we will book a call.',
    cta: 'Sign up',
  },
  es: {
    eyebrow: 'Contacto',
    title: 'Habla con una persona',
    lead: 'Leemos cada mensaje en persona — sin colas de tickets ni chatbots de por medio.',
    emailTitle: 'Email',
    emailBody:
      'La forma más rápida de contactarnos. Cuéntanos qué necesitas y unas líneas sobre tu equipo.',
    responseTitle: 'Tiempo de respuesta',
    responseBody:
      'Entre semana respondemos normalmente en pocas horas (CET). Los fines de semana, un poco más.',
    salesTitle: 'Demo u onboarding',
    salesBody:
      '¿Quieres una demo guiada o ayuda para migrar desde otra herramienta? Indícalo en tu correo y agendamos una llamada.',
    cta: 'Regístrate',
  },
  pt: {
    eyebrow: 'Contacto',
    title: 'Fala com uma pessoa',
    lead: 'Lemos cada mensagem pessoalmente — sem filas de tickets nem chatbots à frente.',
    emailTitle: 'Email',
    emailBody:
      'A forma mais rápida de nos contactar. Conta-nos o que precisas e umas linhas sobre a tua equipa.',
    responseTitle: 'Tempo de resposta',
    responseBody:
      'Durante a semana respondemos normalmente em poucas horas (CET). Aos fins de semana, um pouco mais.',
    salesTitle: 'Demo ou onboarding',
    salesBody:
      'Queres uma demo guiada ou ajuda para migrar de outra ferramenta? Diz-nos no email e marcamos uma chamada.',
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

export default async function ContactPage({
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
          <Card icon={<Mail className="h-5 w-5 text-cyan-300" />} title={c.emailTitle}>
            <a
              href="mailto:hola@portalservices.digital"
              className="text-cyan-300 hover:text-cyan-200"
            >
              hola@portalservices.digital
            </a>
            <p className="mt-2 text-sm text-slate-400">{c.emailBody}</p>
          </Card>
          <Card icon={<Clock className="h-5 w-5 text-cyan-300" />} title={c.responseTitle}>
            <p className="text-sm text-slate-400">{c.responseBody}</p>
          </Card>
          <Card
            icon={<MessageCircle className="h-5 w-5 text-cyan-300" />}
            title={c.salesTitle}
          >
            <p className="text-sm text-slate-400">{c.salesBody}</p>
          </Card>

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

function Card({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex items-center gap-3">
        {icon}
        <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="mt-3 text-slate-300">{children}</div>
    </div>
  );
}
