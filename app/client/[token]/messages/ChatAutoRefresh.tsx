'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Polls the server every 5s and on window focus so the client sees
 * new owner messages without refreshing manually. Lightweight — relies
 * on Next's router refresh to re-run the server component.
 *
 * 5s is the sweet spot pre-Supabase-realtime: feels close to live, but
 * cheap enough not to hammer the server.
 */
export function ChatAutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), 5_000);
    const onFocus = () => router.refresh();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener('focus', onFocus);
    };
  }, [router]);

  return null;
}
