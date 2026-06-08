import Link from 'next/link';
import type { ReactNode } from 'react';
import { Globe, MapPin, Users } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { ScrollLock } from '@/components/ScrollLock';

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
    <>
      <ScrollLock />
      <main
        className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/60 px-4"
      style={{
        // Lock the screen completely — no scroll, no rubber-band, no drift.
        // `position: fixed` + `inset: 0` pins the layout to the viewport edges
        // so iOS can't slide it. `touch-action: none` blocks scroll gestures
        // (taps + typing still work via the inputs' own touch-action: auto).
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        overscrollBehavior: 'none',
        touchAction: 'none',
        paddingTop: 'max(env(safe-area-inset-top), 1rem)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 1.5rem)',
        paddingLeft: 'max(env(safe-area-inset-left), 1rem)',
        paddingRight: 'max(env(safe-area-inset-right), 1rem)',
      }}
    >
      {/* Decorative orbs — clipped by main's overflow-hidden so they never push width */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 -z-10 h-[26rem] w-[26rem] rounded-full bg-gradient-to-br from-cyan-300/40 via-blue-400/25 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-[24rem] w-[24rem] rounded-full bg-gradient-to-tr from-blue-500/30 via-cyan-300/20 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(37,99,235,1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage:
            'radial-gradient(ellipse at center, black 40%, transparent 85%)',
        }}
      />

      {/* The card. Width capped to whichever is smaller: 21rem OR viewport minus 2rem. */}
      <div className="relative w-full" style={{ maxWidth: 'min(21rem, calc(100vw - 2rem))' }}>
        <div className="absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />

        <div className="w-full overflow-hidden rounded-[1.25rem] bg-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25),0_6px_16px_-10px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70">
          <div className="px-5 pb-5 pt-5 sm:px-6">
            <div className="flex justify-center">
              <Logo size="md" className="!h-12 sm:!h-14" />
            </div>

            {badges && badges.length === 1 ? (
              <div className="mt-2.5 flex justify-center">
                <PortalTypeChip label={badges[0]} />
              </div>
            ) : badges && badges.length > 1 ? (
              <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                <BadgePill icon={Globe} label={badges[0] ?? 'One platform'} />
                {badges[1] ? <BadgePill icon={MapPin} label={badges[1]} /> : null}
                {badges[2] ? <BadgePill icon={Users} label={badges[2]} /> : null}
              </div>
            ) : null}

            <div className="mt-3.5 border-t border-slate-100 pt-3.5 text-center">
              <h1 className="text-[15px] font-semibold leading-tight tracking-[-0.01em] text-[#0b1d3a]">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-1 text-[12px] leading-snug text-slate-700">
                  {subtitle}
                </p>
              ) : null}
            </div>

            {error ? (
              <p className="mt-3 flex items-start gap-2 rounded-lg border border-rose-200/70 bg-rose-50/80 px-3 py-2 text-[11px] leading-relaxed text-rose-700 shadow-sm">
                <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                <span className="min-w-0 break-words">{error}</span>
              </p>
            ) : null}
            {message ? (
              <p className="mt-3 flex items-start gap-2 rounded-lg border border-emerald-200/70 bg-emerald-50/80 px-3 py-2 text-[11px] leading-relaxed text-emerald-700 shadow-sm">
                <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span className="min-w-0 break-words">{message}</span>
              </p>
            ) : null}

            <div className="mt-3.5">{children}</div>

            {footer ? <div className="mt-3">{footer}</div> : null}

            <p className="mt-4 text-center text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              © {new Date().getFullYear()} Portal Services UK
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="mt-3 block text-center text-[11px] font-semibold text-slate-600 transition hover:text-slate-900"
        >
          ← Back to home
        </Link>
      </div>
      </main>
    </>
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
    <span className="inline-flex max-w-full items-center gap-1.5 truncate rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#0b1d3a] ring-1 ring-blue-100">
      <Icon className="h-3 w-3 shrink-0 text-[#2563eb]" />
      <span className="truncate">{label}</span>
    </span>
  );
}

function PortalTypeChip({ label }: { label: string }) {
  return (
    <span className="inline-flex max-w-full items-center truncate rounded-full bg-white px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] shadow-[0_6px_18px_-8px_rgba(37,99,235,0.40),inset_0_0_0_1px_rgba(37,99,235,0.16)]">
      <span className="truncate bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#0891b2] bg-clip-text text-transparent">
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
    <label className="block min-w-0">
      <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700">
        {label}
      </span>
      <div className="mt-1.5 min-w-0">{children}</div>
      {hint ? <p className="mt-1.5 text-[11px] text-slate-600">{hint}</p> : null}
    </label>
  );
}
