'use client';

import { useEffect, useState } from 'react';

/**
 * Route-scoped fallback for /login. If the server render of the login
 * page itself throws (i18n load, layout error, anything else upstream
 * of the form), this still shows a minimal usable sign-in form so the
 * user is never locked out of the app.
 *
 * The form posts to /login the same way the real page does — Next picks
 * it up via the form action. Identifier + password inputs match the
 * signIn action's expected formData shape.
 *
 * i18n: since this is a client component and the server render already
 * failed, we can't safely call `getLocale()` here. We read the
 * `portal_locale` cookie directly from `document.cookie` and fall back
 * to English. Inline COPY map keeps the fallback self-contained — if
 * the i18n catalog itself is what broke upstream, this still renders.
 */
type Locale = 'en' | 'es' | 'pt';
const SUPPORTED: readonly Locale[] = ['en', 'es', 'pt'];

const COPY: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    identifierLabel: string;
    passwordLabel: string;
    submit: string;
    retry: string;
    techDetail: string;
    noMessage: string;
  }
> = {
  en: {
    eyebrow: 'Zapli',
    title: 'Sign in',
    subtitle:
      'Minimal view — the full page had a loading issue. You can still sign in.',
    identifierLabel: 'PIN or email',
    passwordLabel: 'Password (empty for cleaner with PIN)',
    submit: 'Sign in',
    retry: 'Retry loading the full page',
    techDetail: 'Technical detail',
    noMessage: '(no message)',
  },
  es: {
    eyebrow: 'Zapli',
    title: 'Iniciar sesión',
    subtitle:
      'Vista mínima — la página completa tuvo un problema cargando. Igual puedes entrar.',
    identifierLabel: 'PIN o email',
    passwordLabel: 'Contraseña (vacía para cleaner con PIN)',
    submit: 'Entrar',
    retry: 'Reintentar cargar la página completa',
    techDetail: 'Detalle técnico',
    noMessage: '(sin mensaje)',
  },
  pt: {
    eyebrow: 'Zapli',
    title: 'Iniciar sessão',
    subtitle:
      'Vista mínima — a página completa teve um problema a carregar. Mesmo assim podes entrar.',
    identifierLabel: 'PIN ou email',
    passwordLabel: 'Senha (vazia para limpador com PIN)',
    submit: 'Entrar',
    retry: 'Tentar carregar a página completa',
    techDetail: 'Detalhe técnico',
    noMessage: '(sem mensagem)',
  },
};

function readLocaleFromCookie(): Locale {
  if (typeof document === 'undefined') return 'en';
  const match = document.cookie.match(/(?:^|;\s*)portal_locale=([^;]+)/);
  const v = match ? (decodeURIComponent(match[1]) as Locale) : 'en';
  return SUPPORTED.includes(v) ? v : 'en';
}

export default function LoginError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Initialize from cookie on mount — keeps SSR/CSR stable since this
  // component is client-only and rendered after the server render fails.
  const [locale, setLocale] = useState<Locale>('en');
  useEffect(() => {
    setLocale(readLocaleFromCookie());
  }, []);
  const copy = COPY[locale];

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
          {copy.eyebrow}
        </p>
        <h1
          style={{
            margin: '8px 0 0',
            fontSize: 22,
            fontWeight: 600,
            color: '#fff',
          }}
        >
          {copy.title}
        </h1>
        <p
          style={{
            margin: '6px 0 18px',
            fontSize: 13,
            color: '#94a3b8',
          }}
        >
          {copy.subtitle}
        </p>

        <form
          action="/login"
          method="post"
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>
              {copy.identifierLabel}
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
              {copy.passwordLabel}
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
            {copy.submit}
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
          {copy.retry}
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
            {copy.techDetail}
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
            {error.message || copy.noMessage}
            {error.digest ? `\nDigest: ${error.digest}` : ''}
            {error.stack ? `\n\n${error.stack}` : ''}
          </pre>
        </details>
      </div>
    </main>
  );
}
