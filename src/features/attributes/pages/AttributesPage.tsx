import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { PageHeader } from '@/shared/ui/PageHeader';
import { DataTable } from '@/shared/ui/DataTable';
import { StatusTag } from '@/shared/ui/StatusTag';
import { FormModal, FormField, inputClass } from '@/shared/ui/FormModal';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';
import { primaryButtonClass, secondaryButtonClass } from '@/shared/ui/buttonStyles';

export function AttributesPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: '', name: '', type: 'text' });
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['attributes'],
    queryFn: async () => (await http.get('/attributes')).data,
  });

  const create = useMutation({
    mutationFn: (body: typeof form) => http.post('/attributes', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['attributes'] }); setOpen(false); },
  });

  const exportMut = useMutation({
    mutationFn: () => http.post('/exports', { type: 'attributes' }),
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  return (
    <div>
      <PageHeader
        title="Gestión de Atributos"
        subtitle="Módulo 02 — Define y organiza los atributos del catálogo"
        actions={
          <>
             <button type="button" onClick={() => exportMut.mutate()} className={secondaryButtonClass}>
               Exportar
             </button>
             <button type="button" onClick={() => setOpen(true)} className={primaryButtonClass}>
               + Nuevo atributo
             </button>
          </>
        }
      />
      <DataTable
        data={data.data}
        columns={[
          { key: 'code', header: 'Código' },
          { key: 'name', header: 'Nombre' },
          { key: 'type', header: 'Tipo' },
          { key: 'group', header: 'Grupo', render: (r) => (r.group as { name?: string })?.name ?? '—' },
          { key: 'channels', header: 'Canales', render: (r) => (r.channels as string[])?.join(', ') },
          { key: 'status', header: 'Estado', render: (r) => <StatusTag status={String(r.status)} /> },
        ]}
      />
      <FormModal open={open} title="Nuevo atributo" onClose={() => setOpen(false)} onSubmit={(e) => { e.preventDefault(); create.mutate(form); }} loading={create.isPending}>
        <FormField label="Código"><input className={inputClass} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required /></FormField>
        <FormField label="Nombre"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></FormField>
        <FormField label="Tipo">
          <select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="text">Texto</option><option value="number">Número</option><option value="color">Color</option><option value="boolean">Booleano</option>
          </select>
        </FormField>
      </FormModal>
    </div>
  );
}
