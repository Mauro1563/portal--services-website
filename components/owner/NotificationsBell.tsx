'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell, CheckCircle2, MessageCircle, Star } from 'lucide-react';
import {
  fetchOwnerNotifications,
  type Notification,
  type NotificationsPayload,
} from '@/app/owner/notifications/actions';

const FOCUS_THROTTLE_MS = 30_000;
const POLL_MS = 60_000;

const ICON: Record<Notification['kind'], React.ComponentType<{ className?: string }>> = {
  message: MessageCircle,
  completion: CheckCircle2,
  rating: Star,
};

const TONE: Record<Notification['kind'], string> = {
  message: 'text-brand-600 bg-brand-600/10',
  completion: 'text-emerald-600 bg-emerald-50',
  rating: 'text-amber-600 bg-amber-50',
};

function relative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `hace ${days}d`;
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

/**
 * Header bell for the owner portal. Caller passes the initial
 * `NotificationsPayload` from the server component so the bell renders
 * with real data on first paint (no on-mount fetch). Then we poll every
 * 60s, refresh on window focus (throttled to once per 30s), and skip
 * everything when the tab is hidden.
 *
 * The previous version fired an extra server-action call on EVERY mount
 * (4 Supabase queries: requireOwner + 3 parallel) for every owner page
 * that includes the bell, plus another 4 on every focus. With multiple
 * tabs open that became a steady background hum slowing down every
 * navigation.
 */
export function NotificationsBell({
  initialData,
}: {
  initialData?: NotificationsPayload;
}) {
  const [data, setData] = useState<NotificationsPayload | null>(
    initialData ?? null,
  );
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastFetchRef = useRef(initialData ? Date.now() : 0);

  const refresh = () => {
    if (typeof document !== 'undefined' && document.hidden) return;
    lastFetchRef.current = Date.now();
    fetchOwnerNotifications()
      .then(setData)
      .catch(() => setData({ items: [], unreadCount: 0 }));
  };

  useEffect(() => {
    // Only fetch on mount if the server didn't pre-hydrate us — saves
    // ~4 Supabase calls per owner page nav on the common path.
    if (!initialData) refresh();
    const interval = setInterval(refresh, POLL_MS);
    const onFocus = () => {
      if (Date.now() - lastFetchRef.current < FOCUS_THROTTLE_MS) return;
      refresh();
    };
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const count = data?.unreadCount ?? 0;
  const items = data?.items ?? [];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notificaciones"
        className="relative grid h-9 w-9 place-items-center rounded-lg border border-surface-2 bg-white text-text-2 transition hover:border-surface-3 hover:bg-surface-1"
      >
        <Bell className="h-4 w-4" />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Mobile backdrop for the bottom-sheet variant — tap to dismiss
              and stop the page behind from receiving the tap. The
              click-outside handler in the effect above still covers
              keyboard/Escape, this is just a visual scrim + a wider hit
              target on touch. */}
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm sm:hidden"
          />
          <div
            role="dialog"
            aria-label="Notificaciones"
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] origin-bottom overflow-hidden rounded-t-2xl border border-surface-2 bg-white shadow-2xl sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-full sm:mt-2 sm:max-h-none sm:w-[min(360px,calc(100vw-2rem))] sm:origin-top-right sm:rounded-2xl sm:shadow-xl"
          >
          <header className="flex items-center justify-between border-b border-surface-2 px-4 py-3">
            <div>
              <h3 className="font-display text-sm font-semibold text-text-1">
                Notificaciones
              </h3>
              <p className="mt-0.5 text-[11px] text-text-3">
                {count === 0
                  ? 'Sin novedades por ahora'
                  : `${count} mensaje${count === 1 ? '' : 's'} sin leer`}
              </p>
            </div>
          </header>

          <ul className="max-h-[60vh] divide-y divide-surface-2 overflow-y-auto">
            {items.length === 0 ? (
              <li className="px-4 py-10 text-center text-sm text-text-3">
                Nada por aquí todavía.
              </li>
            ) : (
              items.map((n) => {
                const Icon = ICON[n.kind];
                const tone = TONE[n.kind];
                return (
                  <li key={n.id}>
                    <Link
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 transition hover:bg-surface-1"
                    >
                      <span
                        className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${tone}`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p
                            className={`truncate font-display text-sm ${
                              n.unread
                                ? 'font-semibold text-text-1'
                                : 'font-medium text-text-2'
                            }`}
                          >
                            {n.title}
                          </p>
                          <span className="shrink-0 text-[10px] text-text-3">
                            {relative(n.createdAt)}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-[12px] text-text-2">
                          {n.body}
                        </p>
                      </div>
                      {n.unread && (
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                      )}
                    </Link>
                  </li>
                );
              })
            )}
          </ul>

          {items.length > 0 && (
            <div className="border-t border-surface-2 bg-surface-1/40 px-4 py-2 text-center">
              <Link
                href="/owner/clients"
                onClick={() => setOpen(false)}
                className="text-[11px] font-semibold text-brand-700 hover:underline"
              >
                Ver todos los clientes →
              </Link>
            </div>
          )}
          </div>
        </>
      )}
    </div>
  );
}
