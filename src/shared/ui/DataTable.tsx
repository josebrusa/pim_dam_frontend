import { EmptyState } from './LoadingState';
import { Pagination } from './Pagination';

type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
};

type DataTableProps<T extends Record<string, unknown>> = {
  columns: Column<T>[];
  data: T[];
  keyField?: string;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
};

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyField = 'id',
  page = 1,
  pageSize,
  onPageChange,
}: DataTableProps<T>) {
  const paginatedData = pageSize ? data.slice((page - 1) * pageSize, page * pageSize) : data;
  const totalPages = pageSize ? Math.max(1, Math.ceil(data.length / pageSize)) : 1;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-bg-card shadow-[0_24px_60px_rgba(10,61,98,0.08)]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-bg-surface text-xs uppercase tracking-[0.16em] text-text-secondary">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row) => (
            <tr key={String(row[keyField])} className="border-b border-border/60 transition-colors hover:bg-accent/5">
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
        <div className="px-4 pb-4">
          <EmptyState
            title="Aun no hay resultados"
            message="Cuando haya informacion disponible en este modulo, aparecera aqui con el formato Lumify."
          />
        </div>
      )}
      {onPageChange && pageSize ? <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} /> : null}
    </div>
  );
}
