type BreadcrumbProps = {
  current: string;
};

export function Breadcrumb({ current }: BreadcrumbProps) {
  return (
    <div className="min-w-0 flex-1 text-sm text-text-secondary lg:flex-none">
      Lumify PIM / <span className="font-medium text-brand-deep">{current}</span>
    </div>
  );
}
