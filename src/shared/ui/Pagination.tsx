import { ActionButton } from './ActionButton';

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
      <div className="text-sm text-text-secondary">
        Página <span className="font-medium text-brand-deep">{page}</span> de <span className="font-medium text-brand-deep">{totalPages}</span>
      </div>
      <div className="flex items-center gap-2">
        <ActionButton variant="secondary" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          Anterior
        </ActionButton>
        <ActionButton variant="secondary" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          Siguiente
        </ActionButton>
      </div>
    </div>
  );
}
