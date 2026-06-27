import { Camera, Star } from 'lucide-react';

/**
 * Horizontally-scrollable strip of recent-job photos shown on demo pages.
 * Uses public Unsplash hot-linked URLs (no auth required, no image config
 * needed — these are plain <img> tags so they bypass next/image domain
 * allow-listing). Purely visual: photos are decorative samples, not real
 * customer data.
 */
export type DemoPhoto = {
  src: string;
  label: string;
  meta?: string;
  rating?: number;
};

export const DEMO_PHOTOS: DemoPhoto[] = [
  {
    src: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&auto=format&fit=crop&q=70',
    label: 'Cocina · Apto 2A',
    meta: 'Limpieza profunda · 2h',
    rating: 5,
  },
  {
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=70',
    label: 'Sala · Casa Gómez',
    meta: 'Limpieza estándar · 1h 30m',
    rating: 5,
  },
  {
    src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&auto=format&fit=crop&q=70',
    label: 'Baño · Loft Diagonal',
    meta: 'Limpieza estándar · 45m',
    rating: 5,
  },
  {
    src: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&auto=format&fit=crop&q=70',
    label: 'Dormitorio · Studio',
    meta: 'Cambio de huésped · 1h',
    rating: 4,
  },
  {
    src: 'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=600&auto=format&fit=crop&q=70',
    label: 'Oficina · Coworking',
    meta: 'Limpieza fin de día · 1h',
    rating: 5,
  },
  {
    src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop&q=70',
    label: 'Cocina · Piso turístico',
    meta: 'Check-out Airbnb · 2h 15m',
    rating: 5,
  },
];

export function DemoPhotoStrip({
  title = 'Limpiezas recientes',
  caption = 'Fotos reales después del servicio — cargadas por el equipo desde la app del operario.',
  photos = DEMO_PHOTOS,
}: {
  title?: string;
  caption?: string;
  photos?: DemoPhoto[];
}) {
  return (
    <section className="mt-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-[13px] font-bold text-slate-900">
            {title}
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500">{caption}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-blue-700 ring-1 ring-inset ring-blue-100">
          <Camera className="h-2.5 w-2.5" />
          {photos.length}
        </span>
      </div>

      <div className="mt-3 -mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-3">
          {photos.map((p) => (
            <figure
              key={p.label}
              className="relative w-44 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-inset ring-slate-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.label}
                loading="lazy"
                className="h-28 w-full object-cover"
              />
              {typeof p.rating === 'number' ? (
                <div className="absolute right-2 top-2 inline-flex items-center gap-0.5 rounded-full bg-white/90 px-1.5 py-0.5 text-[9.5px] font-bold text-amber-600 shadow-sm backdrop-blur">
                  <Star className="h-2.5 w-2.5 fill-amber-400 stroke-amber-500" />
                  {p.rating.toFixed(1)}
                </div>
              ) : null}
              <figcaption className="px-2.5 py-2">
                <p className="truncate text-[11px] font-bold text-slate-900">
                  {p.label}
                </p>
                {p.meta ? (
                  <p className="mt-0.5 truncate text-[10px] text-slate-500">
                    {p.meta}
                  </p>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
