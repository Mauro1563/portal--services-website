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
function iconFor(name: string): { Icon: typeof Sparkles } {
  // Color-coded tile chrome killed per design brief — all category icons render
  // on the same paper-on-clay surface; only the glyph shape distinguishes
  // them. State / identity comes from copy, not chroma.
  const n = name.toLowerCase();
  if (n.includes('mudanza') || n.includes('move')) return { Icon: Box };
  if (n.includes('vidrio') || n.includes('window') || n.includes('cristal'))
    return { Icon: SquareDashedBottom };
  if (
    n.includes('profunda') ||
    n.includes('deep') ||
    n.includes('post') ||
    n.includes('obra')
  )
    return { Icon: Hammer };
  if (n.includes('cocina') || n.includes('kitchen')) return { Icon: Brush };
  if (n.includes('aire') || n.includes('air') || n.includes('vent'))
    return { Icon: Wind };
  return { Icon: Sparkles };
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
      <section className="mt-8">
        <h2 className="ps-serif text-[28px] leading-[0.95] tracking-[-0.03em] text-[#141414]">
          Categorías
        </h2>
        <Link
          href={`/client/${token}/book`}
          className="mt-4 flex items-center gap-3 rounded-[12px] border border-dashed border-[#1414141A] bg-[#E4DACA] p-5 transition hover:border-[#FF5B1F]"
          style={{ transitionDuration: '160ms' }}
        >
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] border border-[#1414141A] text-[#141414]"
            style={{ backgroundColor: '#F4EFE6' }}
          >
            <Plus className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-[#141414]">
              Pide tu primer servicio
            </p>
            <p className="ps-mono mt-1 text-[11px] text-[#54524D]">
              tu equipo aún no publicó precios — abre el chat y avísales.
            </p>
          </div>
        </Link>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="flex items-end justify-between">
        <h2 className="ps-serif text-[28px] leading-[0.95] tracking-[-0.03em] text-[#141414]">
          Categorías
        </h2>
        <Link
          href={`/client/${token}/book`}
          className="ps-mono inline-flex items-center gap-0.5 text-[12px] text-[#141414]"
        >
          <span
            style={{
              backgroundImage: 'linear-gradient(#FF5B1F, #FF5B1F)',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100% 1px',
              backgroundPosition: '0 calc(100% + 3px)',
              paddingBottom: '3px',
            }}
          >
            ver todo
          </span>
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {services.slice(0, 6).map((s) => {
          const { Icon } = iconFor(s.name);
          return (
            <Link
              key={s.id}
              href={`/client/${token}/book?service=${s.id}`}
              className="ps-set group flex flex-col items-center gap-2 rounded-[12px] border border-[#1414141A] bg-[#E4DACA] p-4 text-center transition hover:bg-[#141414] hover:text-[#F4EFE6]"
              style={{ transitionDuration: '160ms' }}
            >
              <span
                className="grid h-12 w-12 place-items-center rounded-[12px] border border-[#1414141A] text-[#141414] group-hover:border-[#F4EFE6]/30 group-hover:bg-[#F4EFE6] group-hover:text-[#141414]"
                style={{ backgroundColor: '#F4EFE6' }}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span
                className="line-clamp-2 text-[12px] font-semibold leading-tight text-[#141414] group-hover:text-[#F4EFE6]"
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
