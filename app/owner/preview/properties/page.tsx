/**
 * Public preview: Owner → Properties list. Mocked data.
 * Interactive: search filter + expandable details panel per property.
 */
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  Camera,
  ChevronDown,
  ChevronRight,
  Info,
  MapPin,
  Plus,
  Ruler,
  Search,
  Users,
  X,
} from 'lucide-react';
import { DemoBottomTabBar } from '../_components/DemoBottomTabBar';

type Property = {
  id: string;
  name: string;
  address: string;
  mapsQuery: string;
  beds: number;
  baths: number;
  area: number;
  guests: number;
  platform: 'airbnb' | 'booking' | 'direct';
  cleanings: number;
  photo: string;
};

const initialProperties: Property[] = [
  {
    id: '1',
    name: 'Soho Loft',
    address: '22 Old Compton St, Soho, London W1D 4TR',
    mapsQuery: '22+Old+Compton+St+London',
    beds: 2, baths: 2, area: 65, guests: 4, platform: 'airbnb', cleanings: 24,
    photo: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&auto=format&fit=crop&q=70',
  },
  {
    id: '2',
    name: 'Camden House',
    address: '47 Camden High St, London NW1 0LT',
    mapsQuery: '47+Camden+High+St+London',
    beds: 4, baths: 3, area: 180, guests: 8, platform: 'direct', cleanings: 12,
    photo: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop&q=70',
  },
  {
    id: '3',
    name: 'Notting Hill Flat',
    address: '12 Portobello Rd, London W11 2DZ',
    mapsQuery: '12+Portobello+Rd+London',
    beds: 1, baths: 1, area: 45, guests: 2, platform: 'booking', cleanings: 18,
    photo: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&auto=format&fit=crop&q=70',
  },
  {
    id: '4',
    name: 'Mayfair Studio',
    address: '8 Berkeley St, Mayfair, London W1J 8DY',
    mapsQuery: '8+Berkeley+St+Mayfair+London',
    beds: 0, baths: 1, area: 32, guests: 2, platform: 'airbnb', cleanings: 30,
    photo: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=70',
  },
  {
    id: '5',
    name: 'Shoreditch Penthouse',
    address: '31 Curtain Rd, Shoreditch, London EC2A 3LT',
    mapsQuery: '31+Curtain+Rd+Shoreditch+London',
    beds: 3, baths: 2, area: 110, guests: 6, platform: 'airbnb', cleanings: 22,
    photo: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=70',
  },
  {
    id: '6',
    name: 'Hackney Studio',
    address: '78 Mare St, Hackney, London E8 4RT',
    mapsQuery: '78+Mare+St+Hackney+London',
    beds: 1, baths: 1, area: 38, guests: 2, platform: 'booking', cleanings: 16,
    photo: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=70',
  },
];

const platformChip: Record<Property['platform'], string> = {
  airbnb: 'bg-rose-100 text-rose-700',
  booking: 'bg-blue-100 text-blue-700',
  direct: 'bg-emerald-100 text-emerald-700',
};

export default function OwnerPropertiesPreview() {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return properties;
    return properties.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q),
    );
  }, [properties, query]);

  function addProperty() {
    if (!newName.trim() || !newAddress.trim()) return;
    setProperties((prev) => [
      ...prev,
      {
        id: `new-${prev.length + 1}`,
        name: newName.trim(),
        address: newAddress.trim(),
        mapsQuery: encodeURIComponent(newAddress.trim()).replace(/%20/g, '+'),
        beds: 2, baths: 1, area: 50, guests: 2,
        platform: 'direct',
        cleanings: 0,
        photo: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=70',
      },
    ]);
    setNewName('');
    setNewAddress('');
    setShowNewForm(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-5">
          <Link
            href="/owner/preview"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Demo · Propiedades
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Propiedades
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {properties.length} sitios bajo gestión.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNewForm((s) => !s)}
            title="Añadir una propiedad nueva al panel"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.5)]"
          >
            <Plus className="h-4 w-4" /> Nueva propiedad
          </button>
        </div>

        {showNewForm ? (
          <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50/40 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Añadir propiedad
              </h3>
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                aria-label="Cerrar"
                className="rounded-full p-1 text-slate-500 hover:bg-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nombre (ej. Mayfair Townhouse)"
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
              />
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="5 Bond St, Mayfair, London W1S 1SF"
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
              />
            </div>
            <button
              type="button"
              onClick={addProperty}
              className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Guardar propiedad
            </button>
          </div>
        ) : null}

        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar propiedad…"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-slate-500">
          <Info className="h-3 w-3" /> Toca cualquier propiedad para ver fotos
          y datos. Toda la información es editable desde aquí.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {visible.map((p) => {
            const isOpen = openId === p.id;
            return (
              <div
                key={p.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-300"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : p.id)}
                  title="Mostrar fotos y detalles de esta propiedad"
                  className="group relative flex w-full items-start gap-4 p-4 text-left"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 text-blue-700 ring-1 ring-blue-100">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-slate-900">{p.name}</h3>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${platformChip[p.platform]}`}
                      >
                        {p.platform}
                      </span>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3 w-3" /> {p.address}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <BedDouble className="h-3 w-3" /> {p.beds}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Bath className="h-3 w-3" /> {p.baths}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Ruler className="h-3 w-3" /> {p.area}m²
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3 w-3" /> {p.guests}
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] text-slate-400">
                      {p.cleanings} limpiezas este mes
                    </p>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-blue-500" />
                  ) : (
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 group-hover:text-slate-500" />
                  )}
                </button>

                {isOpen ? (
                  <div className="border-t border-slate-100 bg-slate-50/40 p-4">
                    <img
                      src={p.photo}
                      alt={p.name}
                      loading="lazy"
                      className="h-40 w-full rounded-xl object-cover"
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href={`https://maps.google.com/?q=${p.mapsQuery}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Abrir la ubicación en Google Maps"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-200 hover:bg-blue-50"
                      >
                        <MapPin className="h-3 w-3" /> Ver en mapa
                      </a>
                      <Link
                        href="/owner/preview/tasks"
                        title="Ver las limpiezas programadas para esta propiedad"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
                      >
                        <Camera className="h-3 w-3" /> Ver limpiezas
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {visible.length === 0 ? (
          <p className="mt-6 text-center text-sm text-slate-500">
            Sin resultados para “{query}”.
          </p>
        ) : null}
      </div>

      <DemoBottomTabBar active="properties" />
    </main>
  );
}
