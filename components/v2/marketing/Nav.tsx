'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, LogIn } from 'lucide-react';

type Props = {
  logoUrl: string;
  ctaPrimary: string;
  ctaSecondary: string;
  links: { product: string; portals: string; pricing: string; security: string };
};

export function Nav({ logoUrl, ctaPrimary, ctaSecondary, links }: Props) {
  // `scrolled` flips once the viewport has moved past the hero band so the
  // nav can transition from transparent-over-dark to solid-over-white. We
  // start with the initial value derived from window so SSR mismatch doesn't
  // flash, and listen with passive scroll to avoid jank on mobile.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={[
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-slate-200/70 bg-white/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt="Portal Home Digital"
            className={[
              'h-14 w-auto transition sm:h-16',
              // White logo bg looks fine over either state; just invert
              // brightness slightly when over the dark hero so the logo
              // still reads even if its artwork is dark-on-light.
              scrolled ? '' : 'brightness-0 invert',
            ].join(' ')}
          />
        </Link>

        <nav
          className={[
            'hidden items-center gap-8 text-sm font-medium transition-colors md:flex',
            scrolled ? 'text-slate-700' : 'text-white/85',
          ].join(' ')}
        >
          <a
            href="#portals"
            className={scrolled ? 'hover:text-slate-950' : 'hover:text-white'}
          >
            {links.portals}
          </a>
          <a
            href="#how"
            className={scrolled ? 'hover:text-slate-950' : 'hover:text-white'}
          >
            {links.product}
          </a>
          <a
            href="#pricing"
            className={scrolled ? 'hover:text-slate-950' : 'hover:text-white'}
          >
            {links.pricing}
          </a>
          <a
            href="#faq"
            className={scrolled ? 'hover:text-slate-950' : 'hover:text-white'}
          >
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className={[
              'inline-flex h-10 items-center gap-1.5 rounded-xl border px-4 text-sm font-semibold transition',
              scrolled
                ? 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                : 'border-white/20 bg-white/[0.06] text-white backdrop-blur hover:border-white/40 hover:bg-white/[0.12]',
            ].join(' ')}
          >
            <LogIn className="h-4 w-4" />
            {ctaSecondary}
          </Link>
          <Link
            href="/signup"
            className={[
              'inline-flex h-10 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold transition',
              // The primary CTA inverts: cyan gradient over white pages,
              // solid white-on-ink over the dark hero — same energy in
              // either context.
              scrolled
                ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.55)] hover:brightness-110'
                : 'bg-white text-ink-0 hover:bg-slate-100',
            ].join(' ')}
          >
            {ctaPrimary}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
