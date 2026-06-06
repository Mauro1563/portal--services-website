import Link from 'next/link';
import type { ReactNode } from 'react';
import { Logo } from '@/components/Logo';

export function PortalLoginCard({
  badges,
  title,
  subtitle,
  error,
  message,
  children,
  footer,
}: {
  badges?: string[];
  title: string;
  subtitle?: string;
  error?: string;
  message?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/60">
      {/* Decorative orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-cyan-300/40 via-blue-400/30 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-blue-500/25 via-cyan-400/20 to-transparent blur-3xl"
      />
      {/* Subtle grid mask */}
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
        {/* Card */}
        <div className="relative w-full">
          {/* Top edge gradient accent on the card itself */}
          <div className="absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />

          <div className="w-full rounded-[1.75rem] bg-white px-6 py-7 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35),0_8px_24px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70 sm:px-9 sm:py-9">
            {/* Logo */}
            <div className="flex justify-center">
              <Logo size="md" />
            </div>

            {/* Badges */}
            {badges && badges.length > 0 ? (
              <div className="mt-5 hidden flex-wrap items-center justify-center gap-1.5 sm:flex">
                {badges.map((b, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-900 ring-1 ring-blue-100"
                  >
                    {b}
                  </span>
                ))}
              </div>
            ) : null}

            {/* Heading */}
            <div className="mt-5 border-t border-slate-100 pt-5 text-center sm:mt-6 sm:pt-6">
              <h1 className="text-[1.375rem] font-semibold tracking-[-0.015em] text-slate-900">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
                  {subtitle}
                </p>
              ) : null}
            </div>

            {/* Alerts */}
            {error ? (
              <p className="mt-5 flex items-start gap-2 rounded-xl border border-rose-200/70 bg-rose-50/80 px-3.5 py-2.5 text-xs text-rose-700 shadow-sm">
                <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                {error}
              </p>
            ) : null}
            {message ? (
              <p className="mt-5 flex items-start gap-2 rounded-xl border border-emerald-200/70 bg-emerald-50/80 px-3.5 py-2.5 text-xs text-emerald-700 shadow-sm">
                <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                {message}
              </p>
            ) : null}

            {/* Form */}
            <div className="mt-6">{children}</div>

            {footer ? <div className="mt-5">{footer}</div> : null}

            <p className="mt-7 text-center text-[10px] uppercase tracking-[0.18em] text-slate-400">
              © {new Date().getFullYear()} Portal Services Digital
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="mt-5 text-xs font-medium text-slate-400 transition hover:text-slate-700"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}

export function LoginField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      <div className="mt-2">{children}</div>
      {hint ? <p className="mt-1.5 text-[11px] text-slate-400">{hint}</p> : null}
    </label>
  );
}
