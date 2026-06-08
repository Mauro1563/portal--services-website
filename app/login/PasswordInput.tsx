'use client';

import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export function PasswordInput() {
  const [show, setShow] = useState(false);
  return (
    <div className="relative w-full min-w-0">
      <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      <input
        type={show ? 'text' : 'password'}
        name="password"
        autoComplete="current-password"
        placeholder="••••••••"
        className="block h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-white pl-10 pr-11 text-sm font-medium text-[#0b1d3a] placeholder:font-normal placeholder:text-slate-500 transition focus:border-[#0b1d3a] focus:outline-none focus:ring-4 focus:ring-[#0b1d3a]/10"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-[#0b1d3a]"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
