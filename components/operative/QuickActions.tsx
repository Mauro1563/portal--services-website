'use client';

import { Camera, MapPin, Phone } from 'lucide-react';

type Action = {
  href: string;
  label: string;
  icon: 'maps' | 'phone' | 'camera';
  /** External link opens in new tab; internal jumps within the portal. */
  external?: boolean;
};

/**
 * Three-up icon row that gives a cleaner mid-shift one tap to:
 *   1. Open the address in Google Maps
 *   2. Call the client
 *   3. Jump straight to the photo uploader on the task page
 *
 * Items the parent doesn't pass simply get hidden — the row collapses
 * naturally so it never feels half-empty.
 */
export function QuickActions({
  mapsUrl,
  telUrl,
  cameraHref,
}: {
  mapsUrl?: string | null;
  telUrl?: string | null;
  cameraHref?: string | null;
}) {
  const actions: Action[] = [];
  if (mapsUrl)
    actions.push({ href: mapsUrl, label: 'Direcciones', icon: 'maps', external: true });
  if (telUrl) actions.push({ href: telUrl, label: 'Llamar', icon: 'phone' });
  if (cameraHref) actions.push({ href: cameraHref, label: 'Cámara', icon: 'camera' });

  if (actions.length === 0) return null;

  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      {actions.map((a) => (
        <a
          key={a.label}
          href={a.href}
          target={a.external ? '_blank' : undefined}
          rel={a.external ? 'noopener noreferrer' : undefined}
          className="group flex flex-col items-center justify-center gap-1 rounded-2xl border border-surface-2 bg-surface-0 px-2 py-3 text-center shadow-card transition active:scale-[0.97] hover:border-brand-600/40 hover:bg-brand-50/50"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-sm">
            {a.icon === 'maps' ? (
              <MapPin className="h-4 w-4" />
            ) : a.icon === 'phone' ? (
              <Phone className="h-4 w-4" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </span>
          <span className="text-[11px] font-semibold text-text-1">{a.label}</span>
        </a>
      ))}
    </div>
  );
}
