import type { CSSProperties } from 'react';

/**
 * LogoVariant4 — Orbit / sparkle mark.
 * A gradient-filled dot sits inside a hairline orbital ring with a tiny bead
 * riding the orbit, evoking an "all-in-one" hub. Wordmark "Portal Home" in
 * Poppins semibold; "Home" carries the cyan→blue accent gradient.
 */

type Size = 'sm' | 'md' | 'lg' | 'xl';

interface LogoVariant4Props {
  size?: Size;
  mono?: boolean;
  className?: string;
}

const sizePx: Record<Size, number> = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

export default function LogoVariant4({
  size = 'md',
  mono = false,
  className = '',
}: LogoVariant4Props) {
  const h = sizePx[size];
  const markSize = h;

  const wordSize = Math.round(h * 0.42);
  const eyebrowSize = Math.max(9, Math.round(h * 0.13));
  const gap = Math.round(h * 0.32);
  const showEyebrow = size !== 'sm';

  const isOnDark =
    /\btext-white\b/.test(className) ||
    /\b(bg-(?:slate|gray|zinc|neutral|stone|black|ink|navy)-?\d*|dark)\b/.test(className);
  const monoColor = mono ? (isOnDark ? '#ffffff' : '#0f172a') : null;

  const gradientId = 'lv4-grad';
  const dotFill = mono ? (monoColor as string) : `url(#${gradientId})`;
  const ringStroke = mono ? (monoColor as string) : '#cbd5e1'; // slate-300
  const wordColor = mono ? (monoColor as string) : '#0f172a';
  const eyebrowColor = mono ? (monoColor as string) : '#475569';

  const wrapperStyle: CSSProperties = {
    height: h,
    gap,
  };

  return (
    <span
      role="img"
      aria-label="Portal Home"
      className={`inline-flex items-center ${className}`}
      style={wrapperStyle}
    >
      <svg
        width={markSize}
        height={markSize}
        viewBox="0 0 80 80"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>

        {/* Hairline orbital ring, slightly rotated for an off-axis feel. */}
        <g transform="rotate(-22 40 40)">
          <circle
            cx="40"
            cy="40"
            r="32"
            fill="none"
            stroke={ringStroke}
            strokeWidth="2"
          />
          {/* A tiny sparkle bead riding the orbit. */}
          <circle cx="72" cy="40" r="3" fill={dotFill} />
        </g>

        {/* Filled gradient dot at the centre. */}
        <circle cx="40" cy="40" r="12" fill={dotFill} />
      </svg>

      <span className="flex flex-col justify-center leading-none">
        {showEyebrow && (
          <span
            className="uppercase tracking-[0.18em]"
            style={{
              fontSize: eyebrowSize,
              color: eyebrowColor,
              marginBottom: Math.round(h * 0.08),
              fontWeight: 500,
            }}
          >
            Cleaning &amp; Facilities
          </span>
        )}
        <span
          className="font-display font-semibold"
          style={{
            fontSize: wordSize,
            fontFamily:
              'Poppins, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
            letterSpacing: '0.01em',
            lineHeight: 1,
          }}
        >
          <span style={{ color: wordColor }}>Portal </span>
          <span
            style={{
              backgroundImage: mono
                ? 'none'
                : 'linear-gradient(135deg, #22d3ee 0%, #2563eb 100%)',
              WebkitBackgroundClip: mono ? undefined : 'text',
              backgroundClip: mono ? undefined : 'text',
              color: mono ? (monoColor as string) : 'transparent',
            }}
          >
            Home
          </span>
        </span>
      </span>
    </span>
  );
}

export { LogoVariant4 };
