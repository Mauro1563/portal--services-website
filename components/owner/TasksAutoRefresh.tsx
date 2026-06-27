'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

/**
 * Subscribes to `tasks` changes for this owner and triggers a router
 * refresh on INSERT / UPDATE / DELETE. Mounted on owner pages where
 * task state matters (dashboard, task list, task detail) so cleaner
 * check-ins / completions / cancellations flow through without the
 * owner having to reload.
 *
 * The owner dashboard's RSC re-fetches 13+ Supabase queries on every
 * refresh — so we aggressively debounce/throttle to keep the UI snappy:
 *  - realtime events: trailing 2s debounce (collapse bursty updates)
 *  - window focus:   throttled to once per 30s (was: every focus)
 *  - fallback poll:  5 min (was: 60s)
 *  - all refreshes:  skipped when document.hidden (background tab)
 */
const REALTIME_DEBOUNCE_MS = 2_000;
const FOCUS_THROTTLE_MS = 30_000;
const FALLBACK_POLL_MS = 5 * 60_000;

export function TasksAutoRefresh({ ownerId }: { ownerId: string }) {
  const router = useRouter();
  const lastRefreshRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const safeRefresh = () => {
      if (typeof document !== 'undefined' && document.hidden) return;
      lastRefreshRef.current = Date.now();
      router.refresh();
    };

    const debouncedRefresh = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        safeRefresh();
      }, REALTIME_DEBOUNCE_MS);
    };

    const throttledFocusRefresh = () => {
      if (Date.now() - lastRefreshRef.current < FOCUS_THROTTLE_MS) return;
      safeRefresh();
    };

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
        debouncedRefresh,
      )
      .subscribe();

    const interval = setInterval(safeRefresh, FALLBACK_POLL_MS);
    window.addEventListener('focus', throttledFocusRefresh);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
      window.removeEventListener('focus', throttledFocusRefresh);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [ownerId, router]);

  return null;
}
