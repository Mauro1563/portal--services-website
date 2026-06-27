import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getClientByToken } from '@/lib/client-auth';
import { ClientShell } from '@/components/client/ClientShell';
import { ChatHub, type ChatConversation } from '@/components/chat/ChatHub';
import { ChatThread } from '@/components/chat/ChatThread';
import type { ChatMessage } from '@/components/chat/ChatBubble';

/**
 * Client multi-thread inbox: the existing `/client/[token]/messages`
 * route is the legacy single-thread client↔owner view (still wired to
 * the bottom tab). This new `/chat-hub` route gives the client a
 * unified inbox with both their assigned cleaner and the manager.
 * Mock data only — Supabase + realtime arrive in a follow-up.
 */

const CLIENT_USER_ID = 'mock-client';

type ThreadSeed = {
  id: string;
  otherParty: string;
  role: 'cleaner' | 'owner';
  subtitle?: string;
  messages: ChatMessage[];
};

/**
 * Two threads: the cleaner doing the actual work, plus the manager
 * for anything contractual (rescheduling, billing). Picked so the
 * preview list shows one fresh (unread) row and one older.
 */
const MOCK_THREADS: ThreadSeed[] = [
  {
    id: 'client-thread-cleaner-ana',
    otherParty: 'Ana Gómez',
    role: 'cleaner',
    subtitle: 'Cleaner asignada',
    messages: [
      {
        id: 'm1',
        conversationId: 'client-thread-cleaner-ana',
        authorId: 'cleaner-ana',
        authorName: 'Ana Gómez',
        body: '¡Hola! Salgo ya para tu casa, llego en 15 min.',
        createdAt: '2026-06-27T08:02:00.000Z',
      },
    ],
  },
  {
    id: 'client-thread-owner',
    otherParty: 'Carmen (manager)',
    role: 'owner',
    subtitle: 'Manager · soporte y facturación',
    messages: [
      {
        id: 'm1',
        conversationId: 'client-thread-owner',
        authorId: CLIENT_USER_ID,
        body: '¿Podría pedir la factura del mes pasado?',
        createdAt: '2026-06-24T11:10:00.000Z',
      },
      {
        id: 'm2',
        conversationId: 'client-thread-owner',
        authorId: 'owner-carmen',
        authorName: 'Carmen',
        body: 'Por supuesto, te la envío hoy mismo por correo.',
        createdAt: '2026-06-24T11:25:00.000Z',
      },
    ],
  },
];

function toConversations(seeds: ThreadSeed[]): ChatConversation[] {
  return seeds.map((seed) => {
    const last = seed.messages[seed.messages.length - 1];
    const unread = seed.messages.filter(
      (m) => m.authorId !== CLIENT_USER_ID,
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
  params: Promise<{ token: string }>;
  searchParams: Promise<{ thread?: string }>;
};

export default async function ClientChatHub({ params, searchParams }: Props) {
  const { token } = await params;
  const { thread: openId } = await searchParams;
  const ctx = await getClientByToken(token);
  if (!ctx) notFound();

  const open = openId
    ? MOCK_THREADS.find((t) => t.id === openId) ?? null
    : null;

  if (open) {
    return (
      <ClientShell
        ctx={ctx}
        token={token}
        activeTab="messages"
        title={open.otherParty}
        showBack
        backHref={`/client/${token}/chat-hub`}
      >
        <div className="-mx-4 -mt-4 min-h-[calc(100vh-8rem)]">
          <ChatThread
            conversationId={open.id}
            currentUserId={CLIENT_USER_ID}
            title={open.otherParty}
            subtitle={open.subtitle}
            initialMessages={open.messages}
          />
        </div>
      </ClientShell>
    );
  }

  return (
    <ClientShell
      ctx={ctx}
      token={token}
      activeTab="messages"
      title="Chat"
    >
      <ChatHub
        conversations={toConversations(MOCK_THREADS)}
        hrefForConversation={(c) =>
          `/client/${token}/chat-hub?thread=${encodeURIComponent(c.id)}`
        }
        emptyTitle="Sin conversaciones"
        emptyBody="Tus mensajes con tu cleaner y tu manager aparecerán aquí."
      />
      <p className="mt-3 text-center text-[11px] text-slate-400">
        ¿Buscas el chat clásico?{' '}
        <Link
          href={`/client/${token}/messages`}
          className="font-semibold text-blue-600 hover:underline"
        >
          Ir a Mensajes
        </Link>
      </p>
    </ClientShell>
  );
}
