/**
 * SwipeVisitCard — wraps the visit-card body in a horizontally
 * draggable surface. Drag right past 35% width to ACCEPT, drag left
 * past 35% to REJECT. A subtle emerald gradient bleeds in from the
 * right (or a slate-rose gradient from the left) with a large
 * translucent action icon scaling in as the drag deepens.
 *
 * Released past threshold → card snaps with a spring-curve transition
 * (cubic-bezier(0.34, 1.56, 0.64, 1)) and fires the callback. A soft
 * navigator.vibrate(8) confirms on devices that support it.
 *
 * Reduced-motion or no-pointer support → renders children plus the
 * existing two-button row fallback (the caller still passes the
 * legacy buttons for keyboard/no-touch users).
 *
 * Built with plain pointer events — no framer-motion dependency.
 */
'use client';

import { Check, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const COMMIT_RATIO = 0.35;
const COMMIT_MIN_PX = 90;
const VELOCITY_COMMIT = 0.7; // px/ms — flick threshold

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function SwipeVisitCard({
  enabled,
  onAccept,
  onReject,
  children,
  fallback,
}: {
  enabled: boolean;
  onAccept: () => void;
  onReject: () => void;
  /** The interactive visit-card content (Link + meta). */
  children: React.ReactNode;
  /** The classic two-button row — always rendered for keyboard/reduced-motion. */
  fallback: React.ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [dx, setDx] = useState(0);
  const [snapping, setSnapping] = useState(false);
  const [reducedState, setReducedState] = useState(false);
  const dragging = useRef(false);
  const startX = useRef(0);
  const lastX = useRef(0);
  const lastT = useRef(0);
  const velocity = useRef(0);
  const widthRef = useRef(320);

  // Run once on mount — match the user's OS motion preference.
  useEffect(() => {
    setReducedState(prefersReducedMotion());
  }, []);

  const pointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled || reducedState) return;
      // Only react to primary pointer (touch / mouse left button).
      if (e.button !== undefined && e.button !== 0) return;
      dragging.current = true;
      startX.current = e.clientX;
      lastX.current = e.clientX;
      lastT.current = performance.now();
      velocity.current = 0;
      widthRef.current = wrapRef.current?.offsetWidth ?? 320;
      setSnapping(false);
      try {
        (e.target as Element).setPointerCapture?.(e.pointerId);
      } catch {
        /* capture not supported */
      }
    },
    [enabled, reducedState],
  );

  const pointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const now = performance.now();
    const dt = Math.max(1, now - lastT.current);
    velocity.current = (e.clientX - lastX.current) / dt;
    lastX.current = e.clientX;
    lastT.current = now;
    // Elastic resistance past width — caps wild swipes without locking.
    const raw = e.clientX - startX.current;
    const w = widthRef.current;
    let next = raw;
    if (Math.abs(raw) > w * 0.6) {
      const sign = raw < 0 ? -1 : 1;
      const over = Math.abs(raw) - w * 0.6;
      next = sign * (w * 0.6 + over * 0.25);
    }
    setDx(next);
  }, []);

  const finish = useCallback(
    (commit: 'accept' | 'reject' | null) => {
      setSnapping(true);
      if (commit === 'accept') {
        setDx(widthRef.current);
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try { navigator.vibrate(8); } catch { /* ignore */ }
        }
        // Let the swipe-out finish visually before unmounting.
        window.setTimeout(() => {
          setDx(0);
          setSnapping(false);
          onAccept();
        }, 220);
      } else if (commit === 'reject') {
        setDx(-widthRef.current);
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try { navigator.vibrate(8); } catch { /* ignore */ }
        }
        window.setTimeout(() => {
          setDx(0);
          setSnapping(false);
          onReject();
        }, 220);
      } else {
        setDx(0);
        window.setTimeout(() => setSnapping(false), 360);
      }
    },
    [onAccept, onReject],
  );

  const pointerUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    const w = widthRef.current;
    const threshold = Math.max(COMMIT_MIN_PX, w * COMMIT_RATIO);
    if (dx > threshold || velocity.current > VELOCITY_COMMIT) {
      finish('accept');
    } else if (dx < -threshold || velocity.current < -VELOCITY_COMMIT) {
      finish('reject');
    } else {
      finish(null);
    }
  }, [dx, finish]);

  // Cancel drag if pointer leaves the window mid-swipe.
  useEffect(() => {
    if (!dragging.current) return;
    function onUp() {
      if (dragging.current) {
        dragging.current = false;
        finish(null);
      }
    }
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [finish]);

  // Disabled (e.g. status !== 'pending') or reduced-motion → render
  // the children as-is plus the legacy two-button fallback row.
  if (!enabled || reducedState) {
    return (
      <>
        {children}
        {fallback}
      </>
    );
  }

  const w = widthRef.current;
  // Background opacity scales linearly from 0 → 1 across half the width.
  const acceptOpacity = Math.min(1, Math.max(0, dx / (w * 0.5)));
  const rejectOpacity = Math.min(1, Math.max(0, -dx / (w * 0.5)));
  const iconScale = 0.7 + Math.min(0.6, Math.abs(dx) / (w * 0.5)) * 0.6;

  return (
    <div ref={wrapRef} className="relative overflow-hidden rounded-2xl">
      {/* Accept reveal — emerald wash from the right with a check icon. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-end rounded-2xl bg-gradient-to-l from-emerald-500/95 via-emerald-500/80 to-emerald-500/0 pr-6"
        style={{ opacity: acceptOpacity }}
      >
        <Check
          className="h-12 w-12 text-white drop-shadow"
          style={{ transform: `scale(${iconScale})`, transition: 'transform 80ms linear' }}
        />
      </div>
      {/* Reject reveal — slate-rose wash from the left with X icon. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-start rounded-2xl bg-gradient-to-r from-rose-500/95 via-rose-500/80 to-rose-500/0 pl-6"
        style={{ opacity: rejectOpacity }}
      >
        <X
          className="h-12 w-12 text-white drop-shadow"
          style={{ transform: `scale(${iconScale})`, transition: 'transform 80ms linear' }}
        />
      </div>

      {/* The draggable surface. */}
      <div
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
        className={snapping ? 'client-spring-snap touch-pan-y' : 'touch-pan-y'}
        style={{
          transform: `translateX(${dx}px)`,
          // While dragging we don't transition — pure 1:1 finger tracking.
          transition: snapping ? undefined : 'none',
        }}
      >
        {children}
      </div>

      {/* Hint pill — fades out once the user starts dragging. */}
      <p
        className="pointer-events-none mt-2 text-center text-[10.5px] font-semibold uppercase tracking-[0.18em] text-slate-400 transition"
        style={{ opacity: Math.abs(dx) > 4 ? 0 : 1 }}
      >
        Desliza →  aceptar     ← rechazar
      </p>
      {/* a11y-only explanation. */}
      <p className="sr-only">
        Desliza a la derecha para aceptar, a la izquierda para rechazar.
      </p>
    </div>
  );
}
