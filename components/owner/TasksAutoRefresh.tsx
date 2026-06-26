'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

/**
 * Subscribes to `tasks` changes for this owner and triggers a router
 * refresh on INSERT / UPDATE / DELETE. Mounted on owner pages where
 * task state matters (dashboard, task list, task detail) so cleaner
 * check-ins / completions / cancellations flow through without the
 * owner having to reload.
 *
 * Heartbeat: 60s fallback + window-focus refresh (less aggressive than
 * the chat refresher because task events are less frequent than
 * messages).
 */
export function TasksAutoRefresh({ ownerId }: { ownerId: string }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`owner-tasks-${ownerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `owner_id=eq.${ownerId}`,
        },
        () => router.refresh(),
      )
      .subscribe();

    const interval = setInterval(() => router.refresh(), 60_000);
    const onFocus = () => router.refresh();
    window.addEventListener('focus', onFocus);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [ownerId, router]);

  return null;
}
