'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { ZapliLogo } from '@/components/brand/ZapliLogo';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';

/**
 * Top global navbar for the rebranded Zapli admin shell.
 *
 * The navbar IS the dark midnight band (#0D0D11) — no border underneath, the
 * bar itself provides the contrast against the page body. White+cyan
 * wordmark sits left; the primary nav lives in the center on md+ with an
 * electric-cyan underline on the active link; locale + sign-in sit right.
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
    <header className="w-full bg-[#0D0D11]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* LEFT — brand mark. Link home so users always have an escape hatch. */}
        <Link
          href="/"
          className="flex items-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/60"
        >
          <ZapliLogo size="sm" tone="onDark" />
        </Link>

        {/* CENTER — primary nav. Hidden on mobile; the hamburger sheet covers
            the same set of links. The active underline is a 2px absolutely
            positioned bar at the bottom of the link in electric cyan. */}
        <nav
          aria-label="Primary"
          className="hidden md:flex md:items-center md:gap-7"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.key === active;
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'relative inline-flex items-center text-[13.5px] transition-colors',
                  isActive
                    ? 'font-semibold text-[#10B981]'
                    : 'font-medium text-[#F8F9FA]/85 hover:text-white',
                ].join(' ')}
              >
                {item.label}
                {isActive ? (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-1 h-[2px] bg-[#10B981]"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT — locale + sign in (+ hamburger on mobile). */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <LocaleSwitcher variant="premium" />
          </div>
          <Link
            href={signedIn ? '/dashboard' : '/login'}
            className="hidden h-9 items-center rounded-full bg-[#10B981] px-4 text-[13px] font-semibold text-[#0D0D11] transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/60 md:inline-flex"
          >
            {signedIn ? 'Account' : 'Sign in'}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="zapli-mobile-sheet"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10 md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/60"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      {/* MOBILE SHEET — top sheet on midnight. We render unconditionally and
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
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          {/* Sheet content — drops from the top, full width. */}
          <div className="absolute inset-x-0 top-0 flex max-h-full flex-col bg-[#0D0D11] shadow-2xl">
            {/* Sheet header: logo on the left, close button on the right so
                the affordance matches the navbar above. */}
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">
              <ZapliLogo size="sm" tone="onDark" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/60"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <nav
              aria-label="Primary mobile"
              className="flex flex-col gap-1 overflow-y-auto px-3 pb-4"
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
                      'rounded-lg px-4 py-3 text-base transition-colors',
                      isActive
                        ? 'bg-white/5 font-semibold text-[#10B981]'
                        : 'font-medium text-[#F8F9FA]/85 hover:bg-white/5 hover:text-white',
                    ].join(' ')}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Sheet footer — locale switcher + sign-in CTA stacked. */}
            <div className="flex flex-col gap-3 border-t border-white/10 p-4">
              <LocaleSwitcher variant="premium" />
              <Link
                href={signedIn ? '/dashboard' : '/login'}
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[#10B981] px-4 text-sm font-semibold text-[#0D0D11] transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/60"
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
