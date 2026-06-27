import { Quote } from "lucide-react";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  gradient: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Desde que usamos la plataforma, hemos duplicado las reservas y reducido las incidencias a casi cero. El portal del propietario es una maravilla.",
    name: "Laura Martín",
    role: "Directora de Operaciones, Cleaners UK",
    initials: "LM",
    gradient: "from-blue-600 to-cyan-500",
  },
  {
    quote:
      "Mis limpiadoras saben exactamente a dónde ir y qué hacer. La app es clarísima y los pagos llegan puntuales cada semana.",
    name: "Carlos Ruiz",
    role: "Fundador, AirHosts Madrid",
    initials: "CR",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    quote:
      "El marketplace nos ha conectado con clientes premium en cuestión de días. La experiencia de reserva es impecable.",
    name: "Sofía Navarro",
    role: "CEO, PristineHouse",
    initials: "SN",
    gradient: "from-violet-500 to-blue-600",
  },
];

const companies: string[] = [
  "Cleaners UK",
  "AirHosts Madrid",
  "PristineHouse",
  "BrillaCasa",
  "MadridClean",
];

export default function TestimonialsSection() {
  return (
    <section className="relative bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-700">
            Testimonios
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Equipos que confían en nosotros
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Operadores y propietarios que han transformado su negocio con
            nuestra plataforma.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <article
              key={t.name}
              className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-md sm:p-8"
            >
              <div
                className={`mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${t.gradient} text-white shadow-sm ring-2 ring-white`}
              >
                <Quote className="h-4 w-4" aria-hidden="true" />
              </div>
              <blockquote className="flex-1 text-[15px] leading-relaxed text-slate-700">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-sm font-bold text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)]`}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-slate-900">
                    {t.name}
                  </p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
            Trabajamos con
          </p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {companies.map((name) => (
              <li key={name}>
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ring-1 ring-blue-100/40 sm:text-sm">
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
