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
        'relative rounded-2xl border border-surface-2 bg-surface-0 shadow-card',
        hover && 'transition-all hover:border-brand-200 hover:shadow-card-lg',
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';
