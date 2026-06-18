import { useQuery } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { PageHeader } from '@/shared/ui/PageHeader';
import { KpiCard } from '@/shared/ui/KpiCard';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';
import { surfacePanelClass } from '@/shared/ui/buttonStyles';

export function DashboardPage() {
  const summary = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => (await http.get('/dashboard/summary')).data,
  });
  const activity = useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: async () => (await http.get('/dashboard/activity')).data,
  });
  const channels = useQuery({
    queryKey: ['dashboard', 'products-by-channel'],
    queryFn: async () => (await http.get('/dashboard/products-by-channel')).data,
  });

  if (summary.isLoading) return <LoadingState />;
  if (summary.isError) return <ErrorState />;

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
      <div className="grid gap-6 lg:grid-cols-2">
        <div className={`${surfacePanelClass} p-5`}>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-text-secondary">Actividad reciente</h3>
          <div className="space-y-4">
            {(activity.data ?? []).map((item: { id: string; message: string; module: string }) => (
              <div key={item.id} className="rounded-2xl border border-border/70 bg-bg-surface/60 p-4 text-sm">
                <div className="font-medium text-brand-deep">{item.message}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.14em] text-text-muted">{item.module}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={`${surfacePanelClass} p-5`}>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-text-secondary">Productos por canal</h3>
          <div className="space-y-3">
            {(channels.data ?? []).map((ch: { name: string; count: number; percentage: number }) => (
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
