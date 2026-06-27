/**
 * RollingStat — wraps a stat-chip value with the Rolling digit-flip on
 * first mount only. Subsequent navigations show static numbers (gated
 * via sessionStorage) so the delight doesn't fatigue.
 *
 * The accent chip ('Próximas') also fires a one-shot ring pulse after
 * the digits land — passed via the `pulse` prop. Total cost: one
 * transform per digit + one keyframe per pulse, all GPU-composited,
 * no infinite loops.
 */
'use client';

import { useEffect, useState } from 'react';
import { Rolling } from './Rolling';

const SESSION_KEY = 'previewChipsSeen';

/** Has the user already seen the chip animation this session? */
function readSeen(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return true;
  }
}

function markSeen() {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* private mode — no-op */
  }
}

export function RollingStat({
  value,
  pulse = false,
  className,
}: {
  value: string;
  pulse?: boolean;
  className?: string;
}) {
  // We render static on the server and on subsequent client mounts to
  // avoid hydration mismatch and re-firing the celebration.
  const [animate, setAnimate] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    const seen = readSeen();
    if (seen) return;
    setAnimate(true);
    markSeen();
    if (pulse) {
      // Pulse fires right after the digits land (~750ms).
      const t = window.setTimeout(() => setShowPulse(true), 750);
      // Auto-clear so the element doesn't keep a stale animation class.
      const t2 = window.setTimeout(() => setShowPulse(false), 750 + 700);
      return () => {
        window.clearTimeout(t);
        window.clearTimeout(t2);
      };
    }
    return undefined;
  }, [pulse]);

  return (
    <span className={`relative inline-flex ${className ?? ''}`}>
      <Rolling value={value} animate={animate} />
      {showPulse && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -m-3 rounded-2xl"
          style={{
            animation:
              'demo-halo-pulse 700ms cubic-bezier(0.22, 1, 0.36, 1) both',
            background: 'currentColor',
            opacity: 0.18,
          }}
        />
      )}
    </span>
  );
}
