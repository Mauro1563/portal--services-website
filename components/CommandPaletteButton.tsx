'use client';

import { Search } from 'lucide-react';
import { useClientLocale, pickCopy } from '@/lib/use-locale-client';

/**
 * Visible affordance for the command palette. Sits in the desktop topbar
 * so the user knows the shortcut exists without having to discover it.
 * Dispatches a global event the <CommandPalette /> listens to.
 */

const COPY = {
  en: { search: 'Search…' },
  es: { search: 'Buscar…' },
  pt: { search: 'Pesquisar…' },
} as const;

export function CommandPaletteButton() {
  const t = pickCopy(COPY, useClientLocale());
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
      className="hidden items-center gap-2 rounded-lg border border-surface-2 bg-white px-2.5 py-1.5 text-[12px] text-text-3 transition hover:border-surface-3 hover:bg-surface-1 lg:inline-flex"
      aria-label="Open command palette"
    >
      <Search className="h-3.5 w-3.5" />
      <span>{t.search}</span>
      <span className="ml-2 hidden items-center gap-0.5 text-[10px] text-text-3 sm:flex">
        <kbd className="rounded border border-surface-2 bg-surface-1 px-1 py-0.5 font-mono text-[9px]">⌘</kbd>
        <kbd className="rounded border border-surface-2 bg-surface-1 px-1 py-0.5 font-mono text-[9px]">K</kbd>
      </span>
    </button>
  );
}
