'use client';

import { useEffect, useState } from 'react';
import { Smartphone, X } from 'lucide-react';

const STORAGE_KEY = 'pwa-install-dismissed-at';
const DISMISS_DAYS = 14;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

/**
 * "Add to home screen" prompt for cleaners on mobile. Behaviour:
 *   - Chrome / Edge / Android: native `beforeinstallprompt` event → show
 *     a real install button that triggers the OS sheet.
 *   - iOS Safari: no install API, so we show step-by-step instructions
 *     (Share → Add to Home Screen).
 *   - Already installed (display-mode standalone), or dismissed in the
 *     last 14 days: render nothing.
 *
 * Persists dismissal in localStorage so we don't nag.
 */
export function PWAInstall() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Already installed — bail out.
    if (typeof window === 'undefined') return;
    const standalone =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      // iOS Safari sets navigator.standalone on the home-screen launcher.
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    // Honour dismissal cooldown.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const dismissedAt = Number(raw);
        const ageMs = Date.now() - dismissedAt;
        if (ageMs < DISMISS_DAYS * 24 * 60 * 60 * 1000) return;
      }
    } catch {
      // localStorage blocked — show anyway.
    }

    const ua = window.navigator.userAgent;
    const iOS = /iPhone|iPad|iPod/.test(ua) && !/CriOS|FxiOS/.test(ua);
    setIsIOS(iOS);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);

    // iOS never fires beforeinstallprompt — show banner directly if iOS Safari.
    if (iOS) setShow(true);

    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // localStorage blocked — banner stays hidden for this session anyway.
    }
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') {
      dismiss();
    }
  };

  if (!show) return null;

  return (
    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-brand-400/30 bg-gradient-to-br from-brand-50 to-cyan-50 p-3.5 shadow-card">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-brand-700 shadow-sm">
        <Smartphone className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-sm font-semibold text-text-1">
          Instala la app
        </p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-text-2">
          {isIOS && !installEvent
            ? 'En Safari: pulsa el botón Compartir → "Añadir a pantalla de inicio".'
            : 'Acceso directo en tu pantalla de inicio. Funciona offline.'}
        </p>
        {installEvent ? (
          <button
            type="button"
            onClick={install}
            className="mt-2 inline-flex h-8 items-center rounded-lg bg-brand-600 px-3 text-[11px] font-bold text-white transition hover:bg-brand-700"
          >
            Instalar ahora
          </button>
        ) : null}
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Cerrar"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-text-3 transition hover:bg-white hover:text-text-1"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
