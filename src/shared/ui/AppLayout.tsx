import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  LayoutDashboard, Tags, Package, FolderTree, ArrowUpDown, Shuffle,
  GitBranch, Radio, Globe, Image, Users,
} from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { http } from '@/shared/api/http';
import { useAuthMe } from '@/features/auth/hooks/useAuthMe';
import { authKeys } from '@/features/auth/queries';
import { logout } from '@/features/auth/api';
import { useQuery } from '@tanstack/react-query';
import { Sidebar, type NavSection } from './Sidebar';
import { Topbar } from './Topbar';
import { SearchInput } from './SearchInput';
import { usePermissions } from '@/shared/hooks/usePermissions';

const navSections: NavSection[] = [
  {
    label: 'Principal',
    items: [{ to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Catálogo',
    items: [
      { to: '/app/attributes', label: 'Atributos', icon: Tags, badge: { label: '02', tone: 'live' } },
      { to: '/app/products', label: 'PDP / Búsqueda', icon: Package, badge: { label: '03', tone: 'live' } },
      { to: '/app/categories', label: 'Categorías', icon: FolderTree },
    ],
  },
  {
    label: 'Operaciones',
    items: [
      { to: '/app/import-export', label: 'Import / Export', icon: ArrowUpDown, badge: { label: '05', tone: 'live' } },
      { to: '/app/mapping', label: 'Mapping', icon: Shuffle },
      { to: '/app/workflows', label: 'Workflows', icon: GitBranch },
    ],
  },
  {
    label: 'Distribución',
    items: [
      { to: '/app/channels', label: 'Canales', icon: Radio, badge: { label: '09', tone: 'live' } },
      { to: '/app/gdsn', label: 'GDSN / GS1', icon: Globe },
    ],
  },
  {
    label: 'Plataforma',
    items: [
      { to: '/app/dam', label: 'DAM', icon: Image, badge: { label: 'Beta', tone: 'beta' } },
      { to: '/app/users', label: 'Usuarios / Roles', icon: Users, badge: { label: '07', tone: 'live' } },
    ],
  },
];

const routeTitles: Record<string, string> = {
  dashboard: 'Dashboard', attributes: 'Atributos', products: 'PDP / Búsqueda',
  categories: 'Categorías', 'import-export': 'Import / Export', mapping: 'Mapping',
  workflows: 'Workflows', channels: 'Canales', gdsn: 'GDSN / GS1', dam: 'DAM', users: 'Usuarios / Roles', settings: 'Configuración',
};

export function AppLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const { data: user } = useAuthMe();
  const { hasPermission } = usePermissions();
  const [searchQ, setSearchQ] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const segment = location.pathname.split('/').pop() ?? 'dashboard';
  const title = routeTitles[segment] ?? segment;

  const searchResults = useQuery({
    queryKey: ['search', searchQ],
    queryFn: async () => (await http.get('/search', { params: { q: searchQ } })).data,
    enabled: searchQ.length >= 2,
  });

  const handleLogout = async () => {
    await logout().catch(() => undefined);
    await queryClient.removeQueries({ queryKey: authKeys.me() });
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
      <Sidebar
        sections={navSections}
        pathname={location.pathname}
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
      />
      <div className="flex min-h-screen flex-1 flex-col lg:pl-60">
        <Topbar
          title={title}
          userInitials={user?.initials}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenSettings={() => handleNavigate('/app/settings')}
          canOpenSettings={hasPermission({ roles: ['PIM_MANAGER', 'IT_ADMIN'] })}
          search={(
            <>
              <SearchInput value={searchQ} onChange={setSearchQ} />
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
            </>
          )}
        />
        <main className="flex-1 p-4 sm:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
