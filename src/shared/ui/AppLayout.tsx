import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Tags, Package, FolderTree, ArrowUpDown, Shuffle,
  GitBranch, Radio, Globe, Image, Users, LogOut, Search,
} from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { authStorage, http } from '@/shared/api/http';
import { useAuthMe } from '@/features/auth/hooks/useAuthMe';
import { useQuery } from '@tanstack/react-query';

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
  dashboard: 'Dashboard', attributes: 'Atributos', products: 'PDP / Búsqueda',
  categories: 'Categorías', 'import-export': 'Import / Export', mapping: 'Mapping',
  workflows: 'Workflows', channels: 'Canales', gdsn: 'GDSN / GS1', dam: 'DAM', users: 'Usuarios / Roles',
};

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useAuthMe();
  const [searchQ, setSearchQ] = useState('');

  const segment = location.pathname.split('/').pop() ?? 'dashboard';
  const title = routeTitles[segment] ?? segment;

  const searchResults = useQuery({
    queryKey: ['search', searchQ],
    queryFn: async () => (await http.get('/search', { params: { q: searchQ } })).data,
    enabled: searchQ.length >= 2,
  });

  const handleLogout = () => {
    authStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-border bg-bg-sidebar">
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-mono text-sm font-medium text-white">L</div>
          <span className="text-[15px] font-semibold">Lumify PIM</span>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <a key={to} href={to} onClick={(e) => { e.preventDefault(); navigate(to); }}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[13.5px] transition-colors ${location.pathname === to ? 'bg-accent/12 text-accent' : 'text-text-secondary hover:bg-white/4 hover:text-text-primary'}`}>
              <Icon className="h-4 w-4 shrink-0" />{label}
            </a>
          ))}
        </nav>
        <div className="border-t border-border p-2.5">
          <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-violet-500 text-xs font-semibold text-white">
              {user?.initials ?? '??'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-medium">{user?.name ?? '...'}</div>
              <div className="text-[11px] text-text-muted">{user?.role ?? ''}</div>
            </div>
            <button type="button" onClick={handleLogout} className="rounded-md p-1 text-text-muted hover:bg-white/4 hover:text-text-primary" aria-label="Cerrar sesión">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col pl-60">
        <header className="sticky top-0 z-40 flex h-[60px] items-center gap-4 border-b border-border bg-bg-base/80 px-6 backdrop-blur">
          <div className="text-sm text-text-secondary">Lumify PIM / <span className="text-text-primary">{title}</span></div>
          <div className="relative ml-auto flex max-w-md flex-1 items-center gap-2 rounded-lg border border-border bg-bg-input px-3 py-2">
            <Search className="h-4 w-4 text-text-muted" />
            <input type="search" placeholder="Buscar productos, atributos..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted" />
            {searchResults.data && searchQ.length >= 2 && (
              <div className="absolute left-0 right-0 top-full mt-1 max-h-64 overflow-y-auto rounded-lg border border-border bg-bg-card shadow-xl">
                {searchResults.data.products?.map((p: { id: string; name: string; code: string }) => (
                  <button key={p.id} type="button" onClick={() => { navigate('/app/products'); setSearchQ(''); }}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-white/4">
                    <span className="text-text-muted">Producto</span> · {p.code} — {p.name}
                  </button>
                ))}
                {searchResults.data.attributes?.map((a: { id: string; name: string; code: string }) => (
                  <button key={a.id} type="button" onClick={() => { navigate('/app/attributes'); setSearchQ(''); }}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-white/4">
                    <span className="text-text-muted">Atributo</span> · {a.code} — {a.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 p-6"><Outlet /></main>
      </div>
    </div>
  );
}
