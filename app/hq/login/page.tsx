import { ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { sendMagicLink } from '../actions';

type Props = {
  searchParams: Promise<{ sent?: string; error?: string }>;
};

export default async function HQLogin({ searchParams }: Props) {
  const { sent, error } = await searchParams;

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_30%,rgba(61,197,240,0.12),transparent_70%)]"
      />
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo size="md" />
        </div>

        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-cyan-300">
            <ShieldCheck className="h-4 w-4" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">
              HQ · Panel administrativo
            </p>
          </div>
          <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-white">
            Accede al panel.
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Te enviaremos un enlace mágico al correo. Solo correos autorizados
            pueden entrar.
          </p>

          {sent ? (
            <div className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2.5 text-xs text-emerald-200">
              Listo. Revisa tu bandeja de entrada — el enlace expira en 15
              minutos.
            </div>
          ) : null}

          {error ? (
            <div className="mt-5 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2.5 text-xs text-rose-200">
              {error === 'not_admin'
                ? 'Este correo no está autorizado para acceder al panel.'
                : error === 'rate_limit'
                ? 'Demasiados intentos. Espera un minuto y vuelve a intentar.'
                : 'Algo falló. Inténtalo de nuevo.'}
            </div>
          ) : null}

          <form action={sendMagicLink} className="mt-6 space-y-3">
            <label className="block">
              <span className="text-xs font-medium text-slate-300">
                Correo
              </span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="tu@empresa.com"
                className="mt-1.5 block h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
              />
            </label>
            <button
              type="submit"
              className="flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-semibold text-white shadow-[0_8px_30px_-10px_rgba(56,189,248,0.6)] transition hover:brightness-110"
            >
              Enviar enlace mágico
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[11px] text-slate-500">
          Acceso restringido. Esta zona no aparece en buscadores.
        </p>
      </div>
    </main>
  );
}
