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

type Faq = {
  icon: typeof HelpCircle;
  question: string;
  answer: string;
  accent: string;
  ring: string;
};

const FAQS: Faq[] = [
  {
    icon: Wallet,
    question: '¿Cómo funcionan los precios y la prueba gratuita?',
    answer:
      'Ofrecemos 14 días de prueba gratuita sin tarjeta de crédito en todos los planes. Después puedes elegir entre los planes Starter, Pro o Enterprise, con facturación mensual o anual (dos meses gratis al pagar el año). Puedes cambiar de plan o cancelar en cualquier momento desde el panel del propietario.',
    accent: 'from-blue-500 to-blue-700',
    ring: 'ring-blue-100',
  },
  {
    icon: Building2,
    question: '¿Puedo gestionar varios negocios o sedes desde una sola cuenta?',
    answer:
      'Sí. Nuestra arquitectura multi-tenant te permite administrar varias sedes, marcas o equipos desde el mismo portal del propietario. Cada sede tiene su propia agenda, personal y reportes, mientras tú mantienes una vista consolidada de ingresos, reservas y métricas en tiempo real.',
    accent: 'from-cyan-500 to-blue-600',
    ring: 'ring-cyan-100',
  },
  {
    icon: Languages,
    question: '¿La plataforma está disponible en varios idiomas?',
    answer:
      'Actualmente soportamos español, inglés, francés, portugués e italiano, tanto en los portales internos como en el marketplace para clientes finales. La detección de idioma es automática según el navegador y cada usuario puede cambiarlo desde su perfil en cualquier momento.',
    accent: 'from-violet-500 to-blue-600',
    ring: 'ring-violet-100',
  },
  {
    icon: Smartphone,
    question: '¿Puedo usar el portal desde el móvil?',
    answer:
      'Totalmente. Todos los portales (propietario, operativo y cliente) son mobile-first y funcionan en cualquier navegador moderno. Además, ofrecemos apps nativas para iOS y Android construidas con Capacitor, con notificaciones push, modo offline y acceso biométrico.',
    accent: 'from-emerald-500 to-emerald-700',
    ring: 'ring-emerald-100',
  },
  {
    icon: ShieldCheck,
    question: '¿Cómo protegéis nuestros datos y cumplís el RGPD?',
    answer:
      'Cumplimos íntegramente con el RGPD europeo. Los datos se alojan en servidores en la UE, cifrados en tránsito (TLS 1.3) y en reposo (AES-256). Realizamos copias de seguridad diarias, auditorías de seguridad anuales y firmamos DPA con todos nuestros clientes. Estamos en proceso de certificación ISO 27001.',
    accent: 'from-amber-500 to-orange-600',
    ring: 'ring-amber-100',
  },
  {
    icon: LifeBuoy,
    question: '¿Qué tiempos de respuesta ofrece el soporte?',
    answer:
      'Nuestro equipo de soporte responde por chat y email en menos de 2 horas en horario laboral (L-V 9-19h CET). Los planes Pro incluyen soporte prioritario con respuesta en menos de 1 hora, y Enterprise dispone de un Customer Success Manager dedicado y SLA garantizado de 30 minutos 24/7.',
    accent: 'from-rose-500 to-pink-600',
    ring: 'ring-rose-100',
  },
];

export default function FaqSection() {
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
              FAQ
            </span>
          </div>
          <h2 className="font-display mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Preguntas frecuentes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            Todo lo que necesitas saber antes de empezar. ¿No encuentras lo que buscas?
            Escríbenos y te respondemos en menos de 2 horas.
          </p>
        </div>

        {/* FAQ list */}
        <ul className="mt-12 space-y-3 sm:space-y-4">
          {FAQS.map((faq) => {
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
            ¿Más preguntas?
          </p>
          <h3 className="font-display mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
            Habla con nuestro equipo
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            Resolvemos cualquier duda sobre planes, integraciones o migración desde
            otra plataforma.
          </p>
          <a
            href="mailto:hola@portal.app"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)] transition hover:from-blue-700 hover:to-blue-800"
          >
            Contactar con soporte
          </a>
        </div>
      </div>
    </section>
  );
}
