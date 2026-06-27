import Link from 'next/link';
import {
  Calendar,
  ClipboardList,
  LifeBuoy,
  MessageCircle,
  User,
} from 'lucide-react';

export type CleanerTab =
  | 'agenda'
  | 'tareas'
  | 'chat'
  | 'perfil'
  | 'soporte';

type Tab = {
  key: CleanerTab;
  href: string;
  label: string;
  Icon: typeof Calendar;
};

const TABS: Tab[] = [
  { key: 'agenda', href: '/operative', label: 'Agenda', Icon: Calendar },
  { key: 'tareas', href: '/operative/week', label: 'Tareas', Icon: ClipboardList },
  { key: 'chat', href: '/operative/chat', label: 'Chat', Icon: MessageCircle },
  { key: 'perfil', href: '/operative/profile', label: 'Perfil', Icon: User },
];

/**
 * Fixed bottom navigation for the cleaner portal — mirrors the
 * "Efficient Work" mockup but with CHAT promoted into the primary slot
 * (replacing SOPORTE). Support content lives in /operative/support and
 * is still reachable from /profile, but day-to-day comms with the
 * owner is now one tap from anywhere.
 *
 * Sits above the iOS home indicator via env(safe-area-inset-bottom).
 * The caller is responsible for adding `pb-24` to the page body so
 * content never hides behind the bar.
 */
export function BottomTabBar({
  active,
  unreadChat = 0,
}: {
  active: CleanerTab;
  unreadChat?: number;
}) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-surface-2 bg-surface-0/95 backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {TABS.map(({ key, href, label, Icon }) => {
          const isActive = key === active;
          const badge = key === 'chat' ? unreadChat : 0;
          return (
            <li key={key} className="flex-1">
              <Link
                href={href}
                prefetch={true}
                className={`relative flex h-14 flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition ${
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
                <span className="relative">
                  <Icon
                    className={`h-5 w-5 ${isActive ? 'stroke-[2.25]' : 'stroke-[1.75]'}`}
                  />
                  {badge > 0 ? (
                    <span className="absolute -right-2 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white ring-2 ring-surface-0">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  ) : null}
                </span>
                <span className="tracking-wider uppercase">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
