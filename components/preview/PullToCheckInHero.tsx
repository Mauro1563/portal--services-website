'use client';

/**
 * PullToCheckInHero
 * -----------------
 * Wraps the "Siguiente parada" hero card and adds a vertical pull-down
 * gesture. When the heroTask is scheduled, the cleaner can drag the card
 * downward with their thumb. A pill ("Suelta para hacer check-in")
 * reveals from beneath with a rubber-band that visibly stiffens past
 * 64px. Release past 88px commits a check-in; release earlier snaps
 * back. Reduced-motion clients get a normal tap target via the existing
 * Check-in chip in the agenda card below, so we render the gesture only
 * when motion is allowed.
 */
import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

const PULL_THRESHOLD = 88;
const PILL_REVEAL_AT = 24;
const PILL_FULL_AT = 72;

export function PullToCheckInHero({
  enabled,
  onCheckIn,
  children,
}: {
  /** True when the hero task is scheduled and can be checked in. */
  enabled: boolean;
  onCheckIn: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);
  const startX = useRef<number | null>(null);
  const axisLocked = useRef<'x' | 'y' | null>(null);
  const pointerIdRef = useRef<number | null>(null);

  const [pull, setPull] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(m.matches);
    update();
    m.addEventListener?.('change', update);
    return () => m.removeEventListener?.('change', update);
  }, []);

  function reset() {
    startY.current = null;
    startX.current = null;
    axisLocked.current = null;
    pointerIdRef.current = null;
    setDragging(false);
    setPull(0);
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!enabled) return;
    const t = e.target as HTMLElement;
    if (t.closest('a, button, input')) return;
    startY.current = e.clientY;
    startX.current = e.clientX;
    axisLocked.current = null;
    pointerIdRef.current = e.pointerId;
    try {
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    } catch {
      /* noop */
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (startY.current == null || startX.current == null) return;
    const dy = e.clientY - startY.current;
    const dx = e.clientX - startX.current;

    if (axisLocked.current == null) {
      if (Math.abs(dy) < 6 && Math.abs(dx) < 6) return;
      axisLocked.current = Math.abs(dy) > Math.abs(dx) ? 'y' : 'x';
      if (axisLocked.current === 'x') {
        reset();
        return;
      }
      setDragging(true);
    }

    if (axisLocked.current === 'y' && dy > 0) {
      // Rubber band: translateY = dy * (1 - dy/400), asymptote ~100px.
      const rubber = dy * (1 - Math.min(0.9, dy / 400));
      setPull(rubber);
    } else if (axisLocked.current === 'y' && dy <= 0) {
      setPull(0);
    }
  }

  function onPointerUp() {
    if (startY.current == null) return;
    if (pull >= PULL_THRESHOLD) {
      // Commit: pulse the card once, fire the check-in.
      setPulsing(true);
      window.setTimeout(() => setPulsing(false), 380);
      onCheckIn();
    }
    setPull(0);
    window.setTimeout(reset, reducedMotion ? 0 : 220);
  }

  const armed = pull >= PULL_THRESHOLD;
  const pillProgress = Math.max(
    0,
    Math.min(1, (pull - PILL_REVEAL_AT) / (PILL_FULL_AT - PILL_REVEAL_AT)),
  );

  const transition = dragging
    ? 'none'
    : reducedMotion
      ? 'transform 120ms linear'
      : 'transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1)';

  return (
    <div className="relative">
      {/* Hint pill beneath the card. Translates from -100% up into view as
          the user pulls. Switches copy once the commit threshold is hit. */}
      {enabled ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-2 z-0 flex justify-center"
          style={{
            transform: `translateY(${-100 + pillProgress * 110}%)`,
            opacity: pillProgress,
            transition: dragging ? 'none' : 'transform 200ms ease-out, opacity 200ms ease-out',
          }}
        >
          <span
            className={`ps-mono inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] transition-colors ${
              armed
                ? 'bg-[#FF5B1F] text-[#1A0A04]'
                : 'bg-[#F4EFE6] text-[#141414] border border-[#1414141A]'
            }`}
            style={{ transitionDuration: 'var(--dur-fast)', transitionTimingFunction: 'var(--ease)' }}
          >
            <Play
              className="h-3 w-3"
              style={{
                transform: `rotate(${armed ? 90 : 0}deg)`,
                transition: 'transform 160ms ease-out',
              }}
            />
            {armed ? 'suelta para hacer check-in' : 'tira para hacer check-in'}
          </span>
        </div>
      ) : null}

      <div
        ref={ref}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          transform: `translateY(${pull}px) scale(${pulsing ? 1.02 : 1})`,
          transition,
          touchAction: enabled ? 'pan-x' : 'auto',
        }}
        className="relative z-10"
      >
        {children}
      </div>
    </div>
  );
}
