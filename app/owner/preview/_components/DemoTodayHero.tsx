'use client';

/**
 * "Mejor del día" hero card. Front side shows today's standout cleaner,
 * task count, on-time %, and a property thumb. A slow conic-gradient
 * spotlight rotates behind the avatar (paused when tab hidden to spare
 * GPU). Tapping flips to the back — a 7-day sparkline + "Enviar bonus"
 * button that drops a tiny SVG confetti star on press.
 *
 * Reduced motion: spotlight stops, flip becomes a crossfade.
 */
import { useEffect, useRef, useState } from 'react';
import { Award, Building2, Send } from 'lucide-react';
import { useClientLocale, pickCopy } from '@/lib/use-locale-client';

const COPY = {
  en: {
    bestOfDay: 'Best of the day',
    seeWeekly: 'See Carmen’s weekly detail',
    back: '← Back',
    seeDetail: 'See detail →',
    cleansOnTime: '3 cleans today · 98% on time',
    starOfDay: 'Star of the day',
    last7Days: 'Carmen Ruiz · last 7 days',
    avgOnTime: 'On-time average: 91%',
    bonusSent: 'Bonus sent',
    sendBonus: 'Send £20 bonus',
    bonusConfirm: '£20 bonus sent to Carmen',
  },
  es: {
    bestOfDay: 'Mejor del día',
    seeWeekly: 'Ver detalle semanal de Carmen',
    back: '← Volver',
    seeDetail: 'Ver detalle →',
    cleansOnTime: '3 limpiezas hoy · 98% a tiempo',
    starOfDay: 'Estrella del día',
    last7Days: 'Carmen Ruiz · últimos 7 días',
    avgOnTime: 'Media de puntualidad: 91%',
    bonusSent: 'Bonus enviado',
    sendBonus: 'Enviar bonus £20',
    bonusConfirm: 'Bonus de £20 enviado a Carmen',
  },
  pt: {
    bestOfDay: 'Melhor do dia',
    seeWeekly: 'Ver detalhe semanal da Carmen',
    back: '← Voltar',
    seeDetail: 'Ver detalhe →',
    cleansOnTime: '3 limpezas hoje · 98% a horas',
    starOfDay: 'Estrela do dia',
    last7Days: 'Carmen Ruiz · últimos 7 dias',
    avgOnTime: 'Média de pontualidade: 91%',
    bonusSent: 'Bónus enviado',
    sendBonus: 'Enviar bónus £20',
    bonusConfirm: 'Bónus de £20 enviado à Carmen',
  },
} as const;

const SPARK = [82, 88, 91, 87, 95, 93, 98]; // on-time %, last 7 days

export function DemoTodayHero() {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  const [flipped, setFlipped] = useState(false);
  const [bonusSent, setBonusSent] = useState(false);
  const [reduced, setReduced] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    // Pause the spotlight rotation when the tab is hidden.
    const onVisibility = () => {
      const card = cardRef.current;
      if (!card) return;
      card.dataset.paused = document.hidden ? 'true' : 'false';
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      mq.removeEventListener('change', onChange);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  function sendBonus() {
    setBonusSent(true);
    const btn = buttonRef.current;
    if (!btn || reduced) return;
    // SVG confetti star — single element, animated via WAAPI then removed.
    const rect = btn.getBoundingClientRect();
    const star = document.createElement('div');
    star.setAttribute('aria-hidden', 'true');
    star.style.position = 'fixed';
    star.style.left = `${rect.left + rect.width / 2 - 10}px`;
    star.style.top = `${rect.top - 6}px`;
    star.style.width = '20px';
    star.style.height = '20px';
    star.style.pointerEvents = 'none';
    star.style.zIndex = '60';
    star.innerHTML =
      '<svg viewBox="0 0 20 20" fill="#facc15" xmlns="http://www.w3.org/2000/svg"><path d="M10 0l2.6 6.4L19 8l-5 4.6L15.4 19 10 15.5 4.6 19 6 12.6 1 8l6.4-1.6L10 0z"/></svg>';
    document.body.appendChild(star);
    const dx = (Math.random() - 0.5) * 80;
    star.animate(
      [
        { transform: 'translateY(0) scale(1) rotate(0deg)', opacity: 1 },
        { transform: `translate(${dx}px, -90px) scale(0.6) rotate(180deg)`, opacity: 0 },
      ],
      { duration: 700, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    ).onfinish = () => star.remove();
  }

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5"
      style={{ perspective: '1200px' }}
    >
      <header className="mb-3 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 font-display text-lg font-semibold text-slate-900">
          <Award className="h-4 w-4 text-amber-500" /> {t.bestOfDay}
        </h2>
        <button
          type="button"
          onClick={() => setFlipped((s) => !s)}
          title={t.seeWeekly}
          className="text-[11.5px] font-semibold text-blue-700 hover:text-blue-800"
        >
          {flipped ? t.back : t.seeDetail}
        </button>
      </header>

      <div
        ref={cardRef}
        className="relative h-[148px] w-full"
        style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            transform: reduced
              ? 'none'
              : flipped
                ? 'rotateY(180deg)'
                : 'rotateY(0deg)',
            backfaceVisibility: 'hidden',
            opacity: reduced && flipped ? 0 : 1,
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <div className="flex h-full items-center gap-4">
            <div className="relative grid h-20 w-20 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-2xl font-bold text-white ring-2 ring-amber-300/70">
              CR
              {/* Conic spotlight (paused when tab hidden via data-paused). */}
              <span
                aria-hidden
                className={`pointer-events-none absolute -inset-6 rounded-full ${reduced ? '' : 'demo-spotlight'}`}
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0deg, #fbbf24 12deg, transparent 60deg, transparent 360deg)',
                  filter: 'blur(18px)',
                  opacity: 0.35,
                  animationPlayState: 'var(--play, running)',
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-slate-900">Carmen Ruiz</p>
              <p className="mt-0.5 text-[12px] text-slate-600">
                {t.cleansOnTime}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">
                <Award className="h-3 w-3" /> {t.starOfDay}
              </div>
            </div>
            <div className="hidden h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-emerald-200 via-emerald-100 to-amber-100 sm:flex sm:items-center sm:justify-center">
              <Building2 className="h-7 w-7 text-emerald-700" />
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            transform: reduced
              ? 'none'
              : flipped
                ? 'rotateY(360deg)'
                : 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            opacity: reduced ? (flipped ? 1 : 0) : 1,
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="text-[12.5px] font-semibold text-slate-900">
                {t.last7Days}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                {t.avgOnTime}
              </p>
              <svg viewBox="0 0 140 32" className="mt-1.5 h-9 w-full">
                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                  points={SPARK.map((v, i) => `${(i / (SPARK.length - 1)) * 140},${32 - ((v - 80) / 20) * 28}`).join(' ')}
                />
                {SPARK.map((v, i) => (
                  <circle
                    key={i}
                    cx={(i / (SPARK.length - 1)) * 140}
                    cy={32 - ((v - 80) / 20) * 28}
                    r={i === SPARK.length - 1 ? 3 : 1.5}
                    fill={i === SPARK.length - 1 ? '#f59e0b' : '#2563eb'}
                  />
                ))}
              </svg>
            </div>
            <div className="flex items-center justify-between gap-3">
              <button
                ref={buttonRef}
                type="button"
                onClick={sendBonus}
                disabled={bonusSent}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 px-3 text-[12px] font-semibold text-white transition hover:brightness-110 disabled:cursor-default disabled:opacity-60"
              >
                <Send className="h-3.5 w-3.5" />
                {bonusSent ? t.bonusSent : t.sendBonus}
              </button>
              {bonusSent ? (
                <span className="text-[11px] font-medium text-emerald-700">
                  {t.bonusConfirm}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
