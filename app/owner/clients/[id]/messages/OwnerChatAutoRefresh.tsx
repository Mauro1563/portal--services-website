'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

/**
 * Owner-side mirror of the client chat refresher. Subscribes to
 * client_messages for this conversation and refreshes when the client
 * sends a new message, so the owner sees replies instantly without
 * tapping the back button + going in again.
 */
export function OwnerChatAutoRefresh({ clientId }: { clientId: string }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`owner-chat-${clientId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'client_messages',
          filter: `client_id=eq.${clientId}`,
        },
        () => router.refresh(),
      )
      .subscribe();

    const interval = setInterval(() => router.refresh(), 15_000);
    const onFocus = () => router.refresh();
    window.addEventListener('focus', onFocus);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [clientId, router]);

  return null;
}
