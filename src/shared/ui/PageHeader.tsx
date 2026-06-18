import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <h1 className="text-[22px] font-semibold tracking-tight text-brand-deep">{title}</h1>
        {subtitle && (
          <p className="mt-1 max-w-3xl text-sm leading-6 text-text-secondary">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2.5 max-sm:w-full">{actions}</div>}
    </div>
  );
}
