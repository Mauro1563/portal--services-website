'use client';

/**
 * PSDNavbar — Portal Services Digital top navigation.
 *
 * Standalone component (not embedded in a hero) so any marketing page can
 * mount it independently. Uses PortalServicesLogo for the mother-brand
 * mark and next-intl for i18n copy (namespace `psd.nav`).
 *
 * Palette is strict: navy #0B2A6B for the primary CTA, blue #2563EB for
 * hover accents, no teal or green anywhere on this shell.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { PortalServicesLogo } from '@/components/brand/PortalServicesLogo';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';

type NavItem = { href: string; key: 'solutions' | 'features' | 'demos' | 'about' | 'contact' };

const ITEMS: NavItem[] = [
  { href: '#soluciones', key: 'solutions' },
  { href: '#features', key: 'features' },
  { href: '#demos', key: 'demos' },
  { href: '/company', key: 'about' },
  { href: '#contact', key: 'contact' },
];

export function PSDNavbar() {
  const t = useTranslations('psd.landing.nav');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
          aria-label="Portal Services Digital — home"
        >
          <PortalServicesLogo variant="dark" size="md" showWordmark />
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {ITEMS.map((it) => (
            <Link
              key={it.key}
              href={it.href}
              className="text-sm font-medium text-slate-700 transition hover:text-[#2563EB]"
            >
              {t(it.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher variant="premium" />
          <Link
            href="#contact"
            className="hidden items-center gap-1.5 rounded-full bg-[#0B2A6B] px-4 py-2 text-sm font-semibold text-white shadow-psd-navy-card transition hover:bg-[#103A8C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 sm:inline-flex"
          >
            {t('requestDemo')}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t('closeMenu') : t('openMenu')}
            aria-expanded={open}
            aria-controls="psd-mobile-menu"
            className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-700 transition hover:border-slate-300 hover:text-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="psd-mobile-menu"
          role="dialog"
          aria-modal="true"
          className="border-t border-slate-200 bg-white md:hidden"
        >
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {ITEMS.map((it) => (
              <Link
                key={it.key}
                href={it.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50 hover:text-[#2563EB]"
              >
                {t(it.key)}
              </Link>
            ))}
            <Link
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-[#0B2A6B] px-4 py-2.5 text-sm font-semibold text-white shadow-psd-navy-card hover:bg-[#103A8C]"
            >
              {t('requestDemo')}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export default PSDNavbar;
