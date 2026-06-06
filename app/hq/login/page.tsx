import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { signInWithPassword } from '../actions';

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function HQLogin({ searchParams }: Props) {
  const { error } = await searchParams;

  const errorMessage =
    error === 'missing'
      ? 'Completa email y contraseña.'
      : error === 'not_admin'
      ? 'Este correo no está autorizado para acceder al panel.'
      : error === 'rate_limit'
      ? 'Demasiados intentos. Espera un minuto y vuelve a intentar.'
      : error === 'invalid'
      ? 'Email o contraseña incorrectos.'
      : error
      ? 'Algo falló. Inténtalo de nuevo.'
      : null;

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-canvas px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-mesh-light opacity-70"
      />
      <div className="w-full max-w-sm">
        <div className="rounded-3xl bg-paper p-8 ring-1 ring-line shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)]">
          <div className="mb-6 flex justify-center">
            <Logo size="md" variant="full" />
          </div>
          <div className="flex items-center gap-2 text-brand-600">
            <ShieldCheck className="h-4 w-4" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">
              HQ · Panel administrativo
            </p>
          </div>
          <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-graphite-1">
            Sign in to your account
          </h1>
          <p className="mt-1 text-sm text-graphite-3">
            Acceso restringido. Solo correos autorizados.
          </p>

          {errorMessage ? (
            <div className="mt-5 rounded-xl bg-rose-50 px-3 py-2.5 text-xs text-rose-700 ring-1 ring-inset ring-rose-200">
              {errorMessage}
            </div>
          ) : null}

          <form action={signInWithPassword} className="mt-6 space-y-3">
            <label className="block">
              <span className="text-xs font-medium text-graphite-2">
                Email
              </span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="tu@empresa.com"
                className="mt-1.5 block h-11 w-full rounded-xl bg-white px-3.5 text-sm text-graphite-1 placeholder:text-graphite-4 ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-graphite-2">
                Password
              </span>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="mt-1.5 block h-11 w-full rounded-xl bg-white px-3.5 text-sm text-graphite-1 placeholder:text-graphite-4 ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </label>
            <button
              type="submit"
              className="flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.55)] transition hover:brightness-110"
            >
              Sign in
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link
              href="/hq/forgot-password"
              className="text-xs font-medium text-graphite-3 hover:text-brand-600"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-graphite-4">
          Acceso restringido. Esta zona no aparece en buscadores.
        </p>
      </div>
    </main>
  );
}
