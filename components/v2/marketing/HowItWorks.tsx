import { ArrowRight } from 'lucide-react';

const STEPS = [
  {
    n: '01',
    title: 'Da de alta a tu equipo en minutos',
    desc: 'Carga tus empleados, edificios y clientes con un CSV o desde el panel. Cada operativo recibe un PIN de 6 dígitos para entrar al portal — sin contraseñas, sin instalar nada.',
  },
  {
    n: '02',
    title: 'El operativo trabaja desde el móvil',
    desc: 'Check-in con GPS al llegar al edificio, parte diario con fotos, comunicación con el supervisor. Todo en tiempo real, también sin conexión.',
  },
  {
    n: '03',
    title: 'Tú ves todo desde un solo lugar',
    desc: 'Asistencias, calidad, incidencias, partes y clientes — un dashboard único en el portal manager o director. Si algo no va bien, te enteras al instante.',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700">
            Cómo funciona
          </span>
          <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.02em] text-slate-950 sm:text-4xl lg:text-5xl">
            De WhatsApp + Excel a tiempo real,{' '}
            <span className="bg-gradient-to-br from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              en una tarde.
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            No necesitas instalar nada, no necesitas formación, no necesitas un IT.
            Tres pasos y estás operando.
          </p>
        </header>

        <ol className="mt-14 grid gap-5 sm:grid-cols-3">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="relative flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="font-display text-4xl font-semibold tracking-tight text-slate-300">
                {s.n}
              </span>
              <h3 className="font-display text-lg font-semibold tracking-tight text-slate-950">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">{s.desc}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 text-center">
          <a
            href="#cta"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-6 text-sm font-semibold text-white shadow-[0_12px_30px_-10px_rgba(37,99,235,0.55)] transition hover:brightness-110"
          >
            Empezar prueba gratis
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
