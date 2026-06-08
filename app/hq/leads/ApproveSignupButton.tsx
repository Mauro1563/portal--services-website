'use client';

import { useState, useTransition } from 'react';
import { Check, Loader2, ShieldCheck } from 'lucide-react';
import { approveOwnerSignup } from './actions';

export function ApproveSignupButton({ leadId }: { leadId: string }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<
    | { kind: 'idle' }
    | { kind: 'ok'; email: string }
    | { kind: 'err'; msg: string }
  >({ kind: 'idle' });

  if (result.kind === 'ok') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
        <Check className="h-3.5 w-3.5" /> Autorizado · email enviado a {result.email}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm('¿Autorizar este registro? Se creará la cuenta y se enviará la contraseña por email.')) return;
          startTransition(async () => {
            const r = await approveOwnerSignup(leadId);
            if (r.ok) setResult({ kind: 'ok', email: r.email });
            else setResult({ kind: 'err', msg: r.error });
          });
        }}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 px-3.5 text-[12px] font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Autorizando…
          </>
        ) : (
          <>
            <ShieldCheck className="h-3.5 w-3.5" /> Autorizar
          </>
        )}
      </button>
      {result.kind === 'err' ? (
        <span className="text-[11px] text-rose-600">{result.msg}</span>
      ) : null}
    </div>
  );
}
