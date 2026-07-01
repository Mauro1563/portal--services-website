import Link from 'next/link';
import {
  ArrowLeft,
  Home,
  LogIn,
  Search,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from 'lucide-react';

export const metadata = {
  title: 'Página no encontrada · Portal Services Digital',
  robots: { index: false, follow: false },
};

const shortcuts = [
  { href: '/', label: 'Inicio', desc: 'Sitio público', Icon: Home },
  { href: '/login', label: 'Acceso', desc: 'Email + password', Icon: LogIn },
  { href: '/signup', label: 'Crear cuenta', desc: 'Registrarte como dueño', Icon: UserPlus },
  { href: '/hq/login', label: 'HQ Admin', desc: 'Panel administrativo', Icon: ShieldCheck },
];

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/60 px-5 py-10">
      {/* Brand orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-cyan-400/40 via-blue-400/25 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-blue-500/30 via-cyan-300/20 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(37,99,235,1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage:
            'radial-gradient(ellipse at center, black 40%, transparent 85%)',
        }}
      />

      <div className="relative w-full max-w-xl">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_40px_90px_-20px_rgba(15,23,42,0.20),0_12px_30px_-12px_rgba(15,23,42,0.10)] ring-1 ring-slate-200/80">
          <div className="h-1 w-full bg-gradient-to-r from-[#22d3ee] via-[#2563eb] to-[#1d4ed8]" />

          <div className="px-7 py-9 sm:px-10 sm:py-11">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 text-blue-700 shadow-[inset_0_0_0_1px_rgba(37,99,235,0.18)]">
                <Search className="h-5 w-5" />
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  Error 404
                </span>
                <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                  Esta página no existe
                </h1>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-700">
              El enlace que seguiste está roto o la página fue movida. Estos
              son los accesos directos más comunes:
            </p>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {shortcuts.map((s) => {
                const Icon = s.Icon;
                return (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 text-blue-700">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">
                        {s.label}
                      </p>
                      <p className="truncate text-[11px] text-slate-600">
                        {s.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition hover:text-slate-900"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Volver al inicio
              </Link>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                © {new Date().getFullYear()} Portal Services Digital
              </p>
            </div>
          </div>
        </div>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
          <Sparkles className="h-3 w-3" />
          Si el problema persiste, escríbenos a hola@portalservices.digital
        </p>
      </div>
    </main>
  );
}
