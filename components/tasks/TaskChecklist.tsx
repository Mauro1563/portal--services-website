'use client';

/**
 * Renders the per-task checklist that an Airbnb (and occasionally a Hogar)
 * cleaner ticks off before they're allowed to mark a task as completed.
 *
 * The component is intentionally dumb — it owns no state and never talks
 * to the network. The parent (a server-action wrapper in the real route,
 * or a useState reducer in the preview) is responsible for persisting the
 * tick. We keep it dumb so the same component can back:
 *
 *   - the live /operative/tasks/[id] page (server action onToggle),
 *   - the public /operative/preview-airbnb demo (in-memory onToggle), and
 *   - the residential /operative/preview demo (typically empty checklist,
 *     so we render the empty state instead of an awkward zero-row card).
 *
 * Checklist item shape mirrors tasks.checklist JSONB exactly:
 *   { key, label, done, doneAt?, doneByUserId? }
 */
import { CheckCircle2 } from 'lucide-react';

export type ChecklistItem = {
  key: string;
  label: string;
  done: boolean;
  doneAt?: string;
  doneByUserId?: string;
};

export type TaskChecklistProps = {
  items: ChecklistItem[];
  onToggle: (key: string, done: boolean) => void;
  /** When true, render rows as non-interactive (used in completed tasks). */
  readOnly?: boolean;
  /**
   * Optional map of userId -> display name so we can render
   * "completado por María a las 10:21" rather than a raw UUID.
   * When a name is missing we fall back to "un compañero".
   */
  userNames?: Record<string, string>;
};

function formatDoneAt(iso: string | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function TaskChecklist({
  items,
  onToggle,
  readOnly = false,
  userNames,
}: TaskChecklistProps) {
  // Empty state — residential tasks usually have no checklist, and rendering
  // a zero-progress bar with "0 de 0 completados" reads as broken UI. Show
  // a friendly note instead.
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-surface-2 bg-surface-1/40 px-3 py-4 text-center">
        <p className="text-[12px] text-text-3">
          Esta tarea no tiene checklist.
        </p>
      </div>
    );
  }

  const doneCount = items.reduce((acc, it) => acc + (it.done ? 1 : 0), 0);
  const total = items.length;
  const pct = Math.round((doneCount / total) * 100);
  const allDone = doneCount === total;

  return (
    <div className="rounded-xl border border-dashed border-orange-200 bg-orange-50/40 p-3">
      {/* Header: progress label + progress bar — keeps the "X de Y" cue at
          the top so the cleaner sees the gate distance before scanning rows. */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-orange-800">
          Checklist
        </p>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${
            allDone
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-white text-orange-800 ring-1 ring-orange-200'
          }`}
        >
          {doneCount} de {total} completados
        </span>
      </div>
      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-orange-100"
        aria-hidden
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            allDone ? 'bg-emerald-500' : 'bg-orange-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <ul className="mt-3 space-y-1.5">
        {items.map((item) => {
          const doneAt = formatDoneAt(item.doneAt);
          const doneBy =
            item.doneByUserId && userNames?.[item.doneByUserId]
              ? userNames[item.doneByUserId]
              : item.doneByUserId
                ? 'un compañero'
                : null;
          const meta =
            item.done && (doneAt || doneBy)
              ? `completado${doneBy ? ` por ${doneBy}` : ''}${doneAt ? ` a las ${doneAt}` : ''}`
              : null;
          return (
            <li key={item.key}>
              <label
                className={`flex items-start gap-2 rounded-lg px-1 py-1 transition ${
                  readOnly ? '' : 'cursor-pointer hover:bg-white/70'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  disabled={readOnly}
                  onChange={(e) => onToggle(item.key, e.target.checked)}
                  className="mt-[3px] h-4 w-4 shrink-0 cursor-pointer accent-orange-600 disabled:cursor-not-allowed"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-[12px] font-semibold ${
                      item.done ? 'text-text-3 line-through' : 'text-text-1'
                    }`}
                  >
                    {item.label}
                  </p>
                  {meta ? (
                    <p className="mt-0.5 inline-flex items-center gap-1 text-[10.5px] text-text-3">
                      <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                      {meta}
                    </p>
                  ) : null}
                </div>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
