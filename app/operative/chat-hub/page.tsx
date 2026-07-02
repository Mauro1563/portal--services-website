import Link from 'next/link';
import { ChatHub, type ChatConversation } from '@/components/chat/ChatHub';
import { ChatThread } from '@/components/chat/ChatThread';
import type { ChatMessage } from '@/components/chat/ChatBubble';
import { BottomTabBar } from '@/components/operative/BottomTabBar';
import { getT } from '@/lib/i18n';

/**
 * Cleaner inbox: the existing `/operative/chat` is a single-thread view
 * pinned to the cleaner↔owner conversation (kept as-is so deep links
 * and the current bottom tab don't break). This new `/chat-hub` route
 * is the multi-thread variant: the cleaner can see threads with the
 * clients they serve plus the manager. Mock data only in this pass.
 */

const CLEANER_USER_ID = 'mock-cleaner';

type ThreadSeed = {
  id: string;
  otherParty: string;
  role: 'client' | 'owner';
  subtitle?: string;
  messages: ChatMessage[];
};

/**
 * Three threads — two clients (typical situation: a cleaner with a
 * couple of regulars) and the manager. The owner thread is the same
 * conversation surfaced at `/operative/chat`; we mirror it here so
 * the multi-thread hub feels complete.
 */
const MOCK_THREADS: ThreadSeed[] = [
  {
    id: 'cleaner-thread-owner',
    otherParty: 'Carmen (manager)',
    role: 'owner',
    subtitle: 'Manager · turno asignado',
    messages: [
      {
        id: 'm1',
        conversationId: 'cleaner-thread-owner',
        authorId: 'owner-carmen',
        authorName: 'Carmen',
        body: 'Mañana añado una limpieza extra a las 16:00, ¿te viene bien?',
        createdAt: '2026-06-26T20:14:00.000Z',
      },
      {
        id: 'm2',
        conversationId: 'cleaner-thread-owner',
        authorId: CLEANER_USER_ID,
        body: 'Sí, perfecto.',
        createdAt: '2026-06-26T20:18:00.000Z',
      },
    ],
  },
  {
    id: 'cleaner-thread-client-laura',
    otherParty: 'Laura Pérez',
    role: 'client',
    subtitle: 'Cliente · Calle Mayor 14',
    messages: [
      {
        id: 'm1',
        conversationId: 'cleaner-thread-client-laura',
        authorId: 'client-laura',
        authorName: 'Laura Pérez',
        body: 'Dejo la llave en el buzón como siempre.',
        createdAt: '2026-06-27T07:50:00.000Z',
      },
    ],
  },
  {
    id: 'cleaner-thread-client-marcos',
    otherParty: 'Marcos Ruiz',
    role: 'client',
    subtitle: 'Cliente · Av. del Mar 3',
    messages: [
      {
        id: 'm1',
        conversationId: 'cleaner-thread-client-marcos',
        authorId: CLEANER_USER_ID,
        body: 'Llego en 10 minutos.',
        createdAt: '2026-06-25T10:55:00.000Z',
      },
      {
        id: 'm2',
        conversationId: 'cleaner-thread-client-marcos',
        authorId: 'client-marcos',
        authorName: 'Marcos Ruiz',
        body: 'Genial, gracias!',
        createdAt: '2026-06-25T10:56:00.000Z',
      },
    ],
  },
];

function toConversations(seeds: ThreadSeed[]): ChatConversation[] {
  return seeds.map((seed) => {
    const last = seed.messages[seed.messages.length - 1];
    const unread = seed.messages.filter(
      (m) => m.authorId !== CLEANER_USER_ID,
    ).length;
    return {
      id: seed.id,
      otherPartyName: seed.otherParty,
      lastMessagePreview: last?.body,
      lastMessageAt: last?.createdAt,
      unreadCount: unread,
    };
  });
}

type Props = {
  searchParams: Promise<{ thread?: string }>;
};

export default async function OperativeChatHub({ searchParams }: Props) {
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
              href="/operative/chat-hub"
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              <span aria-hidden>←</span> {t('common.back')}
            </Link>
          </div>
          <div className="flex-1 min-h-0">
            <ChatThread
              conversationId={open.id}
              currentUserId={CLEANER_USER_ID}
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
                `/operative/chat-hub?thread=${encodeURIComponent(c.id)}`
              }
              emptyTitle="Sin conversaciones"
              emptyBody="Tus mensajes con clientes y tu manager aparecerán aquí."
            />
          </div>
        </>
      )}

      <BottomTabBar active="chat" />
    </main>
  );
}
