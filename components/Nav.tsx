import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Logo } from './Logo';
import { LocaleSwitcher } from './LocaleSwitcher';
import { MobileMenu } from './MobileMenu';

export function Nav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const links = [
    { href: `/${locale}#portals`, label: t('solutions') },
    { href: `/${locale}#vip`, label: t('product') },
    { href: `/${locale}#pricing`, label: t('pricing') },
    { href: `/${locale}#security`, label: t('security') },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/60 bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href={`/${locale}`} aria-label="Portal Services">
          <Logo size="md" variant="full" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
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

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <Link
            href="https://hq.portalservices.digital"
            className="hidden text-sm font-medium text-graphite-3 transition hover:text-graphite-1 md:block"
          >
            {t('login')}
          </Link>
          <a
            href="mailto:portalservicesdigital@gmail.com?subject=Demo%20request"
            className="inline-flex h-9 items-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 px-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.55)] transition hover:brightness-110"
          >
            {t('cta')}
          </a>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
