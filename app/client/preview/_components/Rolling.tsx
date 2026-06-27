/**
 * Rolling number — a per-digit roller-shutter ticker.
 * Each digit is a vertically stacked column 0–9 translated by translateY
 * (-digit * 1em). Eased ease-out-expo over 600–800ms with a staggered
 * per-digit delay of ~60ms. The first time the component mounts the
 * digits roll from 0 → target. After that we render the final value
 * statically (gate handled by the caller via the `animate` prop), so
 * the delight stays special and doesn't re-fire on every navigation.
 *
 * Non-digit characters ('.', ',', ' ', etc.) render in place — only
 * 0–9 columns animate. Decimals slide in last because their digit
 * position is further right.
 */
'use client';

import { useEffect, useState } from 'react';

export function Rolling({
  value,
  animate = true,
  durationMs = 700,
  perDigitDelayMs = 60,
  className,
}: {
  value: string;
  animate?: boolean;
  durationMs?: number;
  perDigitDelayMs?: number;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!animate) return;
    // Defer to next frame so the initial 0-state paints first, then we
    // transition into the target — giving the column its roll motion.
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  const chars = value.split('');

  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'baseline', whiteSpace: 'pre' }}
    >
      {chars.map((ch, i) => {
        const isDigit = ch >= '0' && ch <= '9';
        if (!isDigit) {
          return (
            <span key={`s-${i}`} aria-hidden style={{ lineHeight: 1 }}>
              {ch}
            </span>
          );
        }
        const target = Number(ch);
        const offset = animate && !mounted ? 0 : target;
        // Stagger from the right so the rightmost digits land last —
        // makes the decimal feel like the final flourish.
        const digitsToRight = chars.slice(i + 1).filter((c) => c >= '0' && c <= '9').length;
        const delay = animate ? digitsToRight * perDigitDelayMs : 0;
        return (
          <span
            key={`d-${i}`}
            aria-hidden
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              height: '1em',
              lineHeight: 1,
              verticalAlign: 'baseline',
            }}
          >
            <span
              className="client-digit-col"
              style={{
                transform: `translateY(-${offset}em)`,
                transitionDuration: `${durationMs}ms`,
                transitionDelay: `${delay}ms`,
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <span key={n} className="client-digit-cell">
                  {n}
                </span>
              ))}
            </span>
          </span>
        );
      })}
      {/* Screen-reader friendly: announce the final value once. */}
      <span className="sr-only">{value}</span>
    </span>
  );
}
