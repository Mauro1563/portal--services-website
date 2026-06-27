'use client';

/**
 * EarningsCoinAnimator
 * --------------------
 * FLIP-style coin animation: when a task is completed, a single £ coin
 * spawns at the source rect (the completed row) and arcs across the
 * screen into the target rect (the "Hoy" figure inside the earnings
 * strip). On arrival the earnings span ticks from the old amount to the
 * new amount with an odometer-style requestAnimationFrame counter.
 *
 * The choreography is exposed through a tiny context so any descendant
 * can fire `flyFrom(sourceRect)` without prop-drilling. There is at most
 * one transient DOM node per completion, GC'd on animation end.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';

type Ctx = {
  /** Fire a coin from this rect to the registered earnings target. */
  flyFrom: (rect: DOMRect | null) => void;
  /** Register the DOM element whose textContent is the "Hoy" figure. */
  registerCounter: (el: HTMLSpanElement | null) => void;
  /** Roll the counter from prev → next pence over ~600ms. */
  rollTo: (prevPence: number, nextPence: number) => void;
};

const EarningsAnimationContext = createContext<Ctx | null>(null);

export function useEarningsAnimation(): Ctx {
  return (
    useContext(EarningsAnimationContext) ?? {
      flyFrom: () => undefined,
      registerCounter: () => undefined,
      rollTo: () => undefined,
    }
  );
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function formatMoney(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

export function EarningsAnimationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const registerCounter = useCallback((el: HTMLSpanElement | null) => {
    counterRef.current = el;
  }, []);

  const rollTo = useCallback((prevPence: number, nextPence: number) => {
    const el = counterRef.current;
    if (!el) return;
    if (prevPence === nextPence) return;

    if (prefersReducedMotion()) {
      el.textContent = formatMoney(nextPence);
      return;
    }

    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);

    const duration = 600;
    const start = performance.now();
    const delta = nextPence - prevPence;

    function step(now: number) {
      const t = Math.min(1, (now - start) / duration);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - t, 4);
      const current = Math.round(prevPence + delta * eased);
      if (el) el.textContent = formatMoney(current);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    }
    rafRef.current = requestAnimationFrame(step);
  }, []);

  const flyFrom = useCallback((rect: DOMRect | null) => {
    if (typeof document === 'undefined') return;
    if (!rect) return;
    const target = counterRef.current;
    if (!target) return;

    if (prefersReducedMotion()) return; // counter still rolls in rollTo

    const targetRect = target.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    const endX = targetRect.left + targetRect.width / 2;
    const endY = targetRect.top + targetRect.height / 2;

    const coin = document.createElement('span');
    coin.textContent = '£';
    coin.setAttribute('aria-hidden', 'true');
    coin.style.cssText = [
      'position:fixed',
      `left:${startX}px`,
      `top:${startY}px`,
      'z-index:80',
      'pointer-events:none',
      'transform:translate(-50%,-50%) scale(0.6)',
      'width:36px',
      'height:36px',
      'border-radius:9999px',
      'display:grid',
      'place-items:center',
      'font-weight:800',
      'font-family:ui-sans-serif,system-ui',
      'color:#fff',
      'background:radial-gradient(circle at 30% 30%, #fde68a, #d97706 70%)',
      'box-shadow:0 6px 20px -6px rgba(217,119,6,0.55), inset 0 -2px 4px rgba(0,0,0,0.18)',
      'will-change:transform,opacity',
    ].join(';');
    document.body.appendChild(coin);

    const midX = (startX + endX) / 2;
    const arcY = Math.min(startY, endY) - 120;

    const anim = coin.animate(
      [
        {
          transform: `translate(${0}px, ${0}px) scale(0.6) rotateY(0deg)`,
          opacity: 0.4,
          offset: 0,
        },
        {
          transform: `translate(${midX - startX}px, ${arcY - startY}px) scale(1.1) rotateY(180deg)`,
          opacity: 1,
          offset: 0.55,
        },
        {
          transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0.4) rotateY(360deg)`,
          opacity: 0.9,
          offset: 1,
        },
      ],
      {
        duration: 420,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards',
      },
    );
    anim.onfinish = () => {
      coin.remove();
      // Small bump on the counter on landing.
      if (target) {
        target.animate(
          [
            { transform: 'scale(1)' },
            { transform: 'scale(1.08)' },
            { transform: 'scale(1)' },
          ],
          { duration: 260, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
        );
      }
    };
    anim.oncancel = () => coin.remove();
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <EarningsAnimationContext.Provider value={{ flyFrom, registerCounter, rollTo }}>
      {children}
    </EarningsAnimationContext.Provider>
  );
}
