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
import { pickCopy, useClientLocale, type ClientLocale } from '@/lib/use-locale-client';

type Prompt = {
  id: string;
  text: string;
  reply: string;
  action: { label: string; href?: string };
};

const PROMPTS_BY_LOCALE: Record<ClientLocale, Prompt[]> = {
  en: [
    {
      id: 'book-fast',
      text: 'Book a cleaning for tomorrow 10am',
      reply:
        'Booked: tomorrow 10:00 at your Soho flat with Ana Ruiz (standard clean, 2h, £45). Ana will confirm in under 5 min. Would you like to add window cleaning for £15 more?',
      action: { label: 'Confirm without windows', href: '/client/preview/cleanings' },
    },
    {
      id: 'subscribe-weekly',
      text: 'Sign me up for a weekly clean with a discount',
      reply:
        'Standard weekly clean with Ana every Tuesday 10:00 — £38.25/visit (15% off vs £45 one-off). You save £27/month. Cancel anytime.',
      action: { label: 'Activate weekly plan', href: '/client/preview/book?plan=weekly' },
    },
    {
      id: 'incident-lookup',
      text: 'Why was my last cleaning cancelled?',
      reply:
        'Your 12 Jun visit was cancelled by Luis (off sick). We auto-assigned Ana for 14 Jun at no extra cost. You received a £10 credit for the inconvenience — available to use.',
      action: { label: 'Use £10 credit', href: '/client/preview/book?credit=10' },
    },
  ],
  es: [
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
  ],
  pt: [
    {
      id: 'book-fast',
      text: 'Reservar limpeza para amanhã às 10h',
      reply:
        'Reservado: amanhã às 10:00 no seu apartamento do Soho com Ana Ruiz (limpeza padrão, 2h, £45). A Ana confirma em menos de 5 min. Quer adicionar limpeza de vidros por mais £15?',
      action: { label: 'Confirmar sem vidros', href: '/client/preview/cleanings' },
    },
    {
      id: 'subscribe-weekly',
      text: 'Subscreva-me a limpeza semanal com desconto',
      reply:
        'Limpeza semanal padrão com a Ana todas as terças às 10:00 — £38,25/visita (15% off vs £45 pontual). Poupa £27/mês. Cancela quando quiser.',
      action: { label: 'Ativar plano semanal', href: '/client/preview/book?plan=weekly' },
    },
    {
      id: 'incident-lookup',
      text: 'Porque foi cancelada a minha última limpeza?',
      reply:
        'A sua visita de 12 jun foi cancelada pelo Luis (doente). Atribuímos automaticamente a Ana para 14 jun sem custo adicional. Recebeu £10 de crédito pela inconveniência — disponíveis para usar.',
      action: { label: 'Usar £10 de crédito', href: '/client/preview/book?credit=10' },
    },
  ],
};

const COPY = {
  en: {
    openTitle: 'Talk to Sofía, your assistant',
    openAria: 'Open Sofía assistant',
    pillLabel: 'Ask me anything',
    dialogAria: 'Sofía assistant',
    closeTitle: 'Close',
    nameTitle: 'Sofía',
    subtitle: 'Your portal assistant — try her out',
    youLabel: 'You',
    sofiaLabel: 'Sofía',
    backTitle: 'Back to suggestions',
    backLabel: 'Back',
  },
  es: {
    openTitle: 'Habla con Sofía, tu asistente',
    openAria: 'Abrir asistente Sofía',
    pillLabel: 'Pregúntame algo',
    dialogAria: 'Asistente Sofía',
    closeTitle: 'Cerrar',
    nameTitle: 'Sofía',
    subtitle: 'Tu asistente del portal — pruébala',
    youLabel: 'Tú',
    sofiaLabel: 'Sofía',
    backTitle: 'Volver a las sugerencias',
    backLabel: 'Atrás',
  },
  pt: {
    openTitle: 'Fala com a Sofía, a tua assistente',
    openAria: 'Abrir assistente Sofía',
    pillLabel: 'Pergunta-me algo',
    dialogAria: 'Assistente Sofía',
    closeTitle: 'Fechar',
    nameTitle: 'Sofía',
    subtitle: 'A tua assistente do portal — experimenta',
    youLabel: 'Tu',
    sofiaLabel: 'Sofía',
    backTitle: 'Voltar às sugestões',
    backLabel: 'Atrás',
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

export function ConciergeSheet() {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  const PROMPTS = PROMPTS_BY_LOCALE[locale] ?? PROMPTS_BY_LOCALE.en;
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
      {/* The pill — fixed above the bottom tab bar. Hidden while sheet
          is open. The blue→indigo→purple gradient was rule-9 forbidden
          (decorative non-semantic colour); we now use the midnight ink
          fill as a primary CTA on the white app surface and reserve the
          teal #10B981 for the tiny sparkle glyph. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={t.openTitle}
        aria-label={t.openAria}
        className={`fixed bottom-20 left-1/2 z-30 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#0A0D18] px-4 py-2 text-[12px] font-bold text-white shadow-[0_10px_28px_-10px_rgba(10,13,24,0.45)] transition will-change-transform hover:scale-[1.03] ${
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
              {/* Header echo of the pill — midnight ink fill, no
                  decorative gradient. The sparkle inside remains the
                  single chromatic accent. */}
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0A0D18]">
                <SparkleGlyph size={18} />
              </span>
              <div>
                <p className="font-display text-base font-bold text-slate-900">
                  {t.nameTitle}
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
                      className="group flex w-full items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-left text-[13px] font-medium text-slate-800 ring-1 ring-inset ring-slate-100 transition hover:bg-white hover:ring-[#10B981]/40"
                    >
                      <span>{p.text}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400 transition group-hover:text-[#0A0D18]" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Streamed reply view. */}
            {picked && (
              <div className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {t.youLabel}
                </p>
                <p className="mt-1 text-[13px] text-slate-700">{picked.text}</p>

                <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-700">
                  <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                  {t.sofiaLabel}
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
                    {t.backLabel}
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    disabled={!streamingDone}
                    title={picked.action.label}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-[#0A0D18] px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white transition hover:bg-[#0A0D18]/90 disabled:cursor-not-allowed disabled:opacity-50"
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
