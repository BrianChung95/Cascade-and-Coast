import type { ButtonHTMLAttributes, ReactElement } from 'react';
import { cloneElement, forwardRef } from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'border border-transparent bg-brand-500 text-white hover:bg-brand-400',
  secondary:
    'border border-stone-300 bg-white text-slate-700 hover:border-brand-200 hover:bg-brand-50/60',
  ghost: 'border border-transparent bg-transparent text-slate-700 hover:bg-stone-100'
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-3 text-base'
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, children, type = 'button', ...rest }, ref) => {
    const mergedClassName = clsx(
      'focus-ring inline-flex items-center justify-center rounded-2xl font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60',
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    if (asChild && children && (children as ReactElement).props) {
      const child = children as ReactElement;
      return cloneElement(child, {
        className: clsx(child.props.className, mergedClassName),
        ...rest
      });
    }

    return (
      <button ref={ref} type={type} className={mergedClassName} {...rest}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
