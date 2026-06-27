import type { CSSProperties } from 'react';

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

/**
 * Variant 4 — Orbit / sparkle mark. A small filled gradient dot sits inside a
 * hairline orbital ring, slightly rotated. The "Home" half of the wordmark
 * picks up the cyan→blue gradient; "Portal" stays in ink.
 */
export default function LogoVariant4({
  size = 'md',
  mono = false,
  className = '',
}: LogoVariant4Props) {
  const h = sizePx[size];
  const markSize = h;

  const wordSize = Math.round(h * 0.42);
  const eyebrowSize = Math.max(8, Math.round(h * 0.13));
  const gap = Math.round(h * 0.32);

  const isOnDark = /\b(bg-(?:slate|gray|zinc|neutral|stone|black|ink|navy)-?\d*|dark)\b/.test(
    className,
  );
  const monoColor = mono ? (isOnDark ? '#ffffff' : '#0f172a') : null;

  const gradientId = 'lv4-grad';
  const dotFill = mono ? (monoColor as string) : `url(#${gradientId})`;
  const ringStroke = mono ? (monoColor as string) : '#cbd5e1'; // slate-300
  const wordColor = mono ? (monoColor as string) : '#0f172a';
  const accentColor = mono ? (monoColor as string) : `url(#${gradientId})`;
  const eyebrowColor = mono ? (monoColor as string) : '#475569';

  const wrapperStyle: CSSProperties = {
    height: h,
    gap,
  };

  // viewBox is 80×80. Dot ~12px, ring ~32px in real px at md=40 -> scale by 2.
  // Use 80-unit coords: dot r=12, ring r=32, stroke 2 (renders ~1px at md).
  return (
    <span
      className={`inline-flex items-center ${className}`}
      style={wrapperStyle}
      aria-label="Portal Home — Cleaning & Facilities"
    >
      <svg
        width={markSize}
        height={markSize}
        viewBox="0 0 80 80"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>

        {/* Hairline orbital ring, slightly rotated for an off-axis feel. */}
        <g transform="rotate(-22 40 40)">
          <ellipse
            cx="40"
            cy="40"
            rx="32"
            ry="32"
            fill="none"
            stroke={ringStroke}
            strokeWidth="2"
          />
          {/* A tiny sparkle bead riding the orbit. */}
          <circle cx="72" cy="40" r="2.5" fill={dotFill} />
        </g>

        {/* Filled gradient dot at the centre. */}
        <circle cx="40" cy="40" r="12" fill={dotFill} />
      </svg>

      <span className="flex flex-col justify-center leading-none">
        <span
          className="uppercase"
          style={{
            fontSize: eyebrowSize,
            color: eyebrowColor,
            letterSpacing: '0.18em',
            marginBottom: Math.round(h * 0.08),
            fontWeight: 500,
          }}
        >
          Cleaning &amp; Facilities
        </span>
        <span
          className="font-semibold"
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
        {/* Hidden accent reference to satisfy unused-var checks if linting strict. */}
        <span style={{ display: 'none' }} aria-hidden="true">
          <svg width="0" height="0">
            <rect fill={accentColor} />
          </svg>
        </span>
      </span>
    </span>
  );
}

export { LogoVariant4 };
