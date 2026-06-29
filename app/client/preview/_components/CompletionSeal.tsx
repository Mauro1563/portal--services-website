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
import { pickCopy, useClientLocale, type ClientLocale } from '@/lib/use-locale-client';

const COPY = {
  en: {
    workLabel: 'Work',
    completed: 'COMPLETED',
    year: '· 2026 ·',
  },
  es: {
    workLabel: 'Trabajo',
    completed: 'COMPLETADA',
    year: '· 2026 ·',
  },
  pt: {
    workLabel: 'Trabalho',
    completed: 'CONCLUÍDA',
    year: '· 2026 ·',
  },
} as const satisfies Record<ClientLocale, unknown>;

export function CompletionSeal({
  visible,
  onDone,
}: {
  visible: boolean;
  onDone?: () => void;
}) {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
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

      {/* The seal itself. Reworked from amber/gold wax (off-palette
          decorative orange) to a midnight ink stamp with teal #00D8C7
          accents — same weighty "completed" feel, on-palette. */}
      <div className="relative client-seal-drop">
        {/* Dust ring — one-shot expanding circle in the accent teal. */}
        <span
          className="absolute left-1/2 top-1/2 -ml-12 -mt-12 h-24 w-24 rounded-full border border-[#00D8C7]/60 client-seal-dust"
        />
        <div
          className="relative grid h-28 w-28 place-items-center rounded-full border-[3px] border-[#00D8C7]/80 text-white shadow-[0_8px_18px_-6px_rgba(10,13,24,0.5)]"
          style={{
            background:
              'radial-gradient(circle at 35% 30%, #1a1f33 0%, #0A0D18 55%, #050811 100%)',
          }}
        >
          {/* Inner stamp ring. */}
          <span className="absolute inset-2 rounded-full border border-white/15" />
          <div className="flex flex-col items-center justify-center text-center">
            <span className="font-display text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#00D8C7]">
              {t.workLabel}
            </span>
            <span className="font-display text-[16px] font-extrabold leading-none tracking-tight text-white">
              {t.completed}
            </span>
            <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.28em] text-white/70">
              {t.year}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
