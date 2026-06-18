import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Tags, Package, FolderTree, ArrowUpDown, Shuffle,
  GitBranch, Radio, Globe, Image, Users, LogOut, Search, Menu, X,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleNavigate = (to: string) => {
    navigate(to);
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-bg-base">
      <div
        className={`fixed inset-0 z-40 bg-[rgba(31,42,55,0.45)] backdrop-blur-sm transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[88vw] flex-col border-r border-white/10 bg-[linear-gradient(180deg,#0a3d62_0%,#1f2a37_100%)] text-white shadow-[0_20px_50px_rgba(10,61,98,0.18)] transition-transform lg:w-60 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent font-mono text-sm font-medium text-white shadow-[0_10px_30px_rgba(60,157,255,0.35)]">L</div>
          <span className="text-[15px] font-semibold">Lumify PIM</span>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Cerrar navegación"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <a key={to} href={to} onClick={(e) => { e.preventDefault(); handleNavigate(to); }}
              className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-[13.5px] transition-colors ${location.pathname === to ? 'bg-accent/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
              <Icon className="h-4 w-4 shrink-0" />{label}
            </a>
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
            <button type="button" onClick={handleLogout} className="rounded-md p-1 text-white/45 transition-colors hover:bg-white/10 hover:text-white" aria-label="Cerrar sesión">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col lg:pl-60">
        <header className="sticky top-0 z-30 flex min-h-[68px] flex-wrap items-center gap-3 border-b border-border bg-white/85 px-4 py-3 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-brand-deep shadow-[0_8px_20px_rgba(10,61,98,0.06)] lg:hidden"
            aria-label="Abrir navegación"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1 text-sm text-text-secondary lg:flex-none">Lumify PIM / <span className="font-medium text-brand-deep">{title}</span></div>
          <div className="relative order-3 w-full lg:order-none lg:ml-auto lg:flex lg:max-w-md lg:flex-1">
            <div className="flex w-full items-center gap-2 rounded-full border border-border bg-white px-4 py-2 shadow-[0_8px_20px_rgba(10,61,98,0.06)]">
            <Search className="h-4 w-4 text-text-muted" />
            <input type="search" placeholder="Buscar productos, atributos..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted" />
            </div>
            {searchResults.data && searchQ.length >= 2 && (
              <div className="absolute left-0 right-0 top-full mt-2 max-h-64 overflow-y-auto rounded-2xl border border-border bg-bg-card shadow-[0_24px_60px_rgba(10,61,98,0.12)]">
                {searchResults.data.products?.map((p: { id: string; name: string; code: string }) => (
                  <button key={p.id} type="button" onClick={() => { handleNavigate('/app/products'); setSearchQ(''); }}
                    className="block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-accent/5">
                    <span className="text-text-muted">Producto</span> · {p.code} — {p.name}
                  </button>
                ))}
                {searchResults.data.attributes?.map((a: { id: string; name: string; code: string }) => (
                  <button key={a.id} type="button" onClick={() => { handleNavigate('/app/attributes'); setSearchQ(''); }}
                    className="block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-accent/5">
                    <span className="text-text-muted">Atributo</span> · {a.code} — {a.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
