import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { PageHeader } from '@/shared/ui/PageHeader';
import { DataTable } from '@/shared/ui/DataTable';
import { StatusTag } from '@/shared/ui/StatusTag';
import { FormModal, FormField, inputClass } from '@/shared/ui/FormModal';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';
import { ActionButton } from '@/shared/ui/ActionButton';
import { filterChipClass, surfacePanelClass } from '@/shared/ui/buttonStyles';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { createProduct, deleteProduct, updateProduct } from '../api';
import { productsKeys, useProductsQuery } from '../queries';
import type { ProductForm, ProductItem, ProductUpdateForm } from '../types';

const productFormSchema = z.object({
  code: z.string().trim().min(3, 'El código debe tener al menos 3 caracteres.'),
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.'),
});

const productUpdateSchema = z.object({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  status: z.string().trim().min(1, 'Selecciona un estado.'),
});

export function ProductsPage() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<ProductForm>({ code: '', name: '' });
  const [formError, setFormError] = useState('');
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [editForm, setEditForm] = useState<ProductUpdateForm>({ name: '', status: 'draft' });
  const [editError, setEditError] = useState('');
  const qc = useQueryClient();
  const { hasPermission } = usePermissions();

  const { data, isLoading, isError } = useProductsQuery({ status });

  const create = useMutation({
    mutationFn: createProduct,
    onSuccess: () => { qc.invalidateQueries({ queryKey: productsKeys.all }); setOpen(false); setFormError(''); },
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: ProductUpdateForm }) => updateProduct(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productsKeys.all });
      setEditOpen(false);
      setEditingProduct(null);
      setEditError('');
    },
  });

  const remove = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productsKeys.all });
      setConfirmDeleteOpen(false);
      setEditingProduct(null);
    },
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

  const handleEdit = (product: ProductItem) => {
    setEditingProduct(product);
    setEditForm({ name: product.name, status: product.status });
    setEditError('');
    setEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const parsed = productUpdateSchema.safeParse(editForm);
    if (!parsed.success) {
      setEditError(parsed.error.issues[0]?.message ?? 'Revisa los campos del formulario.');
      return;
    }

    setEditError('');
    update.mutate({ id: editingProduct.id, body: parsed.data });
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
          {
            key: 'actions',
            header: 'Acciones',
            render: (r) => canWriteProducts ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  className="text-sm font-medium text-accent transition-colors hover:text-accent-hover"
                  onClick={() => handleEdit(r as ProductItem)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="text-sm font-medium text-danger transition-colors hover:opacity-80"
                  onClick={() => { setEditingProduct(r as ProductItem); setConfirmDeleteOpen(true); }}
                >
                  Eliminar
                </button>
              </div>
            ) : '—',
          },
        ]}
      />
      <FormModal open={open} title="Nuevo producto" onClose={() => { setOpen(false); setFormError(''); }} onSubmit={handleCreate} loading={create.isPending}>
        <FormField label="Código"><input className={inputClass} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required /></FormField>
        <FormField label="Nombre"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></FormField>
        {formError && <p className="text-sm text-danger">{formError}</p>}
      </FormModal>
      <FormModal
        open={editOpen}
        title={editingProduct ? `Editar ${editingProduct.code}` : 'Editar producto'}
        onClose={() => { setEditOpen(false); setEditingProduct(null); setEditError(''); }}
        onSubmit={handleUpdate}
        loading={update.isPending}
        submitLabel="Guardar cambios"
      >
        <FormField label="Código">
          <input className={`${inputClass} opacity-70`} value={editingProduct?.code ?? ''} disabled />
        </FormField>
        <FormField label="Nombre">
          <input className={inputClass} value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
        </FormField>
        <FormField label="Estado">
          <select className={inputClass} value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
            <option value="incomplete">Incompleto</option>
          </select>
        </FormField>
        {editError && <p className="text-sm text-danger">{editError}</p>}
      </FormModal>
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Eliminar producto"
        message={`Se eliminará ${editingProduct?.name ?? 'este producto'} de forma permanente.`}
        confirmLabel="Eliminar"
        loading={remove.isPending}
        onClose={() => { setConfirmDeleteOpen(false); setEditingProduct(null); }}
        onConfirm={() => {
          if (editingProduct) remove.mutate(editingProduct.id);
        }}
      />
    </div>
  );
}
