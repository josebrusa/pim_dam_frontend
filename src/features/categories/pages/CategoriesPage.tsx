import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/shared/ui/PageHeader';
import { DataTable } from '@/shared/ui/DataTable';
import { FormModal, FormField, inputClass } from '@/shared/ui/FormModal';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';
import { ActionButton } from '@/shared/ui/ActionButton';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { categoriesKeys, useCategoriesQuery } from '../queries';
import { createCategory, deleteCategory, importCategoryTree, updateCategory } from '../api';
import type { CategoryForm, CategoryItem, CategoryUpdateForm } from '../types';

export function CategoriesPage() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [form, setForm] = useState<CategoryForm>({ code: '', name: '', level: 0 });
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [editForm, setEditForm] = useState<CategoryUpdateForm>({ name: '', level: 0 });
  const qc = useQueryClient();
  const { hasPermission } = usePermissions();

  const { data, isLoading, isError } = useCategoriesQuery();

  const create = useMutation({
    mutationFn: createCategory,
    onSuccess: () => { qc.invalidateQueries({ queryKey: categoriesKeys.all }); setOpen(false); },
  });

  const importTree = useMutation({
    mutationFn: importCategoryTree,
    onSuccess: () => qc.invalidateQueries({ queryKey: categoriesKeys.all }),
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: CategoryUpdateForm }) => updateCategory(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoriesKeys.all });
      setEditOpen(false);
      setEditingCategory(null);
    },
  });

  const remove = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoriesKeys.all });
      setConfirmDeleteOpen(false);
      setEditingCategory(null);
    },
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!data) return <LoadingState />;

  const canManageCategories = hasPermission({ roles: ['PIM_MANAGER', 'IT_ADMIN'] });

  const handleEdit = (category: CategoryItem) => {
    setEditingCategory(category);
    setEditForm({ name: category.name, level: category.level });
    setEditOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Categorías & Taxonomías"
        subtitle="Gestión de jerarquías y clasificación del catálogo"
        actions={
          <>
            <ActionButton variant="secondary" onClick={() => importTree.mutate()} disabled={!canManageCategories}>
                Importar árbol
            </ActionButton>
            <ActionButton onClick={() => setOpen(true)} disabled={!canManageCategories}>
                + Nueva categoría
            </ActionButton>
           </>
         }
       />
      <DataTable
        data={data.data}
        columns={[
          { key: 'code', header: 'Código' },
          { key: 'name', header: 'Nombre' },
          { key: 'level', header: 'Nivel' },
          { key: 'parent', header: 'Padre', render: (r) => (r.parent as { name?: string })?.name ?? '—' },
          {
            key: 'actions',
            header: 'Acciones',
            render: (r) => canManageCategories ? (
              <div className="flex gap-3">
                <button type="button" className="text-sm font-medium text-accent transition-colors hover:text-accent-hover" onClick={() => handleEdit(r as CategoryItem)}>Editar</button>
                <button type="button" className="text-sm font-medium text-danger transition-colors hover:opacity-80" onClick={() => { setEditingCategory(r as CategoryItem); setConfirmDeleteOpen(true); }}>Eliminar</button>
              </div>
            ) : '—',
          },
        ]}
      />
      <FormModal open={open} title="Nueva categoría" onClose={() => setOpen(false)} onSubmit={(e) => { e.preventDefault(); create.mutate(form); }} loading={create.isPending}>
        <FormField label="Código"><input className={inputClass} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required /></FormField>
        <FormField label="Nombre"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></FormField>
      </FormModal>
      <FormModal open={editOpen} title={editingCategory ? `Editar ${editingCategory.code}` : 'Editar categoría'} onClose={() => { setEditOpen(false); setEditingCategory(null); }} onSubmit={(e) => { e.preventDefault(); if (editingCategory) update.mutate({ id: editingCategory.id, body: editForm }); }} loading={update.isPending} submitLabel="Guardar cambios">
        <FormField label="Código"><input className={`${inputClass} opacity-70`} value={editingCategory?.code ?? ''} disabled /></FormField>
        <FormField label="Nombre"><input className={inputClass} value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required /></FormField>
        <FormField label="Nivel"><input className={inputClass} type="number" min={0} value={editForm.level} onChange={(e) => setEditForm({ ...editForm, level: Number(e.target.value) })} required /></FormField>
      </FormModal>
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Eliminar categoría"
        message={`Se eliminará ${editingCategory?.name ?? 'esta categoría'} de forma permanente.`}
        confirmLabel="Eliminar"
        loading={remove.isPending}
        onClose={() => { setConfirmDeleteOpen(false); setEditingCategory(null); }}
        onConfirm={() => {
          if (editingCategory) remove.mutate(editingCategory.id);
        }}
      />
    </div>
  );
}
