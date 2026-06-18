import { PageHeader } from '@/shared/ui/PageHeader';
import { StatChip } from '@/shared/ui/StatChip';
import { surfacePanelClass } from '@/shared/ui/buttonStyles';

export function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Configuración"
        subtitle="Ajustes base del espacio de trabajo, usuarios y parámetros operativos de Lumify PIM."
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatChip label="Entorno" value="SaaS" color="text-accent" />
        <StatChip label="Autenticación" value="JWT" color="text-info" />
        <StatChip label="Estado" value="Base lista" color="text-success" />
      </div>
      <div className={`${surfacePanelClass} p-5`}>
        <h2 className="text-lg font-semibold text-brand-deep">Configuración inicial</h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Este módulo queda preparado para conectar ajustes de tenant, branding, auditoría, permisos y preferencias globales.
        </p>
      </div>
    </div>
  );
}
