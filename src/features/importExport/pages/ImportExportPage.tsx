import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { PageHeader } from '@/shared/ui/PageHeader';
import { DataTable } from '@/shared/ui/DataTable';
import { StatusTag } from '@/shared/ui/StatusTag';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';

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
            <button type="button" onClick={() => createExport.mutate()} className="rounded-[10px] border border-border px-4 py-2 text-sm text-text-secondary hover:bg-white/4">Exportar</button>
            <button type="button" onClick={() => createImport.mutate()} className="rounded-[10px] bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover">+ Nueva importación</button>
          </>
        }
      />
      <h3 className="mb-3 text-sm font-medium text-text-secondary">Importaciones</h3>
      <DataTable data={imports.data.data} columns={[
        { key: 'code', header: 'Job' }, { key: 'type', header: 'Tipo' },
        { key: 'rowCount', header: 'Filas' },
        { key: 'status', header: 'Estado', render: (r) => <StatusTag status={String(r.status)} /> },
      ]} />
      <h3 className="mb-3 mt-8 text-sm font-medium text-text-secondary">Exportaciones</h3>
      <DataTable data={exports.data.data} columns={[
        { key: 'code', header: 'Job' }, { key: 'type', header: 'Tipo' },
        { key: 'status', header: 'Estado', render: (r) => <StatusTag status={String(r.status)} /> },
      ]} />
    </div>
  );
}
