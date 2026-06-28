import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

/**
 * Slim top strip mounted above every /<portal>/preview route via a layout.
 * Keeps the portal's own header intact (some have the white-label logo
 * centered) but adds two things prospects need:
 *   • Zapli wordmark in the LEFT corner so the brand is always visible
 *   • a clear "Volver al sitio" link in the RIGHT corner to bounce back
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

  const tone = {
    owner: 'bg-slate-900 text-cyan-300',
    cleaner: 'bg-emerald-600 text-emerald-50',
    client: 'bg-[#00D8C7] text-[#0A0D18]',
  }[portal];

  return (
    <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-md items-center justify-between gap-2 px-3 sm:max-w-2xl">
        {/* Left — wordmark, always in the corner */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 -ml-1 rounded-md px-1.5 py-1 text-slate-900 transition hover:bg-slate-100"
          aria-label="Zapli"
        >
          <span className="grid h-6 w-6 place-items-center rounded-md bg-[#00D8C7] text-[10px] font-bold text-[#0A0D18]">
            Z
          </span>
          <span className="font-display text-[12px] font-semibold leading-none">
            Zapli
          </span>
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
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/40"
        >
          <ArrowLeft className="h-3 w-3" />
          <span className="hidden sm:inline">Volver al sitio</span>
          <span className="sm:hidden">Volver</span>
        </Link>
      </div>
    </div>
  );
}
