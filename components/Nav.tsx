import Link from 'next/link';
import { Button } from './ui/Button';

export function Nav() {
  const links = [
    { href: '/#product', label: 'Product' },
    { href: '/#solutions', label: 'Solutions' },
    { href: '/#pricing', label: 'Pricing' },
    { href: '/#security', label: 'Security' },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-ink-0/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Portal Services Digital">
          <img src="/logo.svg" alt="" className="h-8 w-8" />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-[13px] font-semibold tracking-[0.18em] text-white">
              PORTAL SERVICES
            </span>
            <span className="text-[11px] font-semibold tracking-[0.32em] text-cyan-300">
              DIGITAL
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-slate-300 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="https://hq.portalservices.digital"
            className="hidden text-sm text-slate-300 transition hover:text-white md:block"
          >
            Login
          </Link>
          <Button size="sm">Get a demo</Button>
        </div>
      </div>
    </header>
  );
}
