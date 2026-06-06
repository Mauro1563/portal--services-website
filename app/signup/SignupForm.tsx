'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  Globe,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Users2,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { signupOwner, type SignupResult } from './actions';

export function SignupForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<SignupResult | null>(null);
  const [copied, setCopied] = useState<'email' | 'pwd' | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const input = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      business: String(fd.get('business') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      country: String(fd.get('country') ?? ''),
      teamSize: String(fd.get('teamSize') ?? ''),
    };
    startTransition(async () => {
      const r = await signupOwner(input);
      setResult(r);
    });
  }

  function copy(text: string, which: 'email' | 'pwd') {
    void navigator.clipboard.writeText(text);
    setCopied(which);
    setTimeout(() => setCopied((c) => (c === which ? null : c)), 1500);
  }

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/60">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-cyan-300/40 via-blue-400/30 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-blue-500/25 via-cyan-400/20 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(15,23,42,1) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,1) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse at center, black 50%, transparent 80%)',
        }}
      />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center px-4 py-6 sm:py-10">
        <div className="relative w-full">
          <div className="absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />
          <div className="w-full overflow-hidden rounded-[1.75rem] bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35),0_8px_24px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70">
          <section className="relative flex flex-col px-6 py-7 sm:px-9 sm:py-9">
            <div className="mb-5 flex justify-center">
              <Logo size="md" />
            </div>

            {result?.ok ? (
              <SuccessPanel
                email={result.email}
                password={result.password}
                onEnter={() => router.push('/owner')}
                copied={copied}
                onCopy={copy}
              />
            ) : (
              <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
                <h1 className="text-[1.375rem] font-semibold tracking-[-0.015em] text-slate-900">
                  Crea tu cuenta
                </h1>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
                  Tu acceso al portal queda listo en segundos.
                </p>

                {result && !result.ok ? (
                  <p className="mt-5 flex items-start gap-2 rounded-xl border border-rose-200/70 bg-rose-50/80 px-3.5 py-2.5 text-xs text-rose-700 shadow-sm">
                    <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                    {result.error}
                  </p>
                ) : null}

                <form className="mt-7 space-y-4" onSubmit={onSubmit}>
                  <Field label="Nombre completo" icon={User}>
                    <input
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="María García"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Email de trabajo" icon={Mail}>
                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      placeholder="maria@miempresa.com"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Nombre de tu empresa" icon={Building2}>
                    <input
                      type="text"
                      name="business"
                      required
                      autoComplete="organization"
                      placeholder="Limpiezas García"
                      className={inputClass}
                    />
                  </Field>

                  <details className="group rounded-xl">
                    <summary className="flex cursor-pointer items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 transition hover:text-slate-600">
                      <span>+ Datos opcionales</span>
                      <span className="text-slate-300 group-open:hidden">Mostrar</span>
                      <span className="hidden text-slate-300 group-open:inline">Ocultar</span>
                    </summary>
                    <div className="mt-4 space-y-4">
                      <Field label="Teléfono" icon={Phone} optional>
                        <input
                          type="tel"
                          name="phone"
                          autoComplete="tel"
                          placeholder="+34 600 000 000"
                          className={inputClass}
                        />
                      </Field>
                      <Field label="País" icon={Globe} optional>
                        <input
                          type="text"
                          name="country"
                          autoComplete="country-name"
                          placeholder="España"
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Tamaño del equipo" icon={Users2} optional>
                        <select
                          name="teamSize"
                          defaultValue=""
                          className={`${inputClass} appearance-none`}
                        >
                          <option value="">Elige una opción…</option>
                          <option value="1-5">1 a 5 personas</option>
                          <option value="6-20">6 a 20 personas</option>
                          <option value="20+">Más de 20 personas</option>
                        </select>
                      </Field>
                    </div>
                  </details>

                  <button
                    type="submit"
                    disabled={pending}
                    className="group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_36px_-12px_rgba(37,99,235,0.55),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all duration-300 hover:shadow-[0_22px_48px_-12px_rgba(37,99,235,0.65)] hover:brightness-[1.08] active:translate-y-px disabled:cursor-wait disabled:opacity-70"
                  >
                    <span className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                    {pending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Creando…
                      </>
                    ) : (
                      <>
                        Crear mi cuenta
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-slate-400">
                    ¿Ya tienes cuenta?{' '}
                    <Link
                      href="/login"
                      className="font-semibold text-blue-600 transition hover:text-blue-700"
                    >
                      Inicia sesión
                    </Link>
                  </p>
                </form>

                <Link
                  href="/"
                  className="mt-6 text-center text-xs font-medium text-slate-400 transition hover:text-slate-700 lg:text-left"
                >
                  ← Volver al inicio
                </Link>
              </div>
            )}
          </section>
          </div>
        </div>
      </div>
    </main>
  );
}

const inputClass =
  'block h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3 text-sm font-medium text-slate-900 shadow-inner shadow-slate-200/40 placeholder:font-normal placeholder:text-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10';

function Field({
  label,
  icon: Icon,
  optional,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        <span>{label}</span>
        {optional ? (
          <span className="font-medium normal-case tracking-normal text-slate-400">
            opcional
          </span>
        ) : null}
      </span>
      <div className="relative mt-2">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        {children}
      </div>
    </label>
  );
}

function SuccessPanel({
  email,
  password,
  onEnter,
  copied,
  onCopy,
}: {
  email: string;
  password: string;
  onEnter: () => void;
  copied: 'email' | 'pwd' | null;
  onCopy: (text: string, which: 'email' | 'pwd') => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
      <div className="flex justify-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 shadow-inner ring-1 ring-emerald-200/70">
          <CheckCircle2 className="h-7 w-7" />
        </span>
      </div>
      <h1 className="mt-5 text-center text-[1.375rem] font-semibold tracking-[-0.015em] text-slate-900">
        ¡Bienvenido!
      </h1>
      <p className="mt-1.5 text-center text-[13px] leading-relaxed text-slate-500">
        Tu cuenta está lista. Guarda estos datos — los necesitarás para volver
        a entrar.
      </p>

      <div className="mt-7 space-y-3 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
        <CopyableRow
          label="Email"
          value={email}
          onCopy={() => onCopy(email, 'email')}
          copied={copied === 'email'}
          mono
        />
        <CopyableRow
          label="Contraseña temporal"
          value={password}
          onCopy={() => onCopy(password, 'pwd')}
          copied={copied === 'pwd'}
          mono
        />
      </div>

      <p className="mt-5 flex items-start gap-2 rounded-xl border border-amber-200/70 bg-amber-50/80 px-3.5 py-2.5 text-xs text-amber-800 shadow-sm">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Te pediremos cambiar esta contraseña la primera vez que entres.
      </p>

      <button
        type="button"
        onClick={onEnter}
        className="group relative mt-6 inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_36px_-12px_rgba(37,99,235,0.55),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all duration-300 hover:brightness-[1.08]"
      >
        <span className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        Entrar a mi portal
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </div>
  );
}

function CopyableRow({
  label,
  value,
  onCopy,
  copied,
  mono,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <div className="mt-1.5 flex items-stretch gap-2">
        <div
          className={`flex h-11 flex-1 items-center rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 ${
            mono ? 'font-mono tracking-wide' : 'font-medium'
          }`}
        >
          {value}
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" /> Copiado
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copiar
            </>
          )}
        </button>
      </div>
    </div>
  );
}
