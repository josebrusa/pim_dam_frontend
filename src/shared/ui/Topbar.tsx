import { Menu, Settings } from 'lucide-react';
import type { ReactNode } from 'react';
import { Breadcrumb } from './Breadcrumb';
import { ActionButton } from './ActionButton';

type TopbarProps = {
  title: string;
  search: ReactNode;
  userInitials?: string;
  onOpenSidebar: () => void;
  onOpenSettings: () => void;
  canOpenSettings?: boolean;
};

export function Topbar({ title, search, userInitials, onOpenSidebar, onOpenSettings, canOpenSettings = true }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex min-h-[68px] flex-wrap items-center gap-3 border-b border-border bg-white/85 px-4 py-3 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenSidebar}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-brand-deep shadow-[0_8px_20px_rgba(10,61,98,0.06)] lg:hidden"
        aria-label="Abrir navegación"
      >
        <Menu className="h-5 w-5" />
      </button>
      <Breadcrumb current={title} />
      <div className="relative order-3 w-full lg:order-none lg:ml-auto lg:flex lg:max-w-md lg:flex-1">{search}</div>
      <ActionButton
        variant="secondary"
        onClick={onOpenSettings}
        disabled={!canOpenSettings}
        icon={<Settings className="h-4 w-4" />}
        className="border-border text-brand-deep shadow-[0_8px_20px_rgba(10,61,98,0.06)] hover:border-accent/30 hover:bg-accent/5 hover:text-brand-deep disabled:border-border disabled:bg-slate-100 disabled:text-slate-400"
        title={canOpenSettings ? 'Abrir configuración' : 'Configuración disponible para administradores'}
      >
        Configuración
      </ActionButton>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
        {userInitials ?? '??'}
      </div>
    </header>
  );
}
