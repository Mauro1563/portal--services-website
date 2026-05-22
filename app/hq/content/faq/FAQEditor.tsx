'use client';

import { useState, useTransition } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';

export type FAQItem = { q: string; a: string };
export type FAQContent = { title: string; items: FAQItem[] };

export function FAQEditor({
  initial,
  saveAction,
}: {
  initial: FAQContent;
  saveAction: (content: FAQContent) => Promise<void>;
}) {
  const [data, setData] = useState(initial);
  const [saving, startSaving] = useTransition();
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-paper p-6 ring-1 ring-line">
        <label className="block">
          <span className="text-[11px] font-medium text-graphite-3">
            Título de la sección FAQ
          </span>
          <input
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="mt-1 h-10 w-full rounded-xl bg-white px-3 text-sm text-graphite-1 ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          />
        </label>
      </section>

      <section className="rounded-2xl bg-paper p-6 ring-1 ring-line">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-graphite-1">
            Preguntas ({data.items.length})
          </h2>
          <button
            type="button"
            onClick={() =>
              setData((d) => ({ ...d, items: [...d.items, { q: '', a: '' }] }))
            }
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-slate-100 px-3 text-xs font-medium text-graphite-1 hover:bg-slate-200"
          >
            <Plus className="h-3.5 w-3.5" /> Añadir pregunta
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {data.items.map((it, i) => (
            <div
              key={i}
              className="rounded-xl bg-slate-50 p-4 ring-1 ring-inset ring-line"
            >
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-100 text-[11px] font-bold text-brand-700">
                  {i + 1}
                </span>
                <div className="flex-1 space-y-3">
                  <label className="block">
                    <span className="text-[11px] font-medium text-graphite-3">
                      Pregunta
                    </span>
                    <input
                      value={it.q}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          items: d.items.map((x, j) =>
                            j === i ? { ...x, q: e.target.value } : x,
                          ),
                        }))
                      }
                      className="mt-1 h-10 w-full rounded-xl bg-white px-3 text-sm text-graphite-1 ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[11px] font-medium text-graphite-3">
                      Respuesta
                    </span>
                    <textarea
                      rows={3}
                      value={it.a}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          items: d.items.map((x, j) =>
                            j === i ? { ...x, a: e.target.value } : x,
                          ),
                        }))
                      }
                      className="mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm text-graphite-1 ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setData((d) => ({
                      ...d,
                      items: d.items.filter((_, j) => j !== i),
                    }))
                  }
                  aria-label="Eliminar"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-graphite-4 hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
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
