'use client';

import { useState, useTransition } from 'react';
import { Save } from 'lucide-react';

export type FieldSpec<T> = {
  key: keyof T & string;
  label: string;
  multiline?: boolean;
  hint?: string;
};

export function SimpleEditor<T extends Record<string, string>>({
  initial,
  fields,
  saveAction,
}: {
  initial: T;
  fields: FieldSpec<T>[];
  saveAction: (content: T) => Promise<void>;
}) {
  const [data, setData] = useState<T>(initial);
  const [saving, startSaving] = useTransition();
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-paper p-6 ring-1 ring-line">
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map((f) => (
            <label
              key={f.key}
              className={`block ${f.multiline ? 'sm:col-span-2' : ''}`}
            >
              <span className="text-[11px] font-medium text-graphite-3">
                {f.label}
              </span>
              {f.multiline ? (
                <textarea
                  rows={3}
                  value={data[f.key]}
                  onChange={(e) =>
                    setData({ ...data, [f.key]: e.target.value } as T)
                  }
                  className="mt-1 block w-full rounded-xl bg-white px-3 py-2 text-sm text-graphite-1 ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
              ) : (
                <input
                  type="text"
                  value={data[f.key]}
                  onChange={(e) =>
                    setData({ ...data, [f.key]: e.target.value } as T)
                  }
                  className="mt-1 block h-10 w-full rounded-xl bg-white px-3 text-sm text-graphite-1 ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
              )}
              {f.hint ? (
                <span className="mt-1 block text-[10px] text-graphite-4">
                  {f.hint}
                </span>
              ) : null}
            </label>
          ))}
        </div>
      </section>

      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-2xl bg-paper px-5 py-3 ring-1 ring-line shadow-[0_10px_40px_-20px_rgba(15,23,42,0.18)]">
        <p className="text-xs text-graphite-3">
          {savedAt
            ? `Guardado a las ${savedAt.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              })}.`
            : 'Los cambios se aplican al instante en el sitio público.'}
        </p>
        <button
          type="button"
          onClick={() =>
            startSaving(async () => {
              await saveAction(data);
              setSavedAt(new Date());
            })
          }
          disabled={saving}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.55)] transition hover:brightness-110 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
}
