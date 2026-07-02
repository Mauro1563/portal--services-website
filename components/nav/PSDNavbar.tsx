'use client';

/**
 * PSDNavbar — Portal Services Digital top navigation.
 *
 * Standalone component (not embedded in a hero) so any marketing page can
 * mount it independently. Uses PortalServicesLogo (light variant) for the
 * mother-brand mark on the dark navy surface and next-intl for i18n copy
 * (namespace `psd.nav`).
 *
 * Palette: deep navy gradient bar (#0B1327 → #0F1B3D → #0B2A6B), blue
 * #2563EB accent for hover states and the primary CTA. Zero teal, zero
 * green in this shell.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { PortalServicesLogo } from '@/components/brand/PortalServicesLogo';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';

type NavItem = {
  href: string;
  key: 'solutions' | 'chat' | 'features' | 'demos' | 'about' | 'contact';
};

const ITEMS: NavItem[] = [
  { href: '#soluciones', key: 'solutions' },
  { href: '#chat', key: 'chat' },
  { href: '#features', key: 'features' },
  { href: '#demos', key: 'demos' },
  { href: '/company', key: 'about' },
  { href: '#contact', key: 'contact' },
];

export function PSDNavbar() {
  const t = useTranslations('psd.landing.nav');
  const locale = useLocale() as 'en' | 'es' | 'pt';
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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-gradient-to-r from-[#0B1327] via-[#0F1B3D] to-[#0B2A6B] shadow-[0_1px_0_rgba(255,255,255,0.05)_inset,0_10px_30px_-15px_rgba(11,42,107,0.5)] backdrop-blur-md">
      {/* Subtle ambient glow so the bar has depth instead of being a flat block */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(37,99,235,0.25) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1327]"
          aria-label="Portal Services Digital — home"
        >
          <PortalServicesLogo variant="light" size="md" showWordmark />
        </Link>

        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Primary"
        >
          {ITEMS.map((it) => (
            <Link
              key={it.key}
              href={it.href}
              className="text-sm font-medium text-white/80 transition hover:text-white"
            >
              {t(it.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher variant="premium" current={locale} />
          <Link
            href="#contact"
            className="hidden items-center gap-1.5 rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] ring-1 ring-inset ring-[#60A5FA]/40 transition hover:bg-[#1D4ED8] hover:shadow-[0_0_28px_rgba(37,99,235,0.7)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1327] sm:inline-flex"
          >
            {t('requestDemo')}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t('closeMenu') : t('openMenu')}
            aria-expanded={open}
            aria-controls="psd-mobile-menu"
            className="grid h-10 w-10 place-items-center rounded-lg border border-white/20 bg-white/5 text-white transition hover:border-white/40 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] md:hidden"
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
          className="relative border-t border-white/10 bg-gradient-to-b from-[#0F1B3D] to-[#0B1327] md:hidden"
        >
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {ITEMS.map((it) => (
              <Link
                key={it.key}
                href={it.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-white/85 transition hover:bg-white/5 hover:text-white"
              >
                {t(it.key)}
              </Link>
            ))}
            <Link
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] ring-1 ring-inset ring-[#60A5FA]/40 hover:bg-[#1D4ED8]"
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
