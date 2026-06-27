/**
 * LogoVariant1 — Geometric "PH" monogram in a rounded tile with a cyan→blue
 * gradient. The P and H share negative-space construction (punched white)
 * to read as one intertwined mark. Modern agency feel; wordmark sits right.
 */
import type { CSSProperties } from 'react';

type Size = 'sm' | 'md' | 'lg' | 'xl';

interface LogoVariant1Props {
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

export default function LogoVariant1({
  size = 'md',
  mono = false,
  className = '',
}: LogoVariant1Props) {
  const h = sizePx[size];
  const tileSize = h;

  // Type scales with the mark height; integer-only to stay crisp.
  const wordSize = Math.round(h * 0.42);
  const eyebrowSize = Math.max(9, Math.round(h * 0.13));
  const gap = Math.round(h * 0.32);
  const eyebrowGap = Math.max(2, Math.round(h * 0.06));

  // Eyebrow is too cramped at sm — only render at md/lg/xl.
  const showEyebrow = size !== 'sm';

  // Detect dark contexts (explicit text-white, or dark-ish bg utility on wrapper).
  const isOnDark =
    /\btext-white\b/.test(className) ||
    /\bbg-(?:slate|gray|zinc|neutral|stone|black|ink|navy)-(?:[6-9]\d{2}|950)\b/.test(className) ||
    /\b(?:bg-black|dark)\b/.test(className);

  const monoColor = mono ? (isOnDark ? '#ffffff' : '#0f172a') : null;

  const gradientId = 'lv1-grad';
  const maskId = 'lv1-mask';
  const tileFill = mono ? (monoColor as string) : `url(#${gradientId})`;
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
        width={tileSize}
        height={tileSize}
        viewBox="0 0 80 80"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
        shapeRendering="geometricPrecision"
        className={mono ? '' : 'drop-shadow-md'}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="80" height="80">
            {/* White = tile visible. Black = punched through to background. */}
            <rect x="0" y="0" width="80" height="80" fill="white" />

            {/* Letter P — left stem + bowl. */}
            <rect x="18" y="18" width="8" height="44" fill="black" />
            <path
              d="M26 18 H38 a10 10 0 0 1 0 20 H26 Z"
              fill="black"
            />
            {/* Bowl counter (white = brought back). */}
            <rect x="26" y="24" width="12" height="8" rx="4" fill="white" />

            {/* Letter H — two stems + crossbar, intertwined with the P bowl. */}
            <rect x="46" y="18" width="8" height="44" fill="black" />
            <rect x="60" y="18" width="8" height="44" fill="black" />
            <rect x="46" y="36" width="22" height="8" fill="black" />

            {/* Negative-space link: white sliver where P bowl meets H stem,
                creating the intertwined read at small sizes. */}
            <rect x="38" y="26" width="8" height="4" fill="white" />
          </mask>
        </defs>

        <rect
          x="0"
          y="0"
          width="80"
          height="80"
          rx="20"
          ry="20"
          fill={tileFill}
          mask={`url(#${maskId})`}
        />
      </svg>

      <span className="flex flex-col justify-center leading-none">
        {showEyebrow && (
          <span
            className="uppercase"
            style={{
              fontSize: eyebrowSize,
              color: eyebrowColor,
              letterSpacing: '0.18em',
              marginBottom: eyebrowGap,
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
            color: wordColor,
            fontFamily:
              'Poppins, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
            letterSpacing: '0.01em',
            lineHeight: 1,
          }}
        >
          Portal Home
        </span>
      </span>
    </span>
  );
}

export { LogoVariant1 };
