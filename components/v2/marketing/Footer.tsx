import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

type Props = {
  logoUrl: string;
};

export async function Footer({ logoUrl }: Props) {
  const t = await getTranslations('footer');

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt="Portal Home Digital"
                className="h-14 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
              {t('tagline')}
            </p>
          </div>

          <FooterColumn
            title={t('platform')}
            links={[
              { label: t('platformLinks.portals'), href: '#portals' },
              { label: t('platformLinks.how'), href: '#how' },
              { label: t('platformLinks.pricing'), href: '#pricing' },
              { label: t('platformLinks.faq'), href: '#faq' },
            ]}
          />

          <FooterColumn
            title={t('company')}
            links={[
              { label: t('companyLinks.hq'), href: '/hq/login' },
              { label: t('companyLinks.privacy'), href: '/privacy' },
              { label: t('companyLinks.terms'), href: '/terms' },
            ]}
          />

          <FooterColumn
            title={t('contact')}
            links={[
              {
                label: 'hola@portalservices.digital',
                href: 'mailto:hola@portalservices.digital',
              },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>{t('rights')}</p>
          <p>{t('madeWith')}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5 text-sm text-slate-700">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="hover:text-slate-950">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
