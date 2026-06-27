import Link from 'next/link';
import {
  Box,
  Brush,
  ChevronRight,
  Hammer,
  Plus,
  Sparkles,
  SquareDashedBottom,
  Wind,
} from 'lucide-react';

export type CatalogService = {
  id: string;
  name: string;
};

/**
 * Pick a sensible icon + color tone from the service name. Pure text
 * matching — works in any language since we're checking root words
 * commonly used by Spanish/English cleaning shops. Falls back to a
 * generic sparkle for anything we don't recognise.
 */
function iconFor(name: string): {
  Icon: typeof Sparkles;
  bg: string;
  fg: string;
} {
  const n = name.toLowerCase();
  if (n.includes('mudanza') || n.includes('move'))
    return { Icon: Box, bg: 'bg-amber-50', fg: 'text-amber-600' };
  if (n.includes('vidrio') || n.includes('window') || n.includes('cristal'))
    return { Icon: SquareDashedBottom, bg: 'bg-sky-50', fg: 'text-sky-600' };
  if (
    n.includes('profunda') ||
    n.includes('deep') ||
    n.includes('post') ||
    n.includes('obra')
  )
    return { Icon: Hammer, bg: 'bg-violet-50', fg: 'text-violet-600' };
  if (n.includes('cocina') || n.includes('kitchen'))
    return { Icon: Brush, bg: 'bg-rose-50', fg: 'text-rose-600' };
  if (n.includes('aire') || n.includes('air') || n.includes('vent'))
    return { Icon: Wind, bg: 'bg-teal-50', fg: 'text-teal-600' };
  return { Icon: Sparkles, bg: 'bg-blue-50', fg: 'text-blue-600' };
}

/**
 * Category grid in the marketplace style — labelled "Categorías" with
 * a "Ver todo" link, 4-up tiles each showing a circular icon block and
 * the service name underneath. Pulls the owner's real `service_types`
 * passed by the parent. Tapping a tile deep-links to the booking
 * form with that service pre-selected.
 */
export function ServiceCatalog({
  token,
  services,
}: {
  token: string;
  services: CatalogService[];
}) {
  if (services.length === 0) {
    return (
      <section className="mt-6">
        <h2 className="text-[13px] font-bold text-slate-900">Categorías</h2>
        <Link
          href={`/client/${token}/book`}
          className="mt-3 flex items-center gap-3 rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 p-4 transition hover:border-blue-300 hover:bg-blue-50/70"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-700">
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
      </section>
    );
  }

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-bold text-slate-900">Categorías</h2>
        <Link
          href={`/client/${token}/book`}
          className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-blue-700 hover:text-blue-800"
        >
          Ver todo <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2.5">
        {services.slice(0, 6).map((s) => {
          const { Icon, bg, fg } = iconFor(s.name);
          return (
            <Link
              key={s.id}
              href={`/client/${token}/book?service=${s.id}`}
              className="group flex flex-col items-center gap-2 rounded-2xl bg-white p-3 text-center ring-1 ring-inset ring-slate-100 transition hover:-translate-y-0.5 hover:ring-blue-200 hover:shadow-[0_8px_20px_-10px_rgba(37,99,235,0.35)]"
            >
              <span
                className={`grid h-12 w-12 place-items-center rounded-2xl ${bg} ${fg}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span
                className="line-clamp-2 text-[12px] font-semibold leading-tight text-slate-700 group-hover:text-blue-700"
                style={{ textWrap: 'balance' } as React.CSSProperties}
              >
                {s.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
