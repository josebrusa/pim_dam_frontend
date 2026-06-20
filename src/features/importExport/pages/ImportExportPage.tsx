import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { DataTable } from '@/shared/ui/DataTable';
import { StatusTag } from '@/shared/ui/StatusTag';
import { FormModal, FormField, inputClass } from '@/shared/ui/FormModal';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';
import { ActionButton } from '@/shared/ui/ActionButton';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { createExportJob, createImportJob, deleteExportJob, deleteImportJob, updateExportJob, updateImportJob } from '../api';
import { importExportKeys, useExportsQuery, useImportsQuery } from '../queries';
import type { JobItem, JobUpdateForm } from '../types';

export function ImportExportPage() {
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobItem | null>(null);
  const [editingKind, setEditingKind] = useState<'import' | 'export'>('import');
  const [editForm, setEditForm] = useState<JobUpdateForm>({ type: '', status: 'pending' });
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
  const updateImport = useMutation({ mutationFn: ({ id, body }: { id: string; body: JobUpdateForm }) => updateImportJob(id, body), onSuccess: () => { qc.invalidateQueries({ queryKey: importExportKeys.imports }); setEditOpen(false); setEditingJob(null); } });
  const updateExport = useMutation({ mutationFn: ({ id, body }: { id: string; body: JobUpdateForm }) => updateExportJob(id, body), onSuccess: () => { qc.invalidateQueries({ queryKey: importExportKeys.exports }); setEditOpen(false); setEditingJob(null); } });
  const removeImport = useMutation({ mutationFn: deleteImportJob, onSuccess: () => { qc.invalidateQueries({ queryKey: importExportKeys.imports }); setConfirmDeleteOpen(false); setEditingJob(null); } });
  const removeExport = useMutation({ mutationFn: deleteExportJob, onSuccess: () => { qc.invalidateQueries({ queryKey: importExportKeys.exports }); setConfirmDeleteOpen(false); setEditingJob(null); } });

  if (imports.isLoading || exports.isLoading) return <LoadingState />;
  if (imports.isError || exports.isError) return <ErrorState />;
  if (!imports.data || !exports.data) return <LoadingState />;

  const canWriteImports = hasPermission('imports:write');

  const handleEdit = (job: JobItem, kind: 'import' | 'export') => {
    setEditingJob(job);
    setEditingKind(kind);
    setEditForm({ type: job.type, status: job.status });
    setEditOpen(true);
  };

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
         { key: 'actions', header: 'Acciones', render: (r) => canWriteImports ? <div className="flex gap-3"><button type="button" className="text-sm font-medium text-accent transition-colors hover:text-accent-hover" onClick={() => handleEdit(r as JobItem, 'import')}>Editar</button><button type="button" className="text-sm font-medium text-danger transition-colors hover:opacity-80" onClick={() => { setEditingJob(r as JobItem); setEditingKind('import'); setConfirmDeleteOpen(true); }}>Eliminar</button></div> : '—' },
       ]} />
      <h3 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-text-secondary">Exportaciones</h3>
      <DataTable data={exports.data.data} columns={[
         { key: 'code', header: 'Job' }, { key: 'type', header: 'Tipo' },
         { key: 'status', header: 'Estado', render: (r) => <StatusTag status={String(r.status)} /> },
         { key: 'actions', header: 'Acciones', render: (r) => canWriteImports ? <div className="flex gap-3"><button type="button" className="text-sm font-medium text-accent transition-colors hover:text-accent-hover" onClick={() => handleEdit(r as JobItem, 'export')}>Editar</button><button type="button" className="text-sm font-medium text-danger transition-colors hover:opacity-80" onClick={() => { setEditingJob(r as JobItem); setEditingKind('export'); setConfirmDeleteOpen(true); }}>Eliminar</button></div> : '—' },
       ]} />
      <FormModal open={editOpen} title={editingJob ? `Editar ${editingJob.code}` : 'Editar job'} onClose={() => { setEditOpen(false); setEditingJob(null); }} onSubmit={(e) => { e.preventDefault(); if (!editingJob) return; if (editingKind === 'import') updateImport.mutate({ id: editingJob.id, body: editForm }); else updateExport.mutate({ id: editingJob.id, body: editForm }); }} loading={updateImport.isPending || updateExport.isPending} submitLabel="Guardar cambios">
        <FormField label="Tipo"><input className={inputClass} value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })} required /></FormField>
        <FormField label="Estado"><select className={inputClass} value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}><option value="pending">Pendiente</option><option value="processing">Procesando</option><option value="completed">Completado</option><option value="failed">Fallido</option></select></FormField>
      </FormModal>
      <ConfirmDialog open={confirmDeleteOpen} title="Eliminar job" message={`Se eliminará ${editingJob?.code ?? 'este job'}.`} confirmLabel="Eliminar" loading={removeImport.isPending || removeExport.isPending} onClose={() => { setConfirmDeleteOpen(false); setEditingJob(null); }} onConfirm={() => { if (!editingJob) return; if (editingKind === 'import') removeImport.mutate(editingJob.id); else removeExport.mutate(editingJob.id); }} />
    </div>
  );
}
