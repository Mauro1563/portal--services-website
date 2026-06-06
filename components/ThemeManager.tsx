'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

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
