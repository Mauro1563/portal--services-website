'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { ZapliLogo } from '@/components/brand/ZapliLogo';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';

/**
 * Top global navbar for the rebranded Zapli admin shell.
 *
 * NOT used by the marketing site or the legacy demo previews
 * (/owner/preview, /operative/preview, /client/preview). Drop this into the
 * top of any admin page (Dashboard / Clients / Staff / Scheduling / Reports)
 * and pass `active` so the right link picks up the cyan underline.
 */

type NavKey = 'dashboard' | 'clients' | 'staff' | 'scheduling' | 'reports';

export type ZapliNavbarProps = {
  active?: NavKey;
  signedIn?: boolean;
};

type NavItem = { key: NavKey; href: string; label: string };

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', href: '/dashboard', label: 'Dashboard' },
  { key: 'clients', href: '/clients', label: 'Clients' },
  { key: 'staff', href: '/staff', label: 'Staff' },
  { key: 'scheduling', href: '/scheduling', label: 'Scheduling' },
  { key: 'reports', href: '/reports', label: 'Reports' },
];

export function ZapliNavbar({ active, signedIn = false }: ZapliNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll while the mobile sheet is open so the page underneath
  // doesn't scroll when fingers drag across the overlay.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  // Close the sheet on Escape so keyboard users can dismiss it.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LEFT — brand mark. Link home so users always have an escape hatch. */}
        <Link
          href="/"
          className="flex items-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
        >
          <ZapliLogo size="sm" />
        </Link>

        {/* CENTER — primary nav. Hidden on mobile; the hamburger sheet covers
            the same set of links. */}
        <nav
          aria-label="Primary"
          className="hidden md:flex md:h-16 md:items-stretch md:gap-1"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.key === active;
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  // Full-height link so the active underline sits flush with
                  // the navbar's bottom border.
                  'inline-flex items-center px-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-b-2 border-cyan-400 text-cyan-600'
                    : 'border-b-2 border-transparent text-slate-700 hover:text-slate-900',
                ].join(' ')}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT — locale + sign in (+ hamburger on mobile). */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LocaleSwitcher variant="premium" />
          </div>
          <Link
            href={signedIn ? '/dashboard' : '/login'}
            className="hidden sm:inline-flex h-9 items-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
          >
            {signedIn ? 'Account' : 'Sign in'}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="zapli-mobile-sheet"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      {/* MOBILE SHEET — full-viewport drawer. We render unconditionally and
          gate the visible state on `mobileOpen` so the close animation could
          be added later without restructuring. */}
      {mobileOpen ? (
        <div
          id="zapli-mobile-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 md:hidden"
        >
          {/* Scrim — tap to dismiss. */}
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          {/* Sheet content — slides from the right on larger phones, full
              width on small ones. */}
          <div className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl">
            {/* Sheet header: locale switcher at top + close button. */}
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <LocaleSwitcher variant="premium" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <nav
              aria-label="Primary mobile"
              className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = item.key === active;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={[
                      'rounded-lg px-4 py-3 text-base font-medium transition-colors',
                      isActive
                        ? 'bg-cyan-50 text-cyan-700'
                        : 'text-slate-800 hover:bg-slate-50',
                    ].join(' ')}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Sheet footer — sign-in CTA pinned to the bottom. */}
            <div className="border-t border-slate-200 p-4">
              <Link
                href={signedIn ? '/dashboard' : '/login'}
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
              >
                {signedIn ? 'Account' : 'Sign in'}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default ZapliNavbar;
