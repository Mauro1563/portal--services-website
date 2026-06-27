'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

export type ChatMessage = {
  id: string;
  conversationId: string;
  authorId: string;
  authorName?: string;
  body: string;
  createdAt: string;
  /** Used for optimistic messages that haven't been confirmed by the server. */
  pending?: boolean;
  /** True when the optimistic send failed; row will offer a retry. */
  failed?: boolean;
};

interface ChatBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

/**
 * A single chat bubble. Own messages render on the right with a brand
 * gradient; others render on the left with a neutral surface. Pending
 * messages render at reduced opacity so the user can tell the send is
 * still in flight.
 */
export function ChatBubble({ message, isOwn }: ChatBubbleProps) {
  const time = formatTime(message.createdAt);

  return (
    <div className={cn('flex w-full', isOwn ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm',
          isOwn
            ? 'rounded-br-sm bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
            : 'rounded-bl-sm bg-white text-slate-900 ring-1 ring-slate-200',
          message.pending && 'opacity-70',
          message.failed && 'ring-1 ring-rose-300',
        )}
      >
        {!isOwn && message.authorName ? (
          <div className="mb-0.5 text-[11px] font-semibold text-slate-500">
            {message.authorName}
          </div>
        ) : null}
        <div className="whitespace-pre-wrap break-words">{message.body}</div>
        <div
          className={cn(
            'mt-1 flex items-center gap-1 text-[10px]',
            isOwn ? 'justify-end text-white/70' : 'justify-start text-slate-400',
          )}
        >
          <span>{time}</span>
          {message.pending && !message.failed ? <span>· enviando…</span> : null}
          {message.failed ? <span className="text-rose-500">· no enviado</span> : null}
        </div>
      </div>
    </div>
  );
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}
