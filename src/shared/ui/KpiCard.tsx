type KpiCardProps = {
  label: string;
  value: string;
  delta?: string;
  valueColor?: string;
};

export function KpiCard({ label, value, delta, valueColor = 'text-accent' }: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-bg-card p-5 shadow-[0_24px_60px_rgba(10,61,98,0.08)]">
      <div className="mb-2 text-xs text-text-secondary">{label}</div>
      <div className={`text-2xl font-semibold ${valueColor}`}>{value}</div>
      {delta && <div className="mt-1 text-xs text-text-muted">{delta}</div>}
    </div>
  );
}
