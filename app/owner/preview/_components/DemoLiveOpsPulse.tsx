'use client';

/**
 * Live ops pulse line — a 24px lane that draws the last 8h of cleaner
 * activity as a thin SVG path with three named pucks gliding L→R.
 * Every tick advances a deterministic virtual clock so the demo always
 * looks alive without burning battery (single 3s interval, no rAF).
 *
 * Reduced motion: pucks freeze at their current spot, the whisper line
 * becomes a static "última actividad" caption.
 */
import { useEffect, useReducer, useState } from 'react';
import { useClientLocale, pickCopy } from '@/lib/use-locale-client';

const COPY = {
  en: {
    last8h: 'Last 8h',
    lastActivity: 'last activity: 2 min ago',
    initial: 'Carmen arrived at Soho · 2 min ago',
    carmenSoho: 'Carmen arrived at Soho · now',
    luciaCamden: 'Lucía marked Camden ✓ · now',
    pedroRoute: 'Pedro en route to Notting Hill',
    carmenPhotos: 'Carmen uploaded 4 photos · Soho',
    luciaMayfair: 'Lucía starts Mayfair',
  },
  es: {
    last8h: 'Últimas 8h',
    lastActivity: 'última actividad: hace 2 min',
    initial: 'Carmen llegó a Soho · hace 2 min',
    carmenSoho: 'Carmen llegó a Soho · ahora',
    luciaCamden: 'Lucía marcó Camden ✓ · ahora',
    pedroRoute: 'Pedro en ruta a Notting Hill',
    carmenPhotos: 'Carmen subió 4 fotos · Soho',
    luciaMayfair: 'Lucía empieza Mayfair',
  },
  pt: {
    last8h: 'Últimas 8h',
    lastActivity: 'última atividade: há 2 min',
    initial: 'Carmen chegou a Soho · há 2 min',
    carmenSoho: 'Carmen chegou a Soho · agora',
    luciaCamden: 'Lucía marcou Camden ✓ · agora',
    pedroRoute: 'Pedro a caminho de Notting Hill',
    carmenPhotos: 'Carmen enviou 4 fotos · Soho',
    luciaMayfair: 'Lucía começa Mayfair',
  },
} as const;

type Cleaner = {
  id: string;
  name: string;
  short: string;
  color: string;
  /** progress 0–1 across the 8h lane */
  p: number;
  /** speed per tick, baseline ~0.04 */
  v: number;
};

type Event = {
  id: number;
  cleanerId: string;
  labelKey: TimelineSlot['labelKey'] | 'initial';
};

type State = {
  cleaners: Cleaner[];
  /** Latest event shown in the whisper line. */
  event: Event | null;
  /** Increment-only id to retrigger CSS animation via React key. */
  haloFor: string | null;
  haloKey: number;
  tick: number;
};

const INITIAL_CLEANERS: Cleaner[] = [
  { id: 'carmen', name: 'Carmen', short: 'CR', color: 'bg-blue-600', p: 0.18, v: 0.05 },
  { id: 'lucia', name: 'Lucía', short: 'LV', color: 'bg-emerald-600', p: 0.42, v: 0.045 },
  { id: 'pedro', name: 'Pedro', short: 'PK', color: 'bg-amber-500', p: 0.66, v: 0.04 },
];

type TimelineSlot = {
  afterTicks: number;
  cleanerId: string;
  labelKey: 'carmenSoho' | 'luciaCamden' | 'pedroRoute' | 'carmenPhotos' | 'luciaMayfair';
};

const TIMELINE: TimelineSlot[] = [
  { afterTicks: 1, cleanerId: 'carmen', labelKey: 'carmenSoho' },
  { afterTicks: 3, cleanerId: 'lucia', labelKey: 'luciaCamden' },
  { afterTicks: 5, cleanerId: 'pedro', labelKey: 'pedroRoute' },
  { afterTicks: 7, cleanerId: 'carmen', labelKey: 'carmenPhotos' },
  { afterTicks: 9, cleanerId: 'lucia', labelKey: 'luciaMayfair' },
];

function reducer(state: State, action: { type: 'tick' }): State {
  if (action.type !== 'tick') return state;
  const nextTick = state.tick + 1;
  // Slide each puck along the lane; loop softly when reaching the end.
  const cleaners = state.cleaners.map((c) => {
    const np = c.p + c.v * 0.18;
    return { ...c, p: np > 1 ? 0.05 : np };
  });
  // Scripted event lookup — wraps the timeline.
  const slot = TIMELINE.find(
    (t) => t.afterTicks === ((nextTick - 1) % (TIMELINE.length * 2)) + 1,
  );
  if (slot) {
    return {
      cleaners,
      event: { id: nextTick, cleanerId: slot.cleanerId, labelKey: slot.labelKey },
      haloFor: slot.cleanerId,
      haloKey: state.haloKey + 1,
      tick: nextTick,
    };
  }
  return { ...state, cleaners, tick: nextTick };
}

export function DemoLiveOpsPulse() {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  const [state, dispatch] = useReducer(reducer, {
    cleaners: INITIAL_CLEANERS,
    event: { id: 0, cleanerId: 'carmen', labelKey: 'initial' },
    haloFor: null,
    haloKey: 0,
    tick: 0,
  });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => dispatch({ type: 'tick' }), 3000);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <div className="mt-3 select-none rounded-xl bg-gradient-to-r from-slate-50 via-white to-slate-50 px-3 py-2 ring-1 ring-slate-200">
      <div className="relative h-6">
        {/* The thin activity path — last 8 hours sparkline-style */}
        <svg
          aria-hidden
          viewBox="0 0 320 24"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="demo-pulse-grad" x1="0" x2="1">
              <stop offset="0" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="0.5" stopColor="#06b6d4" stopOpacity="0.55" />
              <stop offset="1" stopColor="#10b981" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <path
            d="M0 14 Q 40 6 80 12 T 160 11 T 240 13 T 320 10"
            stroke="url(#demo-pulse-grad)"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Subtle hour ticks every 1h (8 segments) */}
          {Array.from({ length: 9 }).map((_, i) => (
            <line
              key={i}
              x1={(i * 320) / 8}
              x2={(i * 320) / 8}
              y1="20"
              y2="22"
              stroke="rgba(15,23,42,0.18)"
              strokeWidth="1"
            />
          ))}
        </svg>
        {/* Gliding cleaner pucks */}
        <div className="absolute inset-0">
          {state.cleaners.map((c) => (
            <div
              key={c.id}
              className="demo-puck-track absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${Math.min(98, Math.max(2, c.p * 100))}%` }}
            >
              <span
                className={`relative grid h-4 w-4 place-items-center rounded-full text-[8px] font-bold text-white shadow ${c.color}`}
              >
                {c.short}
                {state.haloFor === c.id ? (
                  <span
                    key={`${c.id}-${state.haloKey}`}
                    aria-hidden
                    className={`demo-halo pointer-events-none absolute inset-0 rounded-full ${c.color} opacity-60`}
                  />
                ) : null}
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-1.5 flex items-center justify-between gap-2 text-[11px] leading-tight text-slate-600">
        <span className="font-semibold uppercase tracking-wider text-slate-500">
          {t.last8h}
        </span>
        {state.event ? (
          <span
            key={reduced ? 'static' : state.event.id}
            className={`min-w-0 truncate text-right text-slate-700 ${reduced ? '' : 'demo-whisper'}`}
          >
            {reduced ? t.lastActivity : t[state.event.labelKey]}
          </span>
        ) : null}
      </p>
    </div>
  );
}
