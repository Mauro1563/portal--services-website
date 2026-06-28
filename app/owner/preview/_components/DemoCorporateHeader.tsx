'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell, Check, Globe, Settings, Clock, X } from 'lucide-react';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { useClientLocale, pickCopy } from '@/lib/use-locale-client';

type NotifId = 'n1' | 'n2' | 'n3';
type Notification = {
  id: NotifId;
  title: string;
  meta: string;
  read: boolean;
};

const COPY = {
  en: {
    hello: 'Hello',
    teamActive: 'Your team is active right now',
    notifications: 'Notifications',
    notifTitle: 'See recent notifications (bookings, completed tasks, reviews)',
    settings: 'Settings',
    settingsTitle: 'Quick preferences: notifications, language, time zone',
    preferences: 'Preferences',
    markAll: 'Mark all',
    close: 'Close',
    noNotifs: 'No notifications.',
    pushNotifs: 'Push notifications',
    realtimeAlerts: 'Receive real-time alerts',
    disablePush: 'Disable push notifications',
    enablePush: 'Enable push notifications',
    language: 'Language',
    timezone: 'Time zone',
    spanish: 'Spanish',
    english: 'English',
    notif1Title: 'New booking · Soho Loft',
    notif1Meta: 'Airbnb · 4 min ago',
    notif2Title: 'Carmen R. completed Camden House',
    notif2Meta: 'Photos uploaded · 18 min ago',
    notif3Title: 'New 5★ review from María García',
    notif3Meta: 'Notting Hill Flat · 1h ago',
  },
  es: {
    hello: 'Hola',
    teamActive: 'Tu equipo está activo ahora mismo',
    notifications: 'Notificaciones',
    notifTitle: 'Ver notificaciones recientes (reservas, tareas completadas, reviews)',
    settings: 'Ajustes',
    settingsTitle: 'Preferencias rápidas: notificaciones, idioma, zona horaria',
    preferences: 'Preferencias',
    markAll: 'Marcar todas',
    close: 'Cerrar',
    noNotifs: 'Sin notificaciones.',
    pushNotifs: 'Notificaciones push',
    realtimeAlerts: 'Recibe alertas en tiempo real',
    disablePush: 'Desactivar notificaciones push',
    enablePush: 'Activar notificaciones push',
    language: 'Idioma',
    timezone: 'Zona horaria',
    spanish: 'Español',
    english: 'English',
    notif1Title: 'Nueva reserva · Soho Loft',
    notif1Meta: 'Airbnb · hace 4 min',
    notif2Title: 'Carmen R. completó Camden House',
    notif2Meta: 'Fotos subidas · hace 18 min',
    notif3Title: 'Nueva review 5★ de María García',
    notif3Meta: 'Notting Hill Flat · hace 1h',
  },
  pt: {
    hello: 'Olá',
    teamActive: 'A tua equipa está ativa agora mesmo',
    notifications: 'Notificações',
    notifTitle: 'Ver notificações recentes (reservas, tarefas concluídas, reviews)',
    settings: 'Definições',
    settingsTitle: 'Preferências rápidas: notificações, idioma, fuso horário',
    preferences: 'Preferências',
    markAll: 'Marcar todas',
    close: 'Fechar',
    noNotifs: 'Sem notificações.',
    pushNotifs: 'Notificações push',
    realtimeAlerts: 'Recebe alertas em tempo real',
    disablePush: 'Desativar notificações push',
    enablePush: 'Ativar notificações push',
    language: 'Idioma',
    timezone: 'Fuso horário',
    spanish: 'Espanhol',
    english: 'Inglês',
    notif1Title: 'Nova reserva · Soho Loft',
    notif1Meta: 'Airbnb · há 4 min',
    notif2Title: 'Carmen R. concluiu Camden House',
    notif2Meta: 'Fotos enviadas · há 18 min',
    notif3Title: 'Nova review 5★ de María García',
    notif3Meta: 'Notting Hill Flat · há 1h',
  },
} as const;

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
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  const NOTIF_COPY: Record<NotifId, { title: string; meta: string }> = {
    n1: { title: t.notif1Title, meta: t.notif1Meta },
    n2: { title: t.notif2Title, meta: t.notif2Meta },
    n3: { title: t.notif3Title, meta: t.notif3Meta },
  };
  const [readMap, setReadMap] = useState<Record<NotifId, boolean>>({
    n1: false,
    n2: false,
    n3: false,
  });
  const notifs: Notification[] = (['n1', 'n2', 'n3'] as NotifId[]).map((id) => ({
    id,
    title: NOTIF_COPY[id].title,
    meta: NOTIF_COPY[id].meta,
    read: readMap[id],
  }));
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
    setReadMap({ n1: true, n2: true, n3: true });
  }
  function markOne(id: NotifId) {
    setReadMap((prev) => ({ ...prev, [id]: true }));
  }

  return (
    <header className="-mx-3 -mt-4 mb-5 sm:-mx-4 sm:-mt-5 lg:-mx-8 lg:-mt-7">
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 px-5 pb-7 pt-7 text-white sm:px-7 lg:px-10 lg:pb-10 lg:pt-9">
        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {t.hello}, {firstName}
            </h1>
            <p className="mt-1.5 flex items-center gap-2 text-[13px] font-medium text-white/90">
              <span
                aria-hidden
                className="relative inline-flex h-2 w-2"
                title={t.teamActive}
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {subtitle}
            </p>
          </div>
          <div ref={popoverRef} className="relative flex shrink-0 items-center gap-2">
            {/* Locale switcher first so it sits at the very top-right edge of
                the preview header — mirrors the real /owner CorporateHeader. */}
            <LocaleSwitcher variant="premium" />
            <button
              ref={bellRef}
              type="button"
              onClick={openNotifs}
              aria-label={t.notifications}
              aria-haspopup="dialog"
              aria-expanded={notifOpen}
              title={t.notifTitle}
              className="relative grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              <Bell className="h-4 w-4" />
              {unread > 0 ? (
                <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                  {unread}
                </span>
              ) : null}
            </button>
            <button
              ref={gearRef}
              type="button"
              onClick={openSettings}
              aria-label={t.settings}
              aria-haspopup="dialog"
              aria-expanded={settingsOpen}
              title={t.settingsTitle}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
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
                  className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm sm:hidden"
                />
              <div
                ref={notifPanelRef}
                role="dialog"
                aria-modal="true"
                aria-label={t.notifications}
                className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-hidden rounded-t-2xl bg-white text-slate-900 shadow-2xl ring-1 ring-slate-200 sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-11 sm:max-h-none sm:w-80 sm:max-w-[calc(100vw-2rem)] sm:rounded-2xl sm:shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">
                    {t.notifications}
                  </p>
                  <div className="flex items-center gap-1">
                    {unread > 0 ? (
                      <button
                        type="button"
                        onClick={markAllRead}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                      >
                        {t.markAll}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => {
                        setNotifOpen(false);
                        bellRef.current?.focus();
                      }}
                      aria-label={t.close}
                      className="ml-1 rounded-full p-1 text-slate-500 hover:bg-slate-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
                  {notifs.map((n) => (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => markOne(n.id)}
                        className={`flex w-full items-start gap-2 px-4 py-3 text-left transition hover:bg-slate-50 ${
                          n.read ? 'opacity-60' : ''
                        }`}
                      >
                        <span
                          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                            n.read ? 'bg-slate-300' : 'bg-blue-600'
                          }`}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] font-semibold text-slate-900">
                            {n.title}
                          </span>
                          <span className="mt-0.5 block text-[11.5px] text-slate-600">
                            {n.meta}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                  {notifs.length === 0 ? (
                    <li className="px-4 py-6 text-center text-xs text-slate-500">
                      {t.noNotifs}
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
                  className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm sm:hidden"
                />
              <div
                ref={settingsPanelRef}
                role="dialog"
                aria-modal="true"
                aria-label={t.preferences}
                className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-hidden rounded-t-2xl bg-white text-slate-900 shadow-2xl ring-1 ring-slate-200 sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-11 sm:max-h-none sm:w-72 sm:max-w-[calc(100vw-2rem)] sm:rounded-2xl sm:shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">
                    {t.preferences}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsOpen(false);
                      gearRef.current?.focus();
                    }}
                    aria-label={t.close}
                    className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-slate-900">
                        {t.pushNotifs}
                      </p>
                      <p className="text-[11.5px] text-slate-600">
                        {t.realtimeAlerts}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notifications}
                      onClick={() => setNotifications((v) => !v)}
                      title={notifications ? t.disablePush : t.enablePush}
                      className={`relative h-5 w-9 shrink-0 rounded-full transition ${
                        notifications ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
                          notifications ? 'left-[18px]' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <p className="mb-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                      <Globe className="h-3 w-3" /> {t.language}
                    </p>
                    <div className="flex gap-1.5">
                      {(['es', 'en'] as const).map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setLanguage(lang)}
                          className={`flex-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold transition ${
                            language === lang
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {lang === 'es' ? t.spanish : t.english}
                          {language === lang ? (
                            <Check className="ml-1 inline h-3 w-3" />
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                      <Clock className="h-3 w-3" /> {t.timezone}
                    </p>
                    <select
                      value={timezone}
                      onChange={(e) =>
                        setTimezone(e.target.value as typeof timezone)
                      }
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-[12px] text-slate-700"
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
