import Link from 'next/link';
import { ArrowRight, LogIn } from 'lucide-react';

type Props = {
  logoUrl: string;
  ctaPrimary: string;
  ctaSecondary: string;
  links: { product: string; portals: string; pricing: string; security: string };
};

export function Nav({ logoUrl, ctaPrimary, ctaSecondary, links }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt="Portal Home Digital"
            className="h-14 w-auto sm:h-16"
          />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
          <a href="#portals" className="hover:text-slate-950">{links.portals}</a>
          <a href="#how" className="hover:text-slate-950">{links.product}</a>
          <a href="#pricing" className="hover:text-slate-950">{links.pricing}</a>
          <a href="#faq" className="hover:text-slate-950">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/portales"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            <LogIn className="h-4 w-4" />
            {ctaSecondary}
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.55)] transition hover:brightness-110"
          >
            {ctaPrimary}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
