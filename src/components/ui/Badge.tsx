import type { PropsWithChildren } from 'react';
import clsx from 'clsx';

interface BadgeProps extends PropsWithChildren {
  color?: 'brand' | 'neutral' | 'success' | 'warning';
  className?: string;
}

const colorMap = {
  brand: 'bg-brand-100 text-brand-700 border border-brand-200',
  neutral: 'bg-stone-100 text-slate-700 border border-stone-200',
  success: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-100 text-amber-700 border border-amber-200'
};

const Badge = ({ children, color = 'brand', className }: BadgeProps) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide',
        colorMap[color],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
