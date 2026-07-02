'use client';

import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { PortalServicesLogo } from '@/components/brand/PortalServicesLogo';
import { useClientLocale, pickCopy } from '@/lib/use-locale-client';

/**
 * Slim top strip mounted above every /<portal>/preview route via a layout.
 * Keeps the portal's own header intact (some have the white-label logo
 * centered) but adds two things prospects need:
 *   • Portal Services Digital wordmark in the LEFT corner so the brand
 *     is always visible.
 *   • A localized "Back to site" link in the RIGHT corner to bounce back
 *     to the marketing landing without hunting for the browser back button.
 * The center "DEMO" badge makes it obvious that data is mocked.
 *
 * Marked 'use client' so it can be composed both from server layouts
 * (app/{owner,operative,client}/preview/layout.tsx) and from client
 * pages (app/operative/preview-airbnb/page.tsx). The `useClientLocale`
 * hook reads from the ClientLocaleProvider that RootLayout seeds with
 * the resolved locale, so SSR and CSR agree on first paint (no flash).
 */

const COPY = {
  en: { backToSite: 'Back to site', back: 'Back' },
  es: { backToSite: 'Volver al sitio', back: 'Volver' },
  pt: { backToSite: 'Voltar ao site', back: 'Voltar' },
} as const;

export function DemoTopBar({
  portal,
  title,
}: {
  portal: 'owner' | 'cleaner' | 'client';
  /**
   * Optional override for the centre badge label. When omitted we fall back
   * to the default "Demo · {Portal}". Useful for portal variants that share
   * the same role colour but want a more specific label (e.g. the Airbnb
   * cleaner demo wants "DEMO · CLEANER (AIRBNB)" without coining a new
   * portal tone).
   */
  title?: string;
}) {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);

  const portalLabel = {
    owner: 'Owner',
    cleaner: 'Cleaner',
    client: 'Client',
  }[portal];

  // All three previews live inside "Portal Services: Home" per the
  // umbrella brand, so tones are kept inside the Home green family +
  // navy for the management-facing owner view.
  const tone = {
    owner:
      'bg-gradient-to-r from-[#0B2A6B] to-[#2563EB] text-white shadow-[0_0_16px_rgba(37,99,235,0.35)]',
    cleaner:
      'bg-gradient-to-r from-[#10B981] to-[#34D399] text-white shadow-[0_0_16px_rgba(16,185,129,0.35)]',
    client:
      'bg-gradient-to-r from-[#065F46] to-[#059669] text-white shadow-[0_0_16px_rgba(5,150,105,0.35)]',
  }[portal];

  return (
    <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-md items-center justify-between gap-2 px-3 sm:max-w-2xl">
        {/* Left — Portal Services Digital wordmark */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 -ml-1 rounded-md px-1.5 py-1 transition hover:bg-slate-100"
          aria-label="Portal Services Digital"
        >
          <PortalServicesLogo
            variant="dark"
            size="sm"
            showWordmark
            showTagline={false}
          />
        </Link>

        {/* Center — DEMO badge */}
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] ${tone}`}
        >
          <Sparkles className="h-2.5 w-2.5" />
          {title ?? `Demo · ${portalLabel}`}
        </span>

        {/* Right — back to marketing */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          <ArrowLeft className="h-3 w-3" />
          <span className="hidden sm:inline">{t.backToSite}</span>
          <span className="sm:hidden">{t.back}</span>
        </Link>
      </div>
    </div>
  );
}
