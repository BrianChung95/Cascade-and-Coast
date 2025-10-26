import type { PropsWithChildren } from 'react';
import clsx from 'clsx';

interface ContainerProps extends PropsWithChildren {
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={clsx('mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10', className)}>
      {children}
    </div>
  );
};

export default Container;
