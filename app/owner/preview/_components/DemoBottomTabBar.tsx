import Link from 'next/link';
import {
  Building2,
  LayoutGrid,
  ListChecks,
  MoreHorizontal,
  Users,
} from 'lucide-react';

export type DemoTab = 'home' | 'tasks' | 'cleaners' | 'properties' | 'more';

const ITEMS: Array<{
  key: DemoTab;
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { key: 'home', href: '/owner/preview', label: 'Dashboard', Icon: LayoutGrid },
  { key: 'tasks', href: '/owner/preview/tasks', label: 'Limpiezas', Icon: ListChecks },
  { key: 'cleaners', href: '/owner/preview/cleaners', label: 'Cleaners', Icon: Users },
  { key: 'properties', href: '/owner/preview/properties', label: 'Sitios', Icon: Building2 },
  { key: 'more', href: '/owner/preview/clients', label: 'Clientes', Icon: MoreHorizontal },
];

/**
 * Preview-only bottom nav — same Corporate Trust style as the real
 * BottomTabBar but every href points inside /owner/preview/* so the
 * clickable tour never leaks into the authed routes.
 */
export function DemoBottomTabBar({ active }: { active: DemoTab }) {
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
                className={`relative flex h-14 flex-col items-center justify-center gap-0.5 text-[10px] font-semibold uppercase tracking-wider transition ${
                  isActive ? 'text-blue-700' : 'text-slate-500 hover:text-slate-900'
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
