'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Eagerly warms the router cache for the routes the user is most likely to
 * land on after submitting the login form. Runs once on mount so by the
 * time the server action redirects, Next.js already has the destination
 * RSC payload ready and the navigation feels instant.
 *
 * /owner is by far the highest-volume target; /operative and /hq are
 * cheap extra prefetches for the cleaner and super-admin branches.
 */
export function PrefetchRoutes() {
  const router = useRouter();
  useEffect(() => {
    router.prefetch('/owner');
    router.prefetch('/operative');
    router.prefetch('/hq');
  }, [router]);
  return null;
}
