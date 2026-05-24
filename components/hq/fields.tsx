'use client';

import { Plus, Trash2 } from 'lucide-react';

export const inputCls =
  'mt-1 h-10 w-full rounded-xl bg-white px-3 text-sm text-graphite-1 ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40';
export const areaCls =
  'mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm text-graphite-1 ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40';

export type Spec = { key: string; label: string; full?: boolean; area?: boolean };

/** Edits a flat object of string fields against a schema. */
export function FieldGrid({
  schema,
  value,
  onChange,
}: {
  schema: Spec[];
  value: Record<string, unknown>;
  onChange: (key: string, v: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {schema.map((f) => (
        <label key={f.key} className={`block ${f.full || f.area ? 'sm:col-span-2' : ''}`}>
          <span className="text-[11px] font-medium text-graphite-3">{f.label}</span>
          {f.area ? (
            <textarea rows={2} value={String(value[f.key] ?? '')} onChange={(e) => onChange(f.key, e.target.value)} className={areaCls} />
          ) : (
            <input value={String(value[f.key] ?? '')} onChange={(e) => onChange(f.key, e.target.value)} className={inputCls} />
          )}
        </label>
      ))}
    </div>
  );
}

/** Edits an array of objects, each with the same field schema. Add/remove. */
export function ListEditor({
  items,
  schema,
  onChange,
  addLabel = 'Añadir',
  blank,
}: {
  items: Record<string, unknown>[];
  schema: Spec[];
  onChange: (next: Record<string, unknown>[]) => void;
  addLabel?: string;
  blank: () => Record<string, unknown>;
}) {
  const set = (i: number, key: string, v: string) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, [key]: v } : it)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="rounded-xl bg-slate-50 p-4 ring-1 ring-inset ring-line">
          <div className="grid gap-3 sm:grid-cols-2">
            {schema.map((f) => (
              <label key={f.key} className={`block ${f.full || f.area ? 'sm:col-span-2' : ''}`}>
                <span className="text-[11px] text-graphite-3">{f.label}</span>
                {f.area ? (
                  <textarea rows={2} value={String(it[f.key] ?? '')} onChange={(e) => set(i, f.key, e.target.value)} className={areaCls} />
                ) : (
                  <input value={String(it[f.key] ?? '')} onChange={(e) => set(i, f.key, e.target.value)} className={inputCls} />
                )}
              </label>
            ))}
          </div>
          <div className="mt-2 flex justify-end">
            <button onClick={() => remove(i)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-graphite-3 hover:bg-rose-50 hover:text-rose-600">
              <Trash2 className="h-3.5 w-3.5" /> Quitar
            </button>
          </div>
        </div>
      ))}
      <button onClick={() => onChange([...items, blank()])} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-brand-600 ring-1 ring-inset ring-line hover:bg-slate-50">
        <Plus className="h-3.5 w-3.5" /> {addLabel}
      </button>
    </div>
  );
}

/** Edits an array of plain strings (one row each). */
export function StringListEditor({
  items,
  onChange,
  addLabel = 'Añadir',
}: {
  items: string[];
  onChange: (next: string[]) => void;
  addLabel?: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <input value={s} onChange={(e) => onChange(items.map((x, idx) => (idx === i ? e.target.value : x)))} className="h-10 w-full rounded-xl bg-white px-3 text-sm ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
          <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="shrink-0 rounded-lg p-2 text-graphite-3 hover:bg-rose-50 hover:text-rose-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...items, ''])} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-brand-600 ring-1 ring-inset ring-line hover:bg-slate-50">
        <Plus className="h-3.5 w-3.5" /> {addLabel}
      </button>
    </div>
  );
}
