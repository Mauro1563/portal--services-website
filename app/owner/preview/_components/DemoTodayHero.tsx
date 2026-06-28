'use client';

/**
 * "Mejor del día" — the owner portal's single highlight card per screen.
 * Ultramarine background (owner's per-portal secondary), paper text, mandarin
 * accents for the badge + the bonus CTA. Front side shows today's standout
 * cleaner; tapping flips to the back — a 7-day sparkline + "Enviar bonus"
 * button that drops a mandarin "set" stamp on press (the owner's signature
 * delight — an ink-press on the day's column).
 *
 * Behaviour preserved: 3D flip via rotateY, spotlight rotation paused when
 * the tab is hidden, bonus animation via WAAPI, reduced-motion fallback.
 */
import { useEffect, useRef, useState } from 'react';
import { Award, Building2, Send } from 'lucide-react';

const SPARK = [82, 88, 91, 87, 95, 93, 98]; // on-time %, last 7 days

export function DemoTodayHero() {
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
    // Mandarin ink-press "set" stamp — the owner portal's signature delight.
    const rect = btn.getBoundingClientRect();
    const stamp = document.createElement('div');
    stamp.setAttribute('aria-hidden', 'true');
    stamp.style.position = 'fixed';
    stamp.style.left = `${rect.left + rect.width / 2 - 14}px`;
    stamp.style.top = `${rect.top - 8}px`;
    stamp.style.width = '28px';
    stamp.style.height = '28px';
    stamp.style.pointerEvents = 'none';
    stamp.style.zIndex = '60';
    stamp.innerHTML =
      '<svg viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="24" height="24" rx="3" fill="#FF5B1F"/><text x="14" y="19" text-anchor="middle" font-family="Instrument Serif, serif" font-size="14" fill="#1A0A04">set</text></svg>';
    document.body.appendChild(stamp);
    const dx = (Math.random() - 0.5) * 60;
    stamp.animate(
      [
        { transform: 'translateY(0) scale(0.4) rotate(-8deg)', opacity: 0 },
        { transform: `translate(${dx * 0.4}px, -20px) scale(1.1) rotate(-4deg)`, opacity: 1, offset: 0.4 },
        { transform: `translate(${dx}px, -80px) scale(0.8) rotate(6deg)`, opacity: 0 },
      ],
      { duration: 520, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
    ).onfinish = () => stamp.remove();
  }

  return (
    <section
      className="ps-set relative overflow-hidden rounded-[12px] bg-[#1B2D6B] p-5 text-[#F4EFE6] md:p-6"
      style={{ perspective: '1200px' }}
    >
      <header className="mb-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 font-mono text-[12px] text-[#F4EFE6]/70">
            mejor del día
            <span className="inline-block h-[1px] w-5 align-middle bg-[#FF5B1F]" />
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFlipped((s) => !s)}
          title="Ver detalle semanal de Carmen"
          className="ps-link font-mono text-[11px] text-[#F4EFE6]"
        >
          {flipped ? '← Volver' : 'Ver detalle →'}
        </button>
      </header>

      <div
        ref={cardRef}
        className="relative h-[160px] w-full"
        style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0"
          style={{
            transform: reduced
              ? 'none'
              : flipped
                ? 'rotateY(180deg)'
                : 'rotateY(0deg)',
            backfaceVisibility: 'hidden',
            opacity: reduced && flipped ? 0 : 1,
            transitionProperty: 'transform, opacity',
            transitionDuration: '520ms',
            transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          <div className="flex h-full items-center gap-4">
            <div className="relative grid h-20 w-20 shrink-0 place-items-center rounded-full bg-[#F4EFE6] text-2xl font-bold text-[#1B2D6B] ring-1 ring-[#FF5B1F]/60" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
              CR
              {/* Mandarin conic spotlight (paused when tab hidden). */}
              <span
                aria-hidden
                className={`pointer-events-none absolute -inset-6 rounded-full ${reduced ? '' : 'demo-spotlight'}`}
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0deg, #FF5B1F 14deg, transparent 70deg, transparent 360deg)',
                  filter: 'blur(18px)',
                  opacity: 0.4,
                  animationPlayState: 'var(--play, running)',
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="text-[28px] leading-[1] tracking-[-0.02em] text-[#F4EFE6] md:text-[32px]"
                style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
              >
                Carmen <span className="italic">Ruiz</span>
              </p>
              <p className="mt-1 font-mono text-[11px] text-[#F4EFE6]/70">
                3 limpiezas hoy · 98% a tiempo
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#FF5B1F] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#1A0A04]">
                <Award className="h-3 w-3" /> estrella del día
              </div>
            </div>
            <div className="hidden h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[12px] border border-[#F4EFE6]/20 bg-[#F4EFE6]/5 sm:flex">
              <Building2 className="h-7 w-7 text-[#F4EFE6]/80" strokeWidth={1.25} />
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0"
          style={{
            transform: reduced
              ? 'none'
              : flipped
                ? 'rotateY(360deg)'
                : 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            opacity: reduced ? (flipped ? 1 : 0) : 1,
            transitionProperty: 'transform, opacity',
            transitionDuration: '520ms',
            transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          <div className="flex h-full flex-col justify-between">
            <div>
              <p
                className="text-[20px] leading-[1.05] tracking-[-0.015em] text-[#F4EFE6]"
                style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
              >
                Carmen Ruiz · últimos 7 días
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-[#F4EFE6]/65">
                media de puntualidad: 91%
              </p>
              <svg viewBox="0 0 140 32" className="mt-2 h-10 w-full">
                <polyline
                  fill="none"
                  stroke="#F4EFE6"
                  strokeWidth="1.5"
                  points={SPARK.map((v, i) => `${(i / (SPARK.length - 1)) * 140},${32 - ((v - 80) / 20) * 28}`).join(' ')}
                />
                {SPARK.map((v, i) => (
                  <circle
                    key={i}
                    cx={(i / (SPARK.length - 1)) * 140}
                    cy={32 - ((v - 80) / 20) * 28}
                    r={i === SPARK.length - 1 ? 3 : 1.5}
                    fill={i === SPARK.length - 1 ? '#FF5B1F' : '#F4EFE6'}
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
                className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#FF5B1F] px-4 text-[12px] font-semibold text-[#1A0A04] disabled:cursor-default disabled:opacity-50"
                style={{ transitionDuration: '160ms' }}
              >
                <Send className="h-3.5 w-3.5" />
                {bonusSent ? 'Bonus enviado' : 'Enviar bonus £20'}
              </button>
              {bonusSent ? (
                <span className="font-mono text-[11px] text-[#F4EFE6]/80">
                  £20 enviado a Carmen
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
