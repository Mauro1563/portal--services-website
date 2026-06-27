/**
 * Cleaner-side earnings math, kept in one place so /operative,
 * /operative/earnings and the task detail all agree on what a task
 * is worth to the cleaner.
 *
 * Per migration 0035_tips_and_rates.sql:
 *   cleaner pay = actual_hours
 *               * COALESCE(tasks.cleaner_pay_rate_pence,
 *                          cleaners.default_hourly_pay_pence)
 *               + tasks.tip_pence
 *
 * Notes:
 * - We never read tasks.price_pence here — that is the CLIENT-facing
 *   sticker price, not the cleaner payout. Mixing them was the bug
 *   the original strip had: a cleaner on a £15/h rate would see the
 *   full £80 service price as "their" earnings.
 * - actual_hours is NULL until the cleaner reports it. In that case
 *   the labour part is £0 and only the tip counts. That mirrors what
 *   the owner ledger does, so payroll never disagrees with the app.
 * - Tips go 100% to the cleaner, irrespective of hours.
 */

export type EarningsTask = {
  /** NUMERIC(4,2) from Postgres — supabase-js returns it as string OR number. */
  actual_hours: number | string | null;
  cleaner_pay_rate_pence: number | null;
  tip_pence: number | null;
};

/** Compute pay for a single task, in pence. Always >= 0. */
export function taskEarningsPence(
  task: EarningsTask,
  defaultHourlyPayPence: number,
): number {
  const hours =
    task.actual_hours == null
      ? 0
      : typeof task.actual_hours === 'string'
        ? Number(task.actual_hours)
        : task.actual_hours;
  const safeHours = Number.isFinite(hours) && hours > 0 ? hours : 0;
  const rate = task.cleaner_pay_rate_pence ?? defaultHourlyPayPence ?? 0;
  const labour = Math.round(safeHours * rate);
  const tip = task.tip_pence ?? 0;
  return Math.max(0, labour + tip);
}

/** Just the labour portion (no tip). Used in the per-task breakdown row. */
export function taskLabourPence(
  task: EarningsTask,
  defaultHourlyPayPence: number,
): number {
  const hours =
    task.actual_hours == null
      ? 0
      : typeof task.actual_hours === 'string'
        ? Number(task.actual_hours)
        : task.actual_hours;
  const safeHours = Number.isFinite(hours) && hours > 0 ? hours : 0;
  const rate = task.cleaner_pay_rate_pence ?? defaultHourlyPayPence ?? 0;
  return Math.max(0, Math.round(safeHours * rate));
}

/** Sum of earnings across a list of tasks. */
export function sumEarningsPence(
  tasks: EarningsTask[],
  defaultHourlyPayPence: number,
): number {
  return tasks.reduce(
    (sum, t) => sum + taskEarningsPence(t, defaultHourlyPayPence),
    0,
  );
}

/** Sum of tip_pence across a list of tasks. */
export function sumTipsPence(tasks: EarningsTask[]): number {
  return tasks.reduce((sum, t) => sum + (t.tip_pence ?? 0), 0);
}

/** Display a pence amount as £ with 2dp (use 0dp for the strip). */
export function formatPenceMoney(pence: number, dp: 0 | 2 = 2): string {
  return `£${(pence / 100).toFixed(dp)}`;
}
