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
    'bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-[0_8px_30px_-10px_rgba(37,99,235,0.6)] hover:shadow-[0_8px_30px_-5px_rgba(37,99,235,0.8)] hover:brightness-110',
  secondary:
    'bg-white/[0.06] text-white border border-white/10 hover:bg-white/[0.1] hover:border-white/20',
  ghost: 'text-slate-200 hover:text-white hover:bg-white/[0.06]',
  outline: 'border border-white/15 text-white hover:bg-white/[0.05]',
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
