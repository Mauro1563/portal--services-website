import { Star } from 'lucide-react';

export type CleanerCard = {
  id: string;
  name: string;
  avgStars: number | null;
  ratingCount: number;
};

/**
 * Cleaners that have worked for THIS client recently, with their average
 * rating. Stand-in for the "Featured Cleaners" marketplace in the
 * mockup — our model isn't a marketplace, so we surface the cleaners
 * the client already knows. Hidden entirely when the client has no
 * past services.
 */
export function FeaturedCleaners({ cleaners }: { cleaners: CleanerCard[] }) {
  if (cleaners.length === 0) return null;

  return (
    <section className="mt-6">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
        Tu equipo
      </h2>
      <ul className="mt-3 flex gap-3 overflow-x-auto pb-2">
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
              <div className="flex w-[120px] flex-col items-center rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-base font-bold text-white shadow-[0_8px_18px_-8px_rgba(5,150,105,0.55)]">
                  {initials}
                </span>
                <p className="mt-2 truncate text-[12.5px] font-semibold text-slate-900">
                  {c.name.split(/\s+/)[0]}
                </p>
                {c.avgStars != null ? (
                  <p className="mt-0.5 inline-flex items-center gap-0.5 text-[10.5px] font-semibold text-amber-700">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {c.avgStars.toFixed(1)}
                    <span className="font-normal text-slate-400">
                      {' '}
                      · {c.ratingCount}
                    </span>
                  </p>
                ) : (
                  <p className="mt-0.5 text-[10.5px] text-slate-400">
                    Sin valoraciones
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
