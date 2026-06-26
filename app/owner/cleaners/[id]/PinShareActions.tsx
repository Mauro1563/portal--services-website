'use client';

import { useState } from 'react';
import { Check, Copy, ExternalLink, Mail, MessageCircle } from 'lucide-react';
import { waUrl as buildWaUrl } from '@/lib/phone';

type Props = {
  cleanerName: string;
  pin: string;
  phone: string | null;
  email: string | null;
  /**
   * Deep-link to the operative login screen with the PIN pre-filled.
   * Computed server-side in the page (uses lib/cleaner-link.ts) so the
   * 'server-only' boundary stays intact in this client component.
   */
  loginUrl: string;
  /**
   * Public business name (Alan Cleaners, etc) — used in the share copy
   * so the cleaner instantly knows who's writing.
   */
  businessName?: string | null;
};

/**
 * Owner-facing share panel for a cleaner's login link. Builds a clean
 * Spanish onboarding message + a one-tap deep-link so the cleaner
 * lands on `/operative/login` with the PIN pre-filled — same magic
 * "one-tap" UX the client portal has.
 *
 * Three channels (the email button hides when we don't have one):
 *  - WhatsApp (uses the cleaner's phone if on file, else share sheet)
 *  - Email   (only when email is on file)
 *  - Copy link / copy PIN — always available as fallback
 *
 * The PIN itself stays visible at the bottom in case the link breaks
 * (some browsers strip query strings on share, links get truncated in
 * copy-paste, etc).
 */
export function PinShareActions({
  cleanerName,
  pin,
  phone,
  email,
  loginUrl,
  businessName,
}: Props) {
  const [copied, setCopied] = useState<'link' | 'pin' | null>(null);

  const team = businessName?.trim() || 'Portal Home';
  const firstName = cleanerName.split(/\s+/)[0] ?? cleanerName;
  const message =
    `¡Hola ${firstName}! 👋\n\n` +
    `Te damos la bienvenida al equipo de ${team}.\n` +
    `Esta es tu app para ver tus limpiezas, hacer check-in y subir fotos.\n\n` +
    `👉 Entra con un toque (PIN ya cargado):\n${loginUrl}\n\n` +
    `Si el link falla, tu PIN es: ${pin}\n\n` +
    `Consejo: añade la página a tu pantalla de inicio para abrirla como una app.`;

  const subject = `Tu acceso al portal de ${team}`;
  const mailUrl = email
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
    : null;

  const waUrl =
    buildWaUrl(phone, message) ??
    `https://wa.me/?text=${encodeURIComponent(message)}`;

  async function copy(text: string, what: 'link' | 'pin') {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      // Older browsers without clipboard API — silent fallback
    }
  }

  return (
    <div className="space-y-3">
      {/* PRIMARY action: open WhatsApp pre-filled with the welcome msg */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-sm font-bold uppercase tracking-wider text-white shadow-[0_10px_24px_-10px_rgba(5,150,105,0.55)] transition hover:brightness-110 active:scale-[0.99]"
      >
        <MessageCircle className="h-4 w-4" />
        {phone ? 'Enviar por WhatsApp' : 'Compartir por WhatsApp'}
      </a>

      {/* SECONDARY channels — email + copy link */}
      <div className="grid grid-cols-2 gap-2">
        {mailUrl ? (
          <a
            href={mailUrl}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-surface-2 bg-surface-0 text-[12px] font-semibold text-text-1 transition hover:border-brand-400 hover:bg-surface-1"
          >
            <Mail className="h-3.5 w-3.5" />
            Enviar por email
          </a>
        ) : null}
        <button
          type="button"
          onClick={() => copy(loginUrl, 'link')}
          className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-surface-2 bg-surface-0 text-[12px] font-semibold text-text-1 transition hover:border-brand-400 hover:bg-surface-1 ${
            mailUrl ? '' : 'col-span-2'
          }`}
        >
          {copied === 'link' ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" /> Link copiado
            </>
          ) : (
            <>
              <ExternalLink className="h-3.5 w-3.5" /> Copiar link
            </>
          )}
        </button>
      </div>

      {/* Preview of what gets sent — so the owner knows */}
      <details className="rounded-xl border border-surface-2 bg-surface-1/40 px-3 py-2">
        <summary className="cursor-pointer text-[10.5px] font-bold uppercase tracking-wider text-text-3">
          Vista previa del mensaje
        </summary>
        <pre className="mt-2 whitespace-pre-wrap break-words font-sans text-[11.5px] leading-relaxed text-text-2">
{message}
        </pre>
      </details>

      {/* PIN fallback — visible + copyable */}
      <div className="flex items-center justify-between gap-2 rounded-xl border border-dashed border-surface-2 bg-surface-1/40 px-3 py-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-3">
            PIN de respaldo
          </p>
          <p className="mt-0.5 font-mono text-base font-bold tracking-[0.3em] text-text-1">
            {pin}
          </p>
        </div>
        <button
          type="button"
          onClick={() => copy(pin, 'pin')}
          aria-label="Copiar PIN"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-surface-2 bg-surface-0 px-3 text-[11px] font-semibold text-text-2 hover:bg-surface-1"
        >
          {copied === 'pin' ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" /> Copiado
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> PIN
            </>
          )}
        </button>
      </div>
    </div>
  );
}
