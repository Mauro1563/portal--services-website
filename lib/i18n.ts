import 'server-only';
import { cookies } from 'next/headers';
import enMessages from '@/messages/en.json';
import esMessages from '@/messages/es.json';
import ptMessages from '@/messages/pt.json';

/**
 * Locale resolution — EN-default-first policy.
 *
 * English is the unconditional default. Browser `Accept-Language` detection
 * is intentionally OFF (next-intl `localeDetection: false`) so that a first-
 * time visitor with a Spanish or Portuguese browser still lands on /en/.
 *
 * Priority on the client (resolved by <LocaleSwitcher /> + middleware):
 *   1. localStorage('portal_locale')  — survives across tabs and restarts
 *   2. Cookie 'portal_locale'         — set by middleware + setLocale action
 *   3. URL prefix /en|/es|/pt         — synced into the cookie by middleware
 *   4. Fallback 'en'                  — DEFAULT_LOCALE below
 *
 * Server-side (this file) only sees the cookie, so steps (1) and (3) are
 * collapsed into (2) by the time getLocale() runs.
 */

export type Locale = 'en' | 'es' | 'pt';
export const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'es', 'pt'] as const;
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_COOKIE = 'portal_locale';

export type Messages = typeof enMessages;

const MESSAGES_MAP: Record<Locale, Messages> = {
  en: enMessages,
  es: esMessages as Messages,
  pt: ptMessages as Messages,
};

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
};

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const v = store.get(LOCALE_COOKIE)?.value as Locale | undefined;
  return v && SUPPORTED_LOCALES.includes(v) ? v : DEFAULT_LOCALE;
}

export async function getMessages(): Promise<Messages> {
  return MESSAGES_MAP[await getLocale()];
}

/**
 * Server-side translator. Pass a dot-path into messages JSON; falls back to
 * the key string when the path is missing so missing translations are visible
 * at runtime instead of silently empty.
 *
 * Optional second argument substitutes `{name}` placeholders, so
 * `t('greeting', { name: 'Maria' })` resolves "Hi, {name}" → "Hi, Maria".
 * Call sites that still pass a single argument keep working unchanged.
 */
export async function getT(): Promise<
  (key: string, params?: Record<string, string | number>) => string
> {
  const messages = await getMessages();
  return (key, params) => {
    const raw = translate(messages, key);
    return params ? interpolate(raw, params) : raw;
  };
}

export function translate(messages: Messages, key: string): string {
  const parts = key.split('.');
  let cur: unknown = messages;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return key;
    }
  }
  return typeof cur === 'string' ? cur : key;
}

// Simple {name} placeholder substitution. Missing keys leave the placeholder
// in place so a typo in the translation file is visible at runtime.
function interpolate(
  template: string,
  params: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in params ? String(params[name]) : match,
  );
}
