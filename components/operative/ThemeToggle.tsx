'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const STORAGE_KEY = 'operative-theme';

type Mode = 'light' | 'night';

/**
 * Operative-only dark mode toggle. Persists the choice in localStorage
 * (per-device — a cleaner sharing a phone gets a consistent experience)
 * and fires a `themechange` event so the global ThemeManager re-applies
 * the right data-theme for the current path.
 *
 * On first visit, honors the device's prefers-color-scheme so the
 * operative app feels native.
 *
 * Affects only the operative portal because the CSS overrides in
 * app/globals.css are scoped to `[data-theme="operative-night"]` AND
 * ThemeManager only applies that value when pathname starts with
 * /operative. Navigating to /owner / /hq stays light as designed.
 */
export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let saved: Mode | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY) as Mode | null;
    } catch {
      // ignore
    }
    const prefers: Mode = window.matchMedia?.('(prefers-color-scheme: dark)')
      .matches
      ? 'night'
      : 'light';
    setMode(saved ?? prefers);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Mode = mode === 'night' ? 'light' : 'night';
    setMode(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event('themechange'));
  };

  if (!mounted) {
    return <div className="h-9 w-9" />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mode === 'night' ? 'Modo claro' : 'Modo oscuro'}
      className="grid h-9 w-9 place-items-center rounded-lg border border-surface-2 bg-surface-0 text-text-2 transition hover:border-surface-3 hover:bg-surface-1"
    >
      {mode === 'night' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
