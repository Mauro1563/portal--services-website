import 'server-only';
import { cookies } from 'next/headers';
import enMessages from '@/messages/en.json';
import esMessages from '@/messages/es.json';
import ptMessages from '@/messages/pt.json';

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
 */
export async function getT(): Promise<(key: string) => string> {
  const messages = await getMessages();
  return (key: string) => translate(messages, key);
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
