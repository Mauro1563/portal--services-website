'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Keeps the document's data-theme attribute in sync with the current
 * pathname on client-side navigation. Without this, after visiting an
 * /owner/* page (which sets data-theme="light" via owner/layout.tsx)
 * users navigating to a different light section would still see the
 * stale attribute, or worse, navigating from a light section to a
 * dark one (e.g. /welcome) would render dark text on a light bg.
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

export function ThemeManager() {
  const pathname = usePathname() ?? '/';

  useEffect(() => {
    const isLight = LIGHT_PREFIXES.some((p) => pathname.startsWith(p));
    const html = document.documentElement;
    if (isLight) {
      html.setAttribute('data-theme', 'light');
    } else {
      html.removeAttribute('data-theme');
    }
  }, [pathname]);

  return null;
}
