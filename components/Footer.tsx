import Link from 'next/link';
import { Lang, t } from '@/lib/i18n';

export default function Footer({ lang }: { lang: Lang }) {
  const tr = t(lang).footer;
  const nav = t(lang).nav;

  return (
    <footer className="border-t border-white/5 mt-24" style={{ background: '#060D1A' }}>
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm"
                style={{ background: 'linear-gradient(135deg,#ED8B00,#F59E0B)', color: '#0F172A' }}>
                PS
              </div>
              <span className="font-black text-white">Portal Services Digital</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">{tr.tagline}</p>
            <p className="text-sm text-white/30 mt-4">📧 hello@portalservices.digital</p>
            <p className="text-sm text-white/30">📞 +44 20 0000 0000</p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">{tr.links}</p>
            <div className="space-y-2">
              {([[`/`, nav.home],[`/solutions`, nav.solutions],[`/pricing`, nav.pricing],[`/contact`, nav.contact]] as [string,string][]).map(([href,label]) => (
                <Link key={href} href={href} className="block text-sm text-white/50 hover:text-white transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">{tr.legal}</p>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-sm text-white/50 hover:text-white transition-colors">{tr.privacy}</Link>
              <Link href="/terms" className="block text-sm text-white/50 hover:text-white transition-colors">{tr.terms}</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 text-center">
          <p className="text-xs text-white/25">{tr.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
