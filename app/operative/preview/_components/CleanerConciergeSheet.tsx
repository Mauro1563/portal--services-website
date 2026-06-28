/**
 * CleanerConciergeSheet — operative-portal sibling of the client
 * ConciergeSheet. Same visual style: a "Pregúntale a Sofía" floating
 * pill that morphs into a bottom-sheet assistant with three suggested
 * prompts that stream a typed reply char-by-char on tap.
 *
 * Mirrors app/client/preview/_components/ConciergeSheet.tsx — see
 * that file for the implementation rationale. Only the PROMPTS list
 * and the pill label diverge here, so the cleaner persona surfaces
 * tasks that matter on the job (earnings, incidents, ETA).
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
    id: 'week-earnings',
    text: '¿Cuánto llevo ganado esta semana?',
    reply:
      'Llevas £280 esta semana — £45 de hoy más £20 de propinas. Te faltan 2 turnos para llegar a tu meta de £350 (Shoreditch 14:30 hoy, Soho Loft mañana 10:00).',
    action: { label: 'Ver desglose', href: '/operative/preview/week' },
  },
  {
    id: 'report-issue',
    text: 'Reportar problema en propiedad',
    reply:
      'Cuéntame qué pasa. Si es la llave del lockbox no abre, el daño en algo de la casa, o el cliente no está — escojo el reporte correcto y se lo paso al dueño en 1 minuto.',
    action: { label: 'Empezar reporte', href: '/operative/preview/chat' },
  },
  {
    id: 'running-late',
    text: 'Voy con 15 min de retraso',
    reply:
      'Aviso a Ms. Patel: "Carmen llega ~12:45 por tráfico. Llegará puntual al resto del día." También notifico a Alan (dueño). ¿Te parece?',
    action: { label: 'Enviar avisos', href: '/operative/preview/chat' },
  },
];

// Sparkle glyph used both on the pill and the sheet header — the
// rotating conic mask is the visual anchor that ties them together.
function SparkleGlyph({ size = 18 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="relative inline-grid place-items-center rounded-full"
      style={{ width: size, height: size }}
    >
      <span
        className="absolute inset-0 rounded-full client-sparkle-mask"
        style={{
          WebkitMask:
            'radial-gradient(circle, transparent 35%, #000 38%, #000 100%)',
          mask: 'radial-gradient(circle, transparent 35%, #000 38%, #000 100%)',
          opacity: 0.55,
        }}
      />
      <Sparkles
        className="relative text-white"
        style={{ width: size * 0.62, height: size * 0.62 }}
      />
    </span>
  );
}

export function CleanerConciergeSheet() {
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
        className={`fixed bottom-20 left-1/2 z-30 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-4 py-2 text-[12px] font-bold text-white shadow-[0_10px_28px_-10px_rgba(99,102,241,0.65)] transition will-change-transform hover:scale-[1.03] ${
          open ? 'pointer-events-none scale-90 opacity-0' : 'opacity-100'
        }`}
        style={{ transitionDuration: '260ms', transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
      >
        <SparkleGlyph size={16} />
        Pregúntale a Sofía
      </button>

      {/* The sheet — bottom-anchored, scrim, focus-trap-light. */}
      {open && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/50"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Asistente Sofía"
        >
          <div
            className="relative w-full max-w-md rounded-t-3xl bg-white p-5 pb-[calc(env(safe-area-inset-bottom)+5rem)] shadow-xl client-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200" />
            <button
              type="button"
              onClick={close}
              title="Cerrar"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header — visually echoes the pill so it reads as the
                same object morphing into place. */}
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
                <SparkleGlyph size={18} />
              </span>
              <div>
                <p className="font-display text-base font-bold text-slate-900">
                  Sofía
                </p>
                <p className="text-[11px] text-slate-500">
                  Tu asistente del portal — pruébala
                </p>
              </div>
            </div>

            {/* Prompt list (hidden once a prompt is picked). */}
            {!picked && (
              <ul className="mt-4 flex flex-col gap-2">
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
                      className="group flex w-full items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-left text-[13px] font-medium text-slate-800 ring-1 ring-inset ring-slate-100 transition hover:bg-blue-50 hover:ring-blue-200"
                    >
                      <span>{p.text}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400 transition group-hover:text-blue-600" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Streamed reply view. */}
            {picked && (
              <div className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Tú
                </p>
                <p className="mt-1 text-[13px] text-slate-700">{picked.text}</p>

                <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                  Sofía
                </p>
                <p className="mt-1 min-h-[5.5rem] text-[13.5px] leading-relaxed text-slate-800">
                  {streamed}
                  {!streamingDone && (
                    <span
                      aria-hidden
                      className="ml-0.5 inline-block h-[1em] w-[2px] -mb-[3px] bg-slate-700 align-middle client-stream-caret"
                    />
                  )}
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPicked(null)}
                    title="Volver a las sugerencias"
                    className="rounded-2xl bg-slate-100 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-200"
                  >
                    Atrás
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    disabled={!streamingDone}
                    title={picked.action.label}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-blue-600 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {picked.action.label}
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
