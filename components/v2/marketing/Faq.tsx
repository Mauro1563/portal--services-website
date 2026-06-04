'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

type Props = {
  title: string;
  items: { q: string; a: string }[];
};

export function Faq({ title, items }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5">
        <h2 className="text-center font-display text-3xl font-semibold tracking-[-0.02em] text-slate-950 sm:text-4xl">
          {title}
        </h2>

        <ul className="mt-12 space-y-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li
                key={i}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-base font-semibold text-slate-950 sm:text-lg">
                    {item.q}
                  </span>
                  <Plus
                    className={`h-5 w-5 shrink-0 text-slate-500 transition ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  />
                </button>
                {isOpen ? (
                  <p className="border-t border-slate-100 px-5 py-4 text-sm leading-relaxed text-slate-600">
                    {item.a}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
