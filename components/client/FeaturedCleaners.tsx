import Link from 'next/link';
import { Star } from 'lucide-react';

export type CleanerCard = {
  id: string;
  name: string;
  avgStars: number | null;
  ratingCount: number;
};

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
        <span className="text-[11px] text-slate-400">
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
          return (
            <li key={c.id} className="shrink-0">
              <Link
                href={`/client/${token}/book`}
                className="group block w-[140px] overflow-hidden rounded-2xl bg-white ring-1 ring-inset ring-slate-100 transition hover:ring-blue-200 hover:shadow-[0_8px_20px_-10px_rgba(37,99,235,0.35)]"
              >
                <div className="relative grid h-24 place-items-center bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800">
                  <span className="text-xl font-bold text-white drop-shadow">
                    {initials}
                  </span>
                  {c.avgStars != null ? (
                    <span className="absolute right-2 top-2 inline-flex items-center gap-0.5 rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 backdrop-blur">
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                      {c.avgStars.toFixed(1)}
                    </span>
                  ) : null}
                </div>
                <div className="px-3 py-2.5">
                  <p className="truncate text-[12.5px] font-semibold text-slate-900">
                    {c.name}
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-slate-500">
                    {c.ratingCount > 0
                      ? `${c.ratingCount} review${c.ratingCount === 1 ? '' : 's'}`
                      : 'Asignado a tu cuenta'}
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
