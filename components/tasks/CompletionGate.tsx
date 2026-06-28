'use client';

/**
 * "Marcar completada" CTA, gated on:
 *   - every checklist item being done, AND
 *   - photosCount >= requiredPhotos.
 *
 * The component owns no checklist or photo state — it just decides whether
 * the button should be enabled and surfaces the reason when it isn't. That
 * way the same gate can sit beneath both the preview reducer-state and the
 * real route's server-action wiring.
 *
 * Why the disabled message reads "Faltan 3 ítems del checklist · Faltan 2
 * fotos" with a middle dot separator rather than two separate lines: it
 * matches the cadence of the existing toast/strip copy in the cleaner app,
 * keeps the gate compact on small screens, and reads as a single thought.
 */
import { CheckCircle2, Loader2 } from 'lucide-react';
import type { ChecklistItem } from './TaskChecklist';

export type CompletionGateProps = {
  checklist: ChecklistItem[];
  photosCount: number;
  requiredPhotos: number;
  onComplete: () => void;
  /** When true, render a spinner inside the button and prevent re-clicks. */
  loading?: boolean;
};

export function CompletionGate({
  checklist,
  photosCount,
  requiredPhotos,
  onComplete,
  loading = false,
}: CompletionGateProps) {
  const pendingChecklist = checklist.reduce(
    (acc, it) => acc + (it.done ? 0 : 1),
    0,
  );
  const missingPhotos = Math.max(0, requiredPhotos - photosCount);
  const allChecked = pendingChecklist === 0;
  const enoughPhotos = missingPhotos === 0;
  const canComplete = allChecked && enoughPhotos && !loading;

  // Build the disabled reason string. We deliberately pluralise in Spanish
  // ("1 ítem"/"3 ítems", "1 foto"/"2 fotos") because the cleaner-facing
  // copy is consistently Spanish across the operative app.
  const parts: string[] = [];
  if (!allChecked) {
    parts.push(
      pendingChecklist === 1
        ? 'Falta 1 ítem del checklist'
        : `Faltan ${pendingChecklist} ítems del checklist`,
    );
  }
  if (!enoughPhotos) {
    parts.push(
      missingPhotos === 1 ? 'Falta 1 foto' : `Faltan ${missingPhotos} fotos`,
    );
  }
  const reason = parts.join(' · ');

  return (
    <div>
      <button
        type="button"
        onClick={onComplete}
        disabled={!canComplete}
        title={
          canComplete
            ? 'Marcar la tarea como completada'
            : reason || 'Acción no disponible'
        }
        className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-[14px] font-semibold transition active:scale-[0.99] ${
          canComplete
            ? 'bg-emerald-600 text-white shadow-[0_8px_20px_-8px_rgba(5,150,105,0.55)] hover:bg-emerald-700'
            : 'cursor-not-allowed bg-slate-200 text-slate-500'
        }`}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}
        Marcar completada
      </button>
      {!canComplete && reason ? (
        <p
          className="mt-1.5 text-center text-[10.5px] font-medium text-text-3"
          role="status"
          aria-live="polite"
        >
          {reason}
        </p>
      ) : null}
    </div>
  );
}
