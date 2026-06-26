'use client';

import { useEffect } from 'react';

/**
 * Top-level error boundary — catches anything that escapes the
 * per-route error.tsx files and shows the real message in production
 * instead of the masked "Application error" Next default. Useful for
 * diagnosing prod-only crashes without having to chase Vercel logs.
 *
 * Lives at `app/global-error.tsx` so it wraps the root layout itself.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[global] root render failed', error);
  }, [error]);

  return (
    <html>
      <body
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          background: '#0b1020',
          color: '#e2e8f0',
          minHeight: '100vh',
          margin: 0,
          padding: '32px 20px',
        }}
      >
        <div
          style={{
            maxWidth: 640,
            margin: '40px auto',
            background: '#0f172a',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 18,
            padding: 28,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#fb923c',
            }}
          >
            Server error
          </p>
          <h1
            style={{
              margin: '8px 0 4px',
              fontSize: 22,
              fontWeight: 600,
              color: '#fff',
            }}
          >
            Algo se rompió cargando esta página
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.55, margin: '8px 0 18px' }}>
            Reintenta en unos segundos. Si sigue fallando, el detalle técnico
            está debajo — pásamelo para hacer fix-forward.
          </p>

          <button
            type="button"
            onClick={reset}
            style={{
              background: 'linear-gradient(135deg, #22d3ee, #2563eb)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '10px 18px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              marginRight: 8,
            }}
          >
            Reintentar
          </button>
          <a
            href="/login"
            style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.08)',
              color: '#e2e8f0',
              textDecoration: 'none',
              borderRadius: 10,
              padding: '10px 18px',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Ir al login
          </a>

          <details style={{ marginTop: 28 }}>
            <summary
              style={{
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#64748b',
              }}
            >
              Detalle técnico
            </summary>
            <pre
              style={{
                marginTop: 12,
                background: '#020617',
                color: '#cbd5e1',
                padding: 14,
                borderRadius: 10,
                fontSize: 12,
                lineHeight: 1.55,
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {error.message || '(sin mensaje)'}
              {error.digest ? `\n\nDigest: ${error.digest}` : ''}
              {error.stack ? `\n\n${error.stack}` : ''}
            </pre>
          </details>
        </div>
      </body>
    </html>
  );
}
