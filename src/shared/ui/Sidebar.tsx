import { LogOut, X, type LucideIcon } from 'lucide-react';

type NavBadge = {
  label: string;
  tone: 'live' | 'beta' | 'neutral';
};

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: NavBadge;
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

type SidebarProps = {
  sections: NavSection[];
  pathname: string;
  sidebarOpen: boolean;
  onClose: () => void;
  onNavigate: (to: string) => void;
  user?: {
    initials?: string;
    name?: string;
    role?: string;
  };
  onLogout: () => void;
};

const badgeClassByTone = {
  live: 'bg-emerald-400/15 text-emerald-200',
  beta: 'bg-amber-300/15 text-amber-100',
  neutral: 'bg-white/10 text-white/75',
} as const;

export function Sidebar({ sections, pathname, sidebarOpen, onClose, onNavigate, user, onLogout }: SidebarProps) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[88vw] flex-col border-r border-white/10 bg-[linear-gradient(180deg,#0a3d62_0%,#1f2a37_100%)] text-white shadow-[0_20px_50px_rgba(10,61,98,0.18)] transition-transform lg:w-60 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent font-mono text-sm font-medium text-white shadow-[0_10px_30px_rgba(60,157,255,0.35)]">L</div>
        <span className="text-[15px] font-semibold">Lumify PIM</span>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Cerrar navegación"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <nav className="flex-1 space-y-4 overflow-y-auto p-2.5">
        {sections.map((section) => (
          <div key={section.label}>
            <div className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
              {section.label}
            </div>
            <div className="space-y-0.5">
              {section.items.map(({ to, label, icon: Icon, badge }) => (
                <a
                  key={to}
                  href={to}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(to);
                  }}
                  className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-[13.5px] transition-colors ${pathname === to ? 'bg-accent/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{label}</span>
                  {badge && (
                    <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeClassByTone[badge.tone]}`}>
                      {badge.label}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 p-2.5">
        <div className="flex items-center gap-2.5 rounded-xl bg-white/5 px-2.5 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
            {user?.initials ?? '??'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium">{user?.name ?? '...'}</div>
            <div className="text-[11px] text-white/45">{user?.role ?? ''}</div>
          </div>
          <button type="button" onClick={onLogout} className="rounded-md p-1 text-white/45 transition-colors hover:bg-white/10 hover:text-white" aria-label="Cerrar sesión">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
