import Link from 'next/link';
import { Box, Hammer, Sparkles, SquareDashedBottom } from 'lucide-react';

type Service = {
  key: 'regular' | 'profunda' | 'vidrios' | 'mudanza';
  label: string;
  Icon: typeof Sparkles;
  bg: string;
  fg: string;
};

const SERVICES: Service[] = [
  {
    key: 'regular',
    label: 'Limpieza Regular',
    Icon: Sparkles,
    bg: 'bg-emerald-50',
    fg: 'text-emerald-700',
  },
  {
    key: 'profunda',
    label: 'Profunda',
    Icon: Hammer,
    bg: 'bg-teal-50',
    fg: 'text-teal-700',
  },
  {
    key: 'vidrios',
    label: 'Vidrios',
    Icon: SquareDashedBottom,
    bg: 'bg-sky-50',
    fg: 'text-sky-700',
  },
  {
    key: 'mudanza',
    label: 'Mudanza',
    Icon: Box,
    bg: 'bg-amber-50',
    fg: 'text-amber-700',
  },
];

/**
 * 4-up service catalog tiles per the Eco-Friendly mockup. Each tile
 * links to /messages with the service name pre-filled in `?prefill=` so
 * the client can fire off a request to their owner without retyping.
 * Real booking would need a dedicated booking flow + service-types table.
 */
export function ServiceCatalog({ token }: { token: string }) {
  return (
    <section className="mt-6">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
        Servicios disponibles
      </h2>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {SERVICES.map(({ key, label, Icon, bg, fg }) => (
          <Link
            key={key}
            href={`/client/${token}/messages?prefill=${encodeURIComponent(
              `Hola, me gustaría reservar una ${label}.`,
            )}`}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 text-center transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-[0_8px_24px_-12px_rgba(5,150,105,0.4)]"
          >
            <span
              className={`grid h-11 w-11 place-items-center rounded-2xl ${bg} ${fg}`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <span className="line-clamp-2 text-[10.5px] font-semibold leading-tight text-slate-700 group-hover:text-emerald-700">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
