import { type ReactNode } from 'react';

/**
 * Glassmorphism card — frosted-glass effect with a subtle inner
 * highlight. Designed for hero / featured sections in the redesigned
 * shells. Falls back gracefully if backdrop-blur isn't supported
 * (older Android Webview): just shows a translucent white surface.
 */
export function GlassCard({
  children,
  className = '',
  tone = 'neutral',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'neutral' | 'aqua' | 'mint' | 'brand';
}) {
  const toneClasses = {
    neutral:
      'bg-white/70 ring-white/40 [--glow:rgba(34,211,238,0.18)]',
    aqua: 'bg-clean-aqua-soft/70 ring-clean-aqua-glow/40 [--glow:rgba(34,211,238,0.30)]',
    mint: 'bg-clean-mint-soft/70 ring-clean-mint/30 [--glow:rgba(16,185,129,0.25)]',
    brand:
      'bg-gradient-to-br from-cyan-400/15 via-blue-500/15 to-blue-700/15 ring-brand-500/30 [--glow:rgba(37,99,235,0.30)]',
  }[tone];

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl ${toneClasses} p-5 shadow-glass ring-1 ring-inset backdrop-blur-xl transition hover:shadow-sparkle-glow ${className}`}
    >
      {/* Inner highlight that suggests glass thickness */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"
      />
      {/* Soft outer glow visible on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition group-hover:opacity-100"
        style={{
          boxShadow: '0 0 40px var(--glow)',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
