import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { ZapliLogo } from '@/components/brand/ZapliLogo';
import { createClient } from '@/lib/supabase/server';
import { updatePassword } from '../actions';

type Props = {
  searchParams: Promise<{ code?: string; error?: string }>;
};

export default async function ResetPassword({ searchParams }: Props) {
  const { code, error } = await searchParams;

  // Exchange the recovery code for a session so updateUser({ password }) works.
  // Only do this if a code is present and we don't already have an error from
  // a previous submission attempt — otherwise we'd burn the code on each retry.
  let exchangeFailed = false;
  if (code && !error) {
    const supabase = await createClient();
    const { error: exErr } = await supabase.auth.exchangeCodeForSession(code);
    if (exErr) exchangeFailed = true;
  }

  // Are we authenticated (i.e. did the recovery link work)?
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const linkValid = !!user && !exchangeFailed;

  const errorMessage =
    error === 'too_short'
      ? 'La contraseña debe tener al menos 8 caracteres.'
      : error === 'mismatch'
      ? 'Las contraseñas no coinciden.'
      : error === 'expired'
      ? 'El enlace ha caducado. Solicita uno nuevo.'
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
            <ZapliLogo size="md" />
          </div>
          <div className="flex items-center gap-2 text-brand-600">
            <ShieldCheck className="h-4 w-4" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">
              HQ · Nueva contraseña
            </p>
          </div>
          <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-graphite-1">
            Set a new password
          </h1>
          <p className="mt-1 text-sm text-graphite-3">
            Mínimo 8 caracteres. Después de guardar entrarás directo al panel.
          </p>

          {errorMessage ? (
            <div className="mt-5 rounded-xl bg-rose-50 px-3 py-2.5 text-xs text-rose-700 ring-1 ring-inset ring-rose-200">
              {errorMessage}
            </div>
          ) : null}

          {linkValid ? (
            <form action={updatePassword} className="mt-6 space-y-3">
              <label className="block">
                <span className="text-xs font-medium text-graphite-2">
                  Nueva contraseña
                </span>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="mt-1.5 block h-11 w-full rounded-xl bg-white px-3.5 text-sm text-graphite-1 placeholder:text-graphite-4 ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-graphite-2">
                  Confirmar contraseña
                </span>
                <input
                  type="password"
                  name="confirm"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="mt-1.5 block h-11 w-full rounded-xl bg-white px-3.5 text-sm text-graphite-1 placeholder:text-graphite-4 ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
              </label>
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.55)] transition hover:brightness-110"
              >
                Guardar y entrar
              </button>
            </form>
          ) : (
            <div className="mt-6 space-y-3">
              <div className="rounded-xl bg-rose-50 px-3 py-2.5 text-xs text-rose-700 ring-1 ring-inset ring-rose-200">
                Este enlace ya no es válido. Solicita uno nuevo desde la
                pantalla de recuperación.
              </div>
              <Link
                href="/hq/forgot-password"
                className="flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.55)] transition hover:brightness-110"
              >
                Pedir nuevo enlace
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
