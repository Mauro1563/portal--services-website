'use client';

import { useEffect } from 'react';

/**
 * Tiny bridge that runs once in the browser. When the page is loaded inside
 * the Capacitor iOS shell, it:
 *
 *   1. Tags <html> with `capacitor` + `capacitor-<platform>` so our CSS can
 *      target the native app (see app/globals.css → `html.capacitor`).
 *   2. Hides the splash screen as soon as React has hydrated, so the user
 *      sees the real homepage instead of the spinner sitting there.
 *   3. Adds a light haptic tap on every primary button (`data-haptic`,
 *      `.btn-primary`, or `<button type="submit">`) so the app feels native.
 *
 * Lives at the root of the layout so every route gets it.
 */
export function CapacitorBridge() {
  useEffect(() => {
    // Dynamic import so the web build doesn't ship Capacitor SDKs.
    const w = window as unknown as {
      Capacitor?: {
        isNativePlatform: () => boolean;
        getPlatform: () => string;
      };
    };
    const Cap = w.Capacitor;
    if (!Cap?.isNativePlatform()) return;

    document.documentElement.classList.add('capacitor', `capacitor-${Cap.getPlatform()}`);

    // Hide the launch splash now that the homepage is interactive.
    void import('@capacitor/splash-screen').then(({ SplashScreen }) => {
      SplashScreen.hide({ fadeOutDuration: 250 }).catch(() => {});
    });

    // Lock the keyboard accessory bar to LIGHT so it matches the form fields.
    void import('@capacitor/keyboard').then(({ Keyboard }) => {
      Keyboard.setAccessoryBarVisible({ isVisible: true }).catch(() => {});
    });

    // Tap haptics — runs on every click that lands inside a button-like element.
    // Cheap: only fires on actual interaction, and degrades silently on web.
    let hapticsLoaded: { impact: (o: { style: string }) => Promise<void> } | null = null;
    void import('@capacitor/haptics').then((mod) => {
      hapticsLoaded = {
        impact: (o) => mod.Haptics.impact({ style: o.style as 'LIGHT' | 'MEDIUM' | 'HEAVY' }),
      };
    });

    const onTap = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      const btn = el.closest(
        'button, a[href], [data-haptic], .btn-primary, [type="submit"]',
      );
      if (!btn) return;
      // Skip nested toggles inside a form (text inputs etc).
      const tag = btn.tagName.toLowerCase();
      if (tag === 'input' || tag === 'select' || tag === 'textarea') return;
      hapticsLoaded?.impact({ style: 'LIGHT' }).catch(() => {});
    };
    document.addEventListener('click', onTap, true);

    return () => {
      document.removeEventListener('click', onTap, true);
    };
  }, []);

  return null;
}
