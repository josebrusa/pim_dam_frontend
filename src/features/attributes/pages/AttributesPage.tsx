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
import { usePermissions } from '@/shared/hooks/usePermissions';
import { attributesKeys, useAttributesQuery } from '../queries';
import { createAttribute, deleteAttribute, exportAttributes, updateAttribute } from '../api';
import type { AttributeForm, AttributeItem, AttributeUpdateForm } from '../types';

const attributeFormSchema = z.object({
  code: z.string().trim().min(2, 'El código debe tener al menos 2 caracteres.'),
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  type: z.string().trim().min(1, 'Selecciona un tipo.'),
});

export function AttributesPage() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [form, setForm] = useState<AttributeForm>({ code: '', name: '', type: 'text' });
  const [formError, setFormError] = useState('');
  const [editingAttribute, setEditingAttribute] = useState<AttributeItem | null>(null);
  const [editForm, setEditForm] = useState<AttributeUpdateForm>({ name: '', type: 'text', status: 'draft' });
  const [editError, setEditError] = useState('');
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

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: AttributeUpdateForm }) => updateAttribute(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: attributesKeys.all });
      setEditOpen(false);
      setEditingAttribute(null);
      setEditError('');
    },
  });

  const remove = useMutation({
    mutationFn: deleteAttribute,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: attributesKeys.all });
      setConfirmDeleteOpen(false);
      setEditingAttribute(null);
    },
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

  const handleEdit = (attribute: AttributeItem) => {
    setEditingAttribute(attribute);
    setEditForm({ name: attribute.name, type: attribute.type, status: attribute.status });
    setEditError('');
    setEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAttribute) return;

    const parsed = attributeFormSchema.omit({ code: true }).extend({ status: z.string().trim().min(1, 'Selecciona un estado.') }).safeParse(editForm);
    if (!parsed.success) {
      setEditError(parsed.error.issues[0]?.message ?? 'Revisa los campos del formulario.');
      return;
    }

    setEditError('');
    update.mutate({ id: editingAttribute.id, body: parsed.data });
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
          {
            key: 'actions',
            header: 'Acciones',
            render: (r) => canWriteAttributes ? (
              <div className="flex gap-3">
                <button type="button" className="text-sm font-medium text-accent transition-colors hover:text-accent-hover" onClick={() => handleEdit(r as AttributeItem)}>Editar</button>
                <button type="button" className="text-sm font-medium text-danger transition-colors hover:opacity-80" onClick={() => { setEditingAttribute(r as AttributeItem); setConfirmDeleteOpen(true); }}>Eliminar</button>
              </div>
            ) : '—',
          },
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
      <FormModal open={editOpen} title={editingAttribute ? `Editar ${editingAttribute.code}` : 'Editar atributo'} onClose={() => { setEditOpen(false); setEditingAttribute(null); setEditError(''); }} onSubmit={handleUpdate} loading={update.isPending} submitLabel="Guardar cambios">
        <FormField label="Código"><input className={`${inputClass} opacity-70`} value={editingAttribute?.code ?? ''} disabled /></FormField>
        <FormField label="Nombre"><input className={inputClass} value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required /></FormField>
        <FormField label="Tipo">
          <select className={inputClass} value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}>
            <option value="text">Texto</option><option value="number">Número</option><option value="color">Color</option><option value="boolean">Booleano</option>
          </select>
        </FormField>
        <FormField label="Estado">
          <select className={inputClass} value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
            <option value="draft">Borrador</option><option value="published">Publicado</option><option value="incomplete">Incompleto</option>
          </select>
        </FormField>
        {editError && <p className="text-sm text-danger">{editError}</p>}
      </FormModal>
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Eliminar atributo"
        message={`Se eliminará ${editingAttribute?.name ?? 'este atributo'} de forma permanente.`}
        confirmLabel="Eliminar"
        loading={remove.isPending}
        onClose={() => { setConfirmDeleteOpen(false); setEditingAttribute(null); }}
        onConfirm={() => {
          if (editingAttribute) remove.mutate(editingAttribute.id);
        }}
      />
    </div>
  );
}
