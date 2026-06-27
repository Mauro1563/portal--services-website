import Link from 'next/link';
import { ArrowRight, Sparkles, Building2, Users, UserRound } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 text-white">
      {/* Decorative radial glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-blue-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-400/10 blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top nav */}
        <nav className="flex items-center justify-between py-5 sm:py-6">
          <Link href="/" className="inline-flex items-center" aria-label="Portal Home">
            <Logo size="sm" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
          >
            Iniciar sesi&oacute;n
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </nav>

        {/* Hero content */}
        <div className="pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300">
              <Sparkles className="h-3 w-3" />
              Plataforma todo en uno
            </span>

            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Gestiona tu empresa de limpieza
              <span className="block bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-200 bg-clip-text text-transparent">
                sin papeles ni hojas de c&aacute;lculo.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base text-white/75 sm:text-lg">
              Reservas, equipos y cobros conectados en un mismo sitio. Tus operarios
              fichan, tus clientes reservan online y t&uacute; lo controlas todo desde
              un panel claro.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(37,99,235,0.45)] transition hover:from-blue-500 hover:to-blue-600"
              >
                Prueba gratis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                Iniciar sesi&oacute;n
              </Link>
            </div>

            <p className="mt-4 text-xs text-white/55">
              Sin tarjeta de cr&eacute;dito. Cancelas cuando quieras.
            </p>
          </div>

          {/* Three portal palette echoes */}
          <div className="mt-14 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-3 sm:gap-5">
            <PortalCard
              label="Owner"
              title="Panel de gesti&oacute;n"
              description="Reservas, equipos e ingresos en tiempo real."
              icon={<Building2 className="h-4 w-4" />}
              gradient="from-slate-900 via-slate-900 to-blue-900"
              ring="ring-blue-400/30"
              chip="text-cyan-300 border-cyan-300/30 bg-cyan-300/10"
            />
            <PortalCard
              label="Cleaner"
              title="App del operario"
              description="Agenda del d&iacute;a y ganancias al instante."
              icon={<Users className="h-4 w-4" />}
              gradient="from-emerald-600 via-emerald-700 to-slate-900"
              ring="ring-emerald-300/30"
              chip="text-emerald-200 border-emerald-300/30 bg-emerald-300/10"
            />
            <PortalCard
              label="Client"
              title="Reservas online"
              description="Tus clientes reservan en menos de un minuto."
              icon={<UserRound className="h-4 w-4" />}
              gradient="from-sky-500 via-blue-600 to-blue-700"
              ring="ring-sky-300/30"
              chip="text-sky-100 border-sky-200/40 bg-sky-200/10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function PortalCard({
  label,
  title,
  description,
  icon,
  gradient,
  ring,
  chip,
}: {
  label: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  ring: string;
  chip: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 ring-1 ${ring} shadow-[0_8px_24px_rgba(2,6,23,0.35)]`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"
      />
      <div className="relative flex items-start justify-between">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.22em] ${chip}`}
        >
          {label}
        </span>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white ring-1 ring-white/20">
          {icon}
        </span>
      </div>
      <div className="relative mt-10">
        <p className="font-display text-base font-semibold text-white">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-white/70">{description}</p>
      </div>
    </div>
  );
}
