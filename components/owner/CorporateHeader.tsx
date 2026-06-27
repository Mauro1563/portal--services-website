import Link from 'next/link';
import { Building2, Settings } from 'lucide-react';
import { NotificationsBell } from '@/components/owner/NotificationsBell';
import type { NotificationsPayload } from '@/app/owner/notifications/actions';

/**
 * Dark navy hero header for the owner dashboard — the "Corporate Trust"
 * look from the user's reference mockup. Greeting + business identity
 * left, notifications + settings right. Full-bleed inside the page
 * container so the gradient reaches edge-to-edge on mobile.
 */
export function CorporateHeader({
  firstName,
  businessName,
  subtitle,
  initialNotifications,
}: {
  firstName: string;
  businessName: string;
  /** Optional second line under the name — e.g. "12 cleanings hoy". */
  subtitle?: string;
  /** Pre-fetched on the server so the bell doesn't pay a round-trip on mount. */
  initialNotifications?: NotificationsPayload;
}) {
  return (
    <header className="-mx-3 -mt-4 mb-5 sm:-mx-4 sm:-mt-5 lg:-mx-8 lg:-mt-7">
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 px-5 pb-7 pt-7 text-white sm:px-7 lg:px-10 lg:pb-10 lg:pt-9">
        {/* Subtle radial glow for depth — clipped in its own layer so it
            doesn't crop absolutely-positioned descendants (the
            NotificationsBell dropdown anchored below the bell). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-blue-600/15 blur-3xl" />
        </div>

        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300">
              <Building2 className="h-3 w-3" /> Owner · Vista General
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Hola, {firstName}
            </h1>
            <p className="mt-1 text-[13px] text-white/65">
              {subtitle ?? businessName}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="rounded-full bg-white/10 p-1 backdrop-blur">
              <NotificationsBell initialData={initialNotifications} />
            </div>
            <Link
              href="/owner/settings"
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
