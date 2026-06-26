import { Hand, Search, SlidersHorizontal } from 'lucide-react';

/**
 * Greeting + search row at the top of the client home — modeled on
 * the marketplace template: friendly "Hi, Name 👋" line, "Let's
 * start booking" subtitle, an avatar circle to the right, and a
 * search input plus a filter chip underneath.
 *
 * The search form GETs to /messages with the query pre-filled —
 * we don't have a real catalog search yet, so routing it to chat
 * keeps the input meaningful while we ship the booking flow.
 *
 * Component name kept as `EcoGreeting` for now to avoid touching
 * every importer — the visual style itself moved to royal blue
 * per the user's marketplace mockup.
 */
export function EcoGreeting({
  firstName,
  businessName,
  searchAction,
}: {
  firstName: string;
  /** Currently used to seed the avatar initial — businessName isn't
   *  rendered any more (the marketplace look is name-first). */
  businessName: string;
  searchAction: string;
}) {
  void businessName; // kept in the props signature for back-compat

  const initial = firstName.charAt(0).toUpperCase() || '·';

  return (
    <section className="px-1 pt-1">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 font-display text-xl font-bold tracking-tight text-slate-900">
            {firstName}
            <Hand className="h-5 w-5 -rotate-12 text-amber-400" />
          </p>
          <p className="mt-0.5 text-[12.5px] text-slate-500">
            Empecemos tu próxima limpieza
          </p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-sm font-bold text-white shadow-[0_6px_14px_-6px_rgba(37,99,235,0.55)]">
          {initial}
        </span>
      </div>

      <form action={searchAction} method="get" className="mt-4 flex gap-2">
        <label className="relative block flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            type="text"
            name="q"
            placeholder="Buscar servicio…"
            className="block h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </label>
        <button
          type="submit"
          aria-label="Filtros"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-900 text-white transition hover:bg-slate-700"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </form>
    </section>
  );
}
