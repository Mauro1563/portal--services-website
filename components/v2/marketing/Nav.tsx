'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Props = {
  links: {
    product: string;
    roles: string;
    modules: string;
    contact: string;
  };
  ctaPrimary: string;
  ctaSecondary: string;
};

export function Nav({ links, ctaPrimary, ctaSecondary }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={[
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-psd-border/70 bg-white/90 shadow-[0_2px_20px_-12px_rgba(15,32,68,0.15)] backdrop-blur-xl'
          : 'border-b border-transparent bg-white/60 backdrop-blur',
      ].join(' ')}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark className="h-9 w-9 md:h-10 md:w-10" />
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-[15px] font-extrabold tracking-tight text-psd-navy">
              Portal Services
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-psd-blue">
              Digital
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-psd-text md:flex">
          <a href="#modules" className="transition hover:text-psd-navy">
            {links.product}
          </a>
          <a href="#roles" className="transition hover:text-psd-navy">
            {links.roles}
          </a>
          <a href="#modules" className="transition hover:text-psd-navy">
            {links.modules}
          </a>
          <a href="#contact" className="transition hover:text-psd-navy">
            {links.contact}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/hq/login"
            className="hidden h-10 items-center gap-1.5 rounded-full border border-psd-border bg-white px-4 text-sm font-semibold text-psd-text transition hover:border-psd-navy hover:text-psd-navy md:inline-flex"
          >
            {ctaSecondary}
          </Link>
          <a
            href="#contact"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-psd-orange px-5 text-sm font-bold text-white shadow-[0_10px_24px_-8px_rgba(255,107,53,0.55)] transition hover:brightness-105 active:scale-[0.98]"
          >
            {ctaPrimary}
          </a>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-psd-border bg-white text-psd-text md:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
              <path
                d="M2 4h12M2 8h12M2 12h12"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-psd-border bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-5 py-4 text-sm font-medium text-psd-text">
            <a onClick={() => setOpen(false)} href="#modules" className="py-3">
              {links.product}
            </a>
            <a onClick={() => setOpen(false)} href="#roles" className="py-3">
              {links.roles}
            </a>
            <a onClick={() => setOpen(false)} href="#modules" className="py-3">
              {links.modules}
            </a>
            <a onClick={() => setOpen(false)} href="#contact" className="py-3">
              {links.contact}
            </a>
            <Link
              href="/hq/login"
              onClick={() => setOpen(false)}
              className="py-3 font-bold text-psd-navy"
            >
              {ctaSecondary}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

// Portal Services Digital isotype — "PD" mark in the brand's navy /
// blue / orange trio. Inline SVG so we don't take on an asset file.
function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="12" fill="#0F2044" />
      <path
        d="M13 12h9.5c4.7 0 8 2.9 8 7.2 0 4.4-3.3 7.3-8 7.3H18v9.5h-5V12zm5 4.6v5.4h4c2 0 3.3-1 3.3-2.7 0-1.7-1.3-2.7-3.3-2.7h-4z"
        fill="#2563EB"
      />
      <path
        d="M28 12h4.8c5.3 0 8.7 3.5 8.7 8.5v7c0 5-3.4 8.5-8.7 8.5H28V12zm4.8 4.6v14.8h.4c2.3 0 3.9-1.5 3.9-4v-6.8c0-2.5-1.6-4-3.9-4h-.4z"
        fill="#FF6B35"
      />
    </svg>
  );
}
