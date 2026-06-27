'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

export type ChatConversation = {
  id: string;
  /** Display name of the other party. */
  otherPartyName: string;
  /** Optional avatar URL for the other party. */
  otherPartyAvatarUrl?: string | null;
  /** Last message body for the preview row. */
  lastMessagePreview?: string;
  /** ISO timestamp of the last activity. */
  lastMessageAt?: string;
  /** Count of unread messages for the current user. */
  unreadCount?: number;
};

interface ChatHubProps {
  conversations: ChatConversation[];
  /**
   * Builds the href for a conversation row. Each portal injects its own
   * base path (e.g. `/portal/messages/:id`, `/client/:token/messages/:id`).
   */
  hrefForConversation: (conversation: ChatConversation) => string;
  /** Optional empty-state title and copy. */
  emptyTitle?: string;
  emptyBody?: string;
}

/**
 * Reusable inbox: lists conversations the current user is part of. Each
 * row shows an avatar, the other party's name, the last message preview,
 * a relative timestamp, and (when > 0) an unread count badge.
 */
export function ChatHub({
  conversations,
  hrefForConversation,
  emptyTitle = 'Sin conversaciones',
  emptyBody = 'Cuando tengas mensajes aparecerán aquí.',
}: ChatHubProps) {
  if (conversations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
        <div className="text-sm font-semibold text-slate-900">{emptyTitle}</div>
        <div className="mt-1 text-xs text-slate-500">{emptyBody}</div>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {conversations.map((conversation) => (
        <li key={conversation.id}>
          <Link
            href={hrefForConversation(conversation)}
            className="flex items-center gap-3 px-3 py-3 transition-colors hover:bg-slate-50"
          >
            <Avatar
              name={conversation.otherPartyName}
              src={conversation.otherPartyAvatarUrl ?? undefined}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className={cn(
                    'truncate text-sm',
                    (conversation.unreadCount ?? 0) > 0
                      ? 'font-semibold text-slate-900'
                      : 'font-medium text-slate-800',
                  )}
                >
                  {conversation.otherPartyName}
                </span>
                <span className="shrink-0 text-[11px] text-slate-400">
                  {formatRelative(conversation.lastMessageAt)}
                </span>
              </div>
              <div className="mt-0.5 flex items-center justify-between gap-2">
                <span
                  className={cn(
                    'truncate text-xs',
                    (conversation.unreadCount ?? 0) > 0
                      ? 'text-slate-700'
                      : 'text-slate-500',
                  )}
                >
                  {conversation.lastMessagePreview ?? 'Sin mensajes todavía'}
                </span>
                {(conversation.unreadCount ?? 0) > 0 ? (
                  <span className="inline-flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 px-1.5 text-[11px] font-semibold text-white">
                    {formatUnread(conversation.unreadCount ?? 0)}
                  </span>
                ) : null}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Avatar({ name, src }: { name: string; src?: string }) {
  if (src) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={src}
        alt={name}
        className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
      />
    );
  }
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-semibold text-white">
      {initials(name)}
    </div>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || '?';
}

function formatUnread(count: number): string {
  if (count > 99) return '99+';
  return String(count);
}

function formatRelative(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const now = Date.now();
  const diffMs = now - d.getTime();
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return 'ahora';
  if (diffMs < hour) return `${Math.floor(diffMs / minute)} m`;
  if (diffMs < day) return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  if (diffMs < 7 * day) {
    return d.toLocaleDateString(undefined, { weekday: 'short' });
  }
  return d.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' });
}
