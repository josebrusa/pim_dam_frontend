import { PageHeader } from '@/shared/ui/PageHeader';

type ModulePageProps = {
  title: string;
  subtitle: string;
  primaryAction?: string;
  secondaryAction?: string;
};

export function ModulePlaceholderPage({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
}: ModulePageProps) {
  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <>
            {secondaryAction && (
              <button type="button" className="rounded-[10px] border border-border px-4 py-2 text-sm text-text-secondary hover:bg-white/4">
                {secondaryAction}
              </button>
            )}
            {primaryAction && (
              <button type="button" className="rounded-[10px] bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover">
                {primaryAction}
              </button>
            )}
          </>
        }
      />
      <div className="rounded-[14px] border border-border bg-bg-card p-8 text-center text-sm text-text-secondary">
        Módulo en desarrollo — ver backlog en <code className="text-text-primary">docs/implementation-backlog.md</code>
      </div>
    </div>
  );
}
