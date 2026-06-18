type StatChipProps = { label: string; value: string | number; color?: string };

export function StatChip({ label, value, color = 'text-accent' }: StatChipProps) {
  return (
    <div className="rounded-2xl border border-border bg-bg-card px-4 py-3 text-center shadow-[0_16px_40px_rgba(10,61,98,0.06)]">
      <div className={`text-xl font-semibold ${color}`}>{value}</div>
      <div className="mt-1 text-xs text-text-secondary">{label}</div>
    </div>
  );
}
