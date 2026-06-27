import * as React from 'react';

type Size = 'sm' | 'md' | 'lg' | 'xl';

export interface LogoVariant2Props {
  size?: Size;
  mono?: boolean;
  className?: string;
}

const SIZE_PX: Record<Size, number> = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

const WORDMARK_PX: Record<Size, number> = {
  sm: 14,
  md: 18,
  lg: 24,
  xl: 32,
};

const EYEBROW_PX: Record<Size, number> = {
  sm: 7,
  md: 9,
  lg: 11,
  xl: 14,
};

export default function LogoVariant2({
  size = 'md',
  mono = false,
  className = '',
}: LogoVariant2Props): React.ReactElement {
  const px = SIZE_PX[size];
  const wordPx = WORDMARK_PX[size];
  const eyebrowPx = EYEBROW_PX[size];
  const gradientId = React.useId();

  const isDarkBg = /\b(bg-(slate|gray|zinc|neutral|stone|black)-(800|900|950)|bg-black|text-white|dark)\b/.test(
    className,
  );

  const strokeColor = mono
    ? isDarkBg
      ? '#ffffff'
      : '#0f172a'
    : `url(#${gradientId})`;

  const wordmarkColor = mono
    ? isDarkBg
      ? 'text-white'
      : 'text-slate-900'
    : isDarkBg
      ? 'text-white'
      : 'text-slate-900';

  const eyebrowColor = mono
    ? isDarkBg
      ? 'text-white/70'
      : 'text-slate-500'
    : isDarkBg
      ? 'text-cyan-200'
      : 'text-cyan-600';

  return (
    <span
      className={`inline-flex items-center gap-3 ${className}`}
      aria-label="Portal Home"
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="4"
            y1="4"
            x2="36"
            y2="36"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        {/* Single continuous-stroke house silhouette with door */}
        <path
          d="M6 18 L20 6 L34 18 L34 34 L24 34 L24 22 L16 22 L16 34 L6 34 Z"
          stroke={strokeColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Keyhole dot on door */}
        <circle cx="21.5" cy="28" r="1.1" fill={strokeColor} />
      </svg>

      <span className="flex flex-col leading-none">
        <span
          className={`uppercase tracking-[0.18em] font-medium ${eyebrowColor}`}
          style={{ fontSize: eyebrowPx, lineHeight: 1 }}
        >
          Cleaning &amp; Facilities
        </span>
        <span
          className={`font-semibold tracking-tight ${wordmarkColor}`}
          style={{ fontSize: wordPx, lineHeight: 1.1, marginTop: eyebrowPx * 0.45 }}
        >
          Portal Home
        </span>
      </span>
    </span>
  );
}
