/**
 * Reusable image lightbox with prev/next arrows and keyboard support
 * (← → to step, Esc to close). Used across the client + cleaner
 * preview portals so photo galleries feel real.
 */
'use client';

import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export type LightboxPhoto = {
  src: string;
  label?: string;
};

export function DemoLightbox({
  photos,
  index,
  onClose,
  onChange,
  onDelete,
}: {
  photos: LightboxPhoto[];
  index: number | null;
  onClose: () => void;
  onChange: (next: number) => void;
  onDelete?: (idx: number) => void;
}) {
  useEffect(() => {
    if (index === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && photos.length > 1) {
        onChange((index! - 1 + photos.length) % photos.length);
      }
      if (e.key === 'ArrowRight' && photos.length > 1) {
        onChange((index! + 1) % photos.length);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, onClose, onChange, photos.length]);

  if (index === null || !photos[index]) return null;
  const current = photos[index];
  const prev = () => onChange((index - 1 + photos.length) % photos.length);
  const next = () => onChange((index + 1) % photos.length);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        title="Cerrar"
        onClick={onClose}
        className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            title="Anterior"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            title="Siguiente"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <div
        className="flex max-h-full max-w-md flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.src}
          alt={current.label ?? ''}
          className="max-h-[70vh] w-full rounded-2xl object-contain"
        />
        <p className="text-center text-xs font-bold uppercase tracking-wider text-white/80">
          {current.label ? `${current.label} · ` : ''}
          {index + 1} / {photos.length}
        </p>
        {photos.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {photos.map((p, i) => (
              <button
                key={`${p.src}-${i}`}
                type="button"
                onClick={() => onChange(i)}
                title={`Ver ${p.label ?? i + 1}`}
                className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg ring-2 ${
                  i === index ? 'ring-white' : 'ring-transparent opacity-60'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt={p.label ?? ''}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(index)}
            title="Eliminar esta foto de la galería"
            className="self-center rounded-full bg-rose-600/90 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-rose-700"
          >
            Eliminar foto
          </button>
        )}
      </div>
    </div>
  );
}
