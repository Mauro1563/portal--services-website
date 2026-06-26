import Link from 'next/link';
import { Building2, Home, ListChecks, MoreHorizontal, Users } from 'lucide-react';
import { getT } from '@/lib/i18n';

export type Tab = 'home' | 'properties' | 'tasks' | 'cleaners' | 'more';

const ITEMS: Array<{
  key: Tab;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { key: 'home', href: '/owner', Icon: Home },
  { key: 'properties', href: '/owner/properties', Icon: Building2 },
  { key: 'tasks', href: '/owner/tasks', Icon: ListChecks },
  { key: 'cleaners', href: '/owner/cleaners', Icon: Users },
  { key: 'more', href: '/owner/more', Icon: MoreHorizontal },
];

export async function BottomTabBar({ active }: { active: Tab }) {
  const t = await getT();
  const labels: Record<Tab, string> = {
    home: t('nav.home'),
    properties: t('nav.properties'),
    tasks: t('nav.tasks'),
    cleaners: t('nav.cleaners'),
    more: t('nav.more'),
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-2 bg-surface-0 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5"
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {ITEMS.map(({ key, href, Icon }) => {
          const isActive = key === active;
          return (
            <li key={key} className="flex-1">
              <Link
                href={href}
                className={
                  'flex flex-col items-center gap-1 py-1.5 text-[11px] font-medium transition-colors ' +
                  (isActive ? 'text-brand-600' : 'text-text-3 hover:text-text-2')
                }
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className={
                    'h-5 w-5 ' + (isActive ? 'text-brand-600' : 'text-text-3')
                  }
                />
                <span className={isActive ? 'text-brand-600' : ''}>
                  {labels[key]}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
