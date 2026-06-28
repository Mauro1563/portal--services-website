import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Logo } from './Logo';
import { LocaleSwitcher } from './LocaleSwitcher';

export function Nav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const links = [
    { href: `/${locale}#portals`, label: t('solutions') },
    { href: `/${locale}#how`, label: t('product') },
    { href: `/${locale}#pricing`, label: t('pricing') },
    { href: `/${locale}#faq`, label: 'FAQ' },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/60 bg-canvas/85 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Top row: logo + utilities */}
        <div className="flex h-14 items-center justify-between gap-3 md:h-16">
          <Link href={`/${locale}`} aria-label="Zapli" className="shrink-0">
            <Logo size="md" variant="icon" />
          </Link>

          {/* Desktop-only inline links */}
          <nav className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-graphite-2 transition-colors hover:text-graphite-1"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <LocaleSwitcher />
            <Link
              href="https://hq.portalservices.digital"
              className="text-xs font-medium text-graphite-3 transition hover:text-graphite-1 sm:text-sm"
            >
              {t('login')}
            </Link>
            <a
              href="mailto:hola@portalservices.digital?subject=Demo%20request"
              className="inline-flex h-9 items-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 px-3 text-xs font-semibold text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.55)] transition hover:brightness-110 sm:px-3.5 sm:text-sm"
            >
              {t('cta')}
            </a>
          </div>
        </div>

        {/* Mobile-only second row with the section links, scrollable if tight */}
        <nav
          className="-mx-4 flex items-center justify-around gap-1 overflow-x-auto border-t border-slate-200/50 px-3 py-2 md:hidden"
          aria-label="Secciones"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="shrink-0 rounded-md px-2.5 py-1 text-xs font-medium text-graphite-2 transition hover:bg-slate-100 hover:text-graphite-1"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
