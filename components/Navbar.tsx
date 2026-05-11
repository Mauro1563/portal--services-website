'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Lang, t } from '@/lib/i18n';

const FLAGS: Record<Lang, string> = { en: '🇬🇧', es: '🇪🇸', pt: '🇧🇷' };

export default function Navbar({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  const tr = t(lang).nav;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
      style={{ background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(16px)' }}>
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
            style={{ background: 'linear-gradient(135deg,#ED8B00,#F59E0B)', color: '#0F172A' }}>
            PS
          </div>
          <span className="font-black text-white text-sm leading-tight">
            Portal Services<br />
            <span className="font-medium text-white/40 text-[10px] tracking-widest">DIGITAL</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {([['/', tr.home], ['/solutions', tr.solutions], ['/pricing', tr.pricing], ['/contact', tr.contact]] as [string,string][]).map(([href, label]) => (
            <Link key={href} href={href} className="text-sm font-medium text-white/60 hover:text-white transition-colors">
              {label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Language picker */}
          <div className="relative">
            <select
              value={lang}
              onChange={e => setLang(e.target.value as Lang)}
              className="appearance-none bg-white/5 border border-white/10 text-white text-xs font-semibold rounded-lg px-3 py-1.5 cursor-pointer outline-none"
            >
              {(['en','es','pt'] as Lang[]).map(l => (
                <option key={l} value={l}>{FLAGS[l]} {l.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* CTA */}
          <Link href="/contact"
            className="hidden md:block text-sm font-bold px-4 py-2 rounded-xl text-[#0F172A] transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#ED8B00,#F59E0B)' }}>
            {tr.demo}
          </Link>

          {/* Mobile burger */}
          <button className="md:hidden p-2 text-white/60" onClick={() => setOpen(!open)}>
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/5 px-4 py-4 space-y-3"
          style={{ background: 'rgba(15,23,42,0.98)' }}>
          {([['/', tr.home], ['/solutions', tr.solutions], ['/pricing', tr.pricing], ['/contact', tr.contact]] as [string,string][]).map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className="block text-sm font-medium text-white/70 hover:text-white py-1">
              {label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)}
            className="block text-center text-sm font-bold px-4 py-3 rounded-xl text-[#0F172A] mt-2"
            style={{ background: 'linear-gradient(135deg,#ED8B00,#F59E0B)' }}>
            {tr.demo}
          </Link>
        </div>
      )}
    </nav>
  );
}
