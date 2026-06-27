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

/**
 * Variant 1 — Geometric "PH" monogram in a rounded tile with a cyan→blue
 * gradient. Letters are punched white. Wordmark "Portal Home" sits to the
 * right with a thin uppercase eyebrow.
 */
export default function LogoVariant1({
  size = 'md',
  mono = false,
  className = '',
}: LogoVariant1Props) {
  const h = sizePx[size];
  const tileSize = h;
  const radius = Math.round(h * 0.26); // 16–20px at md/lg

  // Letter type scales with the mark height.
  const wordSize = Math.round(h * 0.42);
  const eyebrowSize = Math.max(8, Math.round(h * 0.13));
  const gap = Math.round(h * 0.32);

  const isOnDark = /\b(bg-(?:slate|gray|zinc|neutral|stone|black|ink|navy)-?\d*|dark)\b/.test(
    className,
  );
  const monoColor = mono ? (isOnDark ? '#ffffff' : '#0f172a') : null;

  const gradientId = 'lv1-grad';
  const tileFill = mono ? (monoColor as string) : `url(#${gradientId})`;
  const wordColor = mono ? (monoColor as string) : '#0f172a';
  const eyebrowColor = mono ? (monoColor as string) : '#475569';

  const wrapperStyle: CSSProperties = {
    height: h,
    gap,
  };

  return (
    <span
      className={`inline-flex items-center ${className}`}
      style={wrapperStyle}
      aria-label="Portal Home — Cleaning & Facilities"
    >
      <svg
        width={tileSize}
        height={tileSize}
        viewBox="0 0 80 80"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
        className={mono ? '' : 'drop-shadow-md'}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <mask id="lv1-mask">
            {/* Visible (white) areas of the mask remain filled by the tile. */}
            <rect x="0" y="0" width="80" height="80" fill="white" />

            {/* Letter P — stem + bowl, punched out (black = transparent). */}
            <rect x="18" y="18" width="7" height="44" fill="black" />
            <path
              d="M25 18 H38 a11 11 0 0 1 0 22 H25 Z"
              fill="black"
            />
            <circle cx="38" cy="29" r="5" fill="white" />

            {/* Letter H — two stems joined by a crossbar, intertwined with P. */}
            <rect x="44" y="18" width="7" height="44" fill="black" />
            <rect x="55" y="18" width="7" height="44" fill="black" />
            <rect x="44" y="36" width="18" height="7" fill="black" />
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
          mask="url(#lv1-mask)"
        />
      </svg>

      <span className="flex flex-col justify-center leading-none">
        <span
          className="uppercase tracking-[0.18em]"
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
