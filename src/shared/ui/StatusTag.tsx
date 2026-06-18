const colorMap: Record<string, string> = {
  published: 'bg-success/12 text-success',
  active: 'bg-success/12 text-success',
  connected: 'bg-success/12 text-success',
  accepted: 'bg-success/12 text-success',
  completed: 'bg-success/12 text-success',
  in_progress: 'bg-info/12 text-info',
  draft: 'bg-text-muted/20 text-text-secondary',
  pending: 'bg-warning/12 text-warning',
  incomplete: 'bg-warning/12 text-warning',
  blocked: 'bg-danger/12 text-danger',
  rejected: 'bg-danger/12 text-danger',
  inactive: 'bg-warning/12 text-warning',
  high: 'bg-danger/12 text-danger',
  medium: 'bg-warning/12 text-warning',
  normal: 'bg-info/12 text-info',
};

export function StatusTag({ status, label }: { status: string; label?: string }) {
  const cls = colorMap[status] ?? 'bg-accent/12 text-accent';
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {label ?? status}
    </span>
  );
}
