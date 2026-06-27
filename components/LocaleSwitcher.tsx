'use client';

import { useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Check, Globe } from 'lucide-react';
import { setLocale } from '@/app/i18n/actions';

const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
] as const;

const LOCALE_PREFIXES = ['en', 'es', 'pt'] as const;

type Variant = 'dark' | 'light' | 'onLight';

export function LocaleSwitcher({
  current = 'en',
  variant = 'dark',
}: {
  current?: 'en' | 'es' | 'pt';
  variant?: Variant;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const trigger =
    'inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors ' +
    (variant === 'onLight'
      ? 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
      : variant === 'dark'
      ? 'bg-white/[0.06] text-slate-200 hover:bg-white/[0.10]'
      : 'bg-white/[0.06] text-white hover:bg-white/[0.12]');

  const panel =
    'absolute right-0 top-11 z-50 min-w-[150px] overflow-hidden rounded-xl border shadow-lg ' +
    (variant === 'onLight'
      ? 'border-slate-200 bg-white'
      : variant === 'dark'
      ? 'border-white/10 bg-ink-1'
      : 'border-white/10 bg-navy-900 text-white');

  const itemClass =
    'flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-xs ' +
    (variant === 'onLight'
      ? 'text-slate-700 hover:bg-slate-50'
      : 'text-slate-200 hover:bg-white/[0.06]');

  const checkClass =
    variant === 'onLight' ? 'h-3.5 w-3.5 text-blue-600' : 'h-3.5 w-3.5 text-cyan-300';

  function handleSelect(nextLocale: 'en' | 'es' | 'pt') {
    if (nextLocale === current) {
      setOpen(false);
      return;
    }

    // Build the target path: replace first segment if it's a known locale,
    // otherwise leave the path alone and just refresh after the cookie flip.
    const segments = (pathname ?? '/').split('/');
    // segments[0] === '' for paths starting with '/'
    const firstSeg = segments[1] ?? '';
    const hasLocalePrefix = (LOCALE_PREFIXES as readonly string[]).includes(firstSeg);

    const qs = searchParams?.toString();
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const suffix = (qs ? `?${qs}` : '') + (hash || '');

    startTransition(() => {
      // 1. Flip the cookie immediately so cookie-driven sections (e.g. HeroSection)
      // render in the new language on the very next paint, without waiting for the
      // middleware round-trip.
      if (typeof document !== 'undefined') {
        document.cookie = `portal_locale=${nextLocale}; path=/; max-age=${
          60 * 60 * 24 * 365
        }; samesite=lax`;
      }

      // 2. Also call the server action so the cookie is set server-side for the
      // current request and dependent caches are revalidated.
      const fd = new FormData();
      fd.set('locale', nextLocale);
      void setLocale(fd);

      // 3. Drive the URL. If the current path has a locale prefix, swap it;
      // otherwise just refresh so the page picks up the new cookie.
      if (hasLocalePrefix) {
        segments[1] = nextLocale;
        const nextPath = segments.join('/') || '/';
        router.replace(nextPath + suffix, { scroll: false });
      } else {
        router.refresh();
      }

      setOpen(false);
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={trigger}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="uppercase">{pending ? '…' : current}</span>
      </button>
      {open ? (
        <>
          {/* outside click capture */}
          <button
            type="button"
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default bg-transparent"
          />
          <ul role="menu" className={panel}>
            {LOCALES.map((l) => {
              const active = l.code === current;
              return (
                <li key={l.code} role="none">
                  <button
                    type="button"
                    role="menuitem"
                    disabled={pending}
                    onClick={() => handleSelect(l.code)}
                    className={itemClass}
                  >
                    <span>{l.label}</span>
                    {active ? <Check className={checkClass} /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}
    </div>
  );
}
