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
  // In the public preview the messages tab points at the new chat hub
  // (an inbox of multiple conversations) instead of the legacy single
  // /messages thread, so prospects see the richer experience. The real
  // /client/<token>/messages route is untouched.
  const isPreview = token === 'preview';
  const chatHref = isPreview
    ? `/client/${token}/chat-hub`
    : `/client/${token}/messages`;

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
      href: chatHref,
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
      className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-[#1414141A] backdrop-blur-xl"
      style={{ backgroundColor: 'rgba(244, 239, 230, 0.96)' }}
    >
      <ul className="grid h-16 grid-cols-4">
        {items.map(({ key, href, label, Icon, badge }) => {
          const isActive = key === active;
          return (
            <li key={key}>
              <Link
                href={href}
                prefetch={true}
                className={`ps-mono relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] transition ${
                  isActive ? 'text-[#141414]' : 'text-[#54524D] hover:text-[#141414]'
                }`}
              >
                {isActive ? (
                  <span
                    aria-hidden
                    className="absolute top-0 h-[2px] w-8"
                    style={{ backgroundColor: '#FF5B1F' }}
                  />
                ) : null}
                <span className="relative">
                  <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2]' : 'stroke-[1.5]'}`} />
                  {badge && badge > 0 ? (
                    <span
                      className="absolute -right-2 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-[#1A0A04] ring-2"
                      style={{ backgroundColor: '#FF5B1F', boxShadow: '0 0 0 2px #F4EFE6' }}
                    >
                      {badge > 9 ? '9+' : badge}
                    </span>
                  ) : null}
                </span>
                <span className="lowercase">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="pb-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
