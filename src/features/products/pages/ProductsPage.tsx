import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { PageHeader } from '@/shared/ui/PageHeader';
import { DataTable } from '@/shared/ui/DataTable';
import { StatusTag } from '@/shared/ui/StatusTag';
import { FormModal, FormField, inputClass } from '@/shared/ui/FormModal';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';
import { ActionButton } from '@/shared/ui/ActionButton';
import { filterChipClass, surfacePanelClass } from '@/shared/ui/buttonStyles';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { createProduct } from '../api';
import { productsKeys, useProductsQuery } from '../queries';
import type { ProductForm } from '../types';

const productFormSchema = z.object({
  code: z.string().trim().min(3, 'El código debe tener al menos 3 caracteres.'),
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.'),
});

export function ProductsPage() {
  const [open, setOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<ProductForm>({ code: '', name: '' });
  const [formError, setFormError] = useState('');
  const qc = useQueryClient();
  const { hasPermission } = usePermissions();

  const { data, isLoading, isError } = useProductsQuery({ status });

  const create = useMutation({
    mutationFn: createProduct,
    onSuccess: () => { qc.invalidateQueries({ queryKey: productsKeys.all }); setOpen(false); setFormError(''); },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = productFormSchema.safeParse(form);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Revisa los campos del formulario.');
      return;
    }
    setFormError('');
    create.mutate(parsed.data);
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!data) return <LoadingState />;

  const canWriteProducts = hasPermission('products:write');

  return (
    <div>
      <PageHeader
        title="PDP / Búsqueda de Productos"
        subtitle="Módulo 03 — Fichas de producto y motor de búsqueda"
        actions={
          <>
             <ActionButton variant="secondary" onClick={() => setShowFilters(!showFilters)}>
               Filtros avanzados
             </ActionButton>
             <ActionButton onClick={() => setOpen(true)} disabled={!canWriteProducts}>
               + Nuevo producto
             </ActionButton>
          </>
        }
      />
      {showFilters && (
         <div className={`${surfacePanelClass} mb-4 flex flex-wrap gap-2 p-3`}>
           {['', 'published', 'draft', 'incomplete'].map((s) => (
              <button key={s || 'all'} type="button" onClick={() => { setStatus(s); setPage(1); }} className={`${filterChipClass} ${status === s ? 'border-accent/20 bg-accent/10 text-accent' : ''}`}>
                {s || 'Todos'}
              </button>
            ))}
         </div>
       )}
      <DataTable
        data={data.data}
        page={page}
        pageSize={3}
        onPageChange={setPage}
        columns={[
          { key: 'code', header: 'Código' },
          { key: 'name', header: 'Nombre' },
          { key: 'category', header: 'Categoría', render: (r) => (r.category as { name?: string })?.name ?? '—' },
          { key: 'status', header: 'Estado', render: (r) => <StatusTag status={String(r.status)} /> },
        ]}
      />
      <FormModal open={open} title="Nuevo producto" onClose={() => { setOpen(false); setFormError(''); }} onSubmit={handleCreate} loading={create.isPending}>
        <FormField label="Código"><input className={inputClass} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required /></FormField>
        <FormField label="Nombre"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></FormField>
        {formError && <p className="text-sm text-danger">{formError}</p>}
      </FormModal>
    </div>
  );
}
