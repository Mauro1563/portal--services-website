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
      {/* Desaturating veil over the card behind. Paper-tinted, no blur,
          no rounded-3xl — matches the new 12px surface language. */}
      <div
        className="absolute inset-0 rounded-[12px] backdrop-grayscale-[40%]"
        style={{ backgroundColor: 'rgba(244, 239, 230, 0.7)' }}
      />

      {/* The seal itself — petal disc with mandarin ring + ink stamp text.
          Per design brief: client delight uses only petal + mandarin. */}
      <div className="relative client-seal-drop">
        {/* Dust ring — one-shot expanding circle, mandarin hairline. */}
        <span
          className="absolute left-1/2 top-1/2 -ml-12 -mt-12 h-24 w-24 rounded-full client-seal-dust"
          style={{ border: '1px solid rgba(255, 91, 31, 0.6)' }}
        />
        <div
          className="relative grid h-28 w-28 place-items-center rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #F4D9D2 0%, #E8C8C0 55%, #C99C92 100%)',
            border: '3px solid #FF5B1F',
            color: '#1A0A04',
          }}
        >
          {/* Inner stamp ring. */}
          <span
            className="absolute inset-2 rounded-full"
            style={{ border: '1px solid rgba(255, 91, 31, 0.45)' }}
          />
          <div className="flex flex-col items-center justify-center text-center">
            <span className="ps-mono text-[10px]" style={{ color: '#1A0A04' }}>
              trabajo
            </span>
            <span
              className="ps-serif text-[20px] leading-none tracking-[-0.02em]"
              style={{ color: '#1A0A04' }}
            >
              completada
            </span>
            <span
              className="ps-mono mt-1 text-[9px]"
              style={{ color: '#1A0A04' }}
            >
              · 2026 ·
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
