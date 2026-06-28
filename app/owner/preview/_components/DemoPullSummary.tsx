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
import { useClientLocale, pickCopy } from '@/lib/use-locale-client';

const COPY = {
  en: {
    insightToday: 'Insight of the day',
    insightTitle: 'See today’s insight (heatmap of the last 28 days)',
    releaseToSee: 'Release to see insight',
    pullToSee: 'Pull to see insight',
    hide: 'Hide',
    bookingsLabel: (n: number) => `${n} bookings`,
    aiPrefix: 'AI · ',
    yesAdjust: 'Yes, adjust',
    later: 'Later',
    insight1: 'Your Tuesdays are 38% above average. Raise Tuesday prices to £85?',
    insight2: 'Soho Loft generated more bookings this month. Consider expanding availability.',
    insight3: 'Carmen has held 98% on-time 7 days running — good moment for a bonus.',
    insight4: 'Thursday afternoons are underused. Run a promo to fill them.',
  },
  es: {
    insightToday: 'Insight del día',
    insightTitle: 'Ver el insight del día (heatmap de los últimos 28 días)',
    releaseToSee: 'Soltar para ver insight',
    pullToSee: 'Tirar para ver insight',
    hide: 'Ocultar',
    bookingsLabel: (n: number) => `${n} reservas`,
    aiPrefix: 'IA · ',
    yesAdjust: 'Sí, ajustar',
    later: 'Más tarde',
    insight1: 'Tus martes están un 38% por encima de la media. ¿Subir precios martes a £85?',
    insight2: 'Soho Loft generó más reservas este mes. Considera ampliar disponibilidad.',
    insight3: 'Carmen ha mantenido 98% puntualidad 7 días seguidos — buen momento para un bonus.',
    insight4: 'Las tardes del jueves están infrautilizadas. Promoción para llenarlas.',
  },
  pt: {
    insightToday: 'Insight do dia',
    insightTitle: 'Ver o insight do dia (heatmap dos últimos 28 dias)',
    releaseToSee: 'Soltar para ver insight',
    pullToSee: 'Puxa para ver insight',
    hide: 'Ocultar',
    bookingsLabel: (n: number) => `${n} reservas`,
    aiPrefix: 'IA · ',
    yesAdjust: 'Sim, ajustar',
    later: 'Mais tarde',
    insight1: 'As tuas terças estão 38% acima da média. Subir os preços de terça para £85?',
    insight2: 'Soho Loft gerou mais reservas este mês. Considera ampliar a disponibilidade.',
    insight3: 'A Carmen manteve 98% de pontualidade 7 dias seguidos — bom momento para um bónus.',
    insight4: 'As tardes de quinta estão subaproveitadas. Promoção para as encher.',
  },
} as const;

const HEATMAP = [
  2, 3, 5, 4, 7, 6, 5,
  3, 4, 8, 5, 6, 4, 3,
  4, 5, 9, 6, 7, 5, 2,
  5, 6, 10, 7, 8, 6, 3,
];

const INSIGHT_KEYS = ['insight1', 'insight2', 'insight3', 'insight4'] as const;
type InsightKey = (typeof INSIGHT_KEYS)[number];

function heatColor(count: number) {
  const max = Math.max(...HEATMAP);
  const ratio = count / max;
  const lightness = Math.round(94 - ratio * 36);
  return `oklch(${lightness}% 0.12 155)`;
}

export function DemoPullSummary() {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState('');
  const [insightKey] = useState<InsightKey>(
    () => INSIGHT_KEYS[Math.floor(Math.random() * INSIGHT_KEYS.length)],
  );
  const insight = t[insightKey];
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
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-900/85 px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg backdrop-blur">
            <ChevronDown
              className="h-3.5 w-3.5 transition-transform"
              style={{ transform: `rotate(${ratio * 180}deg)` }}
            />
            {ratio >= 1 ? t.releaseToSee : t.pullToSee}
          </div>
        </div>
      ) : null}

      {/* Desktop trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={t.insightTitle}
        className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-br from-violet-600 to-blue-700 px-3 text-[12px] font-semibold text-white shadow-sm transition hover:brightness-110"
      >
        <Sparkles className="h-3.5 w-3.5" /> {t.insightToday}
      </button>

      {open ? (
        <section className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5 demo-pop">
          <header className="flex items-center justify-between gap-3">
            <h3 className="inline-flex items-center gap-2 font-display text-base font-semibold text-slate-900">
              <Sparkles className="h-4 w-4 text-violet-600" />
              {t.insightToday}
            </h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-900"
            >
              {t.hide}
            </button>
          </header>
          {/* 7×4 heatmap (28 cells) */}
          <div className="mt-3 grid grid-cols-7 gap-1">
            {HEATMAP.map((c, i) => (
              <div
                key={i}
                title={t.bookingsLabel(c)}
                className="h-7 rounded-md ring-1 ring-slate-200/60"
                style={{ backgroundColor: heatColor(c) }}
              />
            ))}
          </div>
          <p className="mt-3 min-h-[40px] text-[13px] leading-snug text-slate-700">
            <span className="font-semibold">{t.aiPrefix}</span>
            {revealed}
            {revealed.length < insight.length ? (
              <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-slate-400 align-middle" />
            ) : null}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-blue-600 px-3 py-1.5 text-[11.5px] font-semibold text-white hover:bg-blue-700"
            >
              {t.yesAdjust}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-white px-3 py-1.5 text-[11.5px] font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              {t.later}
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}
