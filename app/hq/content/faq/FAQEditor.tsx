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
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <label className="block">
          <span className="text-[11px] font-medium text-slate-400">
            Título de la sección FAQ
          </span>
          <input
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="mt-1 h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-white focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          />
        </label>
      </section>

      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-white">
            Preguntas ({data.items.length})
          </h2>
          <button
            type="button"
            onClick={() =>
              setData((d) => ({ ...d, items: [...d.items, { q: '', a: '' }] }))
            }
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-white/[0.06] px-3 text-xs font-medium text-white hover:bg-white/[0.12]"
          >
            <Plus className="h-3.5 w-3.5" /> Añadir pregunta
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {data.items.map((it, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4"
            >
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-[11px] font-bold text-cyan-200">
                  {i + 1}
                </span>
                <div className="flex-1 space-y-3">
                  <label className="block">
                    <span className="text-[11px] font-medium text-slate-400">
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
                      className="mt-1 h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-white focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[11px] font-medium text-slate-400">
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
                      className="mt-1 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
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
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-rose-500/10 hover:text-rose-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-ink-0/85 px-5 py-3 backdrop-blur-xl">
        <p className="text-xs text-slate-400">
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
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 text-sm font-semibold text-white shadow-[0_8px_30px_-10px_rgba(56,189,248,0.6)] transition hover:brightness-110 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
}
