'use client';

import { useState, useTransition } from 'react';
import { Check, Clock, Loader2 } from 'lucide-react';
import { saveActualHours } from '../../actions';

/**
 * "Marcar horas trabajadas" — cleaner self-reports how long a task
 * actually took, in hours (decimal). Drives both the cleaner's own
 * earnings strip and the owner's revenue calc (see migration 0035).
 *
 * Decimal input matches how cleaners think about pay ("2.5 h at £15")
 * rather than minutes — we tried minutes first and people kept entering
 * "2.30" meaning "2h 30m" which silently became 2.30h. Decimal hours
 * with a hint that "2.5 = 2h 30m" is unambiguous.
 *
 * On save the server action revalidates /operative so the earnings
 * strip on the home screen reflects the new figure the instant the
 * cleaner navigates back.
 */
export function ActualHoursForm({
  taskId,
  initial,
  payRatePence,
  tipPence,
}: {
  taskId: string;
  /** Pre-filled value as decimal hours, or empty string if not set. */
  initial: string;
  /** Per-task or default cleaner rate, used for the live preview. */
  payRatePence: number;
  /** Tip on this task — included in the preview so the cleaner sees
   *  the full payout, not just the labour portion. */
  tipPence: number;
}) {
  const [value, setValue] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const dirty = value.trim() !== initial.trim();

  // Live preview of what this task will pay. Mirrors the math in
  // lib/cleaner-earnings.ts so we don't ship two different formulas.
  const parsed = Number(value.replace(',', '.'));
  const hours = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  const labourPence = Math.round(hours * payRatePence);
  const totalPence = labourPence + tipPence;

  const submit = (formData: FormData) => {
    startTransition(async () => {
      await saveActualHours(formData);
      setSavedAt(Date.now());
    });
  };

  return (
    <section className="rounded-2xl border border-surface-2 bg-surface-0 p-4">
      <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-graphite-3">
        <Clock className="h-3 w-3" /> Marcar horas trabajadas
      </p>
      <p className="mt-1 text-[11px] text-graphite-3">
        Cuántas horas tardaste en esta limpieza. Usa decimales — por ej.{' '}
        <span className="font-semibold">2.5</span> = 2 h 30 min.
      </p>
      <form action={submit} className="mt-3 space-y-2.5">
        <input type="hidden" name="task_id" value={taskId} />
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="actual_hours"
            inputMode="decimal"
            step="0.25"
            min="0"
            max="99.99"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="2.5"
            className="block w-28 rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm tabular-nums text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
          />
          <span className="text-xs font-semibold uppercase tracking-wider text-graphite-3">
            horas
          </span>
        </div>

        {/* Live preview — only show when there's something to preview
            (either hours typed or a tip already on the task). */}
        {payRatePence > 0 || tipPence > 0 ? (
          <div className="rounded-lg bg-emerald-50/60 px-3 py-2 text-[11px] text-graphite-2">
            <span className="tabular-nums">
              {hours.toFixed(2)} h × £{(payRatePence / 100).toFixed(2)}/h
              {tipPence > 0 ? (
                <>
                  {' '}
                  + propina £{(tipPence / 100).toFixed(2)}
                </>
              ) : null}
            </span>
            <span className="ml-2 font-bold text-emerald-700 tabular-nums">
              = £{(totalPence / 100).toFixed(2)}
            </span>
          </div>
        ) : null}

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
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 px-3.5 text-[12px] font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            Guardar horas
          </button>
        </div>
      </form>
    </section>
  );
}
