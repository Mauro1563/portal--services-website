import Link from 'next/link';
import type { ReactNode } from 'react';
import { Globe, Home, MapPin, Users } from 'lucide-react';
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
      {/* Soft brand orbs */}
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

      <div className="relative mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center px-4 py-5 sm:py-8">
        {/* The card */}
        <div className="relative w-full">
          <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_40px_90px_-20px_rgba(0,0,0,0.55),0_12px_30px_-12px_rgba(0,0,0,0.30)]">
            {/* Brand-blue accent stripe at the very top */}
            <div className="h-1 w-full bg-gradient-to-r from-[#22d3ee] via-[#2563eb] to-[#1d4ed8]" />

            <div className="px-7 pb-7 pt-8 sm:px-9 sm:pt-10">
              {/* Logo */}
              <div className="flex justify-center">
                <Logo size="md" />
              </div>

              {/* Portal-type indicator(s) */}
              {badges && badges.length === 1 ? (
                <div className="mt-6 flex justify-center">
                  <PortalTypeChip label={badges[0]} />
                </div>
              ) : badges && badges.length > 1 ? (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  <BadgePill icon={Globe} label={badges[0] ?? 'One platform'} />
                  {badges[1] ? (
                    <BadgePill icon={MapPin} label={badges[1]} />
                  ) : null}
                  {badges[2] ? (
                    <BadgePill icon={Users} label={badges[2]} />
                  ) : null}
                </div>
              ) : null}

              {/* Separator */}
              <div className="mt-6 border-t border-slate-100" />

              {/* Heading */}
              <h1 className="mt-6 text-[1.625rem] font-bold leading-tight tracking-[-0.02em] text-[#0b1d3a]">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-1.5 text-[15px] text-slate-500">{subtitle}</p>
              ) : null}

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

              {/* Form slot */}
              <div className="mt-6">{children}</div>

              {footer ? <div className="mt-5">{footer}</div> : null}

              {/* Bottom separator + copyright */}
              <div className="mt-7 border-t border-slate-100 pt-5">
                <p className="text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  © {new Date().getFullYear()} Portal Services UK · All rights
                  reserved
                </p>
              </div>
            </div>
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

function BadgePill({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#0b1d3a] ring-1 ring-blue-100">
      <Icon className="h-3 w-3 text-[#2563eb]" />
      {label}
    </span>
  );
}

/**
 * Premium "you are here" chip for single-portal screens (e.g. /login).
 * Logo-aligned: same cyan→blue→deep-blue gradient as the brand mark, glassy
 * white shell with brand-tinted glow, gradient-filled circular icon, and
 * gradient-text wordmark. Includes a live pulse dot to feel active.
 */
function PortalTypeChip({ label }: { label: string }) {
  return (
    <div className="relative inline-flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-4 shadow-[0_10px_28px_-12px_rgba(37,99,235,0.45),inset_0_0_0_1px_rgba(37,99,235,0.12)]">
      {/* Gradient icon disc */}
      <span className="relative grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#22d3ee] via-[#2563eb] to-[#1d4ed8] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
        <Home className="h-3.5 w-3.5" strokeWidth={2.4} />
        {/* live pulse dot */}
        <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
        </span>
      </span>
      {/* Gradient text label */}
      <span className="bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#0891b2] bg-clip-text text-[11px] font-extrabold uppercase tracking-[0.18em] text-transparent">
        {label}
      </span>
    </div>
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
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
        {label}
      </span>
      <div className="mt-2">{children}</div>
      {hint ? <p className="mt-1.5 text-[11px] text-slate-400">{hint}</p> : null}
    </label>
  );
}
