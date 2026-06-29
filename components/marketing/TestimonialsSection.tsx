import { Quote, Star } from 'lucide-react';
import { getLocale, type Locale } from '@/lib/i18n';

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

/**
 * Per-locale copy. Kept inline here so the marketing landing stays
 * self-contained and we don't have to seed messages JSON for every tweak.
 * Add a key here when adding new copy; the type catches missing locales.
 */
const COPY: Record<
  Locale,
  {
    eyebrow: string;
    heading: string;
    sub: string;
    worksWith: string;
    testimonials: Testimonial[];
  }
> = {
  es: {
    eyebrow: 'Testimonios',
    heading: 'Equipos que confían en nosotros',
    sub: 'Operadores y propietarios que han transformado su negocio con nuestra plataforma.',
    worksWith: 'Trabajamos con',
    testimonials: [
      {
        quote:
          'Desde que usamos la plataforma, hemos duplicado las reservas y reducido las incidencias a casi cero. El portal del propietario es una maravilla.',
        name: 'Laura Martín',
        role: 'Directora de Operaciones, Cleaners UK',
        initials: 'LM',
      },
      {
        quote:
          'Mis limpiadoras saben exactamente a dónde ir y qué hacer. La app es clarísima y los pagos llegan puntuales cada semana.',
        name: 'Carlos Ruiz',
        role: 'Fundador, AirHosts Madrid',
        initials: 'CR',
      },
      {
        quote:
          'El marketplace nos ha conectado con clientes premium en cuestión de días. La experiencia de reserva es impecable.',
        name: 'Sofía Navarro',
        role: 'CEO, PristineHouse',
        initials: 'SN',
      },
    ],
  },
  en: {
    eyebrow: 'Testimonials',
    heading: 'Teams that trust us',
    sub: 'Operators and property owners who have transformed their business with our platform.',
    worksWith: 'We work with',
    testimonials: [
      {
        quote:
          "Since we started using the platform, we've doubled our bookings and cut issues to almost zero. The owner portal is a game changer.",
        name: 'Laura Martín',
        role: 'Head of Operations, Cleaners UK',
        initials: 'LM',
      },
      {
        quote:
          'My cleaners know exactly where to go and what to do. The app is crystal clear and payments land on time every week.',
        name: 'Carlos Ruiz',
        role: 'Founder, AirHosts Madrid',
        initials: 'CR',
      },
      {
        quote:
          'The marketplace connected us with premium clients within days. The booking experience is flawless.',
        name: 'Sofía Navarro',
        role: 'CEO, PristineHouse',
        initials: 'SN',
      },
    ],
  },
  pt: {
    eyebrow: 'Testemunhos',
    heading: 'Equipas que confiam em nós',
    sub: 'Operadores e proprietários que transformaram o seu negócio com a nossa plataforma.',
    worksWith: 'Trabalhamos com',
    testimonials: [
      {
        quote:
          'Desde que usamos a plataforma, duplicámos as reservas e reduzimos os incidentes a quase zero. O portal do proprietário é fantástico.',
        name: 'Laura Martín',
        role: 'Diretora de Operações, Cleaners UK',
        initials: 'LM',
      },
      {
        quote:
          'As minhas limpadoras sabem exatamente para onde ir e o que fazer. A app é clara e os pagamentos chegam a tempo todas as semanas.',
        name: 'Carlos Ruiz',
        role: 'Fundador, AirHosts Madrid',
        initials: 'CR',
      },
      {
        quote:
          'O marketplace ligou-nos a clientes premium em poucos dias. A experiência de reserva é impecável.',
        name: 'Sofía Navarro',
        role: 'CEO, PristineHouse',
        initials: 'SN',
      },
    ],
  },
};

const COMPANIES: string[] = [
  'Cleaners UK',
  'AirHosts Madrid',
  'PristineHouse',
  'BrillaCasa',
  'MadridClean',
];

export default async function TestimonialsSection() {
  const locale = await getLocale();
  const t = COPY[locale];
  return (
    <section className="relative bg-white py-12 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-700">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00D8C7]" aria-hidden="true" />
            {t.eyebrow}
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {t.heading}
          </h2>
          <p className="mt-4 text-base text-slate-600">{t.sub}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-3">
          {t.testimonials.map((item, idx) => (
            <article
              key={item.name}
              className={`relative ${idx === 0 ? 'flex' : 'hidden sm:flex'} flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-md sm:p-8`}
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-900 sm:mb-5">
                <Quote className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="mb-3 flex items-center gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4 sm:mt-6 sm:pt-5">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-900 ring-2 ring-slate-200"
                  aria-hidden="true"
                >
                  {item.initials}
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-slate-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500">{item.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 sm:mt-16">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
            {t.worksWith}
          </p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {COMPANIES.map((name, idx) => (
              <li key={name} className={idx >= 3 ? 'hidden sm:block' : undefined}>
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:text-sm">
                  {name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
