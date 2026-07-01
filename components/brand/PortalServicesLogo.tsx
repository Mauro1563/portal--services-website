/**
 * PortalServicesLogo
 *
 * Renders the Portal Services Digital brand lockup:
 *   [PC mark]  Portal Services Digital
 *              CLEANING & FACILITIES
 *
 * The mark uses `/public/brand/portal-services-logo.png` as a CSS mask
 * so the silhouette is painted with an exact palette color (no filter
 * drift into purple/violet).
 *
 * Variants:
 * - `light`: mark + text painted in near-white (`#F8FAFC`). Use on
 *   dark surfaces (navy hero, dark footer).
 * - `dark`:  mark + text painted in deep navy (`#0B2A6B`). Use on
 *   light surfaces (white nav, cream card).
 * - `auto`:  defaults to `dark`. Prefer explicit variants when the
 *   surface color is known at authoring time.
 *
 * Sizes map to the vertical height of the mark:
 * - `sm`: 28px
 * - `md`: 40px
 * - `lg`: 56px
 *
 * `showWordmark`  toggles the whole "Portal Services Digital" + tagline
 *                 block (defaults to true).
 * `showTagline`   toggles the "CLEANING & FACILITIES" line beneath the
 *                 wordmark (defaults to true).
 */

import type { CSSProperties } from 'react';

export interface PortalServicesLogoProps {
  variant?: 'auto' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  showTagline?: boolean;
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

const TAGLINE_TEXT_SIZE: Record<
  NonNullable<PortalServicesLogoProps['size']>,
  string
> = {
  sm: 'text-[7px]',
  md: 'text-[8.5px]',
  lg: 'text-[10px]',
};

// Exact palette colors — no filter math involved. Adjust here to shift
// the mark tint site-wide.
const DARK_COLOR = '#0B2A6B'; // navy on light surfaces
const LIGHT_COLOR = '#F8FAFC'; // near-white on dark surfaces

const MASK_URL = "url('/brand/portal-services-logo.png')";

const TAGLINE_TEXT = 'CLEANING & FACILITIES';

export function PortalServicesLogo({
  variant = 'auto',
  size = 'md',
  showWordmark = true,
  showTagline = true,
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

  // Tagline color — teal-cold (matches the "Explore Home" CTA). Deeper
  // #0EA5A4 on light surfaces, brighter #5EEAD4 (teal-300) on dark so
  // it stays readable on the navy footer/hero. Applied inline instead
  // of via a Tailwind arbitrary-value class so it survives every JIT
  // scanning edge case — the browser sees a plain inline style.
  const TAGLINE_HEX = resolvedVariant === 'dark' ? '#0EA5A4' : '#5EEAD4';

  return (
    <span
      role="img"
      aria-label="Portal Services Digital — Cleaning & Facilities"
      className={[
        'inline-flex items-center gap-2 align-middle',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span aria-hidden="true" style={markStyle} />
      {showWordmark && (
        <span className="flex flex-col leading-tight">
          <span
            className={[
              'font-semibold tracking-tight whitespace-nowrap',
              WORDMARK_TEXT_SIZE[size],
              wordmarkColor,
            ].join(' ')}
          >
            Portal Services Digital
          </span>
          {showTagline && (
            <span
              className={[
                'mt-0.5 font-semibold uppercase tracking-[0.22em] whitespace-nowrap',
                TAGLINE_TEXT_SIZE[size],
              ].join(' ')}
              style={{ color: TAGLINE_HEX }}
            >
              {TAGLINE_TEXT}
            </span>
          )}
        </span>
      )}
    </span>
  );
}

export default PortalServicesLogo;
