import type { ReactNode } from 'react';
import { ActionButton } from './ActionButton';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[rgba(31,42,55,0.55)] p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[24px] border border-border bg-bg-card p-6 shadow-[0_24px_60px_rgba(10,61,98,0.16)]">
        <div className="mb-3 inline-flex rounded-full bg-warning/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-warning">
          Confirmación
        </div>
        <h2 className="mb-2 text-lg font-semibold text-brand-deep">{title}</h2>
        <div className="text-sm leading-6 text-text-secondary">{message}</div>
        <div className="mt-5 flex justify-end gap-2">
          <ActionButton variant="secondary" onClick={onClose}>
            {cancelLabel}
          </ActionButton>
          <ActionButton onClick={onConfirm} loading={loading} loadingLabel="Procesando...">
            {confirmLabel}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
