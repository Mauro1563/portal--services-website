/**
 * OwnerConciergeSheet — owner-side adaptation of the client ConciergeSheet.
 * Same visual language: gradient pill, blue→indigo→purple gradient header,
 * rotating sparkle glyph, fade-up suggestion list, char-by-char streamed
 * reply, Atrás + CTA buttons. Three owner-flavoured prompts (revenue,
 * reassignment, bonus). Pinned bottom-right so it sits clear of the
 * bottom tab bar's centre on the wider owner page.
 *
 * Mocked: no real LLM call. Replies are deterministic per prompt and the
 * streaming uses setTimeout walking a char array (jittered 18–35ms).
 */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles, X } from 'lucide-react';
import { useClientLocale, pickCopy } from '@/lib/use-locale-client';

type Prompt = {
  id: string;
  text: string;
  reply: string;
  action: { label: string; href?: string };
};

const COPY = {
  en: {
    askSofia: 'Ask Sofía',
    talkToSofia: 'Talk to Sofía, your assistant',
    openSofia: 'Open Sofía assistant',
    sofia: 'Sofía',
    yourAssistant: 'Your portal assistant — try it',
    sofiaAssistant: 'Sofía assistant',
    close: 'Close',
    you: 'You',
    backToSuggestions: 'Back to suggestions',
    back: 'Back',
    prompts: [
      {
        id: 'revenue-week',
        text: 'Show my revenue this week',
        reply:
          'This week you’re at £1,450 (+20% vs last week). Your best day was Thursday at £310, thanks to the 3 deep cleans you accepted. You have 4 pending tasks today worth £180.',
        action: { label: 'See week detail', href: '/owner/preview/analytics' },
      },
      {
        id: 'reassign-pedro',
        text: 'Reassign Pedro’s pending tasks',
        reply:
          'Pedro has 2 tasks tomorrow (Loft Goya 9:00, Casa Sol 14:00). Carmen R. is available for both. Shall I reassign and notify her via WhatsApp?',
        action: { label: 'Reassign to Carmen', href: '/owner/preview/tasks' },
      },
      {
        id: 'bonus-carmen',
        text: 'Send Carmen a £20 bonus for a good week',
        reply:
          'Carmen completed 8 tasks with a 4.9 rating this week. Sending £20 now is automatically deducted from the next payout. Confirm?',
        action: { label: 'Send bonus now', href: '/owner/preview/cleaners' },
      },
    ] as Prompt[],
  },
  es: {
    askSofia: 'Pregúntale a Sofía',
    talkToSofia: 'Habla con Sofía, tu asistente',
    openSofia: 'Abrir asistente Sofía',
    sofia: 'Sofía',
    yourAssistant: 'Tu asistente del portal — pruébala',
    sofiaAssistant: 'Asistente Sofía',
    close: 'Cerrar',
    you: 'Tú',
    backToSuggestions: 'Volver a las sugerencias',
    back: 'Atrás',
    prompts: [
      {
        id: 'revenue-week',
        text: 'Mostrar mi revenue de esta semana',
        reply:
          'Esta semana llevas £1,450 (+20% vs semana pasada). Tu mejor día fue jueves con £310, gracias a las 3 limpiezas profundas que aceptaste. Te quedan 4 tareas pendientes hoy por £180.',
        action: { label: 'Ver detalle de la semana', href: '/owner/preview/analytics' },
      },
      {
        id: 'reassign-pedro',
        text: 'Reasignar las tareas pendientes de Pedro',
        reply:
          'Pedro tiene 2 tareas mañana (Loft Goya 9:00, Casa Sol 14:00). Carmen R. tiene disponibilidad ambas. ¿Le reasigno y le aviso por WhatsApp?',
        action: { label: 'Reasignar a Carmen', href: '/owner/preview/tasks' },
      },
      {
        id: 'bonus-carmen',
        text: 'Enviar bono de £20 a Carmen por buena semana',
        reply:
          'Carmen completó 8 tareas con rating 4.9 esta semana. Enviar £20 ahora se descuenta del próximo pago automáticamente. ¿Confirmas?',
        action: { label: 'Enviar bono ahora', href: '/owner/preview/cleaners' },
      },
    ] as Prompt[],
  },
  pt: {
    askSofia: 'Pergunta à Sofía',
    talkToSofia: 'Fala com a Sofía, a tua assistente',
    openSofia: 'Abrir assistente Sofía',
    sofia: 'Sofía',
    yourAssistant: 'A tua assistente do portal — experimenta',
    sofiaAssistant: 'Assistente Sofía',
    close: 'Fechar',
    you: 'Tu',
    backToSuggestions: 'Voltar às sugestões',
    back: 'Voltar',
    prompts: [
      {
        id: 'revenue-week',
        text: 'Mostra as minhas receitas desta semana',
        reply:
          'Esta semana estás em £1,450 (+20% vs semana passada). O teu melhor dia foi quinta com £310, graças às 3 limpezas profundas que aceitaste. Tens 4 tarefas pendentes hoje no valor de £180.',
        action: { label: 'Ver detalhe da semana', href: '/owner/preview/analytics' },
      },
      {
        id: 'reassign-pedro',
        text: 'Reatribuir as tarefas pendentes do Pedro',
        reply:
          'O Pedro tem 2 tarefas amanhã (Loft Goya 9:00, Casa Sol 14:00). A Carmen R. tem disponibilidade para ambas. Queres que reatribua e a avise por WhatsApp?',
        action: { label: 'Reatribuir à Carmen', href: '/owner/preview/tasks' },
      },
      {
        id: 'bonus-carmen',
        text: 'Enviar um bónus de £20 à Carmen pela boa semana',
        reply:
          'A Carmen concluiu 8 tarefas com classificação 4.9 esta semana. Enviar £20 agora é descontado automaticamente do próximo pagamento. Confirmas?',
        action: { label: 'Enviar bónus agora', href: '/owner/preview/cleaners' },
      },
    ] as Prompt[],
  },
} as const;

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

export function OwnerConciergeSheet() {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  const PROMPTS = t.prompts;
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
      {/* The pill — pinned bottom-right above the tab bar so it doesn't
          collide with the bar's centre FAB area on the wider owner page. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={t.talkToSofia}
        aria-label={t.openSofia}
        className={`fixed bottom-20 right-4 z-30 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-4 py-2 text-[12px] font-bold text-white shadow-[0_10px_28px_-10px_rgba(99,102,241,0.65)] transition will-change-transform hover:scale-[1.03] ${
          open ? 'pointer-events-none scale-90 opacity-0' : 'opacity-100'
        }`}
        style={{ transitionDuration: '260ms', transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
      >
        <SparkleGlyph size={16} />
        {t.askSofia}
      </button>

      {/* The sheet — bottom-anchored, scrim, focus-trap-light. */}
      {open && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/50"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={t.sofiaAssistant}
        >
          <div
            className="relative w-full max-w-md rounded-t-3xl bg-white p-5 pb-[calc(env(safe-area-inset-bottom)+5rem)] shadow-xl client-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200" />
            <button
              type="button"
              onClick={close}
              title={t.close}
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
                  {t.sofia}
                </p>
                <p className="text-[11px] text-slate-500">
                  {t.yourAssistant}
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
                  {t.you}
                </p>
                <p className="mt-1 text-[13px] text-slate-700">{picked.text}</p>

                <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                  {t.sofia}
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
                    title={t.backToSuggestions}
                    className="rounded-2xl bg-slate-100 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-200"
                  >
                    {t.back}
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
