'use client';

/**
 * Pull-to-summarize. On mobile, pulling down from the top of the
 * dashboard reveals a 7×4 heatmap of the last 28 days of bookings.
 * Past 110px the gesture commits — the heatmap stays for the session
 * and an AI-style insight types itself underneath with two action
 * chips. Desktop users get an "Insight del día" button that opens the
 * same panel without the pull affordance.
 *
 * Reduced motion: no rubber-band — pulling above the threshold simply
 * snaps the panel open instantly.
 */
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

const HEATMAP = [
  2, 3, 5, 4, 7, 6, 5,
  3, 4, 8, 5, 6, 4, 3,
  4, 5, 9, 6, 7, 5, 2,
  5, 6, 10, 7, 8, 6, 3,
];

const INSIGHTS = [
  'Tus martes están un 38% por encima de la media. ¿Subir precios martes a £85?',
  'Soho Loft generó más reservas este mes. Considera ampliar disponibilidad.',
  'Carmen ha mantenido 98% puntualidad 7 días seguidos — buen momento para un bonus.',
  'Las tardes del jueves están infrautilizadas. Promoción para llenarlas.',
];

function heatColor(count: number) {
  const max = Math.max(...HEATMAP);
  const ratio = count / max;
  // Warm mandarin wash on clay — denser cells = stronger mandarin tint.
  const lightness = Math.round(92 - ratio * 28);
  return `oklch(${lightness}% ${0.04 + ratio * 0.12} 50)`;
}

export function DemoPullSummary() {
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState('');
  const [insight] = useState(() => INSIGHTS[Math.floor(Math.random() * INSIGHTS.length)]);
  const [dy, setDy] = useState(0);
  const startYRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Typewriter for the insight, only when revealed.
  useEffect(() => {
    if (!open) {
      setRevealed('');
      return;
    }
    let i = 0;
    const step = Math.max(1, Math.ceil(insight.length / 14));
    const id = window.setInterval(() => {
      i = Math.min(insight.length, i + step);
      setRevealed(insight.slice(0, i));
      if (i >= insight.length) window.clearInterval(id);
    }, 20);
    return () => window.clearInterval(id);
  }, [open, insight]);

  useEffect(() => {
    function onTouchStart(e: TouchEvent) {
      if (open) return;
      if (window.scrollY > 4) return;
      if (!e.touches[0]) return;
      startYRef.current = e.touches[0].clientY;
      draggingRef.current = true;
    }
    function onTouchMove(e: TouchEvent) {
      if (!draggingRef.current || startYRef.current == null) return;
      const t = e.touches[0];
      if (!t) return;
      const raw = t.clientY - startYRef.current;
      if (raw <= 0) {
        setDy(0);
        return;
      }
      // Rubber-band — soft past 110px.
      const banded = raw > 110 ? 110 + (raw - 110) * 0.35 : raw;
      setDy(Math.min(160, banded * 0.85));
    }
    function onTouchEnd() {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      const committed = dy > 90;
      setDy(0);
      startYRef.current = null;
      if (committed) setOpen(true);
    }
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [open, dy]);

  const ratio = Math.min(1, dy / 90);

  return (
    <>
      {/* Pull affordance — only renders during a live drag. */}
      {dy > 4 && !open ? (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center"
          style={{ transform: `translateY(${dy * 0.5}px)` }}
        >
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#1414141A] bg-[#141414] px-3 py-1.5 font-mono text-[11px] font-semibold text-[#F4EFE6]">
            <ChevronDown
              className="h-3.5 w-3.5 transition-transform"
              style={{ transform: `rotate(${ratio * 180}deg)` }}
            />
            {ratio >= 1 ? 'soltar para ver insight' : 'tirar para ver insight'}
          </div>
        </div>
      ) : null}

      {/* Desktop trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Ver el insight del día (heatmap de los últimos 28 días)"
        className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-full border border-[#1414141A] bg-[#F4EFE6] px-3 font-mono text-[12px] font-semibold text-[#141414] transition-colors hover:bg-[#E4DACA]"
        style={{ transitionDuration: '160ms' }}
      >
        <Sparkles className="h-3.5 w-3.5 text-[#FF5B1F]" /> insight del día
      </button>

      {open ? (
        <section className="ps-set mt-4 overflow-hidden rounded-[12px] border border-[#1414141A] bg-[#E4DACA] p-5 sm:p-6">
          <header className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-2 font-mono text-[12px] text-[#54524D]">
                <Sparkles className="h-3 w-3 text-[#FF5B1F]" />
                insight del día
                <span className="inline-block h-[1px] w-5 align-middle bg-[#FF5B1F]" />
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ps-link font-mono text-[11px] text-[#54524D]"
            >
              Ocultar
            </button>
          </header>
          {/* 7×4 heatmap (28 cells) */}
          <div className="mt-3 grid grid-cols-7 gap-1">
            {HEATMAP.map((c, i) => (
              <div
                key={i}
                title={`${c} reservas`}
                className="h-7 rounded-[6px] border border-[#1414141A]"
                style={{ backgroundColor: heatColor(c) }}
              />
            ))}
          </div>
          <p className="mt-4 min-h-[44px] text-[14px] leading-[1.45] text-[#141414]">
            <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-[#54524D]">IA · </span>
            {revealed}
            {revealed.length < insight.length ? (
              <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-[#FF5B1F] align-middle" />
            ) : null}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-[#FF5B1F] px-4 py-2 text-[12px] font-semibold text-[#1A0A04]"
              style={{ transitionDuration: '160ms' }}
            >
              Sí, ajustar
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-[#1414141A] bg-transparent px-4 py-2 text-[12px] font-semibold text-[#141414] hover:bg-[#F4EFE6]"
              style={{ transitionDuration: '160ms' }}
            >
              Más tarde
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}
