import { PageHeader } from '@/shared/ui/PageHeader';
import { KpiCard } from '@/shared/ui/KpiCard';

export function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Resumen general de la plataforma Lumify PIM"
      />
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Productos totales" value="12.847" delta="▲ 4.2% este mes" />
        <KpiCard label="SKUs activos" value="38.210" delta="▲ 1.8% esta semana" valueColor="text-success" />
        <KpiCard label="Workflows activos" value="247" delta="Sin cambios hoy" valueColor="text-warning" />
        <KpiCard label="Canales publicados" value="8" delta="▲ 1 nuevo canal" valueColor="text-info" />
      </div>
      <p className="text-sm text-text-secondary">
        Los datos se conectarán a la API cuando el módulo dashboard esté implementado (BE-010).
      </p>
    </div>
  );
}
