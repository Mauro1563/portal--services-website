'use client';

import * as React from 'react';
import { ChatBubble, type ChatMessage } from './ChatBubble';
import { ChatComposer } from './ChatComposer';

export type SendMessageAction = (input: {
  conversationId: string;
  body: string;
}) => Promise<ChatMessage | void>;

export type SubscribeAction = (
  conversationId: string,
  handler: (message: ChatMessage) => void,
) => () => void;

interface ChatThreadProps {
  conversationId: string;
  currentUserId: string;
  /** Other party's display name; rendered in the header. */
  title?: string;
  /** Optional subtitle, e.g. "En línea" or last seen. */
  subtitle?: string;
  initialMessages: ChatMessage[];
  /** Server action that persists a message. Stubbed in the first pass. */
  onSend?: SendMessageAction;
  /** Realtime subscription factory. Returns an unsubscribe fn. */
  subscribe?: SubscribeAction;
}

/**
 * Full chat thread: scrollable message list with auto-scroll on new
 * messages, sticky composer at the bottom, optimistic append on submit,
 * and a realtime subscription that appends inbound messages (deduped by
 * id). The server-side wiring is intentionally stubbed: pass real
 * `onSend` / `subscribe` implementations in a follow-up.
 */
export function ChatThread({
  conversationId,
  currentUserId,
  title,
  subtitle,
  initialMessages,
  onSend,
  subscribe,
}: ChatThreadProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>(initialMessages);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  // Keep the latest message in view whenever the list changes.
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Realtime subscription: dedupe by id so we don't double-render the
  // server echo of an optimistic message.
  React.useEffect(() => {
    if (!subscribe) return;
    const unsubscribe = subscribe(conversationId, (incoming) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === incoming.id)) return prev;
        return [...prev, incoming];
      });
    });
    return () => {
      unsubscribe();
    };
  }, [conversationId, subscribe]);

  const handleSend = React.useCallback(
    async (body: string) => {
      const tempId = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const optimistic: ChatMessage = {
        id: tempId,
        conversationId,
        authorId: currentUserId,
        body,
        createdAt: new Date().toISOString(),
        pending: true,
      };
      setMessages((prev) => [...prev, optimistic]);

      try {
        const sender =
          onSend ??
          (async (input) => {
            // eslint-disable-next-line no-console
            console.log('[chat] stub send', input);
            return undefined;
          });
        const confirmed = await sender({ conversationId, body });

        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== tempId) return m;
            if (confirmed) return { ...confirmed, pending: false };
            return { ...m, pending: false };
          }),
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[chat] send failed', error);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId ? { ...m, pending: false, failed: true } : m,
          ),
        );
      }
    },
    [conversationId, currentUserId, onSend],
  );

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-50">
      {title ? (
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-semibold text-white">
              {initials(title)}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-900">
                {title}
              </div>
              {subtitle ? (
                <div className="truncate text-xs text-slate-500">{subtitle}</div>
              ) : null}
            </div>
          </div>
        </header>
      ) : null}

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-4"
        aria-live="polite"
      >
        <div className="mx-auto flex max-w-md flex-col gap-2">
          {messages.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              Aún no hay mensajes. Envía el primero.
            </div>
          ) : (
            messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message}
                isOwn={message.authorId === currentUserId}
              />
            ))
          )}
        </div>
      </div>

      <ChatComposer onSend={handleSend} />
    </div>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || '?';
}
