/**
 * CompletionSeal — a circular wax-seal "COMPLETADA" stamp that drops
 * from above and thuds onto the visit card. Replaces generic confetti
 * with something that feels handmade and distinctive: a single weighty
 * impact, an 8° tilt, and one dust ring expanding outward. The card
 * desaturates slightly behind the seal.
 *
 * Auto-unmounts after ~2.4s via the visible/onDone contract — the
 * parent owns the show/hide state. No raf loop, no particles, ~3
 * animated nodes total. Safe on a phone the cleaner is using mid-job.
 */
'use client';

import { useEffect } from 'react';

export function CompletionSeal({
  visible,
  onDone,
}: {
  visible: boolean;
  onDone?: () => void;
}) {
  useEffect(() => {
    if (!visible) return;
    const t = window.setTimeout(() => onDone?.(), 2400);
    return () => window.clearTimeout(t);
  }, [visible, onDone]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
      aria-hidden="true"
    >
      {/* Desaturating veil over the card behind. */}
      <div className="absolute inset-0 rounded-3xl bg-slate-50/60 backdrop-grayscale-[40%]" />

      {/* The seal itself. */}
      <div className="relative client-seal-drop">
        {/* Dust ring — one-shot expanding circle. */}
        <span
          className="absolute left-1/2 top-1/2 -ml-12 -mt-12 h-24 w-24 rounded-full border border-amber-300/70 client-seal-dust"
        />
        <div
          className="relative grid h-28 w-28 place-items-center rounded-full border-[3px] border-amber-700/80 text-amber-900 shadow-[0_8px_18px_-6px_rgba(180,83,9,0.45)]"
          style={{
            background:
              'radial-gradient(circle at 35% 30%, #fde68a 0%, #f59e0b 55%, #b45309 100%)',
          }}
        >
          {/* Inner stamp ring. */}
          <span className="absolute inset-2 rounded-full border border-amber-800/40" />
          <div className="flex flex-col items-center justify-center text-center">
            <span className="font-display text-[10px] font-extrabold uppercase tracking-[0.22em] text-amber-950/90">
              Trabajo
            </span>
            <span className="font-display text-[16px] font-extrabold leading-none tracking-tight text-amber-950">
              COMPLETADA
            </span>
            <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.28em] text-amber-950/80">
              · 2026 ·
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
