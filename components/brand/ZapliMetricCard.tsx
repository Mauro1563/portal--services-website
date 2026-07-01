/**
 * ZapliMetricCard — the white-on-light dashboard tile.
 *
 * Anatomy (top to bottom, left to right):
 *   - A 6px electric-cyan dot anchors the top-left as a brand stitch — the
 *     same neon that lights up the primary CTA, just punctuation-sized here.
 *   - Optional delta chip pins to the top-right: emerald for positive, rose
 *     for negative. Both use the *-50/*-700 pairing for AA contrast on white.
 *   - Label is 11px uppercase tracking-wider in slate-600 — small enough to
 *     defer to the value, large enough to remain legible.
 *   - Value is 3xl semibold with tabular-nums so digit columns line up
 *     across a row of cards (no width shimmer between 1.2M and 8.9M).
 *
 * Interactivity: when `href` is set we render as a Next `Link` and add a
 * cyan-tinted lift shadow + 2px translate on hover so the card reads as a
 * navigable surface. Without `href` it stays a static `<div>` — no fake
 * affordance, no pointer cursor.
 *
 * `icon` is an optional render slot in the top-right *next to* the delta
 * chip; pass any ReactNode (typically a 16px lucide-ish glyph).
 */

import Link from 'next/link';
import type { ReactNode } from 'react';

export type ZapliMetricDelta = {
  value: string;
  positive: boolean;
};

export type ZapliMetricCardProps = {
  label: string;
  value: string;
  delta?: ZapliMetricDelta;
  icon?: ReactNode;
  href?: string;
};

// Resting shadow: a tight 1px hairline plus a soft, long ambient drop.
const RESTING_SHADOW =
  'shadow-[0_1px_2px_rgba(15,23,42,0.04),_0_8px_24px_-12px_rgba(15,23,42,0.08)]';

// Hover shadow (link variant only): the ambient drop warms to cyan so the
// lift feels branded, not generic.
const HOVER_SHADOW =
  'hover:shadow-[0_2px_4px_rgba(15,23,42,0.06),_0_12px_32px_-12px_rgba(0,216,199,0.18)]';

const BASE_CLASSES =
  'relative block bg-white text-[#1A1A1A] ' +
  'border border-[rgba(129,134,157,0.25)] rounded-2xl p-5 ' +
  'transition-all duration-200 ease-out';

function CardChrome({
  label,
  value,
  delta,
  icon,
}: Pick<ZapliMetricCardProps, 'label' | 'value' | 'delta' | 'icon'>) {
  return (
    <>
      {/* Top row: cyan brand-dot anchors the card; delta chip + optional
          icon float to the right. Using absolute positioning for the dot
          keeps it visually pinned to the corner regardless of label length. */}
      <span
        aria-hidden="true"
        className="absolute top-4 left-4 block h-1.5 w-1.5 rounded-full bg-[#10B981]"
      />

      {(delta || icon) && (
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {delta && (
            <span
              className={
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ' +
                (delta.positive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700')
              }
            >
              {delta.value}
            </span>
          )}
          {icon && (
            <span className="text-[#475569] flex items-center" aria-hidden="true">
              {icon}
            </span>
          )}
        </div>
      )}

      {/* Spacer pushes label below the dot row; mt-2 from the top padding
          edge gives the dot room to breathe before the label starts. */}
      <div className="mt-2 text-[11px] uppercase tracking-wider text-[#475569]">
        {label}
      </div>
      <div className="mt-1 text-3xl font-semibold tabular-nums">
        {value}
      </div>
    </>
  );
}

export function ZapliMetricCard({
  label,
  value,
  delta,
  icon,
  href,
}: ZapliMetricCardProps) {
  const classes = href
    ? `${BASE_CLASSES} ${RESTING_SHADOW} ${HOVER_SHADOW} hover:-translate-y-0.5`
    : `${BASE_CLASSES} ${RESTING_SHADOW}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        <CardChrome label={label} value={value} delta={delta} icon={icon} />
      </Link>
    );
  }

  return (
    <div className={classes}>
      <CardChrome label={label} value={value} delta={delta} icon={icon} />
    </div>
  );
}

export default ZapliMetricCard;
