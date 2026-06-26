'use client';

import Link from 'next/link';
import { useEffect } from 'react';

/**
 * Route-scoped error boundary for the operative portal — wraps every
 * /operative/* page. Shows the real server message + digest + stack so
 * we can fix-forward without pulling Vercel logs. The cleaner gets a
 * "Reintentar" + "Volver a la agenda" fallback so they're never stuck.
 */
export default function OperativeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[operative] render failed', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-canvas px-4 py-8">
      <div className="mx-auto max-w-md rounded-3xl border border-amber-200 bg-amber-50/60 p-6 text-amber-900">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">
          Algo salió mal
        </p>
        <h1 className="mt-2 font-display text-xl font-semibold">
          No pude cargar esta pantalla
        </h1>
        <p className="mt-2 text-sm text-amber-800">
          Pulsa &quot;Reintentar&quot;. Si sigue fallando, mándale el
          detalle técnico a tu manager para que lo arregle.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center rounded-xl bg-amber-900 px-4 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-amber-800"
          >
            Reintentar
          </button>
          <Link
            href="/operative"
            className="inline-flex h-10 items-center rounded-xl border border-amber-300 bg-white px-4 text-xs font-bold uppercase tracking-wider text-amber-900 transition hover:bg-amber-50"
          >
            Volver a la agenda
          </Link>
        </div>

        <details className="mt-5">
          <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-wider text-amber-700">
            Detalle técnico
          </summary>
          <pre className="mt-2 overflow-x-auto rounded-xl bg-amber-900/90 p-3 text-[11px] leading-relaxed text-amber-50">
            {error.message || '(sin mensaje)'}
            {error.digest ? `\n\nDigest: ${error.digest}` : ''}
            {error.stack ? `\n\n${error.stack}` : ''}
          </pre>
        </details>
      </div>
    </main>
  );
}
