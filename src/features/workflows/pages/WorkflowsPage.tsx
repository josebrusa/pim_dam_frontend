import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { PageHeader } from '@/shared/ui/PageHeader';
import { DataTable } from '@/shared/ui/DataTable';
import { StatusTag } from '@/shared/ui/StatusTag';
import { StatChip } from '@/shared/ui/StatChip';
import { FormModal, FormField, inputClass } from '@/shared/ui/FormModal';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';
import { primaryButtonClass, secondaryButtonClass } from '@/shared/ui/buttonStyles';

export function WorkflowsPage() {
  const [open, setOpen] = useState(false);
  const [showMyTasks, setShowMyTasks] = useState(false);
  const [name, setName] = useState('');
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => (await http.get('/workflows')).data,
  });

  const myTasks = useQuery({
    queryKey: ['workflow-tasks', 'my'],
    queryFn: async () => (await http.get('/workflow-tasks/my')).data,
    enabled: showMyTasks,
  });

  const create = useMutation({
    mutationFn: (body: { name: string }) => http.post('/workflows', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['workflows'] }); setOpen(false); },
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  const tasks = showMyTasks ? myTasks.data : data.tasks.data;

  return (
    <div>
      <PageHeader
        title="Workflows"
        subtitle="Flujos de aprobación y ciclo de vida del producto"
        actions={
          <>
             <button type="button" onClick={() => setShowMyTasks(!showMyTasks)} className={secondaryButtonClass}>
               {showMyTasks ? 'Ver todos' : 'Ver mis tareas'}
             </button>
             <button type="button" onClick={() => setOpen(true)} className={primaryButtonClass}>+ Nuevo workflow</button>
           </>
         }
       />
      {!showMyTasks && (
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <StatChip label="Activos" value={data.stats.active} color="text-accent" />
          <StatChip label="Pendientes" value={data.stats.pending} color="text-warning" />
          <StatChip label="Completados" value={data.stats.completed} color="text-success" />
          <StatChip label="Bloqueados" value={data.stats.blocked} color="text-danger" />
        </div>
      )}
      <DataTable
        data={tasks ?? []}
        columns={[
          { key: 'workflow', header: 'Workflow', render: (r) => (r.workflow as { name?: string })?.name ?? '—' },
          { key: 'productName', header: 'Producto' },
          { key: 'stage', header: 'Etapa' },
          { key: 'priority', header: 'Prioridad', render: (r) => <StatusTag status={String(r.priority)} /> },
          { key: 'status', header: 'Estado', render: (r) => <StatusTag status={String(r.status)} label={String(r.status).replace('_', ' ')} /> },
        ]}
      />
      <FormModal open={open} title="Nuevo workflow" onClose={() => setOpen(false)} onSubmit={(e) => { e.preventDefault(); create.mutate({ name }); }} loading={create.isPending}>
        <FormField label="Nombre"><input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required /></FormField>
      </FormModal>
    </div>
  );
}
