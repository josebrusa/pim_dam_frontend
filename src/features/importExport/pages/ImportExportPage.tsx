import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { PageHeader } from '@/shared/ui/PageHeader';
import { DataTable } from '@/shared/ui/DataTable';
import { StatusTag } from '@/shared/ui/StatusTag';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';
import { primaryButtonClass, secondaryButtonClass } from '@/shared/ui/buttonStyles';

export function ImportExportPage() {
  const qc = useQueryClient();
  const imports = useQuery({ queryKey: ['imports'], queryFn: async () => (await http.get('/imports')).data });
  const exports = useQuery({ queryKey: ['exports'], queryFn: async () => (await http.get('/exports')).data });

  const createImport = useMutation({
    mutationFn: () => http.post('/imports', { type: 'CSV' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['imports'] }),
  });
  const createExport = useMutation({
    mutationFn: () => http.post('/exports', { type: 'products' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exports'] }),
  });

  if (imports.isLoading || exports.isLoading) return <LoadingState />;
  if (imports.isError || exports.isError) return <ErrorState />;

  return (
    <div>
      <PageHeader
        title="Import / Export"
        subtitle="Módulo 05 — Importación y exportación masiva de datos"
        actions={
          <>
             <button type="button" onClick={() => createExport.mutate()} className={secondaryButtonClass}>Exportar</button>
             <button type="button" onClick={() => createImport.mutate()} className={primaryButtonClass}>+ Nueva importación</button>
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
