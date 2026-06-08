'use client';

import { useState } from 'react';
import { Check, Copy, MessageCircle } from 'lucide-react';

type Props = {
  cleanerName: string;
  pin: string;
  phone: string | null;
};

export function PinShareActions({ cleanerName, pin, phone }: Props) {
  const [copied, setCopied] = useState(false);

  const message =
    `Hi ${cleanerName}, your Portal Services Digital login PIN is:\n\n` +
    `${pin}\n\n` +
    `Open https://hq.portalservices.digital/operative/login on your phone and type the PIN. ` +
    `Add to home screen for an app-like experience.`;

  const waUrl = phone
    ? `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;

  function copyPin() {
    navigator.clipboard.writeText(pin).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      },
      () => {
        // Fallback for old browsers — no-op
      },
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-card hover:bg-emerald-700"
      >
        <MessageCircle className="h-4 w-4" />
        {phone ? `Send via WhatsApp` : 'Share via WhatsApp'}
      </a>
      <button
        type="button"
        onClick={copyPin}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-surface-2 bg-surface-0 px-4 text-sm font-medium text-text-1 hover:bg-surface-1"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-emerald-600" /> Copied
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" /> Copy PIN
          </>
        )}
      </button>
    </div>
  );
}
