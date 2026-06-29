'use client';

import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

type Props = {
  /** Localized aria-label when the input is hidden — clicking will reveal. */
  showLabel?: string;
  /** Localized aria-label when the input is visible — clicking will hide. */
  hideLabel?: string;
};

export function PasswordInput({
  showLabel = 'Show password',
  hideLabel = 'Hide password',
}: Props = {}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative w-full min-w-0">
      <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      <input
        type={show ? 'text' : 'password'}
        name="password"
        autoComplete="current-password"
        placeholder="••••••••"
        className="block h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white pl-10 pr-11 text-sm font-medium text-slate-900 placeholder:font-normal placeholder:text-slate-400 transition focus:border-[#00D8C7] focus:outline-none focus:ring-4 focus:ring-[#00D8C7]/20"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? hideLabel : showLabel}
        className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-[#0b1d3a]"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
