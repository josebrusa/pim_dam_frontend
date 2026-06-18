import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { PageHeader } from '@/shared/ui/PageHeader';
import { DataTable } from '@/shared/ui/DataTable';
import { FormModal, FormField, inputClass } from '@/shared/ui/FormModal';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';
import { primaryButtonClass, secondaryButtonClass } from '@/shared/ui/buttonStyles';

export function CategoriesPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: '', name: '', level: 0 });
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await http.get('/categories')).data,
  });

  const create = useMutation({
    mutationFn: (body: typeof form) => http.post('/categories', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); setOpen(false); },
  });

  const importTree = useMutation({
    mutationFn: () => http.post('/categories/import-tree', {
      nodes: [
        { code: 'CAT-100', name: 'Nueva rama', level: 0 },
        { code: 'CAT-101', name: 'Subcategoría', parentCode: 'CAT-100', level: 1 },
      ],
    }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  return (
    <div>
      <PageHeader
        title="Categorías & Taxonomías"
        subtitle="Gestión de jerarquías y clasificación del catálogo"
        actions={
          <>
             <button type="button" onClick={() => importTree.mutate()} className={secondaryButtonClass}>
               Importar árbol
             </button>
             <button type="button" onClick={() => setOpen(true)} className={primaryButtonClass}>
               + Nueva categoría
             </button>
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
