import Link from 'next/link';
import { Calendar, ClipboardList, User, LifeBuoy } from 'lucide-react';

export type CleanerTab = 'agenda' | 'tareas' | 'perfil' | 'soporte';

type Tab = {
  key: CleanerTab;
  href: string;
  label: string;
  Icon: typeof Calendar;
};

const TABS: Tab[] = [
  { key: 'agenda', href: '/operative', label: 'Agenda', Icon: Calendar },
  { key: 'tareas', href: '/operative/week', label: 'Tareas', Icon: ClipboardList },
  { key: 'perfil', href: '/operative/profile', label: 'Perfil', Icon: User },
  { key: 'soporte', href: '/operative/support', label: 'Soporte', Icon: LifeBuoy },
];

/**
 * Fixed bottom navigation for the cleaner portal — mirrors the "Efficient
 * Work" mockup: AGENDA · TAREAS · PERFIL · SOPORTE.
 *
 * Sits above the iOS home indicator via env(safe-area-inset-bottom). The
 * caller is responsible for adding `pb-20` to the page body so content
 * never hides behind the bar.
 */
export function BottomTabBar({ active }: { active: CleanerTab }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-surface-2 bg-surface-0/95 backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {TABS.map(({ key, href, label, Icon }) => {
          const isActive = key === active;
          return (
            <li key={key} className="flex-1">
              <Link
                href={href}
                className={`flex h-14 flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition ${
                  isActive
                    ? 'text-brand-600'
                    : 'text-text-3 hover:text-text-1'
                }`}
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
                <span className="tracking-wider uppercase">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
