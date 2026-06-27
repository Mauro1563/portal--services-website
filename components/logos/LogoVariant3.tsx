/**
 * LogoVariant3 — Typography-only wordmark. "Portal" in slate ink, "Home" in a
 * cyan→blue gradient, separated by a small cyan accent dot. Sits under a tight
 * uppercase eyebrow ("Cleaning & Facilities") at md and up.
 */
import type { CSSProperties } from 'react';

type Size = 'sm' | 'md' | 'lg' | 'xl';

export interface LogoVariant3Props {
  size?: Size;
  mono?: boolean;
  className?: string;
}

// Overall lockup height (eyebrow + wordmark), in px.
const SIZE_PX: Record<Size, number> = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

const WORDMARK_PX: Record<Size, number> = {
  sm: 22,
  md: 24,
  lg: 32,
  xl: 46,
};

const EYEBROW_PX: Record<Size, number> = {
  sm: 8,
  md: 9,
  lg: 11,
  xl: 14,
};

const DOT_PX: Record<Size, number> = {
  sm: 3,
  md: 4,
  lg: 5,
  xl: 7,
};

const EYEBROW_GAP_PX: Record<Size, number> = {
  sm: 2,
  md: 3,
  lg: 4,
  xl: 6,
};

export default function LogoVariant3({
  size = 'md',
  mono = false,
  className = '',
}: LogoVariant3Props) {
  const totalPx = SIZE_PX[size];
  const wordPx = WORDMARK_PX[size];
  const eyebrowPx = EYEBROW_PX[size];
  const dotPx = DOT_PX[size];
  const eyebrowGap = EYEBROW_GAP_PX[size];

  // Eyebrow is too cramped at sm — only render at md/lg/xl.
  const showEyebrow = size !== 'sm';

  // Detect dark contexts (explicit text-white, or dark-ish bg utility on wrapper).
  const isOnDark =
    /\btext-white\b/.test(className) ||
    /\bbg-(?:slate|gray|zinc|neutral|stone|black|ink|navy)-(?:[6-9]\d{2}|950)\b/.test(className) ||
    /\b(?:bg-black|dark)\b/.test(className);

  // Color tokens (integer-free strings; resolved once).
  const inkColor = isOnDark ? '#ffffff' : '#0f172a'; // white / slate-900
  const eyebrowColor = mono
    ? isOnDark
      ? 'rgba(255,255,255,0.65)'
      : '#475569' // slate-600
    : isOnDark
      ? '#cbd5e1' // slate-300
      : '#64748b'; // slate-500
  const dotColor = mono ? inkColor : '#22d3ee'; // cyan-400

  // Integer vertical nudge so the dot sits on the cap-line midpoint.
  const dotShiftPx = Math.max(1, Math.round(wordPx * 0.18));
  // Integer horizontal breathing room around the dot.
  const dotGapPx = Math.max(2, Math.round(dotPx * 1.2));

  const wrapperStyle: CSSProperties = {
    height: totalPx,
    justifyContent: 'center',
  };

  const eyebrowStyle: CSSProperties = {
    fontSize: eyebrowPx,
    color: eyebrowColor,
    letterSpacing: '0.18em',
    lineHeight: 1,
    marginBottom: eyebrowGap,
    fontWeight: 500,
  };

  const wordmarkStyle: CSSProperties = {
    fontSize: wordPx,
    lineHeight: 1,
    fontFamily:
      'Poppins, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    letterSpacing: '-0.01em',
  };

  const portalStyle: CSSProperties = { color: inkColor };

  const dotStyle: CSSProperties = {
    width: dotPx,
    height: dotPx,
    marginLeft: dotGapPx,
    marginRight: dotGapPx,
    backgroundColor: dotColor,
    transform: `translateY(-${dotShiftPx}px)`,
  };

  // "Home" — gradient text-clip in color mode, solid ink in mono.
  const homeClassName = mono
    ? ''
    : 'bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent';
  const homeStyle: CSSProperties = mono ? { color: inkColor } : {};

  return (
    <span
      role="img"
      aria-label="Portal Home"
      className={`inline-flex flex-col leading-none ${className}`}
      style={wrapperStyle}
    >
      {showEyebrow && (
        <span className="uppercase" style={eyebrowStyle}>
          Cleaning &amp; Facilities
        </span>
      )}
      <span
        className="inline-flex items-baseline font-display font-semibold"
        style={wordmarkStyle}
      >
        <span style={portalStyle}>Portal</span>
        <span
          aria-hidden="true"
          className="inline-block rounded-full"
          style={dotStyle}
        />
        <span className={homeClassName} style={homeStyle}>
          Home
        </span>
      </span>
    </span>
  );
}

export { LogoVariant3 };
