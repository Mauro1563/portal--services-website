'use client';

/**
 * TaskRateOverrides
 * -----------------
 * Two optional per-task overrides on top of the task form:
 *
 *   - Tarifa cobrada al cliente (£/h)  → tasks.charge_rate_pence
 *   - Pago al cleaner (£/h)            → tasks.cleaner_pay_rate_pence
 *
 * Both fields start *empty* (which on submit means "leave NULL / fall back
 * to the property or cleaner default"). When the owner changes the
 * property / cleaner select that drives this task, we auto-fill the field
 * with that entity's default — but only when the field is still pristine,
 * so an explicit override the owner just typed never gets clobbered.
 *
 * The form values are sent under the names declared in `chargeFieldName`
 * and `payFieldName` so the server action can pick them up.
 */
import { useEffect, useRef, useState } from 'react';

export type PropertyRate = { id: string; default_charge_rate_pence: number };
export type CleanerRate = { id: string; default_hourly_pay_pence: number };

type Props = {
  /** ID of the <select name="property_id"> that picks the property. */
  propertyFieldName?: string;
  /** ID of the <select name="cleaner_id"> that picks the cleaner. */
  cleanerFieldName?: string;
  /** Per-task override field names exposed to the surrounding form. */
  chargeFieldName?: string;
  payFieldName?: string;

  /** Lookup tables passed in from the server component. */
  properties: PropertyRate[];
  cleaners: CleanerRate[];

  /** Initial values (existing task: pence → £, or undefined for "new task"). */
  initialChargePence?: number | null;
  initialPayPence?: number | null;

  /** Initially-selected entities so we can render a contextual hint. */
  initialPropertyId?: string | null;
  initialCleanerId?: string | null;

  /** Org-wide fallback charge rate (owner_profiles.default_charge_rate_pence). */
  ownerDefaultChargePence?: number | null;
};

function penceToInputValue(p: number | null | undefined): string {
  if (p == null) return '';
  if (!Number.isFinite(p) || p <= 0) return '';
  return (p / 100).toFixed(2);
}

const inputCls =
  'mt-0 block h-11 w-full rounded-xl border border-surface-2 bg-surface-0 pl-7 pr-3.5 text-sm text-text-1 placeholder:text-text-3 transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/25';
const labelTitle = 'text-xs font-medium text-text-2';

export function TaskRateOverrides({
  propertyFieldName = 'property_id',
  cleanerFieldName = 'cleaner_id',
  chargeFieldName = 'charge_rate',
  payFieldName = 'cleaner_pay_rate',
  properties,
  cleaners,
  initialChargePence,
  initialPayPence,
  initialPropertyId,
  initialCleanerId,
  ownerDefaultChargePence,
}: Props) {
  const [charge, setCharge] = useState<string>(penceToInputValue(initialChargePence));
  const [pay, setPay] = useState<string>(penceToInputValue(initialPayPence));

  // Track whether the field is "pristine" (still matches the auto-filled
  // default) so that re-selecting a property doesn't wipe out the value
  // an owner has typed by hand. We seed pristine=true on mount because
  // an empty field is, definitionally, untouched.
  const chargePristine = useRef(true);
  const payPristine = useRef(true);

  // Find the form element so we can subscribe to its `change` events.
  // This way the component doesn't care HOW the property/cleaner select
  // is rendered (server-component label, custom widget, …) — it just
  // listens for native form changes.
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    initialPropertyId ?? null,
  );
  const [selectedCleanerId, setSelectedCleanerId] = useState<string | null>(
    initialCleanerId ?? null,
  );

  useEffect(() => {
    const form = wrapRef.current?.closest('form');
    if (!form) return;
    const handler = (ev: Event) => {
      const t = ev.target as HTMLInputElement | HTMLSelectElement | null;
      if (!t || !t.name) return;
      if (t.name === propertyFieldName) {
        setSelectedPropertyId(t.value || null);
      } else if (t.name === cleanerFieldName) {
        setSelectedCleanerId(t.value || null);
      }
    };
    form.addEventListener('change', handler);
    return () => form.removeEventListener('change', handler);
  }, [propertyFieldName, cleanerFieldName]);

  // When property changes, auto-fill charge rate from that property's
  // default (or the owner-wide default) — but only if the user hasn't
  // overridden the field yet.
  useEffect(() => {
    if (!chargePristine.current) return;
    const prop = properties.find((p) => p.id === selectedPropertyId);
    const pence =
      prop && prop.default_charge_rate_pence > 0
        ? prop.default_charge_rate_pence
        : ownerDefaultChargePence && ownerDefaultChargePence > 0
        ? ownerDefaultChargePence
        : null;
    setCharge(penceToInputValue(pence));
  }, [selectedPropertyId, properties, ownerDefaultChargePence]);

  // Same idea for cleaner pay.
  useEffect(() => {
    if (!payPristine.current) return;
    const cln = cleaners.find((c) => c.id === selectedCleanerId);
    const pence =
      cln && cln.default_hourly_pay_pence > 0 ? cln.default_hourly_pay_pence : null;
    setPay(penceToInputValue(pence));
  }, [selectedCleanerId, cleaners]);

  // Build a short "where the auto-fill came from" hint per field so the
  // owner understands the value isn't pulled out of thin air.
  const chargeHint = (() => {
    const prop = properties.find((p) => p.id === selectedPropertyId);
    if (prop && prop.default_charge_rate_pence > 0) {
      return `Auto-rellenada desde la propiedad (£${(prop.default_charge_rate_pence / 100).toFixed(2)}/h). Editable.`;
    }
    if (ownerDefaultChargePence && ownerDefaultChargePence > 0) {
      return `Auto-rellenada desde la tarifa por defecto del negocio (£${(ownerDefaultChargePence / 100).toFixed(2)}/h). Editable.`;
    }
    return 'Dejá vacío para no facturar esta tarea, o escribí la tarifa por hora.';
  })();

  const payHint = (() => {
    const cln = cleaners.find((c) => c.id === selectedCleanerId);
    if (cln && cln.default_hourly_pay_pence > 0) {
      return `Auto-rellenada desde el cleaner (£${(cln.default_hourly_pay_pence / 100).toFixed(2)}/h). Editable.`;
    }
    return 'Dejá vacío si no pagás por horas a este cleaner.';
  })();

  return (
    <div ref={wrapRef} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelTitle}>Tarifa cobrada al cliente (£/h)</span>
          <div className="relative mt-1.5">
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm font-medium text-text-3">
              £
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              name={chargeFieldName}
              value={charge}
              onChange={(e) => {
                chargePristine.current = false;
                setCharge(e.target.value);
              }}
              placeholder="0.00"
              className={inputCls}
            />
          </div>
          <span className="mt-1 block text-[11px] text-text-3">{chargeHint}</span>
        </label>

        <label className="block">
          <span className={labelTitle}>Pago al cleaner (£/h)</span>
          <div className="relative mt-1.5">
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm font-medium text-text-3">
              £
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              name={payFieldName}
              value={pay}
              onChange={(e) => {
                payPristine.current = false;
                setPay(e.target.value);
              }}
              placeholder="0.00"
              className={inputCls}
            />
          </div>
          <span className="mt-1 block text-[11px] text-text-3">{payHint}</span>
        </label>
      </div>
    </div>
  );
}
