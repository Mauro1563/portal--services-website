'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

interface ChatComposerProps {
  onSend: (body: string) => void | Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * Sticky composer for ChatThread. Multiline textarea that auto-grows up to
 * a max height, Enter submits, Shift+Enter inserts a newline. The send
 * button is disabled when the trimmed value is empty.
 */
export function ChatComposer({
  onSend,
  disabled = false,
  placeholder = 'Escribe un mensaje…',
}: ChatComposerProps) {
  const [value, setValue] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  const submit = React.useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    setValue('');
    void onSend(trimmed);
  }, [value, disabled, onSend]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="sticky bottom-0 z-30 border-t border-slate-200 bg-white/95 px-3 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/80"
    >
      <div className="mx-auto flex max-w-md items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'min-h-[40px] max-h-40 flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-sm',
            'placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30',
            'disabled:cursor-not-allowed disabled:opacity-60',
          )}
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Enviar mensaje"
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-all',
            canSend
              ? 'bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_8px_20px_-8px_rgba(37,99,235,0.55)] hover:brightness-110'
              : 'bg-slate-300',
          )}
        >
          <SendIcon />
        </button>
      </div>
    </form>
  );
}

function SendIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
    </svg>
  );
}
