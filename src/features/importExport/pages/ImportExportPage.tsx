import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/shared/ui/PageHeader';
import { DataTable } from '@/shared/ui/DataTable';
import { StatusTag } from '@/shared/ui/StatusTag';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';
import { ActionButton } from '@/shared/ui/ActionButton';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { createExportJob, createImportJob } from '../api';
import { importExportKeys, useExportsQuery, useImportsQuery } from '../queries';

export function ImportExportPage() {
  const qc = useQueryClient();
  const { hasPermission } = usePermissions();
  const imports = useImportsQuery();
  const exports = useExportsQuery();

  const createImport = useMutation({
    mutationFn: createImportJob,
    onSuccess: () => qc.invalidateQueries({ queryKey: importExportKeys.imports }),
  });
  const createExport = useMutation({
    mutationFn: createExportJob,
    onSuccess: () => qc.invalidateQueries({ queryKey: importExportKeys.exports }),
  });

  if (imports.isLoading || exports.isLoading) return <LoadingState />;
  if (imports.isError || exports.isError) return <ErrorState />;
  if (!imports.data || !exports.data) return <LoadingState />;

  const canWriteImports = hasPermission('imports:write');

  return (
    <div>
      <PageHeader
        title="Import / Export"
        subtitle="Módulo 05 — Importación y exportación masiva de datos"
        actions={
          <>
            <ActionButton variant="secondary" onClick={() => createExport.mutate()} disabled={!canWriteImports}>Exportar</ActionButton>
            <ActionButton onClick={() => createImport.mutate()} disabled={!canWriteImports}>+ Nueva importación</ActionButton>
            </>
          }
        />
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-text-secondary">Importaciones</h3>
      <DataTable data={imports.data.data} columns={[
        { key: 'code', header: 'Job' }, { key: 'type', header: 'Tipo' },
        { key: 'rowCount', header: 'Filas' },
        { key: 'status', header: 'Estado', render: (r) => <StatusTag status={String(r.status)} /> },
      ]} />
      <h3 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-text-secondary">Exportaciones</h3>
      <DataTable data={exports.data.data} columns={[
        { key: 'code', header: 'Job' }, { key: 'type', header: 'Tipo' },
        { key: 'status', header: 'Estado', render: (r) => <StatusTag status={String(r.status)} /> },
      ]} />
    </div>
  );
}
