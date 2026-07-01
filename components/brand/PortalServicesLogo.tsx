/**
 * PortalServicesLogo
 *
 * Renders the Portal Services Digital brand mark using
 * `/public/brand/portal-services-logo.png` as a CSS mask, so the
 * silhouette of the PNG is painted with an exact palette color instead
 * of relying on a CSS filter chain (which was producing a purple tint
 * because chrome/silver → hue-rotate is imprecise).
 *
 * Variants:
 * - `light`: mark is painted white (`#F8FAFC`) — use on dark surfaces
 *   (navy hero, footer).
 * - `dark`:  mark is painted deep navy (`#0B2A6B`) — use on light
 *   surfaces (white nav, cream card).
 * - `auto`:  defaults to `dark`. Prefer explicit variants when the
 *   surface color is known at authoring time.
 *
 * Sizes map to the vertical height of the mark:
 * - `sm`: 28px  (dense nav bars, footers)
 * - `md`: 40px  (standard header)
 * - `lg`: 56px  (hero, marketing pages)
 *
 * The wordmark "Portal Services Digital" renders adjacent to the mark
 * unless `showWordmark` is set to `false` (icon-only usage).
 */

import type { CSSProperties } from 'react';

export interface PortalServicesLogoProps {
  variant?: 'auto' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

const SIZE_PX: Record<NonNullable<PortalServicesLogoProps['size']>, number> = {
  sm: 28,
  md: 40,
  lg: 56,
};

const WORDMARK_TEXT_SIZE: Record<
  NonNullable<PortalServicesLogoProps['size']>,
  string
> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
};

// Exact palette colors — no filter math involved. What you set here is
// what you see. Adjust here to move the entire brand mark's tint site-wide.
const DARK_COLOR = '#0B2A6B'; // navy on light surfaces
const LIGHT_COLOR = '#F8FAFC'; // near-white on dark surfaces

const MASK_URL = "url('/brand/portal-services-logo.png')";

export function PortalServicesLogo({
  variant = 'auto',
  size = 'md',
  showWordmark = true,
  className,
}: PortalServicesLogoProps) {
  const pxSize = SIZE_PX[size];

  const resolvedVariant = variant === 'auto' ? 'dark' : variant;
  const markColor = resolvedVariant === 'dark' ? DARK_COLOR : LIGHT_COLOR;

  // Mask-based render: the PNG's alpha channel dictates the shape, the
  // background-color paints it in the exact palette hue. No filter, no
  // hue drift.
  const markStyle: CSSProperties = {
    display: 'inline-block',
    width: pxSize,
    height: pxSize,
    backgroundColor: markColor,
    WebkitMaskImage: MASK_URL,
    maskImage: MASK_URL,
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
  };

  const wordmarkColor =
    resolvedVariant === 'dark' ? 'text-[#0B2A6B]' : 'text-white';

  return (
    <span
      role="img"
      aria-label="Portal Services Digital"
      className={[
        'inline-flex items-center gap-2 align-middle',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span aria-hidden="true" style={markStyle} />
      {showWordmark && (
        <span
          className={[
            'font-semibold tracking-tight whitespace-nowrap',
            WORDMARK_TEXT_SIZE[size],
            wordmarkColor,
          ].join(' ')}
        >
          Portal Services Digital
        </span>
      )}
    </span>
  );
}

export default PortalServicesLogo;
