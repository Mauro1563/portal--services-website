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
    eyebrow: 'testimonios',
    heading: 'Equipos que confían en nosotros',
    sub: 'Operadores y propietarios que han transformado su negocio con nuestra plataforma.',
    worksWith: 'trabajamos con',
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
    eyebrow: 'testimonials',
    heading: 'Teams that trust us',
    sub: 'Operators and property owners who have transformed their business with our platform.',
    worksWith: 'we work with',
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
    eyebrow: 'testemunhos',
    heading: 'Equipas que confiam em nós',
    sub: 'Operadores e proprietários que transformaram o seu negócio com a nossa plataforma.',
    worksWith: 'trabalhamos com',
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

const SERIF = "'Instrument Serif', Georgia, serif";
const MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

export default async function TestimonialsSection() {
  const locale = await getLocale();
  const t = COPY[locale];
  return (
    <section className="relative bg-[#F4EFE6] ps-paper-grain py-24 md:py-40">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <div className="mx-auto max-w-2xl">
          <p className="text-[12px] text-[#141414]" style={{ fontFamily: MONO }}>
            <span
              className="pb-1"
              style={{
                backgroundImage: 'linear-gradient(#FF5B1F, #FF5B1F)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 1px',
                backgroundPosition: '0 calc(100% + 4px)',
              }}
            >
              {t.eyebrow}
            </span>
          </p>
          <h2
            className="mt-6 text-[32px] leading-[0.95] tracking-[-0.03em] text-[#141414] md:text-[64px]"
            style={{ fontFamily: SERIF, fontWeight: 400 }}
          >
            {t.heading}
          </h2>
          <p className="mt-6 max-w-[62ch] text-[18px] leading-[1.45] text-[#54524D] md:text-[22px]">
            {t.sub}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:mt-24 md:grid-cols-3 md:gap-8">
          {t.testimonials.map((item, idx) => (
            <article
              key={item.name}
              className={`relative ${idx === 0 ? 'flex' : 'hidden sm:flex'} flex-col rounded-[12px] border border-[#1414141A] bg-[#E4DACA] p-10 md:p-14`}
            >
              {/* Single mandarin opening quote — set, not iconified */}
              <span
                aria-hidden
                className="text-[64px] leading-[0.4] text-[#FF5B1F] md:text-[88px]"
                style={{ fontFamily: SERIF, fontWeight: 400 }}
              >
                &ldquo;
              </span>
              <blockquote
                className="mt-6 flex-1 text-[20px] leading-[1.35] tracking-[-0.01em] text-[#141414] md:text-[24px]"
                style={{ fontFamily: SERIF, fontWeight: 400 }}
              >
                {item.quote}
              </blockquote>
              <div className="mt-10 flex items-center gap-3 border-t border-[#1414141A] pt-6">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#141414] text-[12px] text-[#F4EFE6]"
                  style={{ fontFamily: MONO }}
                  aria-hidden="true"
                >
                  {item.initials}
                </div>
                <div>
                  <p className="text-[15px] text-[#141414]">{item.name}</p>
                  <p className="text-[12px] text-[#54524D]" style={{ fontFamily: MONO }}>
                    {item.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 md:mt-24">
          <p className="text-[12px] text-[#54524D]" style={{ fontFamily: MONO }}>
            <span
              className="pb-1"
              style={{
                backgroundImage: 'linear-gradient(#FF5B1F, #FF5B1F)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 1px',
                backgroundPosition: '0 calc(100% + 4px)',
              }}
            >
              {t.worksWith}
            </span>
          </p>
          <ul className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
            {COMPANIES.map((name, idx) => (
              <li key={name} className={idx >= 3 ? 'hidden sm:block' : undefined}>
                <span
                  className="text-[20px] tracking-[-0.01em] text-[#141414] md:text-[24px]"
                  style={{ fontFamily: SERIF, fontWeight: 400 }}
                >
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
