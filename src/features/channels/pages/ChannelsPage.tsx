import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { PageHeader } from '@/shared/ui/PageHeader';
import { DataTable } from '@/shared/ui/DataTable';
import { StatusTag } from '@/shared/ui/StatusTag';
import { FormModal, FormField, inputClass } from '@/shared/ui/FormModal';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';

export function ChannelsPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', connector: '' });
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['channels'],
    queryFn: async () => (await http.get('/channels')).data,
  });

  const syncAll = useMutation({
    mutationFn: () => http.post('/channels/sync-all'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['channels'] }),
  });

  const create = useMutation({
    mutationFn: (body: typeof form) => http.post('/channels', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['channels'] }); setOpen(false); },
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  return (
    <div>
      <PageHeader
        title="Canales & Conectividad"
        subtitle="Módulo 09 — Gestión de canales de publicación y conectores"
        actions={
          <>
            <button type="button" onClick={() => syncAll.mutate()} disabled={syncAll.isPending} className="rounded-[10px] border border-border px-4 py-2 text-sm text-text-secondary hover:bg-white/4">
              {syncAll.isPending ? 'Sincronizando...' : 'Sincronizar todos'}
            </button>
            <button type="button" onClick={() => setOpen(true)} className="rounded-[10px] bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover">+ Nuevo canal</button>
          </>
        }
      />
      <DataTable
        data={data.data}
        columns={[
          { key: 'name', header: 'Canal' },
          { key: 'connector', header: 'Conector' },
          { key: 'productCount', header: 'Productos', render: (r) => Number(r.productCount).toLocaleString('es-ES') },
          { key: 'lastSyncAt', header: 'Última sync', render: (r) => r.lastSyncAt ? new Date(String(r.lastSyncAt)).toLocaleString('es-ES') : '—' },
          { key: 'status', header: 'Estado', render: (r) => <StatusTag status={String(r.status)} label={r.status === 'connected' ? 'Conectado' : String(r.status)} /> },
        ]}
      />
      <FormModal open={open} title="Nuevo canal" onClose={() => setOpen(false)} onSubmit={(e) => { e.preventDefault(); create.mutate(form); }} loading={create.isPending}>
        <FormField label="Nombre"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></FormField>
        <FormField label="Conector"><input className={inputClass} value={form.connector} onChange={(e) => setForm({ ...form, connector: e.target.value })} required /></FormField>
      </FormModal>
    </div>
  );
}
