'use client';

/**
 * AsistenteSheet
 * --------------
 * A 60vh bottom sheet that rises with spring physics from the centre of
 * the bottom tab bar. Suggestions are pure-functions of the current
 * task state, so the sheet always reflects what the cleaner just did.
 *
 * Includes a fake voice chip (Web Speech API stubbed) which animates a
 * pre-scripted string char-by-char on activation, so the demo can show
 * the "felt experience" without microphone permissions.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, Mic, Phone, Sparkles, Timer, X } from 'lucide-react';
// Sparkles retained for the fallback suggestion icon mapping (iconFor → 'fallback').

export type DemoTaskLike = {
  id: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  start_time: string;
  client_name: string;
  property_name: string;
  actualHours: number | null;
  photos: string[];
};

type SuggestionKind = 'report-hours' | 'call-client' | 'upload-photo' | 'fallback';

export type Suggestion = {
  id: string;
  kind: SuggestionKind;
  title: string;
  subtitle: string;
};

/** Pure derivation — re-runs on every render of the parent. No state. */
export function suggestionsFor(tasks: DemoTaskLike[]): Suggestion[] {
  const out: Suggestion[] = [];

  const inProgress = tasks.find((t) => t.status === 'in_progress');
  if (inProgress && inProgress.actualHours == null) {
    out.push({
      id: `report-${inProgress.id}`,
      kind: 'report-hours',
      title: `Reporta las horas de ${inProgress.property_name}`,
      subtitle: 'Aún no has añadido las horas trabajadas.',
    });
  }

  // Next scheduled task >90 min away → suggest calling to confirm.
  const nextScheduled = tasks.find((t) => t.status === 'scheduled');
  if (nextScheduled) {
    const minutesUntil = minutesFromHHMM(nextScheduled.start_time);
    if (minutesUntil > 90) {
      out.push({
        id: `call-${nextScheduled.id}`,
        kind: 'call-client',
        title: `Llama a ${nextScheduled.client_name} para confirmar ${nextScheduled.start_time}`,
        subtitle: `Aún faltan ${Math.round(minutesUntil)} min — confirma para no encontrar la puerta cerrada.`,
      });
    }
  }

  const completedNoPhotos = tasks.find(
    (t) => t.status === 'completed' && t.photos.length === 0,
  );
  if (completedNoPhotos) {
    out.push({
      id: `photo-${completedNoPhotos.id}`,
      kind: 'upload-photo',
      title: `Sube foto del trabajo en ${completedNoPhotos.property_name}`,
      subtitle: 'Las fotos suben tu valoración y reducen disputas.',
    });
  }

  if (out.length === 0) {
    out.push({
      id: 'fallback-tip',
      kind: 'fallback',
      title: 'Vas al día — tómate 2 minutos',
      subtitle: 'Cuando completes otra tarea, te sugeriré el siguiente paso.',
    });
  }

  return out.slice(0, 3);
}

function minutesFromHHMM(hhmm: string): number {
  const [hStr, mStr] = hhmm.split(':');
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  const now = new Date();
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  return Math.max(0, (target.getTime() - now.getTime()) / 60000);
}

function iconFor(kind: SuggestionKind) {
  switch (kind) {
    case 'report-hours':
      return Timer;
    case 'call-client':
      return Phone;
    case 'upload-photo':
      return Camera;
    default:
      return Sparkles;
  }
}

const SCRIPTED_VOICE = 'Programar limpieza de Soho mañana 10am';

export function AsistenteSheet({
  open,
  onClose,
  tasks,
  onAction,
}: {
  open: boolean;
  onClose: () => void;
  tasks: DemoTaskLike[];
  onAction?: (s: Suggestion) => void;
}) {
  const suggestions = useMemo(() => suggestionsFor(tasks), [tasks]);

  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [voiceTyping, setVoiceTyping] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(m.matches);
    update();
    m.addEventListener?.('change', update);
    return () => m.removeEventListener?.('change', update);
  }, []);

  // Reset transient state whenever the sheet closes.
  useEffect(() => {
    if (!open) {
      setDragY(0);
      setVoiceText('');
      setVoiceTyping(false);
    }
  }, [open]);

  // Escape to close + simple focus trap baseline.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  function onHandleDown(e: React.PointerEvent<HTMLDivElement>) {
    startY.current = e.clientY;
    pointerIdRef.current = e.pointerId;
    setDragging(true);
    try {
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    } catch {
      /* noop */
    }
  }

  function onHandleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (startY.current == null) return;
    const dy = e.clientY - startY.current;
    setDragY(Math.max(0, dy));
  }

  function onHandleUp() {
    if (dragY > 120) {
      onClose();
    }
    setDragY(0);
    setDragging(false);
    startY.current = null;
    pointerIdRef.current = null;
  }

  function playFakeVoice() {
    if (voiceTyping) return;
    setVoiceText('');
    setVoiceTyping(true);
    const chars = SCRIPTED_VOICE.split('');
    let i = 0;
    const tick = () => {
      i += 1;
      setVoiceText(chars.slice(0, i).join(''));
      if (i < chars.length) {
        window.setTimeout(tick, 22);
      } else {
        setVoiceTyping(false);
      }
    };
    window.setTimeout(tick, 200);
  }

  const sheetTransition = dragging
    ? 'none'
    : reducedMotion
      ? 'transform 80ms linear'
      : 'transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1)';

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`fixed inset-0 z-[80] bg-black/45 transition-opacity duration-300 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Asistente"
        className="fixed inset-x-0 bottom-0 z-[85] mx-auto w-full max-w-md"
        style={{
          transform: open
            ? `translateY(${dragY}px)`
            : `translateY(100%)`,
          transition: sheetTransition,
        }}
      >
        <div
          className="rounded-t-[12px] border-t border-x border-[#1414141A] bg-[#F4EFE6] pb-6 pt-2"
          style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
        >
          {/* Drag handle — wide, thumb-friendly */}
          <div
            onPointerDown={onHandleDown}
            onPointerMove={onHandleMove}
            onPointerUp={onHandleUp}
            onPointerCancel={onHandleUp}
            className="flex cursor-grab justify-center py-2 touch-none"
            style={{ touchAction: 'none' }}
          >
            <span className="block h-1 w-12 rounded-full bg-[#1414141A]" />
          </div>

          <div className="px-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="ps-mono text-[12px] text-[#54524D]">
                  <span className="ps-link-mandarin text-[#141414]">asistente</span>
                </p>
                <h3 className="ps-serif mt-2 text-[28px] leading-[0.95] tracking-[-0.02em] text-[#141414]">
                  ¿Qué puedo hacer por ti?
                </h3>
                <p className="mt-1 text-[13px] leading-snug text-[#54524D]">
                  Sugerencias basadas en tu agenda ahora mismo.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar asistente"
                className="grid h-9 w-9 place-items-center rounded-full border border-[#1414141A] text-[#54524D] transition-colors hover:border-[#141414] hover:text-[#141414]"
                style={{ transitionDuration: 'var(--dur-fast)', transitionTimingFunction: 'var(--ease)' }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Voice chip — fake STT */}
            <button
              type="button"
              onClick={playFakeVoice}
              className="mt-5 flex w-full items-center gap-3 rounded-full border border-[#1414141A] bg-[#E4DACA] px-3 py-2.5 text-left text-[13px] text-[#141414] transition-colors hover:border-[#141414]"
              style={{ transitionDuration: 'var(--dur-fast)', transitionTimingFunction: 'var(--ease)' }}
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-full bg-[#FF5B1F] text-[#1A0A04] ${
                  voiceTyping ? 'animate-pulse' : ''
                }`}
              >
                <Mic className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1 truncate">
                {voiceText || (voiceTyping ? 'Escuchando…' : 'Pulsa y habla — p.ej. "agenda Soho mañana 10am"')}
                {voiceTyping ? (
                  <span className="ml-0.5 inline-block h-3 w-[2px] animate-pulse bg-[#FF5B1F] align-middle" />
                ) : null}
              </span>
            </button>

            {/* Suggestions */}
            <ul className="mt-5 space-y-2">
              {suggestions.map((s) => {
                const Icon = iconFor(s.kind);
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onAction?.(s);
                        onClose();
                      }}
                      className="ps-set flex w-full items-start gap-3 rounded-[12px] border border-[#1414141A] bg-[#E4DACA] px-4 py-3 text-left transition-colors hover:border-[#141414]"
                      style={{ transitionDuration: 'var(--dur-fast)', transitionTimingFunction: 'var(--ease)' }}
                    >
                      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-[12px] border border-[#1414141A] bg-[#F4EFE6] text-[#141414]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14px] font-medium text-[#141414]">
                          {s.title}
                        </span>
                        <span className="mt-0.5 block text-[12px] leading-snug text-[#54524D]">
                          {s.subtitle}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
