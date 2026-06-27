/**
 * CleanerEtaRibbon — a slim sticky live ribbon at the top of the
 * cleaning detail page. Shows the assigned cleaner's avatar, a
 * breathing 2-color dot (slow 1.8s exhale via CSS @keyframes — no JS
 * loop, no strobe), and a distance number that ticks down character-
 * by-character every few seconds.
 *
 * Tapping the ribbon expands into a mini route card with a hand-drawn
 * London squiggle whose stroke-dashoffset transitions toward zero as
 * the cleaner gets closer.
 *
 * Battery-friendly: a single 5s setInterval drives the tick (NOT raf).
 * Pulse + sparkle are CSS-only. Cleared on unmount.
 */
'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';

type ScriptStep = {
  km: number;
  /** Minutes ETA shown alongside the km value. */
  min: number;
};

// Deterministic mocked ETA script — each tick decrements ~0.1km and
// drops a minute. Lands at "Llega ahora" so the user sees closure.
const SCRIPT: ScriptStep[] = [
  { km: 1.2, min: 8 },
  { km: 1.1, min: 7 },
  { km: 1.0, min: 6 },
  { km: 0.9, min: 5 },
  { km: 0.8, min: 4 },
  { km: 0.6, min: 3 },
  { km: 0.4, min: 2 },
  { km: 0.2, min: 1 },
  { km: 0.0, min: 0 },
];

const TICK_MS = 5000;

export function CleanerEtaRibbon({
  cleanerInitials,
  cleanerName,
}: {
  cleanerInitials: string;
  cleanerName: string;
}) {
  const [idx, setIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const prevKmRef = useRef(SCRIPT[0].km);

  // Decrement ETA every TICK_MS using a single setInterval — explicitly
  // not raf, to keep the cost negligible while the user is scrolling.
  useEffect(() => {
    const id = window.setInterval(() => {
      setIdx((i) => (i < SCRIPT.length - 1 ? i + 1 : i));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  // Flash the digits on each tick for a subtle 'character-flip' feel.
  useEffect(() => {
    if (prevKmRef.current === SCRIPT[idx].km) return;
    prevKmRef.current = SCRIPT[idx].km;
    setFlashing(true);
    const t = window.setTimeout(() => setFlashing(false), 220);
    return () => window.clearTimeout(t);
  }, [idx]);

  const step = SCRIPT[idx];
  const arrived = step.km === 0 && step.min === 0;
  // Squiggle stroke fills in as cleaner gets closer.
  // Total path length used by stroke-dasharray is 240 (matches viewBox).
  const progress = 1 - step.km / SCRIPT[0].km; // 0 → 1
  const dashOffset = 240 * (1 - progress);

  return (
    <div
      className="sticky top-0 z-20 -mx-1 mb-3 px-1 pt-1"
      style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        title={
          arrived
            ? `${cleanerName} ha llegado`
            : `${cleanerName} está a ${step.km.toFixed(1)} km — toca para ver la ruta`
        }
        className="flex w-full items-center gap-3 rounded-full bg-white/90 px-3 py-2 text-left shadow-[0_6px_18px_-12px_rgba(15,23,42,0.4)] ring-1 ring-inset ring-slate-200 transition hover:bg-white"
      >
        {/* Cleaner avatar with breathing pulse dot. */}
        <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-700 text-[12px] font-bold text-white">
          {cleanerInitials}
          <span className="absolute -bottom-0.5 -right-0.5 grid h-3.5 w-3.5 place-items-center">
            <span className="relative inline-grid h-2.5 w-2.5 place-items-center">
              <span
                className="absolute inset-0 rounded-full text-emerald-400 client-eta-pulse"
                style={{ color: '#34d399' }}
              />
              <span className="relative h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </span>
          </span>
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
            {arrived ? 'En tu puerta' : 'En camino'}
          </p>
          <p
            className="mt-0.5 font-display text-[13px] font-bold tabular-nums text-slate-900 transition"
            style={{
              transform: flashing ? 'translateY(-1px)' : 'translateY(0)',
              opacity: flashing ? 0.6 : 1,
              transitionDuration: '220ms',
            }}
          >
            {arrived
              ? `${cleanerName.split(' ')[0]} ha llegado`
              : `${step.km.toFixed(1)} km · ${step.min} min`}
          </p>
        </div>

        <ChevronDown
          className="h-4 w-4 shrink-0 text-slate-400 transition"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}
        />
      </button>

      {/* Expanded mini route card with the squiggle that fills in. */}
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          maxHeight: expanded ? 160 : 0,
          opacity: expanded ? 1 : 0,
          transition:
            'max-height 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease',
        }}
      >
        <div className="mt-2 rounded-2xl bg-white p-3 ring-1 ring-inset ring-slate-100">
          <svg
            viewBox="0 0 240 70"
            className="block h-16 w-full client-eta-squiggle"
            aria-hidden
          >
            {/* Faded background squiggle — the "remaining" route. */}
            <path
              d="M5,55 C30,5 60,55 95,30 S160,10 185,40 S225,30 235,15"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Active squiggle — strokeDashoffset shrinks as cleaner approaches. */}
            <path
              d="M5,55 C30,5 60,55 95,30 S160,10 185,40 S225,30 235,15"
              fill="none"
              stroke="url(#etaGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="240"
              strokeDashoffset={dashOffset}
            />
            {/* Endpoint marker — your home. */}
            <circle cx="235" cy="15" r="4" fill="#2563eb" />
            <defs>
              <linearGradient id="etaGrad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%"  stopColor="#10b981" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
          </svg>
          <p className="mt-1 flex items-center justify-between gap-2 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Ruta aproximada
            </span>
            <span className="font-semibold text-slate-700">
              {arrived ? 'Llegada' : `${step.min} min`}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
