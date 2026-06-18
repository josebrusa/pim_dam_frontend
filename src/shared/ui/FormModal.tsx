import type { ReactNode } from 'react';

type FormModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  submitLabel?: string;
  loading?: boolean;
};

export function FormModal({ open, title, onClose, onSubmit, children, submitLabel = 'Guardar', loading }: FormModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-[14px] border border-border bg-bg-card p-6 shadow-2xl">
        <h2 className="mb-4 text-lg font-semibold">{title}</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-[10px] border border-border px-4 py-2 text-sm text-text-secondary hover:bg-white/4">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="rounded-[10px] bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-60">
              {loading ? 'Guardando...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] text-text-secondary">{label}</label>
      {children}
    </div>
  );
}

export const inputClass = 'w-full rounded-[10px] border border-border bg-bg-input px-3.5 py-2.5 text-sm outline-none focus:border-accent/40';
