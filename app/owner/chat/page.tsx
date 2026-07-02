import Link from 'next/link';
import { ChatHub, type ChatConversation } from '@/components/chat/ChatHub';
import { ChatThread } from '@/components/chat/ChatThread';
import type { ChatMessage } from '@/components/chat/ChatBubble';
import { BottomTabBar } from '@/components/owner/BottomTabBar';
import { getT } from '@/lib/i18n';

/**
 * Owner inbox: surfaces every conversation the owner is part of —
 * threads with clients (booking questions, complaints, schedule
 * changes) and threads with cleaners (shift updates, photo follow-
 * ups). The page is intentionally mock-only in this first cut; the
 * Supabase + realtime wiring lands in the follow-up that swaps
 * `MOCK_THREADS` for a server fetch and `onSend`/`subscribe` props.
 */

const OWNER_USER_ID = 'mock-owner';

type ThreadSeed = {
  id: string;
  /** Who the owner is talking to in this thread. */
  otherParty: string;
  /** Drives the avatar URL accent + a small role label later if needed. */
  role: 'client' | 'cleaner';
  /** Optional secondary line shown in the thread header. */
  subtitle?: string;
  /** Mock conversation contents, ordered oldest → newest. */
  messages: ChatMessage[];
};

/**
 * Four mock threads — two with clients, two with cleaners — chosen so
 * the UI has a healthy mix of unread/read, recent/old, and short/long
 * preview lines to validate ellipsis and badge rendering.
 */
const MOCK_THREADS: ThreadSeed[] = [
  {
    id: 'owner-thread-client-laura',
    otherParty: 'Laura Pérez',
    role: 'client',
    subtitle: 'Cliente · Calle Mayor 14',
    messages: [
      {
        id: 'm1',
        conversationId: 'owner-thread-client-laura',
        authorId: 'client-laura',
        authorName: 'Laura Pérez',
        body: '¿Podemos mover la limpieza del viernes al sábado?',
        createdAt: '2026-06-26T09:12:00.000Z',
      },
      {
        id: 'm2',
        conversationId: 'owner-thread-client-laura',
        authorId: OWNER_USER_ID,
        body: 'Sin problema, lo movemos al sábado a las 10:00.',
        createdAt: '2026-06-26T09:18:00.000Z',
      },
      {
        id: 'm3',
        conversationId: 'owner-thread-client-laura',
        authorId: 'client-laura',
        authorName: 'Laura Pérez',
        body: 'Perfecto, gracias!',
        createdAt: '2026-06-26T09:19:00.000Z',
      },
    ],
  },
  {
    id: 'owner-thread-client-marcos',
    otherParty: 'Marcos Ruiz',
    role: 'client',
    subtitle: 'Cliente · Av. del Mar 3',
    messages: [
      {
        id: 'm1',
        conversationId: 'owner-thread-client-marcos',
        authorId: 'client-marcos',
        authorName: 'Marcos Ruiz',
        body: 'La cocina quedó genial, ¡muchas gracias!',
        createdAt: '2026-06-25T17:40:00.000Z',
      },
    ],
  },
  {
    id: 'owner-thread-cleaner-ana',
    otherParty: 'Ana Gómez',
    role: 'cleaner',
    subtitle: 'Cleaner · Turno de mañana',
    messages: [
      {
        id: 'm1',
        conversationId: 'owner-thread-cleaner-ana',
        authorId: 'cleaner-ana',
        authorName: 'Ana Gómez',
        body: 'Salgo hacia el segundo piso, llego en 15 min.',
        createdAt: '2026-06-27T08:02:00.000Z',
      },
      {
        id: 'm2',
        conversationId: 'owner-thread-cleaner-ana',
        authorId: OWNER_USER_ID,
        body: 'Genial, avísame al terminar.',
        createdAt: '2026-06-27T08:03:00.000Z',
      },
    ],
  },
  {
    id: 'owner-thread-cleaner-jorge',
    otherParty: 'Jorge Méndez',
    role: 'cleaner',
    subtitle: 'Cleaner · Turno de tarde',
    messages: [
      {
        id: 'm1',
        conversationId: 'owner-thread-cleaner-jorge',
        authorId: 'cleaner-jorge',
        authorName: 'Jorge Méndez',
        body: 'Hace falta más detergente para la ruta del jueves.',
        createdAt: '2026-06-26T19:30:00.000Z',
      },
    ],
  },
];

function toConversations(seeds: ThreadSeed[]): ChatConversation[] {
  return seeds.map((seed) => {
    const last = seed.messages[seed.messages.length - 1];
    const unread = seed.messages.filter(
      (m) => m.authorId !== OWNER_USER_ID,
    ).length;
    return {
      id: seed.id,
      otherPartyName: seed.otherParty,
      lastMessagePreview: last?.body,
      lastMessageAt: last?.createdAt,
      // Mocked: count messages from the other party as "unread" so the
      // badge styling is visible while we wait for real read receipts.
      unreadCount: unread,
    };
  });
}

type Props = {
  searchParams: Promise<{ thread?: string }>;
};

export default async function OwnerChatPage({ searchParams }: Props) {
  const { thread: openId } = await searchParams;
  const open = openId
    ? MOCK_THREADS.find((t) => t.id === openId) ?? null
    : null;
  const t = await getT();

  return (
    <main className="flex min-h-screen flex-col bg-canvas pb-20">
      {open ? (
        <>
          <div className="sticky top-0 z-30 border-b border-line bg-paper/95 px-3 py-2 backdrop-blur">
            <Link
              href="/owner/chat"
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              <span aria-hidden>←</span> {t('common.back')}
            </Link>
          </div>
          <div className="flex-1 min-h-0">
            <ChatThread
              conversationId={open.id}
              currentUserId={OWNER_USER_ID}
              title={open.otherParty}
              subtitle={open.subtitle}
              initialMessages={open.messages}
            />
          </div>
        </>
      ) : (
        <>
          <header className="sticky top-0 z-20 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
              Bandeja
            </p>
            <h1 className="mt-0.5 font-display text-base font-semibold text-text-1">
              Chat
            </h1>
          </header>
          <div className="mx-auto w-full max-w-md flex-1 px-4 py-4">
            <ChatHub
              conversations={toConversations(MOCK_THREADS)}
              hrefForConversation={(c) =>
                `/owner/chat?thread=${encodeURIComponent(c.id)}`
              }
              emptyTitle="Sin conversaciones"
              emptyBody="Tus mensajes con clientes y cleaners aparecerán aquí."
            />
          </div>
        </>
      )}

      <BottomTabBar active="chat" />
    </main>
  );
}
