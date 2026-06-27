import {
  HelpCircle,
  ChevronDown,
  Wallet,
  Building2,
  Languages,
  Smartphone,
  ShieldCheck,
  LifeBuoy,
} from 'lucide-react';
import { getLocale, type Locale } from '@/lib/i18n';

type Faq = {
  icon: typeof HelpCircle;
  question: string;
  answer: string;
  accent: string;
  ring: string;
};

/**
 * Per-locale copy. Kept inline here so the marketing landing stays
 * self-contained and we don't have to seed messages JSON for every tweak.
 * Add a key here when adding new copy; the type catches missing locales.
 */
type FaqCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  faqs: Array<Omit<Faq, 'icon' | 'accent' | 'ring'>>;
  footerEyebrow: string;
  footerTitle: string;
  footerSub: string;
  footerCta: string;
};

const FAQ_STYLES: Array<Pick<Faq, 'icon' | 'accent' | 'ring'>> = [
  {
    icon: Wallet,
    accent: 'from-blue-500 to-blue-700',
    ring: 'ring-blue-100',
  },
  {
    icon: Building2,
    accent: 'from-cyan-500 to-blue-600',
    ring: 'ring-cyan-100',
  },
  {
    icon: Languages,
    accent: 'from-violet-500 to-blue-600',
    ring: 'ring-violet-100',
  },
  {
    icon: Smartphone,
    accent: 'from-emerald-500 to-emerald-700',
    ring: 'ring-emerald-100',
  },
  {
    icon: ShieldCheck,
    accent: 'from-amber-500 to-orange-600',
    ring: 'ring-amber-100',
  },
  {
    icon: LifeBuoy,
    accent: 'from-rose-500 to-pink-600',
    ring: 'ring-rose-100',
  },
];

const COPY: Record<Locale, FaqCopy> = {
  es: {
    eyebrow: 'FAQ',
    title: 'Preguntas frecuentes',
    intro:
      '¿No encuentras lo que buscas? Escríbenos y te respondemos en menos de 2 horas.',
    faqs: [
      {
        question: '¿Cómo funcionan los precios y la prueba gratuita?',
        answer:
          'Ofrecemos 14 días de prueba gratuita sin tarjeta de crédito en todos los planes. Después puedes elegir entre los planes Starter, Pro o Enterprise, con facturación mensual o anual (dos meses gratis al pagar el año). Puedes cambiar de plan o cancelar en cualquier momento desde el panel del propietario.',
      },
      {
        question: '¿Puedo gestionar varios negocios o sedes desde una sola cuenta?',
        answer:
          'Sí. Nuestra arquitectura multi-tenant te permite administrar varias sedes, marcas o equipos desde el mismo portal del propietario. Cada sede tiene su propia agenda, personal y reportes, mientras tú mantienes una vista consolidada de ingresos, reservas y métricas en tiempo real.',
      },
      {
        question: '¿La plataforma está disponible en varios idiomas?',
        answer:
          'Actualmente soportamos español, inglés, francés, portugués e italiano, tanto en los portales internos como en el marketplace para clientes finales. La detección de idioma es automática según el navegador y cada usuario puede cambiarlo desde su perfil en cualquier momento.',
      },
      {
        question: '¿Puedo usar el portal desde el móvil?',
        answer:
          'Totalmente. Todos los portales (propietario, operativo y cliente) son mobile-first y funcionan en cualquier navegador moderno. Además, ofrecemos apps nativas para iOS y Android construidas con Capacitor, con notificaciones push, modo offline y acceso biométrico.',
      },
      {
        question: '¿Cómo protegéis nuestros datos y cumplís el RGPD?',
        answer:
          'Cumplimos íntegramente con el RGPD europeo. Los datos se alojan en servidores en la UE, cifrados en tránsito (TLS 1.3) y en reposo (AES-256). Realizamos copias de seguridad diarias, auditorías de seguridad anuales y firmamos DPA con todos nuestros clientes. Estamos en proceso de certificación ISO 27001.',
      },
      {
        question: '¿Qué tiempos de respuesta ofrece el soporte?',
        answer:
          'Nuestro equipo de soporte responde por chat y email en menos de 2 horas en horario laboral (L-V 9-19h CET). Los planes Pro incluyen soporte prioritario con respuesta en menos de 1 hora, y Enterprise dispone de un Customer Success Manager dedicado y SLA garantizado de 30 minutos 24/7.',
      },
    ],
    footerEyebrow: '¿Más preguntas?',
    footerTitle: 'Habla con nuestro equipo',
    footerSub:
      'Resolvemos cualquier duda sobre planes, integraciones o migración desde otra plataforma.',
    footerCta: 'Contactar con soporte',
  },
  en: {
    eyebrow: 'FAQ',
    title: 'Frequently asked questions',
    intro:
      "Everything you need to know before getting started. Can't find what you're looking for? Drop us a line and we'll reply in under 2 hours.",
    faqs: [
      {
        question: 'How does pricing and the free trial work?',
        answer:
          'We offer a 14-day free trial with no credit card required on every plan. After that you can pick Starter, Pro or Enterprise, billed monthly or annually (two months free when you pay yearly). You can switch plans or cancel anytime from the owner dashboard.',
      },
      {
        question: 'Can I manage multiple businesses or locations from one account?',
        answer:
          'Yes. Our multi-tenant architecture lets you run several locations, brands or teams from the same owner portal. Each location has its own schedule, staff and reports, while you keep a consolidated view of revenue, bookings and real-time metrics.',
      },
      {
        question: 'Is the platform available in multiple languages?',
        answer:
          'We currently support Spanish, English, French, Portuguese and Italian across the internal portals and the customer-facing marketplace. Language is auto-detected from the browser, and every user can change it from their profile at any time.',
      },
      {
        question: 'Can I use the portal on mobile?',
        answer:
          'Absolutely. Every portal (owner, operative and customer) is mobile-first and works in any modern browser. We also ship native iOS and Android apps built with Capacitor, with push notifications, offline mode and biometric login.',
      },
      {
        question: 'How do you protect our data and comply with GDPR?',
        answer:
          "We're fully GDPR-compliant. Data is hosted on EU servers, encrypted in transit (TLS 1.3) and at rest (AES-256). We run daily backups, annual security audits and sign a DPA with every customer. We're currently in the ISO 27001 certification process.",
      },
      {
        question: 'What response times does support offer?',
        answer:
          'Our support team replies via chat and email in under 2 hours during business hours (Mon–Fri 9am–7pm CET). Pro plans get priority support with under 1-hour responses, and Enterprise customers get a dedicated Customer Success Manager and a guaranteed 30-minute SLA, 24/7.',
      },
    ],
    footerEyebrow: 'More questions?',
    footerTitle: 'Talk to our team',
    footerSub:
      'We answer anything about plans, integrations or migrating from another platform.',
    footerCta: 'Contact support',
  },
  pt: {
    eyebrow: 'FAQ',
    title: 'Perguntas frequentes',
    intro:
      'Tudo o que precisa saber antes de começar. Não encontra o que procura? Escreva-nos e respondemos em menos de 2 horas.',
    faqs: [
      {
        question: 'Como funcionam os preços e o teste gratuito?',
        answer:
          'Oferecemos 14 dias de teste gratuito sem cartão de crédito em todos os planos. Depois pode escolher entre os planos Starter, Pro ou Enterprise, com faturação mensal ou anual (dois meses grátis no pagamento anual). Pode mudar de plano ou cancelar quando quiser a partir do painel do dono.',
      },
      {
        question: 'Posso gerir vários negócios ou sedes a partir de uma só conta?',
        answer:
          'Sim. A nossa arquitetura multi-tenant permite gerir várias sedes, marcas ou equipas a partir do mesmo portal do dono. Cada sede tem a sua própria agenda, pessoal e relatórios, enquanto mantém uma vista consolidada da receita, reservas e métricas em tempo real.',
      },
      {
        question: 'A plataforma está disponível em vários idiomas?',
        answer:
          'Atualmente suportamos espanhol, inglês, francês, português e italiano, tanto nos portais internos como no marketplace para clientes finais. A deteção do idioma é automática conforme o navegador e cada utilizador pode alterá-lo a partir do seu perfil quando quiser.',
      },
      {
        question: 'Posso usar o portal no telemóvel?',
        answer:
          'Totalmente. Todos os portais (dono, operativo e cliente) são mobile-first e funcionam em qualquer navegador moderno. Além disso, oferecemos apps nativas para iOS e Android construídas com Capacitor, com notificações push, modo offline e acesso biométrico.',
      },
      {
        question: 'Como protegem os nossos dados e cumprem o RGPD?',
        answer:
          'Cumprimos integralmente o RGPD europeu. Os dados são alojados em servidores na UE, cifrados em trânsito (TLS 1.3) e em repouso (AES-256). Fazemos cópias de segurança diárias, auditorias de segurança anuais e assinamos DPA com todos os clientes. Estamos em processo de certificação ISO 27001.',
      },
      {
        question: 'Que tempos de resposta oferece o suporte?',
        answer:
          'A nossa equipa de suporte responde por chat e email em menos de 2 horas em horário laboral (Seg–Sex 9h–19h CET). Os planos Pro incluem suporte prioritário com resposta em menos de 1 hora, e o Enterprise dispõe de um Customer Success Manager dedicado e SLA garantido de 30 minutos 24/7.',
      },
    ],
    footerEyebrow: 'Mais perguntas?',
    footerTitle: 'Fale com a nossa equipa',
    footerSub:
      'Esclarecemos qualquer dúvida sobre planos, integrações ou migração de outra plataforma.',
    footerCta: 'Contactar o suporte',
  },
};

export default async function FaqSection() {
  const locale = await getLocale();
  const t = COPY[locale];
  const faqs: Faq[] = t.faqs.map((entry, i) => ({
    ...entry,
    ...FAQ_STYLES[i % FAQ_STYLES.length],
  }));

  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 sm:py-28">
      {/* Decorative blue/sky wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-100 via-sky-100 to-cyan-100 opacity-60 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 ring-1 ring-blue-100 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <HelpCircle className="h-3 w-3 text-blue-700" aria-hidden />
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-700">
              {t.eyebrow}
            </span>
          </div>
          <h2 className="font-display mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {t.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            {t.intro}
          </p>
        </div>

        {/* FAQ list */}
        <ul className="mt-12 space-y-3 sm:space-y-4">
          {faqs.map((faq) => {
            const Icon = faq.icon;
            return (
              <li key={faq.question}>
                <details className="group rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition open:shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
                  <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-5 sm:px-6 sm:py-6 [&::-webkit-details-marker]:hidden">
                    <span
                      className={`inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${faq.accent} text-white shadow-[0_4px_12px_rgba(37,99,235,0.18)] ring-4 ${faq.ring}`}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="flex-1 text-left text-base font-semibold text-slate-900 sm:text-lg">
                      {faq.question}
                    </span>
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-open:bg-blue-600 group-open:text-white">
                      <ChevronDown
                        className="h-4 w-4 transition-transform duration-200 group-open:rotate-180"
                        aria-hidden
                      />
                    </span>
                  </summary>
                  <div className="px-5 pb-6 sm:px-6 sm:pb-7">
                    <div className="ml-14 border-l-2 border-slate-100 pl-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                      {faq.answer}
                    </div>
                  </div>
                </details>
              </li>
            );
          })}
        </ul>

        {/* Footer CTA */}
        <div className="mt-12 rounded-3xl bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 px-6 py-8 text-center ring-1 ring-blue-100 sm:px-10 sm:py-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-700">
            {t.footerEyebrow}
          </p>
          <h3 className="font-display mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
            {t.footerTitle}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            {t.footerSub}
          </p>
          <a
            href="mailto:hola@portalservices.digital"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)] transition hover:from-blue-700 hover:to-blue-800"
          >
            {t.footerCta}
          </a>
        </div>
      </div>
    </section>
  );
}
