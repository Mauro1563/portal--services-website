import Link from 'next/link';
import { Star } from 'lucide-react';

export type CleanerCard = {
  id: string;
  name: string;
  avgStars: number | null;
  ratingCount: number;
  /** Optional photo URL — when present, replaces the initials hero. */
  photoUrl?: string | null;
  /** Optional specialty label, e.g. "Profunda · 32 servicios". */
  specialty?: string | null;
};

/**
 * Stable hue from a name so each cleaner consistently gets the same
 * neutral surface for their initials fallback across the portal.
 * Picks from a muted neutral/charcoal palette — never the brand blue,
 * which is reserved for the booking CTA so blue = book, not decoration.
 */
function neutralSurfaceFor(name: string): string {
  const palette = [
    'bg-slate-700',
    'bg-stone-700',
    'bg-zinc-700',
    'bg-neutral-700',
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

/**
 * "Top Rated" horizontal scroll — modeled on the marketplace template
 * but adapted to our 1-owner-N-cleaners model: shows cleaners that
 * have actually worked for this client (not a public roster) with
 * their average rating from this client's reviews.
 *
 * Tapping a card doesn't open a profile yet (we don't have one);
 * routes back to the booking form, since most "tap on cleaner" intent
 * in this UI is "I want to book". The booking action stays with the
 * owner — they pick who actually goes.
 */
export function FeaturedCleaners({
  cleaners,
  token,
}: {
  cleaners: CleanerCard[];
  token: string;
}) {
  if (cleaners.length === 0) return null;

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-bold text-slate-900">Tu equipo</h2>
        <span className="text-[11px] text-slate-500">
          {cleaners.length}{' '}
          {cleaners.length === 1 ? 'cleaner' : 'cleaners'} asignados
        </span>
      </div>
      <ul className="mt-3 -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
        {cleaners.map((c) => {
          const initials =
            c.name
              .trim()
              .split(/\s+/)
              .slice(0, 2)
              .map((w) => w[0] ?? '')
              .join('')
              .toUpperCase() || '·';
          const surface = neutralSurfaceFor(c.name);
          return (
            <li key={c.id} className="shrink-0">
              <Link
                href={`/client/${token}/book`}
                className="group block w-[148px] overflow-hidden rounded-2xl bg-white ring-1 ring-inset ring-slate-100 transition hover:ring-blue-200 hover:shadow-[0_8px_20px_-10px_rgba(15,23,42,0.18)]"
              >
                <div className={`relative grid h-24 place-items-center ${c.photoUrl ? '' : surface}`}>
                  {c.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.photoUrl}
                      alt={c.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-white">
                      {initials}
                    </span>
                  )}
                  {c.avgStars != null ? (
                    <span className="absolute right-2 top-2 inline-flex items-center gap-0.5 rounded-full bg-white/95 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 backdrop-blur">
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                      {c.avgStars.toFixed(1)}
                    </span>
                  ) : null}
                </div>
                <div className="px-3 py-2.5">
                  <p className="truncate text-[12.5px] font-semibold text-slate-900">
                    {c.name}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-slate-600">
                    {c.specialty
                      ? c.specialty
                      : c.ratingCount > 0
                        ? `${c.ratingCount} servicio${c.ratingCount === 1 ? '' : 's'}`
                        : 'Asignada a tu cuenta'}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
