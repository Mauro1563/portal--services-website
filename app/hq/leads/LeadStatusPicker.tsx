'use client';

import { useState, useTransition } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { updateLeadStatus, type LeadStatus } from './actions';

const LABELS: Record<LeadStatus, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  qualified: 'Cualificado',
  archived: 'Archivado',
};

const STYLES: Record<LeadStatus, string> = {
  new: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  contacted: 'bg-amber-50 text-amber-700 ring-amber-200',
  qualified: 'bg-cyan-50 text-brand-700 ring-cyan-200',
  archived: 'bg-slate-100 text-graphite-3 ring-slate-200',
};

const ALL: LeadStatus[] = ['new', 'contacted', 'qualified', 'archived'];

export function LeadStatusPicker({
  leadId,
  initial,
}: {
  leadId: string;
  initial: LeadStatus;
}) {
  const [current, setCurrent] = useState<LeadStatus>(initial);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const change = (next: LeadStatus) => {
    setOpen(false);
    if (next === current) return;
    const previous = current;
    setCurrent(next);
    startTransition(async () => {
      const result = await updateLeadStatus(leadId, next);
      if (!result.ok) setCurrent(previous);
    });
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={pending}
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset transition hover:brightness-95 disabled:opacity-50 ${STYLES[current]}`}
      >
        {LABELS[current]}
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <ul className="absolute right-0 z-20 mt-1 min-w-[150px] rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
            {ALL.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => change(s)}
                  className="flex w-full items-center justify-between gap-3 px-3 py-1.5 text-left text-xs hover:bg-slate-50"
                >
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset ${STYLES[s]}`}>
                    {LABELS[s]}
                  </span>
                  {s === current ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
