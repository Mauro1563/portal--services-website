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
        'relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl',
        'shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_20px_40px_-20px_rgba(0,0,0,0.6)]',
        hover && 'transition-all hover:border-white/[0.14] hover:bg-white/[0.05]',
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';
