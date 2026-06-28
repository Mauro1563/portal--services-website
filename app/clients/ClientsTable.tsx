'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, SearchX } from 'lucide-react';

export type ClientRow = {
  id: string;
  name: string;
  email: string | null;
  propertyCount: number;
  lastTaskAt: string | null;
};

/**
 * In-memory filtered table for the Zapli admin shell clients page. The
 * server hands us the full list (RLS already scoped to the owner) and we
 * just narrow it locally so the search feels instant — no extra round trips.
 */
export function ClientsTable({ clients }: { clients: ClientRow[] }) {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return clients;
    return clients.filter((c) => {
      return (
        c.name.toLowerCase().includes(needle) ||
        (c.email ?? '').toLowerCase().includes(needle)
      );
    });
  }, [clients, q]);

  const fmtDate = (iso: string | null) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre o email…"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
          />
        </div>
        <span className="hidden shrink-0 text-xs text-slate-500 sm:block">
          {filtered.length} de {clients.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-5 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
          <SearchX className="h-6 w-6 text-slate-400" aria-hidden />
          <p className="text-sm font-medium text-slate-700">Sin resultados</p>
          <p className="text-xs text-slate-500">
            {q
              ? `No encontramos clientes que coincidan con "${q}".`
              : 'Aún no hay clientes. Crea el primero para empezar.'}
          </p>
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Nombre</th>
                <th className="hidden px-4 py-3 sm:table-cell">Email</th>
                <th className="px-4 py-3 text-right">Propiedades</th>
                <th className="hidden px-4 py-3 text-right md:table-cell">
                  Última tarea
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/owner/clients/${c.id}`}
                      className="font-medium text-slate-900 hover:text-cyan-700"
                    >
                      {c.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-slate-500 sm:hidden">
                      {c.email ?? '—'}
                    </p>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">
                    {c.email ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                    {c.propertyCount}
                  </td>
                  <td className="hidden px-4 py-3 text-right text-slate-600 md:table-cell">
                    {fmtDate(c.lastTaskAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
