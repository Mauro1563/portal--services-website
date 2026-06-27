'use client';

/**
 * useCountUp — small rAF-based counter with an ease-out-expo curve and
 * a single-digit overshoot tail before settling. Used by the demo
 * dashboard stat cards so revenue feels like it physically lands
 * instead of just appearing. Honors prefers-reduced-motion.
 */
import { useEffect, useRef, useState } from 'react';

type Options = {
  duration?: number;
  /** When true, jump immediately to `to` and skip animation. */
  immediate?: boolean;
};

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function useCountUp(to: number, opts: Options = {}) {
  const { duration = 900, immediate = false } = opts;
  const [value, setValue] = useState(immediate ? to : 0);
  const fromRef = useRef(immediate ? to : 0);
  const targetRef = useRef(to);

  useEffect(() => {
    if (immediate) {
      setValue(to);
      fromRef.current = to;
      targetRef.current = to;
      return;
    }
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setValue(to);
      fromRef.current = to;
      targetRef.current = to;
      return;
    }

    const from = fromRef.current;
    targetRef.current = to;
    const span = to - from;
    if (span === 0) return;

    const start = performance.now();
    let raf = 0;
    const overshoot = Math.max(1, Math.round(Math.abs(span) * 0.002)); // ~one trailing unit

    const step = (now: number) => {
      const elapsed = now - start;
      const ratio = Math.min(1, elapsed / duration);
      const eased = easeOutExpo(ratio);
      let current = from + span * eased;
      // Last 8% of the animation: nudge past the target then settle.
      if (ratio > 0.92 && ratio < 1) {
        current = to + overshoot * (1 - (ratio - 0.92) / 0.08);
      } else if (ratio >= 1) {
        current = to;
      }
      setValue(current);
      if (ratio < 1) {
        raf = requestAnimationFrame(step);
      } else {
        fromRef.current = to;
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, immediate]);

  return value;
}
