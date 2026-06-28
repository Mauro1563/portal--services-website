'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { setLocale } from '@/app/i18n/actions';

// EN-default-first ordering: English first, then Spanish, then Portuguese.
// Labels mirror `LOCALE_LABELS` from lib/i18n.ts; that module is server-only,
// so we duplicate the strings here for the client switcher. Keep these two
// maps in sync.
const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
] as const;

const LOCALE_PREFIXES = ['en', 'es', 'pt'] as const;
const LOCALE_STORAGE_KEY = 'portal_locale';

type LocaleCode = (typeof LOCALE_PREFIXES)[number];

function isLocaleCode(v: string | null | undefined): v is LocaleCode {
  return !!v && (LOCALE_PREFIXES as readonly string[]).includes(v);
}

type Variant = 'dark' | 'light' | 'onLight' | 'premium';

export function LocaleSwitcher({
  current = 'en',
  variant = 'dark',
}: {
  current?: 'en' | 'es' | 'pt';
  variant?: Variant;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  // Roving keyboard cursor inside the menu. -1 means "no key has moved focus
  // yet" — pressing ArrowDown on the trigger jumps to the active locale.
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Cross-tab persistence: if localStorage holds a prior pick that differs
  // from the URL's locale segment, navigate to honor it. This runs once on
  // mount so opening a new tab keeps the user's last chosen language.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    } catch {
      // localStorage may be unavailable (private mode, etc.) — silently skip.
      return;
    }
    if (!isLocaleCode(stored)) return;
    if (stored === current) return;

    const segments = (pathname ?? '/').split('/');
    const firstSeg = segments[1] ?? '';
    const hasLocalePrefix = (LOCALE_PREFIXES as readonly string[]).includes(firstSeg);
    const qs = searchParams?.toString();
    const hash = window.location.hash || '';
    const suffix = (qs ? `?${qs}` : '') + hash;

    // Mirror the cookie so server renders agree with localStorage on the
    // very next request.
    document.cookie = `portal_locale=${stored}; path=/; max-age=${
      60 * 60 * 24 * 365
    }; samesite=lax`;

    if (hasLocalePrefix) {
      segments[1] = stored;
      router.replace((segments.join('/') || '/') + suffix, { scroll: false });
    } else {
      router.refresh();
    }
    // We intentionally only react to a mount-time read of localStorage; the
    // dependency list keeps the effect tied to the locale the page rendered
    // with, not to every route change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  // Honour prefers-reduced-motion so we can skip the scale-in animation.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mql.matches);
    update();
    mql.addEventListener?.('change', update);
    return () => mql.removeEventListener?.('change', update);
  }, []);

  // Click-outside to close. pointerdown fires before focus events from other
  // UI bits could steal control.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  // Move DOM focus to the active option whenever the keyboard roving cursor
  // changes; keeps screen-reader focus and visual focus in sync.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    itemRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  // Reset roving focus whenever we close so the next open starts clean.
  useEffect(() => {
    if (!open) setActiveIndex(-1);
  }, [open]);

  function handleTriggerKey(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
      // Start on the currently-active locale if present, otherwise top.
      const currentIdx = LOCALES.findIndex((l) => l.code === current);
      setActiveIndex(currentIdx >= 0 ? currentIdx : 0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      setActiveIndex(LOCALES.length - 1);
    } else if (e.key === 'Escape' && open) {
      e.preventDefault();
      setOpen(false);
    }
  }

  function handleMenuKey(e: React.KeyboardEvent<HTMLUListElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1 + LOCALES.length) % LOCALES.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? LOCALES.length - 1 : i - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(LOCALES.length - 1);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'Tab') {
      // Let Tab close naturally — preserves expected page tab flow.
      setOpen(false);
    }
  }

  function handleSelect(nextLocale: 'en' | 'es' | 'pt') {
    if (nextLocale === current) {
      setOpen(false);
      triggerRef.current?.focus();
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

      // 1b. Persist to localStorage so other tabs and future sessions honor
      // the pick even before the cookie is read on the next request.
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
        } catch {
          // Storage may be disabled — cookie still carries the preference.
        }
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
      triggerRef.current?.focus();
    });
  }

  // Style buckets per variant. The new "premium" variant is the midnight +
  // electric-cyan navbar dropdown specified by the brief; the older variants
  // are kept intact so existing call sites (e.g. the on-light HeroSection
  // nav) keep working unchanged.
  const trigger = (() => {
    if (variant === 'premium') {
      // Midnight pill with electric-cyan accent border. Shows the full
      // language name (not the 2-letter code) so the trigger reads naturally
      // on both the white marketing nav and dark app headers.
      return (
        'inline-flex h-9 items-center gap-2 rounded-full bg-[#0D0D11] px-3.5 ' +
        'text-[13px] font-medium text-[#F8F9FA] ' +
        'border border-cyan-400/30 ' +
        'transition-colors hover:bg-[#15151B] ' +
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D8C7]/60'
      );
    }
    return (
      'inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors ' +
      (variant === 'onLight'
        ? 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
        : variant === 'dark'
        ? 'bg-white/[0.06] text-slate-200 hover:bg-white/[0.10]'
        : 'bg-white/[0.06] text-white hover:bg-white/[0.12]')
    );
  })();

  const panel = (() => {
    if (variant === 'premium') {
      // Smooth pop-in: scale-95 opacity-0 -> scale-100 opacity-100 over 150ms
      // with a soft easing curve (configured in tailwind.config.ts as
      // `animate-locale-pop`). Skip the transform entirely when the user has
      // reduced-motion enabled.
      const motion = reducedMotion ? '' : 'animate-locale-pop';
      return (
        'absolute right-0 top-[calc(100%+6px)] z-50 w-44 origin-top-right overflow-hidden rounded-xl ' +
        'bg-[#0D0D11] ring-1 ring-[#00D8C7]/20 shadow-[0_8px_24px_-8px_rgba(0,216,199,0.25)] ' +
        'py-1 ' +
        motion
      );
    }
    return (
      'absolute right-0 top-11 z-50 min-w-[150px] overflow-hidden rounded-xl border shadow-lg ' +
      (variant === 'onLight'
        ? 'border-slate-200 bg-white'
        : variant === 'dark'
        ? 'border-white/10 bg-ink-1'
        : 'border-white/10 bg-navy-900 text-white')
    );
  })();

  const itemClass = (active: boolean) => {
    if (variant === 'premium') {
      return (
        'flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-[13.5px] transition-colors ' +
        (active
          ? 'text-[#00D8C7] font-semibold'
          : 'text-[#F8F9FA] hover:bg-white/5') +
        ' focus:outline-none focus-visible:bg-white/5'
      );
    }
    return (
      'flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-xs ' +
      (variant === 'onLight'
        ? 'text-slate-700 hover:bg-slate-50'
        : 'text-slate-200 hover:bg-white/[0.06]')
    );
  };

  const checkClass =
    variant === 'premium'
      ? 'h-4 w-4 text-[#00D8C7]'
      : variant === 'onLight'
      ? 'h-3.5 w-3.5 text-blue-600'
      : 'h-3.5 w-3.5 text-cyan-300';

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleTriggerKey}
        className={trigger}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {variant === 'premium' ? (
          <>
            <Globe className="h-4 w-4 text-[#00D8C7]" aria-hidden />
            <span>
              {pending
                ? '…'
                : LOCALES.find((l) => l.code === current)?.label ?? 'English'}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-[#00D8C7] transition-transform ${
                open ? 'rotate-180' : ''
              }`}
              aria-hidden
            />
          </>
        ) : (
          <>
            <Globe className="h-3.5 w-3.5" />
            <span className="uppercase">{pending ? '…' : current}</span>
          </>
        )}
      </button>
      {open ? (
        <ul
          role="menu"
          aria-label="Language"
          onKeyDown={handleMenuKey}
          className={panel}
        >
          {LOCALES.map((l, i) => {
            const active = l.code === current;
            return (
              <li key={l.code} role="none">
                <button
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  type="button"
                  role="menuitem"
                  disabled={pending}
                  tabIndex={activeIndex === i ? 0 : -1}
                  onClick={() => handleSelect(l.code)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={itemClass(active)}
                >
                  <span>{l.label}</span>
                  {active ? <Check className={checkClass} /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
