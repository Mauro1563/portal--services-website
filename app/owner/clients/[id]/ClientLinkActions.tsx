'use client';

import { useState } from 'react';
import { Check, Copy, MessageCircle } from 'lucide-react';

type Props = {
  clientName: string;
  portalUrl: string;
  phone: string | null;
};

export function ClientLinkActions({ clientName, portalUrl, phone }: Props) {
  const [copied, setCopied] = useState(false);

  const message =
    `Hi ${clientName}, here's your private link to track your cleanings:\n\n` +
    `${portalUrl}\n\n` +
    `You can see upcoming visits, see photos of finished work, and rate your cleaner. No password — just tap the link.`;

  const waUrl = phone
    ? `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;

  function copy() {
    navigator.clipboard.writeText(portalUrl).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      },
      () => {},
    );
  }

  return (
    <>
      <p className="mt-3 break-all rounded-xl border border-surface-2 bg-surface-0 px-3 py-2 font-mono text-[11px] text-text-1">
        {portalUrl}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-500/15 px-4 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-400/30 hover:bg-emerald-500/25"
        >
          <MessageCircle className="h-4 w-4" />
          {phone ? 'Send via WhatsApp' : 'Share via WhatsApp'}
        </a>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-surface-2 bg-surface-0 px-4 text-sm font-medium text-text-1 hover:bg-surface-1"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-600" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" /> Copy link
            </>
          )}
        </button>
      </div>
    </>
  );
}
