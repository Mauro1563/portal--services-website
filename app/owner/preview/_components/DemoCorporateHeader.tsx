import Link from 'next/link';
import { Bell, Building2, Settings } from 'lucide-react';

/**
 * Preview-only Corporate Trust header. Same dark-navy gradient as the
 * authed CorporateHeader, but the bell and settings icons are static
 * (no Supabase calls) so the demo loads without any session.
 */
export function DemoCorporateHeader({
  firstName,
  subtitle,
}: {
  firstName: string;
  subtitle: string;
}) {
  return (
    <header className="-mx-3 -mt-4 mb-5 sm:-mx-4 sm:-mt-5 lg:-mx-8 lg:-mt-7">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 px-5 pb-7 pt-7 text-white sm:px-7 lg:px-10 lg:pb-10 lg:pt-9">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-blue-600/15 blur-3xl"
        />

        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300">
              <Building2 className="h-3 w-3" /> Owner · Vista General
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Hola, {firstName}
            </h1>
            <p className="mt-1 text-[13px] text-white/65">{subtitle}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="relative grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/85">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                3
              </span>
            </span>
            <Link
              href="/owner/preview"
              aria-label="Ajustes"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/85 transition hover:bg-white/20"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
