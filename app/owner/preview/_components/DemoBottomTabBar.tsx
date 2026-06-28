'use client';

import Link from 'next/link';
import {
  LayoutGrid,
  ListChecks,
  MessageCircle,
  Users,
  UserSquare2,
} from 'lucide-react';
import { useClientLocale, pickCopy } from '@/lib/use-locale-client';

export type DemoTab =
  | 'home'
  | 'tasks'
  | 'cleaners'
  | 'properties'
  | 'chat'
  | 'more';

const COPY = {
  en: {
    home: 'Home',
    tasks: 'Cleans',
    cleaners: 'Team',
    chat: 'Chat',
    clients: 'Clients',
  },
  es: {
    home: 'Inicio',
    tasks: 'Limpiezas',
    cleaners: 'Equipo',
    chat: 'Chat',
    clients: 'Clientes',
  },
  pt: {
    home: 'Início',
    tasks: 'Limpezas',
    cleaners: 'Equipa',
    chat: 'Chat',
    clients: 'Clientes',
  },
} as const;

/**
 * Preview-only bottom nav — same Corporate Trust style as the real
 * BottomTabBar but every href points inside /owner/preview/* so the
 * clickable tour never leaks into the authed routes.
 */
export function DemoBottomTabBar({ active }: { active: DemoTab }) {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);

  const ITEMS: Array<{
    key: DemoTab;
    href: string;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
  }> = [
    { key: 'home', href: '/owner/preview', label: t.home, Icon: LayoutGrid },
    { key: 'tasks', href: '/owner/preview/tasks', label: t.tasks, Icon: ListChecks },
    { key: 'cleaners', href: '/owner/preview/cleaners', label: t.cleaners, Icon: Users },
    { key: 'chat', href: '/owner/preview/chat-hub', label: t.chat, Icon: MessageCircle },
    { key: 'more', href: '/owner/preview/clients', label: t.clients, Icon: UserSquare2 },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {ITEMS.map(({ key, href, label, Icon }) => {
          const isActive = key === active;
          return (
            <li key={key} className="flex-1">
              <Link
                href={href}
                className={`relative flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition ${
                  isActive ? 'text-blue-700' : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive ? (
                  <span
                    aria-hidden
                    className="absolute top-0 h-[3px] w-10 rounded-b bg-blue-600"
                  />
                ) : null}
                <Icon
                  className={`h-5 w-5 ${isActive ? 'stroke-[2.25]' : 'stroke-[1.75]'}`}
                />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
