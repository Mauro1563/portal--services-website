'use client';

import Link from 'next/link';
import {
  Calendar,
  ClipboardList,
  MessageCircle,
  Sparkles,
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
  onAsistentePress,
  onAsistentePullUp,
}: {
  active: CleanerPreviewTab;
  /** When provided, the centre slot becomes the AI Asistente trigger. */
  onAsistentePress?: () => void;
  /** Fires when the cleaner drags upward from the centre slot. */
  onAsistentePullUp?: () => void;
}) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-surface-2 bg-surface-0/95 backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {/* First two tabs */}
        {TABS.slice(0, 2).map(({ key, href, label, title, Icon }) => (
          <NavItem
            key={key}
            active={key === active}
            href={href}
            label={label}
            title={title}
            Icon={Icon}
          />
        ))}

        {/* Centre Asistente slot — present only when caller wires it up. */}
        {onAsistentePress ? (
          <li className="flex-1">
            <AsistenteButton
              onPress={onAsistentePress}
              onPullUp={onAsistentePullUp}
            />
          </li>
        ) : null}

        {/* Remaining tabs */}
        {TABS.slice(2).map(({ key, href, label, title, Icon }) => (
          <NavItem
            key={key}
            active={key === active}
            href={href}
            label={label}
            title={title}
            Icon={Icon}
          />
        ))}
      </ul>
    </nav>
  );
}

function NavItem({
  active,
  href,
  label,
  title,
  Icon,
}: {
  active: boolean;
  href: string;
  label: string;
  title: string;
  Icon: typeof Calendar;
}) {
  return (
    <li className="flex-1">
      <Link
        href={href}
        title={title}
        className={`relative flex h-14 flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition ${
          active ? 'text-[#00D8C7]' : 'text-text-3 hover:text-text-1'
        }`}
      >
        {active ? (
          <span
            aria-hidden
            className="absolute top-0 h-[3px] w-10 rounded-b bg-[#00D8C7]"
          />
        ) : null}
        <span className="relative">
          <Icon
            className={`h-5 w-5 ${active ? 'stroke-[2.25]' : 'stroke-[1.75]'}`}
          />
        </span>
        <span className="tracking-wider uppercase">{label}</span>
      </Link>
    </li>
  );
}

function AsistenteButton({
  onPress,
  onPullUp,
}: {
  onPress: () => void;
  onPullUp?: () => void;
}) {
  // Drag upward to open the sheet (in addition to a plain tap).
  let startY: number | null = null;
  let pid: number | null = null;
  let dragged = false;

  function onDown(e: React.PointerEvent<HTMLButtonElement>) {
    startY = e.clientY;
    pid = e.pointerId;
    dragged = false;
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {
      /* noop */
    }
  }
  function onMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (startY == null) return;
    if (startY - e.clientY > 28) {
      dragged = true;
      startY = null;
      pid = null;
      onPullUp?.();
    }
  }
  function onUp(e: React.PointerEvent<HTMLButtonElement>) {
    if (pid != null) {
      try {
        e.currentTarget.releasePointerCapture?.(pid);
      } catch {
        /* noop */
      }
    }
    startY = null;
    pid = null;
    // Tap (no drag) → open.
    if (!dragged) onPress();
  }

  return (
    <button
      type="button"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={() => {
        startY = null;
        pid = null;
      }}
      aria-label="Abrir asistente IA"
      title="Asistente IA — pulsa o arrastra hacia arriba"
      className="relative -mt-3 flex h-14 w-full flex-col items-center justify-end gap-1 text-[10px] font-semibold text-violet-700"
    >
      <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 text-white shadow-[0_8px_22px_-6px_rgba(124,58,237,0.55)] transition active:scale-95">
        <Sparkles className="h-5 w-5" />
      </span>
      <span className="tracking-wider uppercase">Asistente</span>
    </button>
  );
}
