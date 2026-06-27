import Link from 'next/link';
import {
  Calendar,
  ClipboardList,
  MessageCircle,
  User,
} from 'lucide-react';

export type CleanerPreviewTab =
  | 'agenda'
  | 'tareas'
  | 'chat'
  | 'perfil';

type Tab = {
  key: CleanerPreviewTab;
  href: string;
  label: string;
  title: string;
  Icon: typeof Calendar;
};

const TABS: Tab[] = [
  {
    key: 'agenda',
    href: '/operative/preview',
    label: 'Agenda',
    title: 'Ver las paradas de hoy con horarios y direcciones',
    Icon: Calendar,
  },
  {
    key: 'tareas',
    href: '/operative/preview/week',
    label: 'Semana',
    title: 'Ver el resumen semanal: horas trabajadas, ganancias y valoraciones',
    Icon: ClipboardList,
  },
  {
    key: 'chat',
    href: '/operative/preview/chat-hub',
    label: 'Chat',
    title: 'Bandeja de chats con el manager y tus clientes',
    Icon: MessageCircle,
  },
  {
    key: 'perfil',
    href: '/operative/preview/profile',
    label: 'Perfil',
    title: 'Ver y editar tus datos personales y PIN de acceso',
    Icon: User,
  },
];

/**
 * Preview-only bottom nav — same look as the real cleaner BottomTabBar,
 * but routes go to /operative/preview/* so the demo never bounces a
 * visitor into the auth-gated portal. Lives in components/preview/ to
 * make ownership clear.
 */
export function PreviewBottomTabBar({
  active,
}: {
  active: CleanerPreviewTab;
}) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-surface-2 bg-surface-0/95 backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {TABS.map(({ key, href, label, title, Icon }) => {
          const isActive = key === active;
          return (
            <li key={key} className="flex-1">
              <Link
                href={href}
                title={title}
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
