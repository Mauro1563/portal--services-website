import * as React from 'react';
import { cn } from '../../lib/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative rounded-2xl bg-paper ring-1 ring-line',
        'shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_10px_30px_-10px_rgba(15,23,42,0.12)]',
        hover && 'transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)] hover:ring-slate-300',
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';
