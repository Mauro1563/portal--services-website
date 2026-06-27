'use client';

import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

type Props = {
  /** Visible label when idle. */
  children: ReactNode;
  /** Label shown while the surrounding <form action={...}> is in flight. Defaults to "Procesando…". */
  pendingLabel?: ReactNode;
  /** Full className for the <button>. Caller owns the look (gradient, outline, danger, etc.). */
  className?: string;
  /** Optional name/value when used as a multi-action picker (e.g. <button name="op" value="approve">). */
  name?: string;
  value?: string;
  /** Optional aria-label override. */
  ariaLabel?: string;
  /** Extra disabled gate combined with pending state. */
  disabled?: boolean;
  /** Form association (when button lives outside the <form>). */
  form?: string;
};

/**
 * Generic submit button for server-action forms. Reads `pending` from
 * `useFormStatus()` so the user gets instant feedback (spinner + label swap)
 * the moment they submit — no need to lift state into the surrounding RSC.
 *
 * The visual styling is fully owned by the caller via `className`, so this
 * component plugs into any existing button variant (brand gradient, outline,
 * danger, etc.) without forcing a redesign.
 */
export function SubmitButton({
  children,
  pendingLabel = 'Procesando…',
  className,
  name,
  value,
  ariaLabel,
  disabled,
  form,
}: Props) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;
  return (
    <button
      type="submit"
      name={name}
      value={value}
      form={form}
      aria-label={ariaLabel}
      aria-busy={pending}
      disabled={isDisabled}
      className={className}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          <span>{pendingLabel}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
