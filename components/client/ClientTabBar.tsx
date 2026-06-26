import Link from 'next/link';
import { CalendarCheck, Home, MessageCircle, User } from 'lucide-react';

/**
 * Tab union accepts the legacy keys (`reviews`, `refer`) so pre-redesign
 * pages keep type-checking — they just won't highlight any tab visually.
 * New code should use one of the four primary tabs.
 */
export type Tab =
  | 'home'
  | 'reservas'
  | 'messages'
  | 'profile'
  | 'reviews'
  | 'refer';

export function ClientTabBar({
  token,
  active,
  unread = 0,
}: {
  token: string;
  active: Tab;
  unread?: number;
}) {
  const items: {
    key: Tab;
    href: string;
    label: string;
    Icon: typeof Home;
    badge?: number;
  }[] = [
    { key: 'home', href: `/client/${token}`, label: 'Inicio', Icon: Home },
    {
      key: 'reservas',
      href: `/client/${token}/cleanings`,
      label: 'Reservas',
      Icon: CalendarCheck,
    },
    {
      key: 'messages',
      href: `/client/${token}/messages`,
      label: 'Chat',
      Icon: MessageCircle,
      badge: unread,
    },
    {
      key: 'profile',
      href: `/client/${token}/profile`,
      label: 'Perfil',
      Icon: User,
    },
  ];

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-emerald-100 bg-white/95 backdrop-blur-xl"
    >
      <ul className="grid grid-cols-4">
        {items.map(({ key, href, label, Icon, badge }) => {
          const isActive = key === active;
          return (
            <li key={key}>
              <Link
                href={href}
                className={`relative flex h-14 flex-col items-center justify-center gap-0.5 text-[10px] font-semibold uppercase tracking-wider transition ${
                  isActive ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {isActive ? (
                  <span
                    aria-hidden
                    className="absolute top-0 h-[3px] w-10 rounded-b bg-emerald-600"
                  />
                ) : null}
                <span className="relative">
                  <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.25]' : 'stroke-[1.75]'}`} />
                  {badge && badge > 0 ? (
                    <span className="absolute -right-2 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
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
