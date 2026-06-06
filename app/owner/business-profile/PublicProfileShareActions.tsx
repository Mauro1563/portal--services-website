'use client';

import { useState } from 'react';
import { Check, Copy, ExternalLink, MessageCircle } from 'lucide-react';

export function PublicProfileShareActions({
  publicUrl,
  businessName,
}: {
  publicUrl: string;
  businessName: string;
}) {
  const [copied, setCopied] = useState(false);

  const waMessage =
    `Check out our cleaning service:\n\n${businessName}\n${publicUrl}`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(waMessage)}`;

  function copy() {
    navigator.clipboard.writeText(publicUrl).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      },
      () => {},
    );
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <a
        href={publicUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-card hover:bg-emerald-700"
      >
        <ExternalLink className="h-4 w-4" /> Preview
      </a>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-emerald-300 bg-surface-0 px-4 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
      >
        <MessageCircle className="h-4 w-4" /> Share on WhatsApp
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
  );
}
