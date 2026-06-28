'use client';

import { useEffect } from 'react';

/**
 * Per-owner brand theming. Mounted in the client portal layout so
 * each owner's clients see THEIR brand colors across the portal
 * (CTAs, promo banner, booking form submit, etc.) without us
 * threading the colors through every component.
 *
 * Works by writing `--brand-primary` and `--brand-secondary` onto
 * `document.documentElement`. Any element using the helper utility
 * classes (`bg-brand-primary`, `text-brand-primary`,
 * `from-brand-primary`, …) or arbitrary Tailwind values like
 * `bg-[var(--brand-primary)]` picks them up automatically.
 *
 * The defaults declared in `globals.css` (`:root`) are the Zapli
 * palette — blue-600 / cyan-400 — so:
 *  - Owner dashboard never mounts this provider → stays Zapli.
 *  - Client portal mounts it with the owner's chosen colors →
 *    everything brand-aware flips.
 *
 * On unmount we reset the inline styles so the page falls back to
 * the `:root` defaults rather than leaking the last owner's colors
 * onto subsequent navigations (matters for the marketing preview
 * route at `/client/preview`).
 */
export function BrandThemeProvider({
  primary,
  secondary,
  contrast,
  children,
}: {
  primary?: string | null;
  secondary?: string | null;
  /** Foreground color rendered on top of primary. Defaults to white. */
  contrast?: string | null;
  children?: React.ReactNode;
}) {
  useEffect(() => {
    const root = document.documentElement;
    const prevPrimary = root.style.getPropertyValue('--brand-primary');
    const prevSecondary = root.style.getPropertyValue('--brand-secondary');
    const prevContrast = root.style.getPropertyValue('--brand-primary-contrast');

    if (primary && isSafeHex(primary)) {
      root.style.setProperty('--brand-primary', primary);
    }
    if (secondary && isSafeHex(secondary)) {
      root.style.setProperty('--brand-secondary', secondary);
    }
    if (contrast && isSafeHex(contrast)) {
      root.style.setProperty('--brand-primary-contrast', contrast);
    }

    return () => {
      // Restore whatever was set before us (usually empty, which
      // makes the var fall back to the :root default).
      if (prevPrimary) root.style.setProperty('--brand-primary', prevPrimary);
      else root.style.removeProperty('--brand-primary');
      if (prevSecondary) root.style.setProperty('--brand-secondary', prevSecondary);
      else root.style.removeProperty('--brand-secondary');
      if (prevContrast) root.style.setProperty('--brand-primary-contrast', prevContrast);
      else root.style.removeProperty('--brand-primary-contrast');
    };
  }, [primary, secondary, contrast]);

  return <>{children}</>;
}

// Belt-and-braces: colors come from the DB but a malformed/unsanitized
// value would still be writing into a CSS property, so we re-check.
function isSafeHex(raw: string): boolean {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(raw.trim());
}
