'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Polls the server every 10s and on window focus so the client sees
 * new owner messages without refreshing manually. Lightweight — relies
 * on Next's router refresh to re-run the server component.
 */
export function ChatAutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), 10_000);
    const onFocus = () => router.refresh();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener('focus', onFocus);
    };
  }, [router]);

  return null;
}
