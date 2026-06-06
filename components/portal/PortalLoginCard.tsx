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
    <main className="relative min-h-screen overflow-hidden bg-surface-1">
      <div className="absolute inset-x-0 top-0 h-1 bg-brand-gradient" />
      <div className="absolute inset-0 bg-mesh-1 opacity-30" aria-hidden />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center px-4 py-8">
        <div className="flex w-full flex-1 flex-col items-center justify-center">
          <div className="w-full rounded-3xl border border-surface-2 bg-surface-0 p-7 shadow-card-lg">
            <div className="flex justify-center">
              <Logo size="md" />
            </div>

            {badges && badges.length > 0 ? (
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                {badges.map((b, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-surface-1 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-navy-900"
                  >
                    {b}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-6 border-t border-surface-2 pt-6">
              <h1 className="font-display text-xl font-semibold text-text-1">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-1 text-sm text-text-2">{subtitle}</p>
              ) : null}

              {error ? (
                <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  {error}
                </p>
              ) : null}
              {message ? (
                <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                  {message}
                </p>
              ) : null}

              <div className="mt-5">{children}</div>
            </div>

            <p className="mt-6 text-center text-[10px] uppercase tracking-[0.14em] text-text-3">
              © {new Date().getFullYear()} Portal Services Digital · All rights
              reserved
            </p>
          </div>

          {footer ? <div className="mt-5 w-full">{footer}</div> : null}

          <Link
            href="/"
            className="mt-6 text-xs text-text-3 transition hover:text-text-2"
          >
            ← Back to home
          </Link>
        </div>
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
      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-3">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint ? <p className="mt-1 text-[11px] text-text-3">{hint}</p> : null}
    </label>
  );
}
