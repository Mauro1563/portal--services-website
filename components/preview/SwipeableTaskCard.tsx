'use client';

/**
 * SwipeableTaskCard
 * -----------------
 * Wraps the agenda row's interactive card. On a touch/pointer device the
 * cleaner can swipe the in-progress card horizontally:
 *
 *   • Right swipe ≥ 55% width  → commit  → onComplete()
 *   • Left  swipe ≥ 55% width  → commit  → onCallClient()
 *
 * The row tracks the finger 1:1, an emerald CheckCircle emerges from the
 * left edge with a soft green wash, and a "Llamar al cliente" action
 * surfaces on the right edge for a left-swipe. Below the commit threshold
 * we spring back with a snappy cubic-bezier.
 *
 * On desktop / fine pointers (and when reduced motion is requested) the
 * swipe still works but the visual choreography is minimal — the existing
 * "Marcar completada" button below this card remains the primary path.
 */
import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Phone } from 'lucide-react';

const COMMIT_RATIO = 0.55; // fraction of card width to trigger
const MAX_RUBBER = 1.0; // hard cap on drag offset (×width)

type Props = {
  /** True when the swipe gesture should be active (in_progress task). */
  enabled: boolean;
  /** Called on right-swipe commit. */
  onComplete: () => void;
  /** Called on left-swipe commit. */
  onCallClient: () => void;
  children: React.ReactNode;
};

export function SwipeableTaskCard({
  enabled,
  onComplete,
  onCallClient,
  children,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const axisLocked = useRef<'x' | 'y' | null>(null);
  const widthRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);

  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [committed, setCommitted] = useState<null | 'right' | 'left'>(null);
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
    setDx(0);
    setDragging(false);
    axisLocked.current = null;
    startX.current = null;
    startY.current = null;
    pointerIdRef.current = null;
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!enabled || committed) return;
    // Don't hijack clicks on buttons/inputs inside the card.
    const t = e.target as HTMLElement;
    if (t.closest('button, a, input, textarea, select')) return;

    widthRef.current = cardRef.current?.getBoundingClientRect().width ?? 320;
    startX.current = e.clientX;
    startY.current = e.clientY;
    axisLocked.current = null;
    pointerIdRef.current = e.pointerId;
    try {
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    } catch {
      /* noop */
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (startX.current == null || startY.current == null) return;
    if (committed) return;
    const ddx = e.clientX - startX.current;
    const ddy = e.clientY - startY.current;

    if (axisLocked.current == null) {
      if (Math.abs(ddx) < 8 && Math.abs(ddy) < 8) return;
      axisLocked.current = Math.abs(ddx) > Math.abs(ddy) ? 'x' : 'y';
      if (axisLocked.current === 'y') {
        // Hand it back to the page for vertical scrolling.
        reset();
        return;
      }
      setDragging(true);
    }

    if (axisLocked.current === 'x') {
      const w = widthRef.current || 1;
      const clamped = Math.max(-w * MAX_RUBBER, Math.min(w * MAX_RUBBER, ddx));
      setDx(clamped);
    }
  }

  function onPointerUp() {
    if (startX.current == null) return;
    const w = widthRef.current || 1;
    const ratio = dx / w;
    if (ratio >= COMMIT_RATIO) {
      // Right-swipe commit → complete.
      setCommitted('right');
      setDx(w * 1.05);
      // Let the snap-out animate, then fire the handler.
      window.setTimeout(() => {
        onComplete();
        reset();
        setCommitted(null);
      }, reducedMotion ? 0 : 180);
    } else if (ratio <= -COMMIT_RATIO) {
      setCommitted('left');
      setDx(-w * 1.05);
      window.setTimeout(() => {
        onCallClient();
        reset();
        setCommitted(null);
      }, reducedMotion ? 0 : 180);
    } else {
      // Snap back.
      setDx(0);
      window.setTimeout(() => {
        reset();
      }, reducedMotion ? 0 : 220);
    }
  }

  // Background visuals — fade in proportionally to the drag distance.
  const w = widthRef.current || 1;
  const ratio = w ? Math.min(1, Math.abs(dx) / (w * COMMIT_RATIO)) : 0;
  const isRight = dx > 0;
  const isLeft = dx < 0;

  // Spring snap-curve (snappy, not bouncy) when not dragging.
  const transition = dragging
    ? 'none'
    : reducedMotion
      ? 'transform 120ms linear'
      : 'transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)';

  return (
    <div ref={wrapRef} className="relative">
      {/* Right-swipe wash (emerald): emerges from the LEFT edge.
          Sits behind the card so its colour wipes underneath. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-start overflow-hidden rounded-2xl bg-emerald-500"
        style={{ opacity: enabled && isRight ? 0.18 + ratio * 0.55 : 0 }}
      >
        <div
          className="ml-4 flex items-center gap-2 text-white"
          style={{
            transform: `translateX(${Math.min(0, dx - 28)}px) scale(${0.85 + ratio * 0.25})`,
          }}
        >
          <CheckCircle2 className="h-6 w-6" />
          <span className="text-[12px] font-bold uppercase tracking-wider">
            Completar
          </span>
        </div>
      </div>

      {/* Left-swipe action (call client): emerges from the RIGHT edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden rounded-2xl bg-sky-600"
        style={{ opacity: enabled && isLeft ? 0.18 + ratio * 0.55 : 0 }}
      >
        <div
          className="mr-4 flex items-center gap-2 text-white"
          style={{
            transform: `translateX(${Math.max(0, dx + 28)}px) scale(${0.85 + ratio * 0.25})`,
          }}
        >
          <span className="text-[12px] font-bold uppercase tracking-wider">
            Llamar
          </span>
          <Phone className="h-5 w-5" />
        </div>
      </div>

      <div
        ref={cardRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          transform: `translateX(${dx}px)`,
          transition,
          touchAction: enabled ? 'pan-y' : 'auto',
        }}
        className="relative"
      >
        {children}
      </div>
    </div>
  );
}
