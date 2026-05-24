'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Icon, LOGO_FULL_URL } from './icons';
import { LangSwitch } from './LangSwitch';

export function Nav({ logoUrl = LOGO_FULL_URL }: { logoUrl?: string }) {
  const t = useTranslations('psd.nav');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <div className="nav-left">
          <a href="#" className="brand" aria-label="Portal Services Digital">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt="Portal Services Digital" height={56} style={{ display: 'block', height: 56, width: 'auto' }} />
          </a>
        </div>
        <nav className="nav-center" aria-label="Primary">
          <a className="nav-link" href="#portals">{t('portals')}</a>
          <a className="nav-link" href="#platform">{t('platform')}</a>
          <a className="nav-link" href="#pricing">{t('pricing')}</a>
          <a className="nav-link" href="#security">{t('security')}</a>
        </nav>
        <div className="nav-right">
          <LangSwitch />
          <a className="nav-link desktop-only" href="https://hq.portalservices.digital" style={{ marginLeft: 8 }}>{t('login')}</a>
          <a className="btn btn-primary" href="mailto:portalservicesdigital@gmail.com?subject=Demo%20request" style={{ marginLeft: 6 }}>
            {t('demo')} <Icon.arrow />
          </a>
          <button className="nav-menu-btn" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            <Icon.menu />
          </button>
        </div>
      </div>
      {open && (
        <div className="nav-mobile">
          <a className="nav-link" href="#portals" onClick={() => setOpen(false)}>{t('portals')}</a>
          <a className="nav-link" href="#platform" onClick={() => setOpen(false)}>{t('platform')}</a>
          <a className="nav-link" href="#pricing" onClick={() => setOpen(false)}>{t('pricing')}</a>
          <a className="nav-link" href="#security" onClick={() => setOpen(false)}>{t('security')}</a>
          <a className="nav-link" href="https://hq.portalservices.digital">{t('login')}</a>
        </div>
      )}
    </header>
  );
}
