import { useQuery } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { PageHeader } from '@/shared/ui/PageHeader';
import { KpiCard } from '@/shared/ui/KpiCard';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';

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
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Productos totales" value={s.totalProducts.toLocaleString('es-ES')} delta="▲ 4.2% este mes" />
        <KpiCard label="SKUs activos" value={s.activeSkus.toLocaleString('es-ES')} delta="▲ 1.8% esta semana" valueColor="text-success" />
        <KpiCard label="Workflows activos" value={String(s.activeWorkflows)} delta="Sin cambios hoy" valueColor="text-warning" />
        <KpiCard label="Canales publicados" value={String(s.publishedChannels)} delta="▲ 1 nuevo canal" valueColor="text-info" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[14px] border border-border bg-bg-card p-5">
          <h3 className="mb-4 text-sm font-medium text-text-secondary">Actividad reciente</h3>
          <div className="space-y-4">
            {(activity.data ?? []).map((item: { id: string; message: string; module: string }) => (
              <div key={item.id} className="text-sm">
                <div>{item.message}</div>
                <div className="text-xs text-text-muted">{item.module}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[14px] border border-border bg-bg-card p-5">
          <h3 className="mb-4 text-sm font-medium text-text-secondary">Productos por canal</h3>
          <div className="space-y-3">
            {(channels.data ?? []).map((ch: { name: string; count: number; percentage: number }) => (
              <div key={ch.name} className="flex items-center gap-3 text-sm">
                <div className="w-28 shrink-0 text-text-secondary">{ch.name}</div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg-surface">
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
