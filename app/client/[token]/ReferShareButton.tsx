'use client';

import { useState } from 'react';
import { Check, Copy, Gift, MessageCircle, Share2, Star } from 'lucide-react';

type Props = {
  businessName: string;
  clientName: string;
  ownerEmail: string | null;
  signupUrl: string;
};

export function ReferShareButton({
  businessName,
  clientName,
  ownerEmail,
  signupUrl,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const firstName = clientName.split(/\s+/)[0];

  const referralMessage =
    `¡Hola! Soy ${firstName} 👋\n\n` +
    `Uso ${businessName} para mis limpiezas y son geniales — ` +
    `fácil de reservar, las limpiadoras registran su entrada con GPS, te envían ` +
    `una foto al terminar y lo ves todo desde el móvil.\n\n` +
    `Si necesitas una limpieza de confianza, pruébalos:\n` +
    `${signupUrl}\n\n` +
    (ownerEmail ? `Contacto: ${ownerEmail}` : '');

  const waUrl = `https://wa.me/?text=${encodeURIComponent(referralMessage)}`;

  // Use the Web Share API on devices that support it (iOS / Android native)
  async function nativeShare() {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: `${businessName} — servicio de limpieza`,
          text: referralMessage,
        });
        return;
      } catch {
        // user cancelled or share failed; fall through to WhatsApp link
      }
    }
    window.open(waUrl, '_blank');
  }

  function copy() {
    navigator.clipboard.writeText(referralMessage).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      },
      () => {},
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/60 p-4 text-left shadow-card transition hover:shadow-card-lg"
      >
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15">
          <Gift className="h-5 w-5 text-amber-700" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-semibold text-text-1">
            ¿Te gusta {businessName}? Cuéntale a un amigo
          </p>
          <p className="mt-0.5 text-[11px] text-text-2">
            Comparte este servicio con alguien que lo necesite.
          </p>
        </div>
        <Share2 className="h-4 w-4 shrink-0 text-amber-700" />
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default bg-black/40 backdrop-blur-sm"
          />
          <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md rounded-t-3xl border-t border-surface-2 bg-surface-0 p-5 shadow-card-lg sm:inset-x-4 sm:bottom-8 sm:rounded-3xl">
            <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-surface-2 sm:hidden" />
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15">
                <Gift className="h-5 w-5 text-amber-700" />
              </span>
              <h2 className="font-display text-base font-semibold text-text-1">
                Recomienda {businessName}
              </h2>
            </div>

            <p className="mt-3 text-sm text-text-2">
              Te preparamos un mensaje de WhatsApp. Elige a quién enviárselo.
            </p>

            <div className="mt-3 max-h-48 overflow-y-auto rounded-xl border border-surface-2 bg-surface-1 p-3 text-xs text-text-2 whitespace-pre-line">
              {referralMessage}
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={nativeShare}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-sm font-semibold text-white shadow-card hover:bg-emerald-700"
              >
                <MessageCircle className="h-4 w-4" />
                Compartir por WhatsApp
              </button>
              <button
                type="button"
                onClick={copy}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-surface-2 bg-surface-0 text-sm font-medium text-text-1 hover:bg-surface-1"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" /> Copiado al portapapeles
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copiar mensaje
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-1 text-xs text-text-3 hover:text-text-2"
              >
                Cancelar
              </button>
            </div>

            <p className="mt-4 inline-flex items-center gap-1 text-[10px] text-text-3">
              <Star className="h-3 w-3 text-amber-500" />
              ¡Gracias por correr la voz!
            </p>
          </div>
        </>
      ) : null}
    </>
  );
}
