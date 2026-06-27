'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function ShareLinkRow({ publicUrl }: { publicUrl: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(publicUrl).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      },
      () => {},
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
      <code className="flex-1 truncate rounded-xl border border-surface-2 bg-surface-1 px-3 py-2.5 font-mono text-[12px] text-text-1">
        {publicUrl}
      </code>
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white shadow-card transition hover:bg-brand-700"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" /> Copiado
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" /> Copiar enlace
          </>
        )}
      </button>
    </div>
  );
}
