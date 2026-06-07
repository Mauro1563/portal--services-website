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
    <main className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/60">
      {/* Layered brand orbs (4 positions, animated pulse) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[32rem] w-[32rem] animate-[pulse_8s_ease-in-out_infinite] rounded-full bg-gradient-to-br from-cyan-400/45 via-blue-400/30 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-20 h-[28rem] w-[28rem] animate-[pulse_10s_ease-in-out_infinite] rounded-full bg-gradient-to-bl from-blue-500/35 via-indigo-400/25 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 h-[26rem] w-[26rem] animate-[pulse_9s_ease-in-out_infinite] rounded-full bg-gradient-to-tr from-cyan-300/40 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-10 h-[30rem] w-[30rem] animate-[pulse_11s_ease-in-out_infinite] rounded-full bg-gradient-to-tl from-blue-400/35 via-cyan-300/20 to-transparent blur-3xl"
      />

      {/* Brand grid pattern (more visible now) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(37,99,235,1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage:
            'radial-gradient(ellipse at center, black 40%, transparent 85%)',
        }}
      />

      {/* Floating sparkles — cleaning-theme decorative shapes */}
      <FloatingSparkles />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center px-4 py-5 sm:py-8">
        {/* The card */}
        <div className="relative w-full">
          <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_40px_90px_-20px_rgba(0,0,0,0.55),0_12px_30px_-12px_rgba(0,0,0,0.30)]">
            {/* Brand-blue accent stripe at the very top */}
            <div className="h-1 w-full bg-gradient-to-r from-[#22d3ee] via-[#2563eb] to-[#1d4ed8]" />

            <div className="px-7 pb-7 pt-8 sm:px-9 sm:pt-10">
              {/* Logo */}
              <div className="flex justify-center">
                <Logo size="md" className="!h-20 sm:!h-24" />
              </div>

              {/* Portal-type indicator(s) */}
              {badges && badges.length === 1 ? (
                <div className="mt-3 flex justify-center">
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
              <h1 className="mt-6 text-base font-semibold leading-tight tracking-[-0.01em] text-[#0b1d3a]">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-1 text-[13px] text-slate-500">{subtitle}</p>
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
 * Decorative cleaning-themed sparkles scattered around the viewport. Pure
 * SVG + Tailwind, no JS state. Each shape has its own size, position and
 * animation delay/duration so they twinkle independently — feels alive
 * without distracting from the form.
 */
function FloatingSparkles() {
  const sparkles = [
    { top: '6%', left: '5%', size: 18, delay: '0s', dur: '4s', opacity: 0.35 },
    { top: '14%', right: '10%', size: 14, delay: '1.2s', dur: '5s', opacity: 0.30 },
    { top: '38%', left: '8%', size: 12, delay: '2.4s', dur: '6s', opacity: 0.25 },
    { top: '52%', right: '6%', size: 20, delay: '0.8s', dur: '4.5s', opacity: 0.40 },
    { bottom: '24%', left: '12%', size: 16, delay: '1.6s', dur: '5.5s', opacity: 0.30 },
    { bottom: '14%', right: '14%', size: 14, delay: '0.4s', dur: '4.2s', opacity: 0.32 },
    { bottom: '6%', left: '40%', size: 10, delay: '2s', dur: '5s', opacity: 0.25 },
    { top: '24%', left: '46%', size: 8, delay: '3s', dur: '4.5s', opacity: 0.22 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {sparkles.map((s, i) => (
        <svg
          key={i}
          width={s.size}
          height={s.size}
          viewBox="0 0 24 24"
          fill="none"
          style={{
            position: 'absolute',
            top: s.top,
            left: s.left,
            right: s.right,
            bottom: s.bottom,
            opacity: s.opacity,
            animation: `pulse ${s.dur} ease-in-out ${s.delay} infinite`,
          }}
        >
          <path
            d="M12 2 L13.4 9.4 L21 12 L13.4 14.6 L12 22 L10.6 14.6 L3 12 L10.6 9.4 Z"
            fill="url(#sparkleGrad)"
          />
          <defs>
            <linearGradient id="sparkleGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
        </svg>
      ))}
    </div>
  );
}

/**
 * Minimal text-only portal indicator, centered under the logo.
 * Gradient text matches the brand mark; soft brand-tinted ring + glow.
 */
function PortalTypeChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] shadow-[0_8px_22px_-10px_rgba(37,99,235,0.40),inset_0_0_0_1px_rgba(37,99,235,0.14)]">
      <span className="bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#0891b2] bg-clip-text text-transparent">
        {label}
      </span>
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
