/**
 * ConciergeSheet — a small "Pregúntame algo" floating pill that morphs
 * into a full bottom-sheet AI concierge ("Sofía"). Three hard-coded
 * suggested prompts fade in with stagger; tapping one streams a typed
 * reply char-by-char (jittered 18–35ms per char) and finishes with a
 * primary action button.
 *
 * Implementation notes:
 *  - The "shared layout" morph (pill → sheet header) is approximated
 *    with two elements that animate in/out with the same gradient
 *    background and rounded shape, so the user perceives continuity
 *    without pulling in framer-motion.
 *  - Streaming uses setTimeout walking a char array; the timer is
 *    cancelled on unmount or when the user picks a new prompt.
 *  - The sparkle glyph uses a CSS conic-gradient mask that rotates
 *    slowly (4s) — not a particle system, no canvas, no raf.
 *  - Sheet renders inside the existing DemoSheet primitive for
 *    backdrop + escape-to-close behavior.
 *  - Mocked: no real LLM call. Replies are deterministic per prompt.
 */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles, X } from 'lucide-react';

type Prompt = {
  id: string;
  text: string;
  reply: string;
  action: { label: string; href?: string };
};

const PROMPTS: Prompt[] = [
  {
    id: 'book-fast',
    text: 'Reservar limpieza para mañana 10am',
    reply:
      'Reservado: mañana 10:00 en tu piso de Soho con Ana Ruiz (limpieza estándar, 2h, £45). Ana confirmará en menos de 5 min. ¿Quieres agregar limpieza de cristales por £15 más?',
    action: { label: 'Confirmar sin cristales', href: '/client/preview/cleanings' },
  },
  {
    id: 'subscribe-weekly',
    text: 'Suscríbeme a limpieza semanal con descuento',
    reply:
      'Limpieza semanal estándar con Ana cada martes 10:00 — £38.25/visita (15% off vs £45 puntual). Te ahorras £27/mes. Cancelas cuando quieras.',
    action: { label: 'Activar plan semanal', href: '/client/preview/book?plan=weekly' },
  },
  {
    id: 'incident-lookup',
    text: '¿Por qué se canceló mi última limpieza?',
    reply:
      'Tu visita del 12 jun fue cancelada por Luis (enfermo). Te asignamos a Ana automáticamente para el 14 jun sin coste extra. Recibiste £10 de crédito por la molestia — disponible para usar.',
    action: { label: 'Usar £10 de crédito', href: '/client/preview/book?credit=10' },
  },
];

// Sparkle glyph used both on the pill and the sheet header — re-skinned
// to the new palette: solid mandarin disc with the sparkles glyph in
// mandarin-ink, no conic gradient (kills the "AI-rainbow" cliché while
// preserving the visual anchor between pill and sheet header).
function SparkleGlyph({ size = 18 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="relative inline-grid place-items-center rounded-full"
      style={{ width: size, height: size, backgroundColor: '#FF5B1F' }}
    >
      <Sparkles
        className="relative"
        style={{ width: size * 0.62, height: size * 0.62, color: '#1A0A04' }}
      />
    </span>
  );
}

export function ConciergeSheet() {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<Prompt | null>(null);
  const [streamed, setStreamed] = useState('');
  const timerRef = useRef<number | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    // Reset selection on close so reopening starts fresh.
    setPicked(null);
    setStreamed('');
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Escape to close.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  // Stream the picked prompt's reply char-by-char.
  useEffect(() => {
    if (!picked) return;
    setStreamed('');
    let i = 0;
    function step() {
      i += 1;
      setStreamed(picked!.reply.slice(0, i));
      if (i < picked!.reply.length) {
        const jitter = 18 + Math.random() * 17; // 18–35ms
        timerRef.current = window.setTimeout(step, jitter);
      } else {
        timerRef.current = null;
      }
    }
    timerRef.current = window.setTimeout(step, 120);
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [picked]);

  const streamingDone = picked != null && streamed.length === picked.reply.length;

  return (
    <>
      {/* The pill — fixed above the bottom tab bar. Hidden while sheet is open. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Habla con Sofía, tu asistente"
        aria-label="Abrir asistente Sofía"
        className={`ps-mono fixed bottom-[5.5rem] left-1/2 z-30 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#141414] bg-[#141414] px-4 py-2.5 text-[12px] text-[#F4EFE6] transition will-change-transform ${
          open ? 'pointer-events-none scale-90 opacity-0' : 'opacity-100'
        }`}
        style={{ transitionDuration: '280ms', transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }}
      >
        <SparkleGlyph size={16} />
        pregúntame algo
      </button>

      {/* The sheet — bottom-anchored, scrim, focus-trap-light. */}
      {open && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center"
          style={{ backgroundColor: 'rgba(20, 20, 20, 0.5)' }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Asistente Sofía"
        >
          <div
            className="relative w-full max-w-md rounded-t-[12px] border-t border-[#1414141A] p-5 pb-[calc(env(safe-area-inset-bottom)+5rem)] client-fade-up"
            style={{ backgroundColor: '#F4EFE6' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full" style={{ backgroundColor: '#1414141A' }} />
            <button
              type="button"
              onClick={close}
              title="Cerrar"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-[#54524D] hover:bg-[#E4DACA] hover:text-[#141414]"
              style={{ transitionDuration: '160ms' }}
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header — visually echoes the pill so it reads as the
                same object morphing into place. */}
            <div className="flex items-center gap-3">
              <SparkleGlyph size={28} />
              <div>
                <p className="ps-serif text-[24px] leading-none tracking-[-0.015em] text-[#141414]">
                  Sofía
                </p>
                <p className="ps-mono mt-1 text-[11px] text-[#54524D]">
                  tu asistente del portal — pruébala
                </p>
              </div>
            </div>

            {/* Prompt list (hidden once a prompt is picked). */}
            {!picked && (
              <ul className="mt-5 flex flex-col gap-2">
                {PROMPTS.map((p, i) => (
                  <li
                    key={p.id}
                    className="client-fade-up"
                    style={{ animationDelay: `${80 + i * 70}ms` }}
                  >
                    <button
                      type="button"
                      onClick={() => setPicked(p)}
                      title={p.text}
                      className="group flex w-full items-center justify-between gap-3 rounded-[12px] border border-[#1414141A] bg-[#E4DACA] px-4 py-3 text-left text-[13px] text-[#141414] transition hover:bg-[#141414] hover:text-[#F4EFE6]"
                      style={{ transitionDuration: '160ms' }}
                    >
                      <span>{p.text}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#54524D] transition group-hover:text-[#FF5B1F]" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Streamed reply view. */}
            {picked && (
              <div className="mt-5">
                <p className="ps-mono text-[11px] text-[#54524D]">tú</p>
                <p className="mt-1 text-[14px] text-[#141414]">{picked.text}</p>

                <p className="ps-mono mt-4 text-[11px] text-[#54524D]">
                  <span
                    style={{
                      backgroundImage: 'linear-gradient(#FF5B1F, #FF5B1F)',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '100% 1px',
                      backgroundPosition: '0 calc(100% + 3px)',
                      paddingBottom: '3px',
                    }}
                  >
                    sofía
                  </span>
                </p>
                <p className="mt-2 min-h-[5.5rem] text-[14px] leading-relaxed text-[#141414]">
                  {streamed}
                  {!streamingDone && (
                    <span
                      aria-hidden
                      className="ml-0.5 inline-block h-[1em] w-[2px] -mb-[3px] align-middle client-stream-caret"
                      style={{ backgroundColor: '#FF5B1F' }}
                    />
                  )}
                </p>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPicked(null)}
                    title="Volver a las sugerencias"
                    className="ps-mono rounded-full border border-[#1414141A] px-4 py-2.5 text-[12px] text-[#141414] hover:bg-[#E4DACA]"
                    style={{ transitionDuration: '160ms' }}
                  >
                    atrás
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    disabled={!streamingDone}
                    title={picked.action.label}
                    className="ps-mono flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-[12px] text-[#1A0A04] transition disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ backgroundColor: '#FF5B1F', transitionDuration: '160ms' }}
                  >
                    {picked.action.label.toLowerCase()}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
