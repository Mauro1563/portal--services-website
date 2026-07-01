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

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Sparkles, X } from 'lucide-react';
import { pickCopy, useClientLocale, type ClientLocale } from '@/lib/use-locale-client';

type Prompt = {
  id: string;
  text: string;
  reply: string;
  action: { label: string; href?: string };
};

const COPY = {
  en: {
    pillTitle: 'Talk to Sofía, your assistant',
    pillAria: 'Open Sofía assistant',
    pillLabel: 'Ask Sofía',
    dialogAria: 'Sofía assistant',
    closeTitle: 'Close',
    name: 'Sofía',
    subtitle: 'Your portal assistant — give it a try',
    you: 'You',
    back: 'Back',
    backTitle: 'Back to the suggestions',
    prompts: [
      {
        id: 'week-earnings',
        text: 'How much have I earned this week?',
        reply:
          "You're on £280 this week — £45 from today plus £20 in tips. You're 2 jobs short of your £350 goal (Shoreditch 14:30 today, Soho Loft tomorrow at 10:00).",
        action: { label: 'See breakdown', href: '/operative/preview/week' },
      },
      {
        id: 'report-issue',
        text: 'Report an issue at a property',
        reply:
          "Tell me what's happening. Whether the lockbox key won't open, something in the home is damaged, or the client isn't there — I'll pick the right report and pass it to the owner in 1 minute.",
        action: { label: 'Start report', href: '/operative/preview/chat' },
      },
      {
        id: 'running-late',
        text: "I'm running 15 minutes late",
        reply:
          'Letting Ms. Patel know: "Carmen will arrive ~12:45 due to traffic. She\'ll be on time for the rest of the day." I\'ll also notify Alan (owner). Sound good?',
        action: { label: 'Send updates', href: '/operative/preview/chat' },
      },
    ] as ReadonlyArray<Prompt>,
  },
  es: {
    pillTitle: 'Habla con Sofía, tu asistente',
    pillAria: 'Abrir asistente Sofía',
    pillLabel: 'Pregúntale a Sofía',
    dialogAria: 'Asistente Sofía',
    closeTitle: 'Cerrar',
    name: 'Sofía',
    subtitle: 'Tu asistente del portal — pruébala',
    you: 'Tú',
    back: 'Atrás',
    backTitle: 'Volver a las sugerencias',
    prompts: [
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
    ] as ReadonlyArray<Prompt>,
  },
  pt: {
    pillTitle: 'Fale com a Sofía, a sua assistente',
    pillAria: 'Abrir assistente Sofía',
    pillLabel: 'Pergunte à Sofía',
    dialogAria: 'Assistente Sofía',
    closeTitle: 'Fechar',
    name: 'Sofía',
    subtitle: 'A sua assistente do portal — experimente',
    you: 'Você',
    back: 'Voltar',
    backTitle: 'Voltar às sugestões',
    prompts: [
      {
        id: 'week-earnings',
        text: 'Quanto já ganhei esta semana?',
        reply:
          'Vai em £280 esta semana — £45 de hoje mais £20 de gorjetas. Faltam-lhe 2 turnos para chegar à meta de £350 (Shoreditch 14:30 hoje, Soho Loft amanhã às 10:00).',
        action: { label: 'Ver detalhe', href: '/operative/preview/week' },
      },
      {
        id: 'report-issue',
        text: 'Reportar problema na propriedade',
        reply:
          'Conte-me o que se passa. Se a chave do cofre não abre, há um dano na casa, ou o cliente não está — escolho o relatório certo e envio-o ao proprietário em 1 minuto.',
        action: { label: 'Começar relatório', href: '/operative/preview/chat' },
      },
      {
        id: 'running-late',
        text: 'Estou 15 min atrasada',
        reply:
          'A avisar a Ms. Patel: "A Carmen chega por volta das 12:45 por causa do trânsito. Ficará a horas para o resto do dia." Também notifico o Alan (proprietário). Concorda?',
        action: { label: 'Enviar avisos', href: '/operative/preview/chat' },
      },
    ] as ReadonlyArray<Prompt>,
  },
} as const satisfies Record<ClientLocale, unknown>;

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
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  const PROMPTS = useMemo(() => [...t.prompts], [t]);
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
        title={t.pillTitle}
        aria-label={t.pillAria}
        className={`fixed bottom-20 left-1/2 z-30 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#0A0D18] px-4 py-2 text-[12px] font-bold text-white shadow-[0_10px_28px_-12px_rgba(10,13,24,0.55)] transition will-change-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] focus-visible:ring-offset-2 ${
          open ? 'pointer-events-none scale-90 opacity-0' : 'opacity-100'
        }`}
        style={{ transitionDuration: '260ms', transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
      >
        <SparkleGlyph size={16} />
        {t.pillLabel}
      </button>

      {/* The sheet — bottom-anchored, scrim, focus-trap-light. */}
      {open && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/50"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={t.dialogAria}
        >
          <div
            className="relative w-full max-w-md rounded-t-3xl bg-white p-5 pb-[calc(env(safe-area-inset-bottom)+5rem)] shadow-xl client-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200" />
            <button
              type="button"
              onClick={close}
              title={t.closeTitle}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header — visually echoes the pill so it reads as the
                same object morphing into place. */}
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0A0D18] ring-1 ring-[#10B981]/40">
                <SparkleGlyph size={18} />
              </span>
              <div>
                <p className="font-display text-base font-bold text-slate-900">
                  {t.name}
                </p>
                <p className="text-[11px] text-slate-500">
                  {t.subtitle}
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
                      className="group flex w-full items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-left text-[13px] font-medium text-slate-800 ring-1 ring-inset ring-slate-200 transition hover:bg-slate-100 hover:ring-slate-300"
                    >
                      <span>{p.text}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400 transition group-hover:text-slate-900" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Streamed reply view. */}
            {picked && (
              <div className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {t.you}
                </p>
                <p className="mt-1 text-[13px] text-slate-700">{picked.text}</p>

                <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-700">
                  <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                  {t.name}
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
                    title={t.backTitle}
                    className="rounded-2xl bg-slate-100 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-200"
                  >
                    {t.back}
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    disabled={!streamingDone}
                    title={picked.action.label}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-[#0A0D18] px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] focus-visible:ring-offset-2"
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
