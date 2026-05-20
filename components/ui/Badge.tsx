import * as React from 'react';
import { cn } from '../../lib/cn';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'brand';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const tones: Record<Tone, string> = {
  neutral: 'bg-white/[0.06] text-slate-200 ring-white/10',
  success: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-300 ring-amber-500/20',
  danger: 'bg-rose-500/10 text-rose-300 ring-rose-500/20',
  info: 'bg-cyan-500/10 text-cyan-300 ring-cyan-500/20',
  brand: 'bg-blue-500/10 text-blue-300 ring-blue-500/20',
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
