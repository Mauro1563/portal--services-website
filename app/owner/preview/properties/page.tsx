/**
 * Public preview: Owner → Properties list + detail. Mocked data.
 */
import Link from 'next/link';
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  ChevronRight,
  MapPin,
  Plus,
  Ruler,
  Search,
  Users,
} from 'lucide-react';

export const metadata = {
  title: 'Preview · Owner Properties',
  robots: { index: false, follow: false },
};

const properties = [
  { id: '1', name: 'Apto Centro 4B', address: 'Calle Mayor 12, Madrid', beds: 2, baths: 2, area: 65, guests: 4, platform: 'airbnb', cleanings: 24 },
  { id: '2', name: 'Casa Sol', address: 'Av. del Parque 8, Madrid', beds: 4, baths: 3, area: 180, guests: 8, platform: 'direct', cleanings: 12 },
  { id: '3', name: 'Loft Goya', address: 'Calle Goya 22, Madrid', beds: 1, baths: 1, area: 45, guests: 2, platform: 'booking', cleanings: 18 },
  { id: '4', name: 'Estudio Salamanca', address: 'Velázquez 45, Madrid', beds: 0, baths: 1, area: 32, guests: 2, platform: 'airbnb', cleanings: 30 },
];

const platformChip: Record<string, string> = {
  airbnb: 'bg-rose-100 text-rose-700',
  booking: 'bg-blue-100 text-blue-700',
  direct: 'bg-emerald-100 text-emerald-700',
};

export default function OwnerPropertiesPreview() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-5">
          <Link href="/owner/preview" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> Owner Dashboard
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Preview · Properties</span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Properties</h1>
            <p className="mt-1 text-sm text-slate-500">{properties.length} sitios bajo gestión.</p>
          </div>
          <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.5)]">
            <Plus className="h-4 w-4" /> Nueva propiedad
          </button>
        </div>

        <div className="mt-5 relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar propiedad…"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {properties.map((p) => (
            <article
              key={p.id}
              className="group relative flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 text-blue-700 ring-1 ring-blue-100">
                <Building2 className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">{p.name}</h3>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${platformChip[p.platform]}`}>
                    {p.platform}
                  </span>
                </div>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="h-3 w-3" /> {p.address}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-600">
                  <span className="inline-flex items-center gap-1"><BedDouble className="h-3 w-3" /> {p.beds}</span>
                  <span className="inline-flex items-center gap-1"><Bath className="h-3 w-3" /> {p.baths}</span>
                  <span className="inline-flex items-center gap-1"><Ruler className="h-3 w-3" /> {p.area}m²</span>
                  <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {p.guests}</span>
                </div>
                <p className="mt-2 text-[11px] text-slate-400">{p.cleanings} limpiezas este mes</p>
              </div>
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-slate-500" />
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
