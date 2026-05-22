import * as React from 'react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.55)] hover:shadow-[0_10px_30px_-6px_rgba(37,99,235,0.7)] hover:brightness-110',
  secondary:
    'bg-white text-graphite-1 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 hover:ring-slate-300',
  ghost: 'text-graphite-2 hover:text-graphite-1 hover:bg-slate-100',
  outline: 'border border-slate-300 text-graphite-1 hover:bg-slate-50',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm rounded-lg',
  md: 'h-10 px-4 text-sm rounded-xl',
  lg: 'h-12 px-6 text-base rounded-xl',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', href, children, ...props }, ref) => {
    const classes = cn(
      'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40 disabled:pointer-events-none disabled:opacity-50',
      variants[variant],
      sizes[size],
      className,
    );

    if (href) {
      return (
        <a href={href} className={classes}>
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
