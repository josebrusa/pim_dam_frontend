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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(31,42,55,0.55)] p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[24px] border border-border bg-bg-card p-6 shadow-[0_24px_60px_rgba(10,61,98,0.16)]">
        <div className="mb-3 inline-flex rounded-full bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          Lumify
        </div>
        <h2 className="mb-4 text-lg font-semibold text-brand-deep">{title}</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-full border border-border bg-white px-4 py-2 text-sm text-text-secondary transition-colors hover:border-accent hover:text-accent">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white shadow-[0_10px_30px_rgba(60,157,255,0.35)] transition-all hover:bg-accent-hover disabled:opacity-60">
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

export const inputClass = 'w-full rounded-[10px] border border-border bg-bg-input px-3.5 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent';
