'use client';

import { useState } from 'react';
import { Gift } from 'lucide-react';
import { addReward } from './actions';

const inputCls =
  'mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20';

export function RewardForm() {
  const [kind, setKind] = useState('free_cleaning');

  return (
    <section className="mt-6 rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card">
      <h2 className="inline-flex items-center gap-2 font-display text-base font-semibold text-text-1">
        <Gift className="h-4 w-4 text-brand-600" /> Añadir un premio
      </h2>
      <p className="mt-1 text-[11px] text-text-3">
        Crea las opciones de recompensa que verán tus clientes al recomendarte.
      </p>

      <form action={addReward} className="mt-4 space-y-3">
        <label className="block">
          <span className="text-xs font-medium text-text-2">Tipo de premio</span>
          <select
            name="kind"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className={inputCls}
          >
            <option value="free_cleaning">Limpieza gratis</option>
            <option value="percent_discount">Descuento %</option>
            <option value="custom">Premio personalizado</option>
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-medium text-text-2">
            Nombre del premio<span className="ml-0.5 text-rose-500">*</span>
          </span>
          <input
            type="text"
            name="title"
            required
            placeholder={
              kind === 'free_cleaning'
                ? 'Una limpieza gratis'
                : kind === 'percent_discount'
                  ? '20% en tu próxima limpieza'
                  : 'Set de productos de regalo'
            }
            className={inputCls}
          />
        </label>

        {kind === 'percent_discount' ? (
          <label className="block">
            <span className="text-xs font-medium text-text-2">
              Porcentaje de descuento<span className="ml-0.5 text-rose-500">*</span>
            </span>
            <input
              type="number"
              name="percent"
              min={1}
              max={100}
              placeholder="20"
              className={inputCls}
            />
          </label>
        ) : null}

        <label className="block">
          <span className="text-xs font-medium text-text-2">Descripción (opcional)</span>
          <input
            type="text"
            name="description"
            placeholder="Cómo y cuándo se aplica el premio"
            className={inputCls}
          />
        </label>

        <button
          type="submit"
          className="flex h-10 items-center justify-center rounded-xl bg-brand-gradient px-4 text-sm font-semibold text-white shadow-brand-glow"
        >
          Añadir premio
        </button>
      </form>
    </section>
  );
}
