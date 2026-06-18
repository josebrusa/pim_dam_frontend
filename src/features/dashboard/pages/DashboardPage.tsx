import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/shared/ui/PageHeader';
import { KpiCard } from '@/shared/ui/KpiCard';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';
import { surfacePanelClass } from '@/shared/ui/buttonStyles';
import { useDashboardActivityQuery, useDashboardProductsByChannelQuery, useDashboardSummaryQuery } from '../queries';

const modules = [
  { to: '/app/attributes', name: 'Atributos', desc: 'Gestión de atributos y grupos', icon: '◈', tone: 'bg-indigo-500/10 text-indigo-600', status: 'Módulo 02' },
  { to: '/app/products', name: 'PDP / Búsqueda', desc: 'Fichas de producto y búsqueda', icon: '◉', tone: 'bg-blue-500/10 text-blue-600', status: 'Módulo 03' },
  { to: '/app/import-export', name: 'Import / Export', desc: 'Importación y exportación de datos', icon: '⇅', tone: 'bg-emerald-500/10 text-emerald-600', status: 'Módulo 05' },
  { to: '/app/users', name: 'Usuarios / Roles', desc: 'Permisos y control de acceso', icon: '◑', tone: 'bg-amber-500/10 text-amber-600', status: 'Módulo 07' },
  { to: '/app/channels', name: 'Canales', desc: 'Conectividad y publicación', icon: '⊕', tone: 'bg-rose-500/10 text-rose-600', status: 'Módulo 09' },
  { to: '/app/categories', name: 'Categorías', desc: 'Taxonomías y jerarquías', icon: '◫', tone: 'bg-cyan-500/10 text-cyan-600', status: 'Activo' },
  { to: '/app/workflows', name: 'Workflows', desc: 'Flujos de aprobación', icon: '⊹', tone: 'bg-violet-500/10 text-violet-600', status: 'Activo' },
  { to: '/app/mapping', name: 'Mapping', desc: 'Transformaciones y mapeos', icon: '⇌', tone: 'bg-yellow-500/10 text-yellow-700', status: 'Activo' },
  { to: '/app/dam', name: 'DAM', desc: 'Gestión de activos digitales', icon: '⊡', tone: 'bg-pink-500/10 text-pink-600', status: 'Beta' },
  { to: '/app/gdsn', name: 'GDSN / GS1', desc: 'Sincronización global', icon: '◎', tone: 'bg-teal-500/10 text-teal-600', status: 'Activo' },
] as const;

export function DashboardPage() {
  const navigate = useNavigate();
  const summary = useDashboardSummaryQuery();
  const activity = useDashboardActivityQuery();
  const channels = useDashboardProductsByChannelQuery();

  if (summary.isLoading) return <LoadingState />;
  if (summary.isError) return <ErrorState />;
  if (!summary.data) return <LoadingState />;

  const s = summary.data;
  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Resumen general de la plataforma Lumify PIM" />
      <div className="mb-8 overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#0a3d62_0%,#0d4f7e_60%,#0a3558_100%)] p-6 text-white shadow-[0_24px_60px_rgba(10,61,98,0.18)]">
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-end">
          <div>
            <div className="mb-3 inline-flex rounded-full bg-accent/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
              Control centralizado del catalogo
            </div>
            <h2 className="max-w-2xl text-2xl font-semibold tracking-tight">
              Opera producto, contenido y publicacion desde una misma vista de trabajo.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
              Lumify combina datos, aprobaciones y sincronizacion omnicanal con una capa visual clara y enfocada en confianza operativa.
            </p>
          </div>
          <div className="grid gap-3 rounded-[20px] border border-white/10 bg-white/8 p-4 backdrop-blur-sm sm:grid-cols-3 lg:grid-cols-1">
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-white/60">Cobertura</div>
              <div className="mt-1 text-xl font-semibold">{s.publishedChannels} canales</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-white/60">Catalogo activo</div>
              <div className="mt-1 text-xl font-semibold">{s.activeSkus.toLocaleString('es-ES')} SKUs</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-white/60">Workflows</div>
              <div className="mt-1 text-xl font-semibold">{s.activeWorkflows} en curso</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Productos totales" value={s.totalProducts.toLocaleString('es-ES')} delta="▲ 4.2% este mes" />
        <KpiCard label="SKUs activos" value={s.activeSkus.toLocaleString('es-ES')} delta="▲ 1.8% esta semana" valueColor="text-success" />
        <KpiCard label="Workflows activos" value={String(s.activeWorkflows)} delta="Sin cambios hoy" valueColor="text-warning" />
        <KpiCard label="Canales publicados" value={String(s.publishedChannels)} delta="▲ 1 nuevo canal" valueColor="text-info" />
      </div>
      <div className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-text-secondary">Módulos del sistema</div>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {modules.map((module) => (
          <button
            key={module.to}
            type="button"
            onClick={() => navigate(module.to)}
            className={`${surfacePanelClass} flex flex-col gap-3 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-accent/30 hover:bg-white`}
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl ${module.tone}`}>
              {module.icon}
            </div>
            <div>
              <div className="text-sm font-semibold text-brand-deep">{module.name}</div>
              <div className="mt-1 text-xs leading-5 text-text-muted">{module.desc}</div>
            </div>
            <span className="mt-auto inline-flex w-fit rounded-full bg-bg-surface px-2.5 py-1 text-[11px] font-medium text-text-secondary">
              {module.status}
            </span>
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className={`${surfacePanelClass} p-5`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-text-secondary">Actividad reciente</h3>
            <button type="button" className="text-xs font-medium text-accent transition-colors hover:text-accent-hover">Ver todo</button>
          </div>
          <div className="space-y-4">
            {(activity.data ?? []).map((item) => (
              <div key={item.id} className="rounded-2xl border border-border/70 bg-bg-surface/60 p-4 text-sm">
                <div className="font-medium text-brand-deep">{item.message}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.14em] text-text-muted">{item.module}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={`${surfacePanelClass} p-5`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-text-secondary">Productos por canal</h3>
            <button type="button" className="text-xs font-medium text-accent transition-colors hover:text-accent-hover">Gestionar canales</button>
          </div>
          <div className="space-y-3">
            {(channels.data ?? []).map((ch) => (
              <div key={ch.name} className="flex items-center gap-3 text-sm">
                <div className="w-28 shrink-0 text-text-secondary">{ch.name}</div>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-bg-surface">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${ch.percentage}%` }} />
                </div>
                <div className="w-16 text-right text-text-muted">{ch.count.toLocaleString('es-ES')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
