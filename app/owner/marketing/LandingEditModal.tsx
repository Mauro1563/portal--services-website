'use client';

import { useState } from 'react';
import { ImageIcon, Pencil, X } from 'lucide-react';
import { useClientLocale, pickCopy } from '@/lib/use-locale-client';

const COPY = {
  en: { save: 'Save', saved: 'Saved' },
  es: { save: 'Guardar', saved: 'Guardado' },
  pt: { save: 'Guardar', saved: 'Guardado' },
} as const;

type ModalKind = 'text' | 'photo';

export function LandingEditButtons() {
  const t = pickCopy(COPY, useClientLocale());
  const [open, setOpen] = useState<ModalKind | null>(null);
  const [saved, setSaved] = useState(false);

  function close() {
    setOpen(null);
    setSaved(false);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to owner_profiles update (about / business_logo_url).
    setSaved(true);
    setTimeout(close, 900);
  }

  return (
    <>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setOpen('text')}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-surface-2 bg-surface-0 px-4 text-sm font-medium text-text-1 hover:bg-surface-1"
        >
          <Pencil className="h-4 w-4 text-brand-600" /> Editar texto
        </button>
        <button
          type="button"
          onClick={() => setOpen('photo')}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-surface-2 bg-surface-0 px-4 text-sm font-medium text-text-1 hover:bg-surface-1"
        >
          <ImageIcon className="h-4 w-4 text-brand-600" /> Cambiar foto destacada
        </button>
      </div>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
          onClick={close}
        >
          <div
            className="w-full max-w-md rounded-t-2xl bg-surface-0 p-5 shadow-card-lg sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-base font-semibold text-text-1">
                {open === 'text' ? 'Editar texto de la landing' : 'Cambiar foto destacada'}
              </h3>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar"
                className="-mr-1 -mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-text-3 hover:bg-surface-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={save} className="mt-4 space-y-3">
              {open === 'text' ? (
                <>
                  <label className="block">
                    <span className="text-xs font-medium text-text-2">Encabezado</span>
                    <input
                      type="text"
                      defaultValue="Reserva tu limpieza en 30 segundos"
                      className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-text-2">Sobre nosotros</span>
                    <textarea
                      rows={4}
                      defaultValue="Equipo profesional, productos eco-friendly y resultados visibles desde la primera visita."
                      className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                    />
                  </label>
                </>
              ) : (
                <label className="block">
                  <span className="text-xs font-medium text-text-2">Subir nueva foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1.5 block w-full rounded-xl border border-dashed border-surface-2 bg-surface-1 px-3.5 py-6 text-xs text-text-2"
                  />
                  <span className="mt-1 block text-[11px] text-text-3">
                    Recomendado: 1600×900px, menos de 2 MB.
                  </span>
                </label>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-surface-2 bg-surface-0 px-4 text-sm font-medium text-text-2 hover:bg-surface-1"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white shadow-card hover:bg-brand-700"
                >
                  {saved ? t.saved : t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
