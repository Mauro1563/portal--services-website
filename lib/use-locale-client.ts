"use client";

import { useEffect, useState } from "react";

export const CLIENT_LOCALES = ["en", "es", "pt"] as const;
export type ClientLocale = (typeof CLIENT_LOCALES)[number];

function isClientLocale(value: string | null | undefined): value is ClientLocale {
  return !!value && (CLIENT_LOCALES as readonly string[]).includes(value);
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const parts = document.cookie ? document.cookie.split(";") : [];
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length));
    }
  }
  return null;
}

function detectLocale(): ClientLocale {
  if (typeof window === "undefined") return "en";
  try {
    const fromStorage = window.localStorage.getItem("portal_locale");
    if (isClientLocale(fromStorage)) return fromStorage;
  } catch {
    // ignore storage access errors
  }
  const fromCookie = readCookie("portal_locale");
  if (isClientLocale(fromCookie)) return fromCookie;
  if (typeof document !== "undefined") {
    const fromHtml = document.documentElement.lang;
    if (isClientLocale(fromHtml)) return fromHtml;
  }
  return "en";
}

export function useClientLocale(): ClientLocale {
  const [locale, setLocale] = useState<ClientLocale>("en");
  useEffect(() => {
    setLocale(detectLocale());
  }, []);
  return locale;
}

export function pickCopy<T>(
  byLocale: Record<ClientLocale, T> | { en: T } & Partial<Record<ClientLocale, T>>,
  locale: ClientLocale,
): T {
  const map = byLocale as Partial<Record<ClientLocale, T>> & { en: T };
  return map[locale] ?? map.en;
}
