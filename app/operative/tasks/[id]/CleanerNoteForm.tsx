'use client';

import { useState, useTransition } from 'react';
import { Check, Loader2, MessageSquare } from 'lucide-react';
import { saveCleanerNote } from '../../actions';

/**
 * Tiny note-back-to-the-owner editor on the operative task detail.
 * Pre-fills from whatever was saved last, only fires the action when
 * the text actually changed, and shows a short "Guardado" pill after
 * a successful save. Falls back to a server redirect with ?note_saved=1
 * on form submit so it still works with JS disabled.
 */
export function CleanerNoteForm({
  taskId,
  initial,
}: {
  taskId: string;
  initial: string;
}) {
  const [value, setValue] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const dirty = value.trim() !== initial.trim();

  const submit = (formData: FormData) => {
    startTransition(async () => {
      // saveCleanerNote redirects, so we never resume below.
      await saveCleanerNote(formData);
      setSavedAt(Date.now());
    });
  };

  return (
    <section className="rounded-2xl border border-surface-2 bg-surface-0 p-4">
      <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-graphite-3">
        <MessageSquare className="h-3 w-3" /> Nota para el manager
      </p>
      <p className="mt-1 text-[11px] text-graphite-3">
        Opcional. Cualquier cosa que el dueño deba saber sobre esta limpieza
        (problemas, pedidos del cliente, daños).
      </p>
      <form action={submit} className="mt-3 space-y-2.5">
        <input type="hidden" name="task_id" value={taskId} />
        <textarea
          name="note"
          rows={3}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ej. Faltaba la llave en la caja, llamé al cliente."
          className="block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-graphite-3">
            {savedAt && !dirty ? (
              <span className="inline-flex items-center gap-1 text-emerald-700">
                <Check className="h-3 w-3" /> Guardado
              </span>
            ) : dirty ? (
              'Cambios sin guardar'
            ) : (
              ''
            )}
          </span>
          <button
            type="submit"
            disabled={pending || !dirty}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 px-3.5 text-[12px] font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            Guardar
          </button>
        </div>
      </form>
    </section>
  );
}
