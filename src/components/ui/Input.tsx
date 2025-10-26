import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={clsx(
        'focus-ring w-full rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm text-slate-700 placeholder:text-stone-400',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
