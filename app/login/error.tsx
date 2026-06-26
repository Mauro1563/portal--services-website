'use client';

import { useEffect } from 'react';

/**
 * Route-scoped fallback for /login. If the server render of the login
 * page itself throws (i18n load, layout error, anything else upstream
 * of the form), this still shows a minimal usable sign-in form so the
 * user is never locked out of the app.
 *
 * The form posts to /login the same way the real page does — Next picks
 * it up via the form action. Identifier + password inputs match the
 * signIn action's expected formData shape.
 */
export default function LoginError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[login] server render failed', error);
  }, [error]);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#0b1020',
        color: '#e2e8f0',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 380,
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
            color: '#22d3ee',
          }}
        >
          Portal Home
        </p>
        <h1
          style={{
            margin: '8px 0 0',
            fontSize: 22,
            fontWeight: 600,
            color: '#fff',
          }}
        >
          Iniciar sesión
        </h1>
        <p
          style={{
            margin: '6px 0 18px',
            fontSize: 13,
            color: '#94a3b8',
          }}
        >
          Vista mínima — la página completa tuvo un problema cargando. Igual
          puedes entrar.
        </p>

        <form
          action="/login"
          method="post"
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>
              PIN o email
            </span>
            <input
              type="text"
              name="identifier"
              required
              autoFocus
              style={{
                height: 44,
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.12)',
                background: '#020617',
                color: '#fff',
                padding: '0 12px',
                fontSize: 14,
              }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>
              Contraseña (vacía para cleaner con PIN)
            </span>
            <input
              type="password"
              name="password"
              style={{
                height: 44,
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.12)',
                background: '#020617',
                color: '#fff',
                padding: '0 12px',
                fontSize: 14,
              }}
            />
          </label>
          <button
            type="submit"
            style={{
              marginTop: 8,
              height: 48,
              borderRadius: 10,
              border: 'none',
              background: 'linear-gradient(135deg,#22d3ee,#2563eb)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Entrar
          </button>
        </form>

        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: 14,
            width: '100%',
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: 11,
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          Reintentar cargar la página completa
        </button>

        <details style={{ marginTop: 18 }}>
          <summary
            style={{
              cursor: 'pointer',
              fontSize: 10,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              fontWeight: 600,
            }}
          >
            Detalle técnico
          </summary>
          <pre
            style={{
              marginTop: 10,
              background: '#020617',
              color: '#cbd5e1',
              padding: 10,
              borderRadius: 8,
              fontSize: 11,
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {error.message || '(sin mensaje)'}
            {error.digest ? `\nDigest: ${error.digest}` : ''}
            {error.stack ? `\n\n${error.stack}` : ''}
          </pre>
        </details>
      </div>
    </main>
  );
}
