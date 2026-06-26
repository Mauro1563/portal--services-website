import Link from 'next/link';
import { Box, Hammer, Plus, Sparkles, SquareDashedBottom } from 'lucide-react';

export type CatalogService = {
  id: string;
  name: string;
};

/**
 * Pick a sensible icon + color tone from the service name. Pure text
 * matching — works in any language since we're checking root words
 * commonly used by Spanish cleaning shops. Falls back to a generic
 * sparkle for anything we don't recognise.
 */
function iconFor(name: string): {
  Icon: typeof Sparkles;
  bg: string;
  fg: string;
} {
  const n = name.toLowerCase();
  if (n.includes('mudanza') || n.includes('move'))
    return { Icon: Box, bg: 'bg-amber-50', fg: 'text-amber-700' };
  if (n.includes('vidrio') || n.includes('window') || n.includes('cristal'))
    return { Icon: SquareDashedBottom, bg: 'bg-sky-50', fg: 'text-sky-700' };
  if (
    n.includes('profunda') ||
    n.includes('deep') ||
    n.includes('post') ||
    n.includes('obra')
  )
    return { Icon: Hammer, bg: 'bg-teal-50', fg: 'text-teal-700' };
  return { Icon: Sparkles, bg: 'bg-emerald-50', fg: 'text-emerald-700' };
}

/**
 * 4-up service catalog tiles per the Eco-Friendly mockup. Pulls the
 * owner's real `service_types` (passed in by the parent) and routes
 * each tap to the booking form with the chosen service pre-selected.
 * If the owner hasn't published any services yet, falls back to a
 * single "Reservar" tile that opens the booking page anyway so the
 * client can still request through chat.
 */
export function ServiceCatalog({
  token,
  services,
}: {
  token: string;
  services: CatalogService[];
}) {
  return (
    <section className="mt-6">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
        Servicios disponibles
      </h2>
      {services.length === 0 ? (
        <Link
          href={`/client/${token}/book`}
          className="mt-3 flex items-center gap-3 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 p-4 transition hover:border-emerald-300 hover:bg-emerald-50/70"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
            <Plus className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-slate-900">
              Pide tu primer servicio
            </p>
            <p className="mt-0.5 text-[11px] text-slate-600">
              Tu equipo aún no publicó precios — abre el chat y avísales.
            </p>
          </div>
        </Link>
      ) : (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {services.slice(0, 4).map((s) => {
            const { Icon, bg, fg } = iconFor(s.name);
            return (
              <Link
                key={s.id}
                href={`/client/${token}/book?service=${s.id}`}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 text-center transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-[0_8px_24px_-12px_rgba(5,150,105,0.4)]"
              >
                <span className={`grid h-11 w-11 place-items-center rounded-2xl ${bg} ${fg}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="line-clamp-2 text-[10.5px] font-semibold leading-tight text-slate-700 group-hover:text-emerald-700">
                  {s.name}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
