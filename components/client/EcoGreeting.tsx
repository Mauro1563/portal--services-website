import { Search, SlidersHorizontal } from 'lucide-react';

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
    <section className="ps-set px-1 pt-1">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="ps-serif text-[40px] leading-[0.95] tracking-[-0.03em] text-[#141414]">
            <span
              style={{
                backgroundImage: 'linear-gradient(#FF5B1F, #FF5B1F)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 1px',
                backgroundPosition: '0 calc(100% + 2px)',
                paddingBottom: '4px',
              }}
            >
              {firstName}
            </span>
          </p>
          <p className="ps-mono mt-2 text-[12px] text-[#54524D]">
            empecemos tu próxima limpieza
          </p>
        </div>
        <span
          className="ps-serif grid h-11 w-11 shrink-0 place-items-center rounded-full text-[18px] text-[#1A0A04]"
          style={{ backgroundColor: '#E8C8C0' }}
        >
          {initial}
        </span>
      </div>

      <form action={searchAction} method="get" className="mt-5 flex gap-2">
        <label className="relative block flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#54524D]"
            aria-hidden
          />
          <input
            type="text"
            name="q"
            placeholder="Buscar servicio…"
            className="block h-11 w-full rounded-[12px] border border-[#1414141A] bg-[#E4DACA] pl-10 pr-3 text-[14px] text-[#141414] placeholder:text-[#54524D] focus:border-[#FF5B1F] focus:outline-none focus:ring-1 focus:ring-[#FF5B1F]"
          />
        </label>
        <button
          type="submit"
          aria-label="Filtros"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] border border-[#1414141A] bg-[#E4DACA] text-[#141414] transition hover:bg-[#141414] hover:text-[#F4EFE6]"
          style={{ transitionDuration: '160ms' }}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </form>
    </section>
  );
}
