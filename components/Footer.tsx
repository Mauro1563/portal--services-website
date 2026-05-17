import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Logo } from './Logo';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const cols = [
    {
      title: t('col_product'),
      links: [
        { label: 'HQ Portal', href: `/${locale}#product` },
        { label: 'Manager Portal', href: `/${locale}#product` },
        { label: 'Supervisor Portal', href: `/${locale}#product` },
        { label: 'Operative App', href: `/${locale}#product` },
        { label: 'Integrations', href: `/${locale}#solutions` },
      ],
    },
    {
      title: t('col_solutions'),
      links: [
        { label: 'Cleaning ops', href: `/${locale}#solutions` },
        { label: 'Facilities management', href: `/${locale}#solutions` },
        { label: 'Airbnb / Property', href: `/${locale}#who` },
        { label: 'Audits & compliance', href: `/${locale}#solutions` },
      ],
    },
    {
      title: t('col_company'),
      links: [{ label: t('link_contact'), href: 'mailto:portalservicesdigital@gmail.com' }],
    },
    {
      title: t('col_resources'),
      links: [
        { label: t('link_security'), href: `/${locale}#security` },
        { label: t('link_pricing'), href: `/${locale}#pricing` },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/[0.06] bg-ink-1/40">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} aria-label="Portal Services Digital">
              <Logo size="md" />
            </Link>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-slate-400 transition hover:text-white">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Portal Services Digital. {t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
