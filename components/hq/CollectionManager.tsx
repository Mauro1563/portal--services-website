'use client';

import { useState, useTransition } from 'react';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { saveMarketingSection } from '@/app/hq/actions';

export type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'date' | 'tel' | 'email';

export type Field = {
  key: string;
  label: string;
  type?: FieldType;
  options?: { value: string; label: string }[];
  placeholder?: string;
  full?: boolean;
};

export type Item = Record<string, string> & { id: string };

function emptyItem(fields: Field[]): Item {
  const it: Record<string, string> = { id: crypto.randomUUID() };
  for (const f of fields) it[f.key] = '';
  return it as Item;
}

export function CollectionManager({
  section,
  initial,
  fields,
  columns,
  emptyLabel = 'Aún no hay registros.',
  addLabel = 'Añadir',
  renderBadge,
}: {
  section: string;
  initial: Item[];
  fields: Field[];
  columns: { key: string; label: string }[];
  emptyLabel?: string;
  addLabel?: string;
  renderBadge?: (item: Item) => { text: string; tone: string } | null;
}) {
  const [items, setItems] = useState<Item[]>(initial);
  const [editing, setEditing] = useState<Item | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, startSaving] = useTransition();
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const persist = (next: Item[]) =>
    startSaving(async () => {
      setItems(next);
      await saveMarketingSection(section, next);
      setSavedAt(new Date());
    });

  const openNew = () => {
    setEditing(emptyItem(fields));
    setIsNew(true);
  };
  const openEdit = (it: Item) => {
    setEditing({ ...it });
    setIsNew(false);
  };
  const remove = (id: string) => {
    if (!confirm('¿Eliminar este registro?')) return;
    persist(items.filter((i) => i.id !== id));
  };
  const submit = () => {
    if (!editing) return;
    const next = isNew
      ? [...items, editing]
      : items.map((i) => (i.id === editing.id ? editing : i));
    persist(next);
    setEditing(null);
  };

  const toneClass = (tone: string) =>
    ({
      emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
      amber: 'bg-amber-50 text-amber-700 ring-amber-200',
      brand: 'bg-cyan-50 text-brand-700 ring-cyan-200',
      rose: 'bg-rose-50 text-rose-700 ring-rose-200',
      slate: 'bg-slate-100 text-graphite-3 ring-line',
    })[tone] ?? 'bg-slate-100 text-graphite-3 ring-line';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-graphite-3">
          {savedAt
            ? `Guardado a las ${savedAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}.`
            : `${items.length} registro(s).`}
        </p>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.55)] transition hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> {addLabel}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-paper ring-1 ring-line">
        {items.length === 0 ? (
          <p className="p-8 text-center text-sm text-graphite-4">{emptyLabel}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                {columns.map((c) => (
                  <th key={c.key} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-graphite-4">
                    {c.label}
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((it) => {
                const badge = renderBadge?.(it);
                return (
                  <tr key={it.id} className="border-b border-line last:border-0">
                    {columns.map((c, ci) => (
                      <td key={c.key} className="px-4 py-3 text-graphite-2">
                        {ci === 0 && badge ? (
                          <span className="flex items-center gap-2">
                            <span className="font-medium text-graphite-1">{it[c.key]}</span>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${toneClass(badge.tone)}`}>
                              {badge.text}
                            </span>
                          </span>
                        ) : (
                          it[c.key] || <span className="text-graphite-4">—</span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(it)} className="rounded-lg p-1.5 text-graphite-3 hover:bg-slate-100 hover:text-brand-600" aria-label="Editar">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => remove(it.id)} className="rounded-lg p-1.5 text-graphite-3 hover:bg-rose-50 hover:text-rose-600" aria-label="Eliminar">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setEditing(null)}>
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-paper p-6 ring-1 ring-line" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-graphite-1">
                {isNew ? 'Nuevo registro' : 'Editar registro'}
              </h3>
              <button onClick={() => setEditing(null)} className="rounded-lg p-1.5 text-graphite-3 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <label key={f.key} className={`block ${f.full || f.type === 'textarea' ? 'sm:col-span-2' : ''}`}>
                  <span className="text-[11px] font-medium text-graphite-3">{f.label}</span>
                  {f.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={editing[f.key] ?? ''}
                      placeholder={f.placeholder}
                      onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                      className="mt-1 block w-full rounded-xl bg-white px-3 py-2 text-sm text-graphite-1 ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                    />
                  ) : f.type === 'select' ? (
                    <select
                      value={editing[f.key] ?? ''}
                      onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                      className="mt-1 block h-10 w-full rounded-xl bg-white px-3 text-sm text-graphite-1 ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                    >
                      <option value="">—</option>
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : f.type === 'email' ? 'email' : f.type === 'tel' ? 'tel' : 'text'}
                      value={editing[f.key] ?? ''}
                      placeholder={f.placeholder}
                      onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                      className="mt-1 block h-10 w-full rounded-xl bg-white px-3 text-sm text-graphite-1 ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                    />
                  )}
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="h-10 rounded-xl px-4 text-sm font-medium text-graphite-3 ring-1 ring-inset ring-line hover:bg-slate-50">
                Cancelar
              </button>
              <button
                onClick={submit}
                disabled={saving}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> {saving ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
