/**
 * Zapli brand mark.
 *
 * Pure inline SVG so the logo renders without network fetches and can pick up
 * gradient + currentColor styling without flashing. The mark pairs a neon
 * cyan/turquoise lightning bolt with a lowercase "zapli" wordmark (Poppins
 * via the `font-display` Tailwind family so it inherits the project's loaded
 * Poppins variable).
 *
 * `mono` collapses the gradient to a single currentColor fill — used inside
 * dark navy headers or anywhere we need the mark to read against an unknown
 * background without an exotic palette.
 */

type Size = 'sm' | 'md' | 'lg' | 'xl';

export type ZapliLogoProps = {
  size?: Size;
  mono?: boolean;
  className?: string;
};

// Per spec: heights in px for the overall mark (icon + wordmark).
const SIZE_PX: Record<Size, number> = {
  sm: 24,
  md: 32,
  lg: 44,
  xl: 64,
};

// Wordmark sizing scales with the icon. Values chosen so the "zapli" cap
// height matches the bolt cap and the optical balance feels right.
const TEXT_CLASS: Record<Size, string> = {
  sm: 'text-[15px] leading-none',
  md: 'text-[20px] leading-none',
  lg: 'text-[28px] leading-none',
  xl: 'text-[40px] leading-none',
};

// Wordmark left padding (gap between bolt and "zapli"). Scales with size.
const GAP_CLASS: Record<Size, string> = {
  sm: 'ml-1.5',
  md: 'ml-2',
  lg: 'ml-2.5',
  xl: 'ml-3',
};

export function ZapliLogo({
  size = 'md',
  mono = false,
  className = '',
}: ZapliLogoProps) {
  const px = SIZE_PX[size];
  // Stable gradient id per-instance so multiple logos on a page don't collide
  // when the browser dedupes by id. Cheap enough to do at module scope since
  // each invocation creates a fresh closure.
  const gradId = `zapli-bolt-${size}-${mono ? 'm' : 'c'}`;

  return (
    <span
      role="img"
      aria-label="Zapli"
      className={`inline-flex items-center ${className}`}
      style={{ height: px }}
    >
      {/* Lightning bolt — square viewBox so we can size by height alone. */}
      <svg
        viewBox="0 0 24 24"
        height={px}
        width={px}
        aria-hidden="true"
        focusable="false"
        className="block shrink-0"
      >
        {!mono ? (
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
        ) : null}
        {/* Classic bolt — sharp diagonal with a chevron notch. */}
        <path
          d="M13.5 2 4 13.6h6.1L9.2 22 20 9.4h-6.6L13.5 2Z"
          fill={mono ? 'currentColor' : `url(#${gradId})`}
        />
      </svg>
      <span
        className={`font-display font-semibold tracking-tight ${TEXT_CLASS[size]} ${GAP_CLASS[size]} ${
          mono ? 'text-current' : 'text-slate-900'
        }`}
      >
        zapli
      </span>
    </span>
  );
}

export default ZapliLogo;
