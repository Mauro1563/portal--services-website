import Link from 'next/link';
import type { ReactNode } from 'react';
import { ShieldCheck, Sparkles, Users } from 'lucide-react';
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
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/60">
      {/* Decorative gradient orbs */}
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-cyan-300/40 via-blue-400/30 to-transparent blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-[32rem] w-[32rem] rounded-full bg-gradient-to-tr from-blue-500/25 via-cyan-400/20 to-transparent blur-3xl"
        aria-hidden
      />
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(15,23,42,1) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,1) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <div className="grid w-full overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35),0_8px_24px_-12px_rgba(15,23,42,0.15)] ring-1 ring-slate-200/70 lg:grid-cols-[1.05fr_1fr]">
          {/* ============ Brand panel (desktop only) ============ */}
          <aside className="relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            {/* Mesh + grid */}
            <div
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                background:
                  'radial-gradient(at 30% 20%, rgba(34,211,238,0.25) 0px, transparent 50%), radial-gradient(at 80% 70%, rgba(59,130,246,0.30) 0px, transparent 55%), radial-gradient(at 20% 90%, rgba(99,102,241,0.20) 0px, transparent 55%)',
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                backgroundSize: '36px 36px',
              }}
              aria-hidden
            />
            {/* Top edge accent */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />

            <div className="relative">
              <div className="inline-flex items-center rounded-2xl bg-white/95 px-4 py-2.5 shadow-lg shadow-blue-900/30 ring-1 ring-white/40 backdrop-blur">
                <Logo size="sm" />
              </div>

              <h2 className="mt-10 font-display text-[2.25rem] font-semibold leading-[1.1] tracking-tight">
                One platform.
                <br />
                One place.
                <br />
                <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-300 bg-clip-text text-transparent">
                  Everyone connected.
                </span>
              </h2>
              <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-slate-300">
                Run cleaning operations, properties and customer
                communication from a single, real-time platform.
              </p>
            </div>

            <ul className="relative mt-10 space-y-4">
              {[
                {
                  icon: Users,
                  title: 'Built for your whole team',
                  body: 'Cleaners, owners and clients — each with their own portal.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Secure by default',
                  body: 'PIN-based crew access, encrypted sessions, GDPR-ready.',
                },
                {
                  icon: Sparkles,
                  title: 'Real-time everywhere',
                  body: 'Live photos, ratings and bookings the moment they happen.',
                },
              ].map(({ icon: Icon, title: t, body }) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 backdrop-blur">
                    <Icon className="h-4 w-4 text-cyan-300" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{t}</p>
                    <p className="text-xs text-slate-300/90">{body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="relative mt-10 text-[10px] uppercase tracking-[0.2em] text-slate-400/80">
              © {new Date().getFullYear()} Portal Services Digital
            </p>
          </aside>

          {/* ============ Form panel ============ */}
          <section className="relative flex flex-col px-6 py-10 sm:px-12 sm:py-14">
            {/* Mobile-only logo header */}
            <div className="mb-8 flex justify-center lg:hidden">
              <Logo size="md" />
            </div>

            <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
              {badges && badges.length > 0 ? (
                <div className="mb-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
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

              <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-950">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-2 text-[15px] text-slate-500">{subtitle}</p>
              ) : null}

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

              <div className="mt-7">{children}</div>

              {footer ? <div className="mt-6">{footer}</div> : null}

              <Link
                href="/"
                className="mt-8 text-center text-xs font-medium text-slate-400 transition hover:text-slate-700 lg:text-left"
              >
                ← Back to home
              </Link>
            </div>
          </section>
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
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      <div className="mt-2">{children}</div>
      {hint ? <p className="mt-1.5 text-[11px] text-slate-400">{hint}</p> : null}
    </label>
  );
}
