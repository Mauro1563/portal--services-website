'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { ZapliLogo } from '@/components/brand/ZapliLogo';
import { completeForcedPasswordChange } from '@/app/signup/actions';

export function ChangePasswordForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [pwd, setPwd] = useState('');
  const [confirm, setConfirm] = useState('');

  const strength = scorePassword(pwd);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (pwd.length < 8) return setError('Mínimo 8 caracteres');
    if (pwd !== confirm) return setError('Las contraseñas no coinciden');
    startTransition(async () => {
      const r = await completeForcedPasswordChange(pwd);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      router.push('/owner');
      router.refresh();
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/60">
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-cyan-300/40 via-blue-400/30 to-transparent blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-[32rem] w-[32rem] rounded-full bg-gradient-to-tr from-blue-500/25 via-cyan-400/20 to-transparent blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-screen max-w-md items-center justify-center px-4 py-10">
        <div className="w-full rounded-[2rem] bg-white p-8 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35),0_8px_24px_-12px_rgba(15,23,42,0.15)] ring-1 ring-slate-200/70 sm:p-10">
          <div className="flex justify-center">
            <ZapliLogo size="md" />
          </div>

          <div className="mt-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-800 ring-1 ring-amber-200/70">
              <ShieldCheck className="h-3 w-3" />
              Cambio obligatorio
            </span>
          </div>

          <h1 className="mt-4 text-center font-display text-2xl font-semibold tracking-tight text-slate-950">
            Crea tu contraseña
          </h1>
          <p className="mt-2 text-center text-sm text-slate-500">
            Reemplaza la contraseña temporal por una tuya antes de continuar.
          </p>

          <form className="mt-7 space-y-4" onSubmit={onSubmit}>
            <PasswordField
              label="Nueva contraseña"
              value={pwd}
              setValue={setPwd}
              show={show}
              toggle={() => setShow((s) => !s)}
              autoComplete="new-password"
            />
            {pwd ? <StrengthBar score={strength} /> : null}
            <PasswordField
              label="Confirma la contraseña"
              value={confirm}
              setValue={setConfirm}
              show={show}
              toggle={() => setShow((s) => !s)}
              autoComplete="new-password"
            />

            {error ? (
              <p className="flex items-start gap-2 rounded-xl border border-rose-200/70 bg-rose-50/80 px-3.5 py-2.5 text-xs text-rose-700">
                <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_36px_-12px_rgba(37,99,235,0.55),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all duration-300 hover:brightness-[1.08] disabled:cursor-wait disabled:opacity-70"
            >
              <span className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Guardando…
                </>
              ) : (
                <>
                  Guardar y entrar
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function PasswordField({
  label,
  value,
  setValue,
  show,
  toggle,
  autoComplete,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  show: boolean;
  toggle: () => void;
  autoComplete: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      <div className="relative mt-2">
        <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete={autoComplete}
          required
          minLength={8}
          placeholder="••••••••"
          className="block h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-11 text-sm font-medium text-slate-900 shadow-inner shadow-slate-200/40 placeholder:font-normal placeholder:text-slate-500 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label={show ? 'Ocultar' : 'Mostrar'}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </label>
  );
}

function scorePassword(p: string): number {
  let s = 0;
  if (p.length >= 8) s++;
  if (p.length >= 12) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 4);
}

function StrengthBar({ score }: { score: number }) {
  const labels = ['Muy débil', 'Débil', 'Aceptable', 'Buena', 'Excelente'];
  const colors = [
    'bg-rose-400',
    'bg-orange-400',
    'bg-amber-400',
    'bg-emerald-400',
    'bg-emerald-500',
  ];
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-1 gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition ${
              i < score ? colors[score] : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
      <span className="w-20 text-right text-[10px] font-semibold text-slate-500">
        {labels[score]}
      </span>
    </div>
  );
}
