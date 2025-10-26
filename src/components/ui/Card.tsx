import type { PropsWithChildren, ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps extends PropsWithChildren {
  className?: string;
  header?: ReactNode; // Optional top slot
  footer?: ReactNode; // Optional bottom slot
}

// Slot-based card primitive used by menu, location, and home features for consistent framing.
const Card = ({ className, header, footer, children }: CardProps) => {
  return (
    <article
      className={clsx(
        'flex h-full flex-col rounded-[28px] border border-stone-200 bg-stone-50/80 p-6 shadow-lg shadow-brand-100/60',
        className
      )}
    >
      {/* Optional header content such as imagery or badges. */}
      {header ? <div className="mb-4">{header}</div> : null}

      {/* Primary content grows to fill the card body. */}
      <div className="flex-1 text-sm text-slate-700">{children}</div>

      {/* Optional footer for actions or metadata. */}
      {footer ? <div className="mt-6">{footer}</div> : null}
    </article>
  );
};

export default Card;
