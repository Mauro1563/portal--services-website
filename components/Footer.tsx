import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Logo } from './Logo';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();

  const cols = [
    {
      title: t('platform'),
      links: [
        { label: tNav('solutions'), href: `/${locale}#portals` },
        { label: tNav('product'), href: `/${locale}#how` },
        { label: tNav('pricing'), href: `/${locale}#pricing` },
        { label: 'FAQ', href: `/${locale}#faq` },
      ],
    },
    {
      title: t('company'),
      links: [
        { label: t('contact'), href: 'mailto:hola@portalservices.digital' },
        { label: tNav('login'), href: 'https://hq.portalservices.digital' },
      ],
    },
    {
      title: t('legal'),
      links: [
        { label: 'Privacy', href: `/${locale}/privacy` },
        { label: 'Terms', href: `/${locale}/terms` },
      ],
    },
  ];

  return (
    <footer className="bg-ink-0 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} aria-label="Zapli">
              {/* Crop the bottom of the PNG so the baked-in tagline doesn't
                  show twice (the brand mark already lives in the hero) */}
              <div className="overflow-hidden" style={{ height: '32px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/portal-home-logo-v2.png"
                  alt="Zapli"
                  className="block w-auto"
                  style={{ height: '46px' }}
                />
              </div>
            </Link>
            <p className="mt-5 max-w-sm text-sm text-slate-400">{t('tagline')}</p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-400 transition hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Zapli. {t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}
