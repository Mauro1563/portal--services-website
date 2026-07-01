import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { PortalServicesLogo } from '@/components/brand/PortalServicesLogo';

/**
 * Slim top strip mounted above every /<portal>/preview route via a layout.
 * Keeps the portal's own header intact (some have the white-label logo
 * centered) but adds two things prospects need:
 *   • Portal Services Digital wordmark in the LEFT corner so the brand
 *     is always visible.
 *   • A clear "Volver al sitio" link in the RIGHT corner to bounce back
 *     to the marketing landing without hunting for the browser back button.
 * The center "DEMO" badge makes it obvious that data is mocked.
 */
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
  const portalLabel = {
    owner: 'Owner',
    cleaner: 'Cleaner',
    client: 'Client',
  }[portal];

  // All three previews live inside "Portal Services: Home" per the
  // umbrella brand, so tones are kept inside the Home green family +
  // navy for the management-facing owner view.
  const tone = {
    owner: 'bg-[#0B2A6B] text-white',
    cleaner: 'bg-[#10B981] text-white',
    client: 'bg-[#059669] text-white',
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
          <span className="hidden sm:inline">Volver al sitio</span>
          <span className="sm:hidden">Volver</span>
        </Link>
      </div>
    </div>
  );
}
