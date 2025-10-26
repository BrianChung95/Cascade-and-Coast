import type { PropsWithChildren, ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps extends PropsWithChildren {
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

const Card = ({ className, header, footer, children }: CardProps) => {
  return (
    <article
      className={clsx(
        'flex h-full flex-col rounded-[28px] border border-stone-200 bg-stone-50/80 p-6 shadow-lg shadow-brand-100/60',
        className
      )}
    >
      {header ? <div className="mb-4">{header}</div> : null}
      <div className="flex-1 text-sm text-slate-700">{children}</div>
      {footer ? <div className="mt-6">{footer}</div> : null}
    </article>
  );
};

export default Card;
