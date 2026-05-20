import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from './ui/Button';
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-ink-0/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href={`/${locale}`} aria-label="Portal Services Digital">
          <Logo size="sm" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <Link
            href="https://hq.portalservices.digital"
            className="hidden text-sm font-medium text-slate-300 transition hover:text-white md:block"
          >
            {t('login')}
          </Link>
          <Button size="sm" href="mailto:portalservicesdigital@gmail.com?subject=Demo%20request">
            {t('cta')}
          </Button>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
