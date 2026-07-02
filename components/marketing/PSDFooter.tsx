/**
 * PSDFooter — Portal Services Digital footer.
 *
 * Four columns: Solutions, Company, Languages, Legal. Dark navy #16224A
 * surface with white text. Uses PortalServicesLogo in light variant so
 * the chrome monogram reads on the deeper background.
 */

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { PortalServicesLogo } from '@/components/brand/PortalServicesLogo';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { getLocale } from 'next-intl/server';

export default async function PSDFooter() {
  const t = await getTranslations('psd.landing.footer');
  const locale = (await getLocale()) as import('@/lib/i18n').Locale;
  const year = 2026;

  return (
    <footer className="bg-[#16224A] text-white" aria-labelledby="psd-footer-heading">
      <h2 id="psd-footer-heading" className="sr-only">
        Portal Services Digital
      </h2>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand + short tagline */}
          <div className="lg:col-span-1">
            <PortalServicesLogo variant="light" size="md" showWordmark />
            <p className="mt-4 max-w-xs text-sm text-white/60">
              {t('tagline')}
            </p>
            <div className="mt-6">
              <LocaleSwitcher variant="premium" current={locale} />
            </div>
          </div>

          {/* Solutions */}
          <nav aria-labelledby="footer-solutions">
            <h3
              id="footer-solutions"
              className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/60"
            >
              {t('solutions.title')}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="#soluciones"
                  className="text-white/85 transition hover:text-white"
                >
                  {t('solutions.workforce')}
                </Link>
              </li>
              <li>
                <Link
                  href="#home-solution"
                  className="text-white/85 transition hover:text-white"
                >
                  {t('solutions.home')}
                </Link>
              </li>
              <li>
                <Link
                  href="#demos"
                  className="text-white/85 transition hover:text-white"
                >
                  {t('solutions.demos')}
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="text-white/85 transition hover:text-white"
                >
                  {t('solutions.features')}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Company */}
          <nav aria-labelledby="footer-company">
            <h3
              id="footer-company"
              className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/60"
            >
              {t('company.title')}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="/company"
                  className="text-white/85 transition hover:text-white"
                >
                  {t('company.about')}
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-white/85 transition hover:text-white"
                >
                  {t('company.contact')}
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-white/85 transition hover:text-white"
                >
                  {t('company.requestDemo')}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-labelledby="footer-legal">
            <h3
              id="footer-legal"
              className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/60"
            >
              {t('legal.title')}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-white/85 transition hover:text-white"
                >
                  {t('legal.privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-white/85 transition hover:text-white"
                >
                  {t('legal.terms')}
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="text-white/85 transition hover:text-white"
                >
                  {t('legal.security')}
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-white/85 transition hover:text-white"
                >
                  {t('legal.cookies')}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center">
          <p>© {year} Portal Services Digital. {t('rights')}</p>
          <p>{t('domain')}</p>
        </div>
      </div>
    </footer>
  );
}
