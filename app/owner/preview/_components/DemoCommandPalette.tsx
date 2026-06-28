'use client';

/**
 * Cmd/Ctrl-K command palette with voice dictation. The owner can either
 * type a command ("programar limpieza de Soho mañana 10am") or tap the
 * mic to dictate it. As text streams in, property + time + day tokens
 * are highlighted live by a tiny regex parser. Pressing Enter "creates"
 * the task — the palette then morphs outward into the result tile via
 * Element.animate().
 *
 * SpeechRecognition is feature-detected; if missing, the typed input
 * still drives token highlighting + creation. The spectrum analyzer
 * polls AudioContext at 30fps (not 60) to spare battery, and the mic
 * auto-stops after 4s of silence.
 *
 * Reduced motion: skip the morph, fade only.
 */
import { useEffect, useRef, useState } from 'react';
import { Mic, Sparkles, X } from 'lucide-react';

// Minimal types — Web Speech is non-standard so we declare what we use.
type SpeechResult = {
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
  }>;
};
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: SpeechResult) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

const PROPERTY_KEYWORDS = [
  'soho', 'camden', 'notting hill', 'mayfair', 'shoreditch', 'hackney', 'kensington', 'bermondsey',
];
const DAY_RE = /\b(hoy|mañana|manana|lunes|martes|miércoles|miercoles|jueves|viernes|sábado|sabado|domingo)\b/gi;
const TIME_RE = /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/gi;

type Token = { kind: 'plain' | 'property' | 'time' | 'day'; text: string };

function tokenize(text: string): Token[] {
  if (!text) return [];
  type Hit = { start: number; end: number; kind: Token['kind'] };
  const hits: Hit[] = [];
  const lower = text.toLowerCase();
  for (const key of PROPERTY_KEYWORDS) {
    let i = lower.indexOf(key);
    while (i !== -1) {
      hits.push({ start: i, end: i + key.length, kind: 'property' });
      i = lower.indexOf(key, i + key.length);
    }
  }
  for (const re of [DAY_RE, TIME_RE]) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      hits.push({ start: m.index, end: m.index + m[0].length, kind: re === DAY_RE ? 'day' : 'time' });
    }
  }
  hits.sort((a, b) => a.start - b.start);
  // De-overlap by giving earlier hits priority.
  const merged: Hit[] = [];
  for (const h of hits) {
    const last = merged[merged.length - 1];
    if (!last || h.start >= last.end) merged.push(h);
  }
  const out: Token[] = [];
  let cursor = 0;
  for (const h of merged) {
    if (h.start > cursor) out.push({ kind: 'plain', text: text.slice(cursor, h.start) });
    out.push({ kind: h.kind, text: text.slice(h.start, h.end) });
    cursor = h.end;
  }
  if (cursor < text.length) out.push({ kind: 'plain', text: text.slice(cursor) });
  return out;
}

const TOKEN_CLS: Record<Token['kind'], string> = {
  plain: '',
  property: 'border-b border-[#FF5B1F] text-[#141414] pb-0.5',
  time: 'font-mono text-[#FF5B1F]',
  day: 'italic text-[#1B2D6B]',
};

export function DemoCommandPalette() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const [bars, setBars] = useState<number[]>(() => Array(12).fill(0));
  const [committed, setCommitted] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Cmd/Ctrl-K to toggle.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((s) => !s);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      stopListening();
      setText('');
      setCommitted(null);
    }
  }, [open]);

  function stopListening() {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* noop */ }
      recognitionRef.current = null;
    }
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch { /* noop */ }
      audioCtxRef.current = null;
    }
    if (silenceTimerRef.current != null) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    setListening(false);
    setBars(Array(12).fill(0));
  }

  async function startListening() {
    setListening(true);
    setText('');
    // Spectrum + silence detector via getUserMedia + AnalyserNode.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      src.connect(analyser);
      analyserRef.current = analyser;
      const buf = new Uint8Array(analyser.frequencyBinCount);
      let last = 0;
      let lastVoiceAt = performance.now();
      const tick = (now: number) => {
        if (now - last >= 33) {
          last = now;
          analyser.getByteFrequencyData(buf);
          const sliced = Array.from(buf).slice(0, 12).map((v) => v / 255);
          setBars(sliced);
          const avg = sliced.reduce((a, b) => a + b, 0) / sliced.length;
          if (avg > 0.06) lastVoiceAt = now;
          if (now - lastVoiceAt > 4000) {
            stopListening();
            return;
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      // Mic not available — fall back to plain typing.
    }
    // SpeechRecognition where supported.
    const Ctor =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;
    if (Ctor) {
      try {
        const rec = new Ctor();
        rec.lang = 'es-ES';
        rec.interimResults = true;
        rec.continuous = false;
        rec.onresult = (e) => {
          let combined = '';
          for (let i = 0; i < e.results.length; i++) {
            combined += e.results[i][0].transcript;
          }
          setText(combined);
        };
        rec.onend = () => {
          recognitionRef.current = null;
        };
        rec.start();
        recognitionRef.current = rec;
      } catch {
        /* noop */
      }
    }
  }

  function commit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setCommitted(trimmed);
    stopListening();
    // Morph: animate the card to the bottom-right action button area.
    const card = cardRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (card && !reduced && typeof card.animate === 'function') {
      card.animate(
        [
          { transform: 'translateY(0) scale(1)', opacity: 1 },
          { transform: 'translateY(40vh) scale(0.4)', opacity: 0 },
        ],
        { duration: 280, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' },
      );
    }
    window.setTimeout(() => {
      setOpen(false);
    }, 260);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    commit();
  }

  const tokens = tokenize(text);

  return (
    <>
      {/* Trigger: floating mandarin chip above the bottom tab bar */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Comando rápido por voz o texto (Cmd/Ctrl-K)"
        aria-label="Abrir comando rápido"
        className="fixed bottom-20 right-4 z-30 inline-flex h-12 items-center gap-2 rounded-full bg-[#FF5B1F] px-4 text-[12.5px] font-semibold text-[#1A0A04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
        style={{ transitionDuration: '160ms' }}
      >
        <Mic className="h-4 w-4" />
        <span>Voz</span>
        <kbd className="hidden rounded border border-[#1A0A04]/30 px-1.5 py-0.5 font-mono text-[10px] text-[#1A0A04] sm:inline">⌘K</kbd>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Comando rápido"
          className="fixed inset-0 z-50 flex items-start justify-center bg-[#141414]/40 px-4 pt-[18vh] backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div
            ref={cardRef}
            className="ps-set w-full max-w-xl overflow-hidden rounded-[12px] border border-[#1414141A] bg-[#F4EFE6]"
          >
            {/* Spectrum analyzer — ink bar with mandarin bars */}
            <div className="flex h-8 items-end justify-center gap-[3px] bg-[#141414] px-4 pt-2 pb-1.5">
              {bars.map((v, i) => (
                <span
                  key={i}
                  className="w-1 rounded-t bg-[#FF5B1F] transition-[height] duration-100"
                  style={{ height: `${Math.max(2, v * 18)}px` }}
                />
              ))}
            </div>
            <form onSubmit={onSubmit} className="flex items-center gap-2 border-b border-[#1414141A] px-4 py-3">
              <Sparkles className="h-4 w-4 shrink-0 text-[#FF5B1F]" />
              <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Programar limpieza de Soho mañana 10am…"
                className="min-w-0 flex-1 bg-transparent text-[15px] text-[#141414] placeholder:text-[#54524D] focus:outline-none"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => (listening ? stopListening() : startListening())}
                aria-label={listening ? 'Detener dictado' : 'Dictar por voz'}
                className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${
                  listening
                    ? 'bg-[#FF5B1F] text-[#1A0A04]'
                    : 'border border-[#1414141A] bg-transparent text-[#141414] hover:bg-[#E4DACA]'
                }`}
                style={{ transitionDuration: '160ms' }}
              >
                <Mic className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="rounded-full p-2 text-[#54524D] hover:bg-[#E4DACA]"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
            {/* Parsed preview */}
            <div className="px-4 py-4">
              <p className="font-mono text-[11px] text-[#54524D]">
                vista previa
                <span className="ml-1 inline-block h-[1px] w-5 align-middle bg-[#FF5B1F]" />
              </p>
              <p className="mt-2 min-h-[28px] text-[14px] leading-snug text-[#141414]">
                {tokens.length === 0 ? (
                  <span className="text-[#54524D]">
                    Tokens de <span className="border-b border-[#FF5B1F] pb-0.5">propiedad</span>,
                    {' '}<span className="italic text-[#1B2D6B]">día</span> y
                    {' '}<span className="font-mono text-[#FF5B1F]">hora</span> aparecerán al escribir.
                  </span>
                ) : (
                  tokens.map((t, i) => (
                    <span key={i} className={TOKEN_CLS[t.kind]}>
                      {t.text}
                    </span>
                  ))
                )}
              </p>
              {committed ? (
                <p className="ps-set mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#3F5B3A]/30 px-2 py-1 font-mono text-[11px] text-[#3F5B3A]">
                  ✓ Tarea creada
                </p>
              ) : null}
              <p className="mt-4 font-mono text-[10.5px] text-[#54524D]">
                Enter para crear · Esc para cerrar · ⌘K para abrir
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
