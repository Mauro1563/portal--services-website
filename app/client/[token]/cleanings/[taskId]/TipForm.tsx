'use client';

import { useState } from 'react';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { saveTip } from '../../actions';

const PRESETS_PENCE = [200, 500, 1000] as const;

type Props = {
  token: string;
  taskId: string;
  /** Current saved tip in pence (0 if none). When > 0 we show "Cambiar". */
  currentTipPence: number;
};

/**
 * Tip picker — three preset chips (£2 / £5 / £10) plus "Otra" which
 * reveals a £-denominated number input. We do the £ → pence conversion
 * on submit so the server action only ever has to handle integer pence.
 *
 * Why client-side: the "Otra" toggle and the chip-selected visual state
 * are pure presentation — easier than juggling them via radio CSS, and
 * we already need JS to round £-input to pence safely.
 */
export function TipForm({ token, taskId, currentTipPence }: Props) {
  const hasExistingTip = currentTipPence > 0;
  const [mode, setMode] = useState<'preset' | 'other' | 'edit'>(
    hasExistingTip ? 'edit' : 'preset',
  );
  const [selected, setSelected] = useState<number | 'other' | null>(null);
  const [otherPounds, setOtherPounds] = useState<string>('');

  // In "edit" mode (existing tip) we just show a button to swap to the picker.
  if (mode === 'edit') {
    return (
      <div className="mt-3">
        <button
          type="button"
          onClick={() => setMode('preset')}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-emerald-300 bg-white px-4 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
        >
          Cambiar
        </button>
      </div>
    );
  }

  // Compute the pence value we'll submit. Pounds input is parsed as
  // a float and rounded to the nearest penny. Invalid / empty → 0,
  // which disables the submit button below.
  let amountPence = 0;
  if (selected === 'other') {
    const pounds = Number(otherPounds.replace(',', '.'));
    if (Number.isFinite(pounds) && pounds > 0) {
      amountPence = Math.round(pounds * 100);
    }
  } else if (typeof selected === 'number') {
    amountPence = selected;
  }

  const canSubmit = amountPence > 0 && amountPence <= 50_000;

  return (
    <form action={saveTip} className="mt-3 space-y-3">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="task_id" value={taskId} />
      <input type="hidden" name="amount_pence" value={amountPence} />

      <div className="grid grid-cols-4 gap-2">
        {PRESETS_PENCE.map((p) => {
          const active = selected === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => setSelected(p)}
              aria-pressed={active}
              className={`flex h-12 items-center justify-center rounded-xl border text-sm font-semibold transition ${
                active
                  ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
                  : 'border-surface-2 bg-white text-text-1 hover:border-emerald-300'
              }`}
            >
              £{p / 100}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setSelected('other')}
          aria-pressed={selected === 'other'}
          className={`flex h-12 items-center justify-center rounded-xl border text-sm font-semibold transition ${
            selected === 'other'
              ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
              : 'border-surface-2 bg-white text-text-1 hover:border-emerald-300'
          }`}
        >
          Otra
        </button>
      </div>

      {selected === 'other' ? (
        <label className="block">
          <span className="text-xs font-medium text-text-2">
            Importe en £
          </span>
          <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-surface-2 bg-white px-3.5 py-2.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
            <span className="text-sm font-semibold text-text-2">£</span>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0.01"
              max="500"
              value={otherPounds}
              onChange={(e) => setOtherPounds(e.target.value)}
              placeholder="0.00"
              className="block w-full bg-transparent text-sm text-text-1 placeholder:text-text-3 focus:outline-none"
              required
            />
          </div>
        </label>
      ) : null}

      <SubmitButton
        disabled={!canSubmit}
        pendingLabel="Enviando…"
        className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {hasExistingTip
          ? `Actualizar propina${amountPence ? ` · £${(amountPence / 100).toFixed(2)}` : ''}`
          : `Enviar propina${amountPence ? ` · £${(amountPence / 100).toFixed(2)}` : ''}`}
      </SubmitButton>

      {hasExistingTip ? (
        <button
          type="button"
          onClick={() => setMode('edit')}
          className="block w-full text-center text-xs text-text-3 hover:text-text-1"
        >
          Cancelar
        </button>
      ) : null}
    </form>
  );
}
