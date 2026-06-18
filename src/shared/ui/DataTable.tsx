type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
};

type DataTableProps<T extends Record<string, unknown>> = {
  columns: Column<T>[];
  data: T[];
  keyField?: string;
};

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyField = 'id',
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-[14px] border border-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-bg-surface text-xs uppercase tracking-wide text-text-secondary">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={String(row[keyField])} className="border-b border-border/60 hover:bg-white/2">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-text-primary">
                  {col.render ? col.render(row) : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="px-4 py-8 text-center text-sm text-text-muted">Sin resultados</div>
      )}
    </div>
  );
}
