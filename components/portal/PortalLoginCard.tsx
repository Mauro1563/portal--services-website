import Link from 'next/link';
import type { ReactNode } from 'react';
import { Globe, MapPin, Users } from 'lucide-react';
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
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#0b1320]">
      {/* Layered dark backdrop suggesting depth/architecture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(at 20% 30%, rgba(30, 58, 102, 0.55) 0px, transparent 55%), radial-gradient(at 80% 70%, rgba(15, 28, 56, 0.6) 0px, transparent 60%), radial-gradient(at 50% 100%, rgba(8, 15, 30, 0.7) 0px, transparent 60%)',
        }}
      />
      {/* Vertical light streaks (architecture hallway feel) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '180px 100%',
        }}
      />
      {/* Soft vignette at the edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.65) 100%)',
        }}
      />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center px-4 py-5 sm:py-8">
        {/* The card */}
        <div className="relative w-full">
          <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_40px_90px_-20px_rgba(0,0,0,0.55),0_12px_30px_-12px_rgba(0,0,0,0.30)]">
            {/* Orange accent stripe at the very top */}
            <div className="h-1 w-full bg-gradient-to-r from-[#ff6b35] via-[#f7931e] to-[#ff6b35]" />

            <div className="px-7 pb-7 pt-8 sm:px-9 sm:pt-10">
              {/* Logo */}
              <div className="flex justify-center">
                <Logo size="md" />
              </div>

              {/* Pill badges with icons */}
              {badges && badges.length > 0 ? (
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
          className="mt-5 text-xs font-medium text-slate-400 transition hover:text-white"
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
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff4ec] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#0b1d3a] ring-1 ring-[#ffe0cc]">
      <Icon className="h-3 w-3 text-[#ff6b35]" />
      {label}
    </span>
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
