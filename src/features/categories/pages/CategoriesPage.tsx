import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/shared/ui/PageHeader';
import { DataTable } from '@/shared/ui/DataTable';
import { FormModal, FormField, inputClass } from '@/shared/ui/FormModal';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';
import { ActionButton } from '@/shared/ui/ActionButton';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { categoriesKeys, useCategoriesQuery } from '../queries';
import { createCategory, importCategoryTree } from '../api';
import type { CategoryForm } from '../types';

export function CategoriesPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CategoryForm>({ code: '', name: '', level: 0 });
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

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!data) return <LoadingState />;

  const canManageCategories = hasPermission({ roles: ['PIM_MANAGER', 'IT_ADMIN'] });

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
        ]}
      />
      <FormModal open={open} title="Nueva categoría" onClose={() => setOpen(false)} onSubmit={(e) => { e.preventDefault(); create.mutate(form); }} loading={create.isPending}>
        <FormField label="Código"><input className={inputClass} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required /></FormField>
        <FormField label="Nombre"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></FormField>
      </FormModal>
    </div>
  );
}
