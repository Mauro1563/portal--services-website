import Link from 'next/link';
import {
  LayoutGrid,
  ListChecks,
  MessageCircle,
  Users,
  UserSquare2,
} from 'lucide-react';

export type DemoTab =
  | 'home'
  | 'tasks'
  | 'cleaners'
  | 'properties'
  | 'chat'
  | 'more';

const ITEMS: Array<{
  key: DemoTab;
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { key: 'home', href: '/owner/preview', label: 'Inicio', Icon: LayoutGrid },
  { key: 'tasks', href: '/owner/preview/tasks', label: 'Limpiezas', Icon: ListChecks },
  { key: 'cleaners', href: '/owner/preview/cleaners', label: 'Equipo', Icon: Users },
  { key: 'chat', href: '/owner/preview/chat-hub', label: 'Chat', Icon: MessageCircle },
  { key: 'more', href: '/owner/preview/clients', label: 'Clientes', Icon: UserSquare2 },
];

/**
 * Preview-only bottom nav — paper canvas, hairline top border, ultramarine
 * active indicator (owner's per-portal secondary), graphite inactive labels.
 * Every href points inside /owner/preview/*.
 */
export function DemoBottomTabBar({ active }: { active: DemoTab }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#1414141A] bg-[#F4EFE6]/95 backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Primary"
    >
      <ul className="mx-auto flex h-16 max-w-md items-stretch justify-around">
        {ITEMS.map(({ key, href, label, Icon }) => {
          const isActive = key === active;
          return (
            <li key={key} className="flex-1">
              <Link
                href={href}
                className={`relative flex h-full flex-col items-center justify-center gap-1 font-mono text-[11px] font-semibold transition-colors ${
                  isActive ? 'text-[#141414]' : 'text-[#54524D] hover:text-[#141414]'
                }`}
                style={{ transitionDuration: '160ms' }}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive ? (
                  <span
                    aria-hidden
                    className="absolute top-0 h-[2px] w-10 rounded-b bg-[#1B2D6B]"
                  />
                ) : null}
                <Icon
                  className={`h-5 w-5 ${isActive ? 'stroke-[1.75]' : 'stroke-[1.5]'}`}
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
