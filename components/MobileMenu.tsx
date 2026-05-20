'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Menu, X } from 'lucide-react';

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'pt', label: 'PT' },
];

export function MobileMenu() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const links = [
    { href: `/${locale}#solutions`, label: t('product') },
    { href: `/${locale}#who`, label: t('solutions') },
    { href: `/${locale}#pricing`, label: t('pricing') },
    { href: `/${locale}#security`, label: t('security') },
    { href: `/${locale}/docs`, label: 'Docs' },
  ];

  function changeLocale(newLocale: string) {
    const segments = pathname.split('/');
    if (['en', 'es', 'pt'].includes(segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join('/') || `/${newLocale}`;
    startTransition(() => {
      router.push(newPath);
      setOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-white hover:bg-white/[0.12] md:hidden"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open ? (
        <>
          {/* Backdrop closes on tap outside the panel */}
          <button
            type="button"
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-20 z-40 cursor-default bg-white/[0.02]/60 backdrop-blur-sm md:hidden"
          />

          {/* Slide-down panel */}
          <div className="fixed inset-x-0 top-20 z-50 border-b border-white/[0.06] bg-white/[0.02]/95 backdrop-blur-xl md:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-white hover:bg-white/[0.03] hover:text-white"
                >
                  {l.label}
                </Link>
              ))}

              <div className="mt-2 border-t border-white/[0.06] pt-3">
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Language
                </p>
                <div className="mt-1.5 flex gap-1.5 px-3">
                  {LOCALES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => changeLocale(l.code)}
                      disabled={pending}
                      className={
                        'inline-flex h-9 flex-1 items-center justify-center rounded-lg text-xs font-semibold tracking-wider transition ' +
                        (locale === l.code
                          ? 'bg-cyan-500/15 text-cyan-300 ring-1 ring-inset ring-cyan-400/30'
                          : 'bg-white/[0.03] text-slate-300 ring-1 ring-inset ring-white/10 hover:bg-white/[0.06]')
                      }
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3 border-t border-white/[0.06] pt-3">
                <Link
                  href="https://hq.portalservices.digital"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-white hover:bg-white/[0.03] hover:text-white"
                >
                  {t('login')} →
                </Link>
              </div>
            </nav>
          </div>
        </>
      ) : null}
    </>
  );
}
