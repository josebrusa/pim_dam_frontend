import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/shared/ui/PageHeader';
import { DataTable } from '@/shared/ui/DataTable';
import { StatusTag } from '@/shared/ui/StatusTag';
import { StatChip } from '@/shared/ui/StatChip';
import { FormModal, FormField, inputClass } from '@/shared/ui/FormModal';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';
import { ActionButton } from '@/shared/ui/ActionButton';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { createWorkflow, deleteWorkflow, updateWorkflow } from '../api';
import { useMyWorkflowTasksQuery, useWorkflowsQuery, workflowsKeys } from '../queries';
import type { WorkflowItem, WorkflowUpdateForm } from '../types';

export function WorkflowsPage() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [showMyTasks, setShowMyTasks] = useState(false);
  const [name, setName] = useState('');
  const [editingWorkflow, setEditingWorkflow] = useState<WorkflowItem | null>(null);
  const [editForm, setEditForm] = useState<WorkflowUpdateForm>({ name: '', status: 'active' });
  const qc = useQueryClient();
  const { hasPermission } = usePermissions();

  const { data, isLoading, isError } = useWorkflowsQuery();

  const myTasks = useMyWorkflowTasksQuery(showMyTasks);

  const create = useMutation({
    mutationFn: createWorkflow,
    onSuccess: () => { qc.invalidateQueries({ queryKey: workflowsKeys.all }); setOpen(false); },
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: WorkflowUpdateForm }) => updateWorkflow(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: workflowsKeys.all });
      setEditOpen(false);
      setEditingWorkflow(null);
    },
  });

  const remove = useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: workflowsKeys.all });
      setConfirmDeleteOpen(false);
      setEditingWorkflow(null);
    },
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!data) return <LoadingState />;

  const canWriteWorkflows = hasPermission('workflows:write');

  const handleEdit = (workflow: WorkflowItem) => {
    setEditingWorkflow(workflow);
    setEditForm({ name: workflow.name, status: workflow.status });
    setEditOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Workflows"
        subtitle="Flujos de aprobación y ciclo de vida del producto"
        actions={
          <>
            <ActionButton variant="secondary" onClick={() => setShowMyTasks(!showMyTasks)}>
                {showMyTasks ? 'Ver todos' : 'Ver mis tareas'}
            </ActionButton>
            <ActionButton onClick={() => setOpen(true)} disabled={!canWriteWorkflows}>+ Nuevo workflow</ActionButton>
            </>
          }
        />
      {!showMyTasks && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-4">
            <StatChip label="Activos" value={data.stats.active} color="text-accent" />
            <StatChip label="Pendientes" value={data.stats.pending} color="text-warning" />
            <StatChip label="Completados" value={data.stats.completed} color="text-success" />
            <StatChip label="Bloqueados" value={data.stats.blocked} color="text-danger" />
          </div>
          <DataTable
            data={data.workflows.data}
            columns={[
              { key: 'name', header: 'Workflow' },
              { key: 'status', header: 'Estado', render: (r) => <StatusTag status={String(r.status)} /> },
              { key: 'tasks', header: 'Tareas', render: (r) => Number((r._count as { tasks?: number } | undefined)?.tasks ?? 0) },
              {
                key: 'actions',
                header: 'Acciones',
                render: (r) => canWriteWorkflows ? (
                  <div className="flex gap-3">
                    <button type="button" className="text-sm font-medium text-accent transition-colors hover:text-accent-hover" onClick={() => handleEdit(r as WorkflowItem)}>Editar</button>
                    <button type="button" className="text-sm font-medium text-danger transition-colors hover:opacity-80" onClick={() => { setEditingWorkflow(r as WorkflowItem); setConfirmDeleteOpen(true); }}>Eliminar</button>
                  </div>
                ) : '—',
              },
            ]}
          />
        </>
      )}
      {showMyTasks && (
        <DataTable
          data={myTasks.data ?? []}
          columns={[
            { key: 'workflow', header: 'Workflow', render: (r) => (r.workflow as { name?: string })?.name ?? '—' },
            { key: 'productName', header: 'Producto' },
            { key: 'stage', header: 'Etapa' },
            { key: 'priority', header: 'Prioridad', render: (r) => <StatusTag status={String(r.priority)} /> },
            { key: 'status', header: 'Estado', render: (r) => <StatusTag status={String(r.status)} label={String(r.status).replace('_', ' ')} /> },
          ]}
        />
      )}
      <FormModal open={open} title="Nuevo workflow" onClose={() => setOpen(false)} onSubmit={(e) => { e.preventDefault(); create.mutate({ name }); }} loading={create.isPending}>
        <FormField label="Nombre"><input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required /></FormField>
      </FormModal>
      <FormModal open={editOpen} title={editingWorkflow ? `Editar ${editingWorkflow.name}` : 'Editar workflow'} onClose={() => { setEditOpen(false); setEditingWorkflow(null); }} onSubmit={(e) => { e.preventDefault(); if (editingWorkflow) update.mutate({ id: editingWorkflow.id, body: editForm }); }} loading={update.isPending} submitLabel="Guardar cambios">
        <FormField label="Nombre"><input className={inputClass} value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required /></FormField>
        <FormField label="Estado">
          <select className={inputClass} value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
            <option value="active">Activo</option>
            <option value="paused">Pausado</option>
            <option value="archived">Archivado</option>
          </select>
        </FormField>
      </FormModal>
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Eliminar workflow"
        message={`Se eliminará ${editingWorkflow?.name ?? 'este workflow'} con sus tareas asociadas.`}
        confirmLabel="Eliminar"
        loading={remove.isPending}
        onClose={() => { setConfirmDeleteOpen(false); setEditingWorkflow(null); }}
        onConfirm={() => {
          if (editingWorkflow) remove.mutate(editingWorkflow.id);
        }}
      />
    </div>
  );
}
