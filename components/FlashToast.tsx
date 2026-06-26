'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

/**
 * Reads the `flash` / `flashErr` URL params on mount, fires a sonner
 * toast, then strips them from the URL via replaceState so a page
 * refresh doesn't replay the same toast forever.
 *
 * Mount once per layout. Server actions communicate by redirecting with
 * `?flash=Cliente%20creado` or `?flashErr=No%20se%20pudo%20crear`. Both
 * params accept a free-text message so the action can be specific
 * without us maintaining a global message catalog.
 */
export function FlashToast() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const consumed = useRef(false);

  useEffect(() => {
    if (consumed.current) return;
    const flash = params.get('flash');
    const flashErr = params.get('flashErr');
    if (!flash && !flashErr) return;
    consumed.current = true;

    if (flash) toast.success(flash);
    if (flashErr) toast.error(flashErr);

    // Strip the params so refresh doesn't re-fire the toast.
    const next = new URLSearchParams(params.toString());
    next.delete('flash');
    next.delete('flashErr');
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [params, pathname, router]);

  return null;
}
