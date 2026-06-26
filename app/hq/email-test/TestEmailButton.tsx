'use client';

import { useState, useTransition } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { sendTestEmail, type TestEmailResult } from './actions';

const REASON_TEXT: Record<string, string> = {
  no_admin: 'Sesión inválida. Cerrá y volvé a entrar.',
  no_key:
    'RESEND_API_KEY no está configurado en Vercel. Agregalo en Settings → Environment Variables y redeploy.',
  send_failed: 'Resend rechazó el envío. Detalle abajo.',
};

export function TestEmailButton() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<TestEmailResult | null>(null);

  return (
    <div>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setResult(null);
          startTransition(async () => {
            const r = await sendTestEmail();
            setResult(r);
          });
        }}
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Enviando…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Enviar email de prueba
          </>
        )}
      </button>

      {result?.ok && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-emerald-700">
                Email enviado a Resend
              </p>
              <p className="mt-1 text-xs text-emerald-800">
                Resend aceptó el envío. Revisá la bandeja (y spam) de{' '}
                <span className="font-mono">{result.to}</span> en los próximos 1–2 min.
              </p>
              <dl className="mt-3 grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1 text-[11px]">
                <dt className="text-emerald-700/70">De:</dt>
                <dd className="font-mono text-emerald-900 break-all">{result.from}</dd>
                <dt className="text-emerald-700/70">Para:</dt>
                <dd className="font-mono text-emerald-900 break-all">{result.to}</dd>
                {result.messageId && (
                  <>
                    <dt className="text-emerald-700/70">ID:</dt>
                    <dd className="font-mono text-emerald-900 break-all">
                      {result.messageId}
                    </dd>
                  </>
                )}
              </dl>
            </div>
          </div>
        </div>
      )}

      {result && !result.ok && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-rose-700">
                No se pudo enviar
              </p>
              <p className="mt-1 text-xs text-rose-800">
                {REASON_TEXT[result.reason] ?? result.reason}
              </p>
              {result.detail && (
                <pre className="mt-2 overflow-x-auto rounded-lg bg-rose-100/60 p-2 text-[10px] text-rose-900">
                  {result.detail}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
