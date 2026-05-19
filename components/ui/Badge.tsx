import * as React from 'react';
import { cn } from '../../lib/cn';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'brand';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const tones: Record<Tone, string> = {
  neutral: 'bg-surface-1 text-text-2 ring-surface-3',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  danger: 'bg-rose-50 text-rose-700 ring-rose-200',
  info: 'bg-cyan-50 text-cyan-700 ring-cyan-200',
  brand: 'bg-blue-50 text-blue-700 ring-blue-200',
};

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
