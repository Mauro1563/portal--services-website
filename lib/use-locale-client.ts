"use client";

import { createContext, createElement, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

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

function detectLocaleFromBrowser(): ClientLocale {
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

/**
 * Server-seeded locale context.
 *
 * The RootLayout server-renders `<ClientLocaleProvider locale={await getLocale()}>`,
 * so both SSR HTML and CSR hydration start with the SAME locale — no flash
 * of English on Spanish/Portuguese pages. Client updates (via
 * LocaleSwitcher setting cookie/localStorage) propagate through the storage
 * event listener below.
 */
const ClientLocaleContext = createContext<ClientLocale>("en");

export function ClientLocaleProvider({
  locale,
  children,
}: {
  locale: ClientLocale;
  children: ReactNode;
}) {
  // Wrap the seed locale in state so downstream consumers re-render when
  // the user changes language in this tab (LocaleSwitcher writes to
  // localStorage, we listen for the storage event) or on any cross-tab
  // change. The seed is authoritative for first paint; the effect below
  // reconciles with whatever the browser currently holds.
  const [current, setCurrent] = useState<ClientLocale>(locale);

  useEffect(() => {
    // On mount, adopt whatever the browser has if it disagrees with the
    // server-seeded value (e.g. user switched language in another tab).
    const detected = detectLocaleFromBrowser();
    if (detected !== current) setCurrent(detected);

    // Watch for cross-tab changes.
    const onStorage = (e: StorageEvent) => {
      if (e.key === "portal_locale" && isClientLocale(e.newValue)) {
        setCurrent(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // Intentionally only react to the initial mount + prop change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  return createElement(
    ClientLocaleContext.Provider,
    { value: current },
    children,
  );
}

export function useClientLocale(): ClientLocale {
  return useContext(ClientLocaleContext);
}

export function pickCopy<
  M extends { en: unknown; es?: unknown; pt?: unknown },
>(byLocale: M, locale: ClientLocale): M['en'] {
  // Each locale's literal types differ when COPY is `as const` (e.g.
  // en.statusScheduled is "Pending" while es.statusScheduled is "Pendiente"),
  // so we widen the return type to M['en'] and treat all locale slots as
  // structurally compatible. Falls back to en when locale slot is absent.
  const map = byLocale as { en: M['en']; es?: M['en']; pt?: M['en'] };
  return (map[locale] ?? map.en) as M['en'];
}
