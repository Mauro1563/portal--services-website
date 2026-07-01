/**
 * ZapliButton — the canonical Zapli call-to-action.
 *
 * Two tones:
 *   - "primary" (default): the bright electric-cyan pill with neon glow that
 *     anchors hero CTAs ("Start 14-day free trial"). Dark ink on neon for
 *     AA legibility; cyan ring shadow that intensifies on hover.
 *   - "ghost": low-emphasis transparent variant with a hairline border that
 *     warms to cyan on hover — pairs alongside a primary as a secondary action.
 *
 * Polymorphic surface: when `href` is set we render a Next `Link` (handles
 * client-side routing + prefetch); otherwise we render a real `<button>` so
 * forms and `onClick` handlers behave correctly. Both branches share the same
 * class string so the visual treatment is identical.
 *
 * `disabled` short-circuits to a div-like button with reduced opacity. We
 * never render a disabled `<a>` because anchors don't honor the attribute;
 * for the link branch we drop the href and swallow clicks via pointer-events.
 */

import Link from 'next/link';
import type { ReactNode, MouseEventHandler } from 'react';

export type ZapliButtonTone = 'primary' | 'ghost';
export type ZapliButtonSize = 'sm' | 'md' | 'lg';

export type ZapliButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  tone?: ZapliButtonTone;
  size?: ZapliButtonSize;
  className?: string;
  disabled?: boolean;
};

// Padding scale tuned so the pill keeps a consistent optical weight against
// the surrounding type at each scale step.
const SIZE_CLASSES: Record<ZapliButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-6 py-3 text-base',
};

// Shared geometry + motion. Pulled out so primary/ghost stay aligned.
const BASE_CLASSES =
  'inline-flex items-center justify-center rounded-full font-semibold tracking-tight ' +
  'transition-all duration-200 ease-out ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'focus-visible:ring-offset-[#0A0D18] active:translate-y-px';

// Primary: dark ink on neon, with a 24px cyan glow that lifts on hover to
// 32px @ 60% — matches the hero CTA in the brand reference.
const PRIMARY_CLASSES =
  'bg-[#10B981] text-[#0A0D18] ' +
  'shadow-[0_0_24px_rgba(0,216,199,0.45)] ' +
  'hover:bg-[#2BF0DE] hover:shadow-[0_0_32px_rgba(0,216,199,0.6)] ' +
  'focus-visible:ring-[#10B981]/40';

// Ghost: transparent with hairline border; warms to a cyan-tinted border on
// hover so it still feels Zapli-branded without competing with the primary.
const GHOST_CLASSES =
  'bg-transparent border border-white/15 text-white ' +
  'hover:bg-white/5 hover:border-[#10B981]/40 ' +
  'focus-visible:ring-[#10B981]/40';

const DISABLED_CLASSES = 'opacity-50 cursor-not-allowed pointer-events-none';

function composeClasses({
  tone,
  size,
  disabled,
  className,
}: {
  tone: ZapliButtonTone;
  size: ZapliButtonSize;
  disabled: boolean;
  className: string;
}): string {
  const toneClasses = tone === 'primary' ? PRIMARY_CLASSES : GHOST_CLASSES;
  return [
    BASE_CLASSES,
    SIZE_CLASSES[size],
    toneClasses,
    disabled ? DISABLED_CLASSES : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function ZapliButton({
  children,
  href,
  onClick,
  tone = 'primary',
  size = 'md',
  className = '',
  disabled = false,
}: ZapliButtonProps) {
  const classes = composeClasses({ tone, size, disabled, className });

  // Link branch: route via Next Link for prefetch. When disabled we omit the
  // navigation target entirely (rendering as a span-shaped button) to avoid
  // an `<a>` that pretends to be disabled but is still keyboard-activatable.
  if (href && !disabled) {
    const handleLinkClick: MouseEventHandler<HTMLAnchorElement> = () => {
      if (onClick) onClick();
    };
    return (
      <Link href={href} onClick={handleLinkClick} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}

export default ZapliButton;
