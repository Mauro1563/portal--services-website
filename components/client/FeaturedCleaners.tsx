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
  // Stable but quietly varied — all warm tones tied to the paper canvas.
  const palette = ['bg-[#141414]', 'bg-[#54524D]', 'bg-[#1A0A04]'];
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
    <section className="mt-8">
      <div className="flex items-end justify-between">
        <h2 className="ps-serif text-[28px] leading-[0.95] tracking-[-0.03em] text-[#141414]">
          Tu equipo
        </h2>
        <span className="ps-mono text-[12px] text-[#54524D]">
          {cleaners.length}{' '}
          {cleaners.length === 1 ? 'asignado' : 'asignados'}
        </span>
      </div>
      <ul className="mt-4 -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
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
                className="group block w-[148px] overflow-hidden rounded-[12px] border border-[#1414141A] bg-[#E4DACA] transition"
                style={{ transitionDuration: '160ms' }}
              >
                <div className={`relative grid h-24 place-items-center border-b border-[#1414141A] ${c.photoUrl ? '' : surface}`}>
                  {c.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.photoUrl}
                      alt={c.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="ps-serif text-[28px] text-[#F4EFE6]">
                      {initials}
                    </span>
                  )}
                  {c.avgStars != null ? (
                    <span
                      className="ps-mono absolute right-2 top-2 inline-flex items-center gap-1 rounded-full border border-[#1414141A] px-2 py-0.5 text-[10px] text-[#141414]"
                      style={{ backgroundColor: '#F4EFE6' }}
                    >
                      <Star className="h-2.5 w-2.5" style={{ fill: '#FF5B1F', color: '#FF5B1F' }} />
                      <span className="tabular-nums">{c.avgStars.toFixed(1)}</span>
                    </span>
                  ) : null}
                </div>
                <div className="px-3 py-3">
                  <p className="truncate text-[13px] font-semibold text-[#141414]">
                    {c.name}
                  </p>
                  <p className="ps-mono mt-1 truncate text-[11px] text-[#54524D]">
                    {c.specialty
                      ? c.specialty
                      : c.ratingCount > 0
                        ? `${c.ratingCount} servicio${c.ratingCount === 1 ? '' : 's'}`
                        : 'asignada a tu cuenta'}
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
