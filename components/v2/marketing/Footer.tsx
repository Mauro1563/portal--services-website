import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export async function Footer() {
  const t = await getTranslations('psdSite.footer');
  const year = 2026;

  return (
    <footer className="border-t border-psd-border bg-white">
      <div className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <FooterMark className="h-10 w-10" />
              <div className="flex flex-col leading-tight">
                <span className="text-[15px] font-extrabold tracking-tight text-psd-navy">
                  Portal Services
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-psd-blue">
                  Digital
                </span>
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-psd-textSoft">
              {t('tagline')}
            </p>
            <p className="mt-4 text-sm font-semibold text-psd-navy">
              esuk.digital
            </p>
          </div>

          <FooterCol
            title={t('product')}
            links={[
              { label: t('modules'), href: '#modules' },
              { label: 'PWA · Offline', href: '#modules' },
              { label: 'Corporate Hub', href: '#modules' },
            ]}
          />
          <FooterCol
            title={t('roles')}
            links={[
              { label: 'Operative', href: '#roles' },
              { label: 'Supervisor', href: '#roles' },
              { label: 'Manager', href: '#roles' },
              { label: 'Director', href: '#roles' },
            ]}
          />
          <FooterCol
            title={t('company')}
            links={[
              { label: t('contact'), href: '#contact' },
              { label: t('privacy'), href: '#' },
              { label: t('terms'), href: '#' },
              { label: t('security'), href: '#' },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-psd-border pt-6 text-[12px] text-psd-textSoft sm:flex-row">
          <p>
            © {year} Portal Services Digital · esuk.digital · {t('rights')}
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-psd-green" />
              ES · EN · PT
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-psd-navy">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="text-psd-textSoft transition hover:text-psd-navy"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect width="48" height="48" rx="12" fill="#0F2044" />
      <path
        d="M13 12h9.5c4.7 0 8 2.9 8 7.2 0 4.4-3.3 7.3-8 7.3H18v9.5h-5V12zm5 4.6v5.4h4c2 0 3.3-1 3.3-2.7 0-1.7-1.3-2.7-3.3-2.7h-4z"
        fill="#2563EB"
      />
      <path
        d="M28 12h4.8c5.3 0 8.7 3.5 8.7 8.5v7c0 5-3.4 8.5-8.7 8.5H28V12zm4.8 4.6v14.8h.4c2.3 0 3.9-1.5 3.9-4v-6.8c0-2.5-1.6-4-3.9-4h-.4z"
        fill="#FF6B35"
      />
    </svg>
  );
}
