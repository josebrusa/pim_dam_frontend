import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Tags,
  Package,
  FolderTree,
  ArrowUpDown,
  Shuffle,
  GitBranch,
  Radio,
  Globe,
  Image,
  Users,
  LogOut,
  Search,
} from 'lucide-react';
import { authStorage } from '@/shared/api/http';

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/attributes', label: 'Atributos', icon: Tags },
  { to: '/app/products', label: 'PDP / Búsqueda', icon: Package },
  { to: '/app/categories', label: 'Categorías', icon: FolderTree },
  { to: '/app/import-export', label: 'Import / Export', icon: ArrowUpDown },
  { to: '/app/mapping', label: 'Mapping', icon: Shuffle },
  { to: '/app/workflows', label: 'Workflows', icon: GitBranch },
  { to: '/app/channels', label: 'Canales', icon: Radio },
  { to: '/app/gdsn', label: 'GDSN / GS1', icon: Globe },
  { to: '/app/dam', label: 'DAM', icon: Image },
  { to: '/app/users', label: 'Usuarios / Roles', icon: Users },
];

const routeTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  attributes: 'Atributos',
  products: 'PDP / Búsqueda',
  categories: 'Categorías',
  'import-export': 'Import / Export',
  mapping: 'Mapping',
  workflows: 'Workflows',
  channels: 'Canales',
  gdsn: 'GDSN / GS1',
  dam: 'DAM',
  users: 'Usuarios / Roles',
};

function breadcrumbFromPath(pathname: string) {
  const segment = pathname.split('/').pop() ?? 'dashboard';
  return routeTitles[segment] ?? segment;
}

export function AppLayout() {
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const title = breadcrumbFromPath(pathname);

  const handleLogout = () => {
    authStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-border bg-bg-sidebar">
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-mono text-sm font-medium text-white">
            L
          </div>
          <span className="text-[15px] font-semibold">Lumify PIM</span>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[13.5px] transition-colors ${
                  isActive
                    ? 'bg-accent/12 text-accent'
                    : 'text-text-secondary hover:bg-white/4 hover:text-text-primary'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border p-2.5">
          <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-violet-500 text-xs font-semibold text-white">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-medium">Admin</div>
              <div className="text-[11px] text-text-muted">PIM_MANAGER</div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md p-1 text-text-muted hover:bg-white/4 hover:text-text-primary"
              aria-label="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col pl-60">
        <header className="sticky top-0 z-40 flex h-[60px] items-center gap-4 border-b border-border bg-bg-base/80 px-6 backdrop-blur">
          <div className="text-sm text-text-secondary">
            Lumify PIM / <span className="text-text-primary">{title}</span>
          </div>
          <div className="ml-auto flex max-w-md flex-1 items-center gap-2 rounded-lg border border-border bg-bg-input px-3 py-2">
            <Search className="h-4 w-4 text-text-muted" />
            <input
              type="search"
              placeholder="Buscar productos, atributos..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted"
            />
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
