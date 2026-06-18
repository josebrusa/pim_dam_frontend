import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { PageHeader } from '@/shared/ui/PageHeader';
import { DataTable } from '@/shared/ui/DataTable';
import { StatusTag } from '@/shared/ui/StatusTag';
import { FormModal, FormField, inputClass } from '@/shared/ui/FormModal';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';
import { ActionButton } from '@/shared/ui/ActionButton';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { attributesKeys, useAttributesQuery } from '../queries';
import { createAttribute, exportAttributes } from '../api';
import type { AttributeForm } from '../types';

const attributeFormSchema = z.object({
  code: z.string().trim().min(2, 'El código debe tener al menos 2 caracteres.'),
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  type: z.string().trim().min(1, 'Selecciona un tipo.'),
});

export function AttributesPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AttributeForm>({ code: '', name: '', type: 'text' });
  const [formError, setFormError] = useState('');
  const qc = useQueryClient();
  const { hasPermission } = usePermissions();

  const { data, isLoading, isError } = useAttributesQuery();

  const create = useMutation({
    mutationFn: createAttribute,
    onSuccess: () => { qc.invalidateQueries({ queryKey: attributesKeys.all }); setOpen(false); setFormError(''); },
  });

  const exportMut = useMutation({
    mutationFn: exportAttributes,
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = attributeFormSchema.safeParse(form);
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

  const canWriteAttributes = hasPermission('attributes:write');

  return (
    <div>
      <PageHeader
        title="Gestión de Atributos"
        subtitle="Módulo 02 — Define y organiza los atributos del catálogo"
        actions={
          <>
             <ActionButton variant="secondary" onClick={() => exportMut.mutate()} disabled={!canWriteAttributes}>
                Exportar
             </ActionButton>
             <ActionButton onClick={() => setOpen(true)} disabled={!canWriteAttributes}>
                + Nuevo atributo
             </ActionButton>
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
      <FormModal open={open} title="Nuevo atributo" onClose={() => { setOpen(false); setFormError(''); }} onSubmit={handleCreate} loading={create.isPending}>
        <FormField label="Código"><input className={inputClass} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required /></FormField>
        <FormField label="Nombre"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></FormField>
        <FormField label="Tipo">
          <select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="text">Texto</option><option value="number">Número</option><option value="color">Color</option><option value="boolean">Booleano</option>
          </select>
        </FormField>
        {formError && <p className="text-sm text-danger">{formError}</p>}
      </FormModal>
    </div>
  );
}
