'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';

/**
 * PortalServicesLogo
 *
 * Renders the Portal Services Digital brand lockup using the master PNG
 * asset located at `/public/brand/portal-services-logo.png`.
 *
 * Variants:
 * - `light`: The logo is displayed as-is with its native chrome/silver
 *   finish. Use this on dark surfaces (navy, black, hero backgrounds)
 *   where the metallic gradient reads well.
 * - `dark`: The logo is tinted deep navy via a CSS filter chain
 *   (invert + sepia + hue-rotate + saturate) so it reads as a solid
 *   navy mark. Use this on light surfaces (white, cream, gray-50)
 *   where the chrome would otherwise disappear.
 * - `auto`: Falls back to `dark` tinting by default, but is intended
 *   to be used in components that inherit `currentColor` context
 *   (e.g. inside a themed header). Prefer explicit variants when the
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

// Filter chain that converts the chrome/silver artwork to the Portal
// Services navy (#0B2A6B). The invert flips lights to darks, sepia
// provides a warm base, and the hue-rotate/saturate combination pulls
// the tone toward navy without washing out edges.
const NAVY_TINT_FILTER =
  'brightness(0) saturate(100%) invert(13%) sepia(58%) saturate(3200%) hue-rotate(220deg) brightness(92%) contrast(101%)';

export function PortalServicesLogo({
  variant = 'auto',
  size = 'md',
  showWordmark = true,
  className,
}: PortalServicesLogoProps) {
  const pxSize = SIZE_PX[size];

  // `auto` defaults to the dark tint since the majority of marketing
  // surfaces are light. Consumers that need chrome-on-dark should pass
  // `variant="light"` explicitly.
  const resolvedVariant = variant === 'auto' ? 'dark' : variant;

  const markStyle: CSSProperties =
    resolvedVariant === 'dark' ? { filter: NAVY_TINT_FILTER } : {};

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
      <Image
        src="/brand/portal-services-logo.png"
        alt=""
        aria-hidden="true"
        width={pxSize}
        height={pxSize}
        priority
        style={{
          height: pxSize,
          width: 'auto',
          ...markStyle,
        }}
      />
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
