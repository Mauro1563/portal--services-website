'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Keeps the document's data-theme attribute in sync with the current
 * pathname. Without this, after visiting an /owner/* page (which sets
 * data-theme="light") users navigating to a different light section
 * would still see the stale attribute, or worse, navigating from a
 * light section to a dark one (e.g. /welcome) would render dark text
 * on a light bg.
 *
 * On the operative portal it additionally checks the per-device
 * "operative-theme" localStorage preference and applies
 * "operative-night" instead of "light" when the user has opted in.
 * Listens for a `themechange` custom event so the operative
 * ThemeToggle can re-trigger this without a full navigation.
 *
 * Mounted at the root layout so it watches every pathname change.
 */
const LIGHT_PREFIXES = [
  '/owner',
  '/hq',
  '/client',
  '/operative',
  '/login',
  '/forgot-password',
  '/reset-password',
];

function applyForPath(pathname: string) {
  const html = document.documentElement;
  const isLight = LIGHT_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isLight) {
    html.removeAttribute('data-theme');
    return;
  }
  if (pathname.startsWith('/operative')) {
    let pref: string | null = null;
    try {
      pref = localStorage.getItem('operative-theme');
    } catch {
      // private browsing / blocked storage — fall back to light
    }
    html.setAttribute(
      'data-theme',
      pref === 'night' ? 'operative-night' : 'light',
    );
    return;
  }
  html.setAttribute('data-theme', 'light');
}

export function ThemeManager() {
  const pathname = usePathname() ?? '/';

  useEffect(() => {
    applyForPath(pathname);
    const onThemeChange = () => applyForPath(pathname);
    window.addEventListener('themechange', onThemeChange);
    return () => window.removeEventListener('themechange', onThemeChange);
  }, [pathname]);

  return null;
}
