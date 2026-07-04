'use client';

import Link from 'next/link';
import {
  BarChart3,
  LayoutGrid,
  Settings,
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
  | 'more'
  | 'reports'
  | 'settings';

const COPY = {
  en: {
    dashboard: 'Dashboard',
    cleaners: 'Cleaners',
    clients: 'Clients',
    reports: 'Reports',
    settings: 'Settings',
  },
  es: {
    dashboard: 'Dashboard',
    cleaners: 'Cleaners',
    clients: 'Clientes',
    reports: 'Reportes',
    settings: 'Ajustes',
  },
  pt: {
    dashboard: 'Dashboard',
    cleaners: 'Cleaners',
    clients: 'Clientes',
    reports: 'Relatórios',
    settings: 'Definições',
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
    { key: 'home', href: '/owner/preview', label: t.dashboard, Icon: LayoutGrid },
    { key: 'cleaners', href: '/owner/preview/cleaners', label: t.cleaners, Icon: Users },
    { key: 'more', href: '/owner/preview/clients', label: t.clients, Icon: UserSquare2 },
    { key: 'reports', href: '/owner/preview/analytics', label: t.reports, Icon: BarChart3 },
    { key: 'settings', href: '/owner/preview', label: t.settings, Icon: Settings },
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
                  isActive ? 'text-[#0A0D18]' : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive ? (
                  <>
                    {/* Top hairline rendered in midnight; the active-state
                        "accent moment" is the small teal dot below the
                        label per palette rule 7. */}
                    <span
                      aria-hidden
                      className="absolute top-0 h-[3px] w-10 rounded-b bg-[#0A0D18]"
                    />
                    <span
                      aria-hidden
                      className="absolute bottom-1 h-1 w-1 rounded-full bg-[#10B981]"
                    />
                  </>
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
