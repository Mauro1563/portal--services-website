'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell, Check, Globe, Settings, Clock, X } from 'lucide-react';

type Notification = {
  id: string;
  title: string;
  meta: string;
  read: boolean;
};

const INITIAL_NOTIFS: Notification[] = [
  {
    id: 'n1',
    title: 'Nueva reserva · Soho Loft',
    meta: 'Airbnb · hace 4 min',
    read: false,
  },
  {
    id: 'n2',
    title: 'Carmen R. completó Camden House',
    meta: 'Fotos subidas · hace 18 min',
    read: false,
  },
  {
    id: 'n3',
    title: 'Nueva review 5★ de María García',
    meta: 'Notting Hill Flat · hace 1h',
    read: false,
  },
];

/**
 * Preview-only Corporate Trust header. Real client-side header with
 * working notifications dropdown and settings popover so the bell and
 * gear icons are no longer dead. Everything is local React state — no
 * Supabase, no fetch.
 */
export function DemoCorporateHeader({
  firstName,
  subtitle,
}: {
  firstName: string;
  subtitle: string;
}) {
  const [notifs, setNotifs] = useState<Notification[]>(INITIAL_NOTIFS);
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [timezone, setTimezone] = useState<'Europe/London' | 'Europe/Madrid'>(
    'Europe/London',
  );

  const popoverRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  const gearRef = useRef<HTMLButtonElement>(null);
  const notifPanelRef = useRef<HTMLDivElement>(null);
  const settingsPanelRef = useRef<HTMLDivElement>(null);
  const unread = notifs.filter((n) => !n.read).length;

  // Click-outside + Escape close for both popovers, with focus restore.
  useEffect(() => {
    if (!notifOpen && !settingsOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!popoverRef.current?.contains(e.target as Node)) {
        if (notifOpen) {
          setNotifOpen(false);
          bellRef.current?.focus();
        }
        if (settingsOpen) {
          setSettingsOpen(false);
          gearRef.current?.focus();
        }
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (notifOpen) {
          setNotifOpen(false);
          bellRef.current?.focus();
        }
        if (settingsOpen) {
          setSettingsOpen(false);
          gearRef.current?.focus();
        }
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [notifOpen, settingsOpen]);

  // Focus the first actionable item when a panel opens.
  useEffect(() => {
    if (notifOpen) {
      const first = notifPanelRef.current?.querySelector<HTMLElement>(
        'button, [href], [tabindex]:not([tabindex="-1"])',
      );
      first?.focus();
    }
  }, [notifOpen]);
  useEffect(() => {
    if (settingsOpen) {
      const first = settingsPanelRef.current?.querySelector<HTMLElement>(
        'button, [href], select, [tabindex]:not([tabindex="-1"])',
      );
      first?.focus();
    }
  }, [settingsOpen]);

  function openNotifs() {
    setSettingsOpen(false);
    setNotifOpen((s) => !s);
  }
  function openSettings() {
    setNotifOpen(false);
    setSettingsOpen((s) => !s);
  }
  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }
  function markOne(id: string) {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  return (
    <header className="-mx-4 -mt-6 mb-6 sm:-mx-6 sm:-mt-8 lg:-mx-8 lg:-mt-10">
      <div className="relative rounded-b-[12px] bg-[#1B2D6B] px-6 pb-9 pt-9 text-[#F4EFE6] sm:px-8 lg:px-10 lg:pb-12 lg:pt-12">
        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-[12px] text-[#F4EFE6]/70">
              hoy
              <span className="ml-1 inline-block h-[1px] w-5 align-middle bg-[#FF5B1F]" />
            </p>
            <h1
              className="mt-2 text-[40px] leading-[0.95] tracking-[-0.03em] text-[#F4EFE6] sm:text-[56px]"
              style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
            >
              Hola, <span className="italic">{firstName}</span>
            </h1>
            <p className="mt-3 flex items-center gap-2 text-[13px] font-medium text-[#F4EFE6]/85">
              <span
                aria-hidden
                className="relative inline-flex h-2 w-2"
                title="Tu equipo está activo ahora mismo"
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF5B1F] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF5B1F]" />
              </span>
              {subtitle}
            </p>
          </div>
          <div ref={popoverRef} className="relative flex shrink-0 items-center gap-2">
            <button
              ref={bellRef}
              type="button"
              onClick={openNotifs}
              aria-label="Notificaciones"
              aria-haspopup="dialog"
              aria-expanded={notifOpen}
              title="Ver notificaciones recientes (reservas, tareas completadas, reviews)"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-[#F4EFE6]/20 bg-transparent text-[#F4EFE6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5B1F]"
              style={{ transitionDuration: '160ms' }}
            >
              <Bell className="h-4 w-4" />
              {unread > 0 ? (
                <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-[#FF5B1F] text-[9px] font-bold text-[#1A0A04]">
                  {unread}
                </span>
              ) : null}
            </button>
            <button
              ref={gearRef}
              type="button"
              onClick={openSettings}
              aria-label="Ajustes"
              aria-haspopup="dialog"
              aria-expanded={settingsOpen}
              title="Preferencias rápidas: notificaciones, idioma, zona horaria"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#F4EFE6]/20 bg-transparent text-[#F4EFE6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5B1F]"
              style={{ transitionDuration: '160ms' }}
            >
              <Settings className="h-4 w-4" />
            </button>

            {notifOpen ? (
              <>
                {/* Mobile scrim — also tap-to-dismiss. */}
                <div
                  aria-hidden
                  onClick={() => {
                    setNotifOpen(false);
                    bellRef.current?.focus();
                  }}
                  className="fixed inset-0 z-40 bg-[#141414]/40 backdrop-blur-sm sm:hidden"
                />
              <div
                ref={notifPanelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Notificaciones"
                className="ps-set fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-hidden rounded-t-[12px] border border-[#1414141A] bg-[#F4EFE6] text-[#141414] sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-12 sm:max-h-none sm:w-80 sm:max-w-[calc(100vw-2rem)] sm:rounded-[12px]"
              >
                <div className="flex items-center justify-between border-b border-[#1414141A] px-4 py-3">
                  <p className="font-mono text-[12px] text-[#54524D]">
                    notificaciones
                  </p>
                  <div className="flex items-center gap-2">
                    {unread > 0 ? (
                      <button
                        type="button"
                        onClick={markAllRead}
                        className="ps-link font-mono text-[11px] text-[#141414]"
                      >
                        Marcar todas
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => {
                        setNotifOpen(false);
                        bellRef.current?.focus();
                      }}
                      aria-label="Cerrar"
                      className="ml-1 rounded-full p-1 text-[#54524D] hover:bg-[#E4DACA]"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <ul className="max-h-80 divide-y divide-[#1414141A] overflow-y-auto">
                  {notifs.map((n) => (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => markOne(n.id)}
                        className={`flex w-full items-start gap-2 px-4 py-3 text-left transition-colors hover:bg-[#E4DACA] ${
                          n.read ? 'opacity-50' : ''
                        }`}
                        style={{ transitionDuration: '160ms' }}
                      >
                        <span
                          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                            n.read ? 'bg-[#54524D]/40' : 'bg-[#FF5B1F]'
                          }`}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] font-semibold text-[#141414]">
                            {n.title}
                          </span>
                          <span className="mt-0.5 block font-mono text-[11px] text-[#54524D]">
                            {n.meta}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                  {notifs.length === 0 ? (
                    <li className="px-4 py-6 text-center text-xs text-[#54524D]">
                      Sin notificaciones.
                    </li>
                  ) : null}
                </ul>
              </div>
              </>
            ) : null}

            {settingsOpen ? (
              <>
                <div
                  aria-hidden
                  onClick={() => {
                    setSettingsOpen(false);
                    gearRef.current?.focus();
                  }}
                  className="fixed inset-0 z-40 bg-[#141414]/40 backdrop-blur-sm sm:hidden"
                />
              <div
                ref={settingsPanelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Preferencias"
                className="ps-set fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-hidden rounded-t-[12px] border border-[#1414141A] bg-[#F4EFE6] text-[#141414] sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-12 sm:max-h-none sm:w-72 sm:max-w-[calc(100vw-2rem)] sm:rounded-[12px]"
              >
                <div className="flex items-center justify-between border-b border-[#1414141A] px-4 py-3">
                  <p className="font-mono text-[12px] text-[#54524D]">
                    preferencias
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsOpen(false);
                      gearRef.current?.focus();
                    }}
                    aria-label="Cerrar"
                    className="rounded-full p-1 text-[#54524D] hover:bg-[#E4DACA]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-4 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-[#141414]">
                        Notificaciones push
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] text-[#54524D]">
                        Recibe alertas en tiempo real
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notifications}
                      onClick={() => setNotifications((v) => !v)}
                      title={
                        notifications
                          ? 'Desactivar notificaciones push'
                          : 'Activar notificaciones push'
                      }
                      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                        notifications ? 'bg-[#FF5B1F]' : 'bg-[#54524D]/25'
                      }`}
                      style={{ transitionDuration: '160ms' }}
                    >
                      <span
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-[#F4EFE6] transition-all ${
                          notifications ? 'left-[18px]' : 'left-0.5'
                        }`}
                        style={{ transitionDuration: '160ms' }}
                      />
                    </button>
                  </div>

                  <div>
                    <p className="mb-2 inline-flex items-center gap-1.5 font-mono text-[11px] text-[#54524D]">
                      <Globe className="h-3 w-3" /> idioma
                    </p>
                    <div className="flex gap-1.5">
                      {(['es', 'en'] as const).map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setLanguage(lang)}
                          className={`flex-1 rounded-full px-2 py-1.5 text-[12px] font-semibold transition-colors ${
                            language === lang
                              ? 'bg-[#141414] text-[#F4EFE6]'
                              : 'border border-[#1414141A] bg-transparent text-[#141414] hover:bg-[#E4DACA]'
                          }`}
                          style={{ transitionDuration: '160ms' }}
                        >
                          {lang === 'es' ? 'Español' : 'English'}
                          {language === lang ? (
                            <Check className="ml-1 inline h-3 w-3" />
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 inline-flex items-center gap-1.5 font-mono text-[11px] text-[#54524D]">
                      <Clock className="h-3 w-3" /> zona horaria
                    </p>
                    <select
                      value={timezone}
                      onChange={(e) =>
                        setTimezone(e.target.value as typeof timezone)
                      }
                      className="h-9 w-full rounded-[12px] border border-[#1414141A] bg-[#F4EFE6] px-3 text-[12px] text-[#141414]"
                    >
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Madrid">Madrid (CET)</option>
                    </select>
                  </div>
                </div>
              </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
