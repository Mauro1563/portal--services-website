/**
 * Tiny shared bottom-sheet / modal used across the preview demos.
 * Click outside or press Escape to dismiss. Mobile-friendly: anchors
 * to the bottom on small screens, centers on desktop.
 */
'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

export function DemoSheet({
  open,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidth} rounded-t-3xl bg-white p-5 shadow-xl sm:rounded-3xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200 sm:hidden" />
        <button
          type="button"
          onClick={onClose}
          title="Cerrar"
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
        >
          <X className="h-4 w-4" />
        </button>
        {title && (
          <h3 className="pr-8 font-display text-lg font-bold text-slate-900">
            {title}
          </h3>
        )}
        <div className={title ? 'mt-3' : ''}>{children}</div>
      </div>
    </div>
  );
}

export function DemoConfirm({
  open,
  onCancel,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'danger',
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'primary';
}) {
  return (
    <DemoSheet open={open} onClose={onCancel} maxWidth="max-w-sm">
      <h3 className="font-display text-base font-bold text-slate-900">{title}</h3>
      {description && (
        <p className="mt-1 text-[13px] text-slate-600">{description}</p>
      )}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          title={cancelLabel}
          className="flex-1 rounded-2xl bg-slate-100 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-200"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          title={confirmLabel}
          className={`flex-1 rounded-2xl px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white ${
            tone === 'danger'
              ? 'bg-rose-600 hover:bg-rose-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </DemoSheet>
  );
}

export function DemoToast({
  show,
  message,
}: {
  show: boolean;
  message: string;
}) {
  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-24 z-[60] mx-auto flex max-w-md justify-center px-4 transition ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
      aria-live="polite"
    >
      <div className="rounded-full bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white shadow-lg">
        {message}
      </div>
    </div>
  );
}
