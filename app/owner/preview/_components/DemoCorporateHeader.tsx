'use client';

import { useState } from 'react';
import { Bell, Building2, Check, Globe, Settings, Clock, X } from 'lucide-react';

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

  const unread = notifs.filter((n) => !n.read).length;

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
    <header className="-mx-3 -mt-4 mb-5 sm:-mx-4 sm:-mt-5 lg:-mx-8 lg:-mt-7">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 px-5 pb-7 pt-7 text-white sm:px-7 lg:px-10 lg:pb-10 lg:pt-9">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-blue-600/15 blur-3xl"
        />

        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300">
              <Building2 className="h-3 w-3" /> Owner · Vista General
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Hola, {firstName}
            </h1>
            <p className="mt-1 text-[13px] text-white/65">{subtitle}</p>
          </div>
          <div className="relative flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={openNotifs}
              aria-label="Notificaciones"
              title="Ver notificaciones recientes (reservas, tareas completadas, reviews)"
              className="relative grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/85 transition hover:bg-white/20"
            >
              <Bell className="h-4 w-4" />
              {unread > 0 ? (
                <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                  {unread}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={openSettings}
              aria-label="Ajustes"
              title="Preferencias rápidas: notificaciones, idioma, zona horaria"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/85 transition hover:bg-white/20"
            >
              <Settings className="h-4 w-4" />
            </button>

            {notifOpen ? (
              <div className="absolute right-0 top-11 z-40 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl bg-white text-slate-900 shadow-xl ring-1 ring-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Notificaciones
                  </p>
                  <div className="flex items-center gap-1">
                    {unread > 0 ? (
                      <button
                        type="button"
                        onClick={markAllRead}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Marcar todas
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setNotifOpen(false)}
                      aria-label="Cerrar"
                      className="ml-1 rounded-full p-1 text-slate-400 hover:bg-slate-100"
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
                          <span className="block text-[12.5px] font-semibold text-slate-900">
                            {n.title}
                          </span>
                          <span className="mt-0.5 block text-[10.5px] text-slate-500">
                            {n.meta}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                  {notifs.length === 0 ? (
                    <li className="px-4 py-6 text-center text-xs text-slate-500">
                      Sin notificaciones.
                    </li>
                  ) : null}
                </ul>
              </div>
            ) : null}

            {settingsOpen ? (
              <div className="absolute right-0 top-11 z-40 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl bg-white text-slate-900 shadow-xl ring-1 ring-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Preferencias
                  </p>
                  <button
                    type="button"
                    onClick={() => setSettingsOpen(false)}
                    aria-label="Cerrar"
                    className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-semibold text-slate-900">
                        Notificaciones push
                      </p>
                      <p className="text-[10.5px] text-slate-500">
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
                      <Globe className="h-3 w-3" /> Idioma
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
                          {lang === 'es' ? 'Español' : 'English'}
                          {language === lang ? (
                            <Check className="ml-1 inline h-3 w-3" />
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                      <Clock className="h-3 w-3" /> Zona horaria
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
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
