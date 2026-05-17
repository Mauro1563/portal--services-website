import Link from 'next/link';

const cols = [
  {
    title: 'Product',
    links: [
      { label: 'HQ Portal', href: '#product' },
      { label: 'Manager Portal', href: '#product' },
      { label: 'Supervisor Portal', href: '#product' },
      { label: 'Operative App', href: '#product' },
      { label: 'Integrations', href: '#solutions' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Cleaning ops', href: '#solutions' },
      { label: 'Facilities management', href: '#solutions' },
      { label: 'Multi-site', href: '#solutions' },
      { label: 'Audits & compliance', href: '#solutions' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Contact', href: 'mailto:hello@portalservices.digital' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Security', href: '#security' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-ink-1/40">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5" aria-label="Portal Services Digital">
              <img src="/logo.svg" alt="" className="h-9 w-9" />
              <span className="flex flex-col leading-tight">
                <span className="font-display text-[13px] font-semibold tracking-[0.18em] text-white">
                  PORTAL SERVICES
                </span>
                <span className="text-[11px] font-semibold tracking-[0.32em] text-cyan-300">
                  DIGITAL
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm tracking-wider text-slate-400">
              <span className="text-slate-300">ONE PLATFORM.</span>{' '}
              <span className="text-cyan-300">ONE PLACE.</span>{' '}
              <span className="text-slate-400">EVERYONE CONNECTED.</span>
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-slate-400 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Portal Services Digital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
