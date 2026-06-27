import * as React from 'react';

type Size = 'sm' | 'md' | 'lg' | 'xl';

export interface LogoVariant3Props {
  size?: Size;
  mono?: boolean;
  className?: string;
}

// Overall height of the lockup (eyebrow + wordmark), in px.
const SIZE_PX: Record<Size, number> = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

const WORDMARK_PX: Record<Size, number> = {
  sm: 18,
  md: 24,
  lg: 32,
  xl: 46,
};

const EYEBROW_PX: Record<Size, number> = {
  sm: 7,
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

export default function LogoVariant3({
  size = 'md',
  mono = false,
  className = '',
}: LogoVariant3Props): React.ReactElement {
  const totalPx = SIZE_PX[size];
  const wordPx = WORDMARK_PX[size];
  const eyebrowPx = EYEBROW_PX[size];
  const dotPx = DOT_PX[size];

  const isDarkBg =
    /\b(bg-(slate|gray|zinc|neutral|stone|black)-(800|900|950)|bg-black|text-white|dark)\b/.test(
      className,
    );

  // Color tokens
  const portalColor = mono
    ? isDarkBg
      ? 'text-white'
      : 'text-slate-900'
    : isDarkBg
      ? 'text-white'
      : 'text-slate-900';

  const eyebrowColor = mono
    ? isDarkBg
      ? 'text-white/60'
      : 'text-slate-500'
    : isDarkBg
      ? 'text-slate-300'
      : 'text-slate-500';

  const dotColorClass = mono
    ? isDarkBg
      ? 'bg-white'
      : 'bg-slate-900'
    : 'bg-cyan-400';

  // "Home" rendering: gradient text-clip in color mode, solid in mono mode.
  const homeClassName = mono
    ? isDarkBg
      ? 'text-white'
      : 'text-slate-900'
    : 'bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent';

  return (
    <span
      className={`inline-flex flex-col leading-none ${className}`}
      aria-label="Portal Home — Cleaning & Facilities"
      style={{ height: totalPx, justifyContent: 'center' }}
    >
      <span
        className={`uppercase tracking-[0.18em] font-medium ${eyebrowColor}`}
        style={{ fontSize: eyebrowPx, lineHeight: 1 }}
      >
        Cleaning &amp; Facilities
      </span>
      <span
        className="inline-flex items-baseline font-bold tracking-tight"
        style={{ fontSize: wordPx, lineHeight: 1.1, marginTop: eyebrowPx * 0.55 }}
      >
        <span className={portalColor}>Portal</span>
        <span
          className={`inline-block rounded-full ${dotColorClass}`}
          style={{
            width: dotPx,
            height: dotPx,
            marginLeft: dotPx * 1.1,
            marginRight: dotPx * 1.1,
            transform: `translateY(-${Math.max(1, Math.round(wordPx * 0.08))}px)`,
          }}
          aria-hidden="true"
        />
        <span className={homeClassName}>Home</span>
      </span>
    </span>
  );
}
