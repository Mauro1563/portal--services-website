import Link from 'next/link';
import {
  Building2,
  LayoutGrid,
  ListChecks,
  MoreHorizontal,
  Users,
} from 'lucide-react';

export type Tab = 'home' | 'properties' | 'tasks' | 'cleaners' | 'more';

const ITEMS: Array<{
  key: Tab;
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { key: 'home', href: '/owner', label: 'Dashboard', Icon: LayoutGrid },
  { key: 'tasks', href: '/owner/tasks', label: 'Limpiezas', Icon: ListChecks },
  { key: 'cleaners', href: '/owner/cleaners', label: 'Cleaners', Icon: Users },
  { key: 'properties', href: '/owner/properties', label: 'Sitios', Icon: Building2 },
  { key: 'more', href: '/owner/more', label: 'Más', Icon: MoreHorizontal },
];

/**
 * Bottom navigation for the owner portal in the Corporate Trust style —
 * uppercase labels, brand underline on active, safe-area-inset for iOS.
 * Keys kept as the original union so every existing page (~30 of them)
 * keeps highlighting the right tab without code changes.
 */
export function BottomTabBar({ active }: { active: Tab }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-2 bg-surface-0/95 backdrop-blur"
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
                  isActive
                    ? 'text-brand-700'
                    : 'text-text-3 hover:text-text-1'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive ? (
                  <span
                    aria-hidden
                    className="absolute top-0 h-[3px] w-10 rounded-b bg-brand-600"
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
