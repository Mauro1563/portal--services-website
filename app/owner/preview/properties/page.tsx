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
  Pencil,
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
  /** Hourly rate charged to the client for cleaning this property, in £. */
  chargePerHour: number;
};

const initialProperties: Property[] = [
  {
    id: '1',
    name: 'Soho Loft',
    address: '22 Old Compton St, Soho, London W1D 4TR',
    mapsQuery: '22+Old+Compton+St+London',
    beds: 2, baths: 2, area: 65, guests: 4, platform: 'airbnb', cleanings: 24,
    photo: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&auto=format&fit=crop&q=70',
    chargePerHour: 26,
  },
  {
    id: '2',
    name: 'Camden House',
    address: '47 Camden High St, London NW1 0LT',
    mapsQuery: '47+Camden+High+St+London',
    beds: 4, baths: 3, area: 180, guests: 8, platform: 'direct', cleanings: 12,
    photo: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop&q=70',
    chargePerHour: 28,
  },
  {
    id: '3',
    name: 'Notting Hill Flat',
    address: '12 Portobello Rd, London W11 2DZ',
    mapsQuery: '12+Portobello+Rd+London',
    beds: 1, baths: 1, area: 45, guests: 2, platform: 'booking', cleanings: 18,
    photo: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&auto=format&fit=crop&q=70',
    chargePerHour: 25,
  },
  {
    id: '4',
    name: 'Mayfair Studio',
    address: '8 Berkeley St, Mayfair, London W1J 8DY',
    mapsQuery: '8+Berkeley+St+Mayfair+London',
    beds: 0, baths: 1, area: 32, guests: 2, platform: 'airbnb', cleanings: 30,
    photo: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=70',
    chargePerHour: 24,
  },
  {
    id: '5',
    name: 'Shoreditch Penthouse',
    address: '31 Curtain Rd, Shoreditch, London EC2A 3LT',
    mapsQuery: '31+Curtain+Rd+Shoreditch+London',
    beds: 3, baths: 2, area: 110, guests: 6, platform: 'airbnb', cleanings: 22,
    photo: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=70',
    chargePerHour: 30,
  },
  {
    id: '6',
    name: 'Hackney Studio',
    address: '78 Mare St, Hackney, London E8 4RT',
    mapsQuery: '78+Mare+St+Hackney+London',
    beds: 1, baths: 1, area: 38, guests: 2, platform: 'booking', cleanings: 16,
    photo: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=70',
    chargePerHour: 24,
  },
];

const platformChip: Record<Property['platform'], string> = {
  airbnb: 'bg-rose-100 text-rose-700',
  booking: 'bg-blue-100 text-blue-700',
  direct: 'bg-emerald-100 text-emerald-700',
};

type PlatformFilter = Property['platform'] | 'all';

export default function OwnerPropertiesPreview() {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState<PlatformFilter>('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const [rateId, setRateId] = useState<string | null>(null);
  const [rateDraft, setRateDraft] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newBeds, setNewBeds] = useState('2');
  const [newBaths, setNewBaths] = useState('1');
  const [newArea, setNewArea] = useState('50');
  const [newPlatform, setNewPlatform] = useState<Property['platform']>('direct');
  const [toast, setToast] = useState<string | null>(null);

  function showToast(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(null), 1800);
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return properties.filter((p) => {
      if (platform !== 'all' && p.platform !== platform) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
      );
    });
  }, [properties, query, platform]);

  function addProperty() {
    if (!newName.trim() || !newAddress.trim()) return;
    setProperties((prev) => [
      ...prev,
      {
        id: `new-${prev.length + 1}`,
        name: newName.trim(),
        address: newAddress.trim(),
        mapsQuery: encodeURIComponent(newAddress.trim()).replace(/%20/g, '+'),
        beds: Number(newBeds) || 0,
        baths: Number(newBaths) || 1,
        area: Number(newArea) || 50,
        guests: (Number(newBeds) || 0) * 2 || 2,
        platform: newPlatform,
        cleanings: 0,
        photo: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=70',
        chargePerHour: 25,
      },
    ]);
    setNewName('');
    setNewAddress('');
    setNewBeds('2');
    setNewBaths('1');
    setNewArea('50');
    setNewPlatform('direct');
    setShowNewForm(false);
    showToast('Propiedad añadida');
  }

  const rateProperty = properties.find((p) => p.id === rateId);

  function openRateSheet(p: Property) {
    setRateId(p.id);
    setRateDraft(String(p.chargePerHour));
  }

  function saveRate() {
    if (!rateId) return;
    const n = Number(rateDraft);
    if (!Number.isFinite(n) || n < 0) return;
    const rounded = Math.round(n * 100) / 100;
    setProperties((prev) =>
      prev.map((p) => (p.id === rateId ? { ...p, chargePerHour: rounded } : p)),
    );
    setRateId(null);
    showToast(`Tarifa actualizada a £${rounded}/h`);
  }

  function deleteProperty(id: string) {
    if (!confirm('¿Eliminar esta propiedad?')) return;
    setProperties((prev) => prev.filter((p) => p.id !== id));
    if (openId === id) setOpenId(null);
    showToast('Propiedad eliminada');
  }

  const platformPill = (active: boolean) =>
    `h-8 rounded-full px-3 text-[11px] font-semibold transition ${
      active
        ? 'bg-blue-600 text-white shadow-sm'
        : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
    }`;

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
              <input
                type="number"
                min={0}
                value={newBeds}
                onChange={(e) => setNewBeds(e.target.value)}
                placeholder="Dormitorios"
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
              />
              <input
                type="number"
                min={1}
                value={newBaths}
                onChange={(e) => setNewBaths(e.target.value)}
                placeholder="Baños"
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
              />
              <input
                type="number"
                min={1}
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                placeholder="m²"
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
              />
              <select
                value={newPlatform}
                onChange={(e) =>
                  setNewPlatform(e.target.value as Property['platform'])
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="direct">Directo</option>
                <option value="airbnb">Airbnb</option>
                <option value="booking">Booking</option>
              </select>
            </div>
            {(!newName.trim() || !newAddress.trim()) ? (
              <p className="mt-2 text-[10.5px] text-rose-600">
                Nombre y dirección son obligatorios.
              </p>
            ) : null}
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

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPlatform('all')}
            title="Mostrar propiedades de cualquier plataforma"
            className={platformPill(platform === 'all')}
          >
            Todas
          </button>
          <button
            type="button"
            onClick={() => setPlatform('airbnb')}
            title="Filtrar sólo propiedades publicadas en Airbnb"
            className={platformPill(platform === 'airbnb')}
          >
            Airbnb
          </button>
          <button
            type="button"
            onClick={() => setPlatform('booking')}
            title="Filtrar sólo propiedades publicadas en Booking.com"
            className={platformPill(platform === 'booking')}
          >
            Booking
          </button>
          <button
            type="button"
            onClick={() => setPlatform('direct')}
            title="Filtrar sólo reservas directas"
            className={platformPill(platform === 'direct')}
          >
            Direct
          </button>
          <span className="ml-auto text-[11px] text-slate-500">
            {visible.length} resultado{visible.length === 1 ? '' : 's'}
          </span>
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
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100">
                      Tarifa £{p.chargePerHour}/h al cliente
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openRateSheet(p);
                        }}
                        title={`Editar la tarifa que cobras al cliente por ${p.name}`}
                        aria-label={`Editar tarifa de ${p.name}`}
                        className="ml-0.5 rounded p-0.5 text-blue-700 hover:bg-blue-100"
                      >
                        <Pencil className="h-2.5 w-2.5" />
                      </button>
                    </div>
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
                        href={`/owner/preview/tasks?property=${encodeURIComponent(p.name)}`}
                        title={`Ver las limpiezas programadas para ${p.name}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
                      >
                        <Camera className="h-3 w-3" /> Ver limpiezas
                      </Link>
                      <button
                        type="button"
                        onClick={() => deleteProperty(p.id)}
                        title="Eliminar esta propiedad del panel"
                        className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50"
                      >
                        Eliminar
                      </button>
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

      {/* Edit charge-rate sheet */}
      {rateProperty ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <div className="w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Tarifa de {rateProperty.name}
                </p>
                <p className="text-[11px] text-slate-500">
                  Lo que cobras al cliente por hora de limpieza.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRateId(null)}
                aria-label="Cerrar"
                className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveRate();
              }}
              className="space-y-3 p-4"
            >
              <label className="block text-xs font-semibold text-slate-700">
                Tarifa por hora (£)
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm text-slate-500">£</span>
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={rateDraft}
                    onChange={(e) => setRateDraft(e.target.value)}
                    autoFocus
                    className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm tabular-nums"
                  />
                  <span className="text-xs text-slate-400">/h</span>
                </div>
              </label>
              <p className="text-[10.5px] text-slate-500">
                Sólo afecta a esta propiedad. El pago del cleaner se gestiona
                desde Cleaners.
              </p>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Guardar tarifa
                </button>
                <button
                  type="button"
                  onClick={() => setRateId(null)}
                  className="flex-1 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="pointer-events-none fixed bottom-20 left-1/2 z-50 -translate-x-1/2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg">
            ✓ {toast}
          </div>
        </div>
      ) : null}

      <DemoBottomTabBar active="properties" />
    </main>
  );
}
