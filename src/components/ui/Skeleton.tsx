import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={clsx('animate-pulse rounded-2xl bg-stone-200', className)}
      aria-hidden="true"
      {...props}
    />
  );
};

export default Skeleton;
