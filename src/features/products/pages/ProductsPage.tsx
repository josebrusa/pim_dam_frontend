import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { PageHeader } from '@/shared/ui/PageHeader';
import { DataTable } from '@/shared/ui/DataTable';
import { StatusTag } from '@/shared/ui/StatusTag';
import { FormModal, FormField, inputClass } from '@/shared/ui/FormModal';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';

export function ProductsPage() {
  const [open, setOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({ code: '', name: '' });
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', status],
    queryFn: async () => (await http.get('/products', { params: { status: status || undefined } })).data,
  });

  const create = useMutation({
    mutationFn: (body: typeof form) => http.post('/products', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); setOpen(false); },
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  return (
    <div>
      <PageHeader
        title="PDP / Búsqueda de Productos"
        subtitle="Módulo 03 — Fichas de producto y motor de búsqueda"
        actions={
          <>
            <button type="button" onClick={() => setShowFilters(!showFilters)} className="rounded-[10px] border border-border px-4 py-2 text-sm text-text-secondary hover:bg-white/4">
              Filtros avanzados
            </button>
            <button type="button" onClick={() => setOpen(true)} className="rounded-[10px] bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover">
              + Nuevo producto
            </button>
          </>
        }
      />
      {showFilters && (
        <div className="mb-4 flex gap-2">
          {['', 'published', 'draft', 'incomplete'].map((s) => (
            <button key={s || 'all'} type="button" onClick={() => setStatus(s)} className={`rounded-lg px-3 py-1.5 text-xs ${status === s ? 'bg-accent/12 text-accent' : 'border border-border text-text-secondary'}`}>
              {s || 'Todos'}
            </button>
          ))}
        </div>
      )}
      <DataTable
        data={data.data}
        columns={[
          { key: 'code', header: 'Código' },
          { key: 'name', header: 'Nombre' },
          { key: 'category', header: 'Categoría', render: (r) => (r.category as { name?: string })?.name ?? '—' },
          { key: 'status', header: 'Estado', render: (r) => <StatusTag status={String(r.status)} /> },
        ]}
      />
      <FormModal open={open} title="Nuevo producto" onClose={() => setOpen(false)} onSubmit={(e) => { e.preventDefault(); create.mutate(form); }} loading={create.isPending}>
        <FormField label="Código"><input className={inputClass} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required /></FormField>
        <FormField label="Nombre"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></FormField>
      </FormModal>
    </div>
  );
}
