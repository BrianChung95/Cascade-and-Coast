import {
  createContext,
  useContext,
  type ButtonHTMLAttributes,
  forwardRef,
  useId
} from 'react';
import type { PropsWithChildren } from 'react';
import clsx from 'clsx';

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

interface TabsProps extends PropsWithChildren {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

const Tabs = ({ value, onValueChange, className, children }: TabsProps) => {
  const baseId = useId();

  return (
    <TabsContext.Provider value={{ value, onValueChange, baseId }}>
      <div className={clsx('space-y-4', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children }: PropsWithChildren) => {
  return (
    <div role="tablist" className="flex flex-wrap gap-2">
      {children}
    </div>
  );
};

interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className, children, ...props }, ref) => {
    const context = useContext(TabsContext);
    if (!context) {
      throw new Error('Tabs.Trigger must be used within Tabs');
    }

    const { value: activeValue, onValueChange, baseId } = context;
    const isActive = activeValue === value;

    return (
      <button
        ref={ref}
        role="tab"
        id={`${baseId}-tab-${value}`}
        aria-selected={isActive}
        aria-controls={`${baseId}-panel-${value}`}
        type="button"
        onClick={() => onValueChange(value)}
        className={clsx(
          'focus-ring inline-flex items-center rounded-2xl border px-4 py-2 text-sm font-medium transition',
          isActive
            ? 'border-brand-300 bg-brand-100 text-brand-700 shadow-sm'
            : 'border-stone-200 bg-white text-slate-600 hover:border-brand-200 hover:bg-brand-50/60',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps extends PropsWithChildren {
  value: string;
  className?: string;
}

const TabsContent = ({ value, className, children }: TabsContentProps) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs.Content must be used within Tabs');
  }

  const { value: activeValue, baseId } = context;

  if (activeValue !== value) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      className={className}
    >
      {children}
    </div>
  );
};

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

export default Tabs;
