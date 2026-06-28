'use client';

import { useFormStatus } from 'react-dom';
import { ArrowRight, Loader2 } from 'lucide-react';

type Props = {
  label: string;
  pendingLabel: string;
};

/**
 * Submit button that flips to a disabled "Entrando…" state the instant the
 * surrounding <form action={signIn}> server action fires. Using
 * `useFormStatus` (instead of local state) means we don't need to lift the
 * pending flag out of the otherwise-server LoginPage — the hook reads from
 * the form's own dispatcher, so feedback is immediate even though signIn
 * still does a Supabase round-trip in the background.
 */
export function SubmitButton({ label, pendingLabel }: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#0A0D18] text-[13px] font-bold uppercase tracking-[0.20em] text-white shadow-[0_14px_28px_-10px_rgba(0,216,199,0.45),inset_0_1px_0_rgba(255,255,255,0.20)] ring-1 ring-[#00D8C7]/40 transition hover:brightness-[1.08] hover:ring-[#00D8C7] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:brightness-100"
    >
      <span className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {pendingLabel}
        </>
      ) : (
        <>
          {label}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </>
      )}
    </button>
  );
}
