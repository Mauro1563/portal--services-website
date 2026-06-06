import Link from 'next/link';
import { Home, MessageCircle, Star, Gift } from 'lucide-react';

type Tab = 'home' | 'messages' | 'reviews' | 'refer';

export function ClientTabBar({
  token,
  active,
  unread = 0,
}: {
  token: string;
  active: Tab;
  unread?: number;
}) {
  const items: { key: Tab; href: string; label: string; Icon: typeof Home; badge?: number }[] = [
    { key: 'home', href: `/client/${token}`, label: 'Inicio', Icon: Home },
    {
      key: 'messages',
      href: `/client/${token}/messages`,
      label: 'Chat',
      Icon: MessageCircle,
      badge: unread,
    },
    { key: 'reviews', href: `/client/${token}/reviews`, label: 'Valoraciones', Icon: Star },
    { key: 'refer', href: `/client/${token}/refer`, label: 'Recomendar', Icon: Gift },
  ];

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-surface-2 bg-surface-0/95 backdrop-blur-xl"
    >
      <ul className="grid grid-cols-4">
        {items.map(({ key, href, label, Icon, badge }) => {
          const isActive = key === active;
          return (
            <li key={key}>
              <Link
                href={href}
                className={`relative flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition ${
                  isActive ? 'text-brand-600' : 'text-text-3 hover:text-text-1'
                }`}
              >
                <span className="relative">
                  <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.2]' : ''}`} />
                  {badge && badge > 0 ? (
                    <span className="absolute -right-2 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white ring-2 ring-surface-0">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  ) : null}
                </span>
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="pb-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
