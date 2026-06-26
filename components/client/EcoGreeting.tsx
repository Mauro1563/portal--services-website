import { Leaf, Search } from 'lucide-react';

/**
 * Warm green greeting block for the client home — "Eco-Friendly" style
 * from the user mockup. Big "HOLA, NAME!" plus a search bar pinned at
 * the bottom of the block. Search currently submits to the messages
 * thread with the query pre-filled so the client can text the owner —
 * a real catalog search would require a service-types table.
 */
export function EcoGreeting({
  firstName,
  businessName,
  searchAction,
}: {
  firstName: string;
  businessName: string;
  /** URL the search form submits to (GET ?q=...). */
  searchAction: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 px-5 pb-5 pt-6 text-white shadow-[0_18px_40px_-18px_rgba(5,150,105,0.55)]">
      {/* Decorative leaves for warmth */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-4 -top-2 text-emerald-300/40 rotate-12"
        style={{ fontSize: 110, lineHeight: 1 }}
      >
        <Leaf />
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute -left-3 bottom-2 text-emerald-300/20 -rotate-12"
        style={{ fontSize: 70, lineHeight: 1 }}
      >
        <Leaf />
      </span>

      <div className="relative">
        <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-100">
          <Leaf className="h-3 w-3" /> {businessName}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
          ¡Hola, {firstName}!
        </h1>
        <p className="mt-1 text-[13px] text-emerald-50/85">
          ¿Qué servicio necesitas hoy?
        </p>

        <form action={searchAction} method="get" className="mt-4">
          <label className="relative block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-700"
              aria-hidden
            />
            <input
              type="text"
              name="q"
              placeholder="Buscar servicio o cleaner…"
              className="block h-12 w-full rounded-2xl border border-white/20 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.35)] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </label>
        </form>
      </div>
    </section>
  );
}
