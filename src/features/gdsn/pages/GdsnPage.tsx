import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/shared/ui/PageHeader';
import { DataTable } from '@/shared/ui/DataTable';
import { StatusTag } from '@/shared/ui/StatusTag';
import { StatChip } from '@/shared/ui/StatChip';
import { FormModal, FormField, inputClass } from '@/shared/ui/FormModal';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';
import { ActionButton } from '@/shared/ui/ActionButton';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { createGdsnPublication, deleteGdsnPublication, updateGdsnPublication } from '../api';
import { gdsnKeys, useGdsnQuery } from '../queries';
import type { GdsnForm, GdsnItem, GdsnUpdateForm } from '../types';

export function GdsnPage() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [form, setForm] = useState<GdsnForm>({ gtin: '', productName: '', dataPool: '1WorldSync', recipient: '' });
  const [editingPublication, setEditingPublication] = useState<GdsnItem | null>(null);
  const [editForm, setEditForm] = useState<GdsnUpdateForm>({ gtin: '', productName: '', dataPool: '1WorldSync', recipient: '', status: 'pending' });
  const qc = useQueryClient();
  const { hasPermission } = usePermissions();

  const { data, isLoading, isError } = useGdsnQuery();

  const create = useMutation({
    mutationFn: createGdsnPublication,
    onSuccess: () => { qc.invalidateQueries({ queryKey: gdsnKeys.all }); setOpen(false); },
  });

  const update = useMutation({ mutationFn: ({ id, body }: { id: string; body: GdsnUpdateForm }) => updateGdsnPublication(id, body), onSuccess: () => { qc.invalidateQueries({ queryKey: gdsnKeys.all }); setEditOpen(false); setEditingPublication(null); } });
  const remove = useMutation({ mutationFn: deleteGdsnPublication, onSuccess: () => { qc.invalidateQueries({ queryKey: gdsnKeys.all }); setConfirmDeleteOpen(false); setEditingPublication(null); } });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!data) return <LoadingState />;

  const canWriteGdsn = hasPermission('gdsn:write');

  const handleEdit = (publication: GdsnItem) => {
    setEditingPublication(publication);
    setEditForm({ gtin: publication.gtin, productName: publication.productName, dataPool: publication.dataPool, recipient: publication.recipient, status: publication.status });
    setEditOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="GDSN / GS1 Syndication"
        subtitle="Sincronización global de datos de producto mediante estándares GS1"
        actions={
          <>
            <ActionButton variant="secondary">Ver publicaciones</ActionButton>
            <ActionButton onClick={() => setOpen(true)} disabled={!canWriteGdsn}>+ Nueva publicación</ActionButton>
           </>
          }
        />
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <StatChip label="GTINs registrados" value={data.stats.registered} color="text-success" />
        <StatChip label="Enviados hoy" value={data.stats.sentToday} color="text-info" />
        <StatChip label="Pendientes" value={data.stats.pending} color="text-warning" />
        <StatChip label="Rechazados" value={data.stats.rejected} color="text-danger" />
      </div>
      <DataTable
        data={data.data}
        columns={[
          { key: 'gtin', header: 'GTIN', render: (r) => <code className="font-mono text-xs">{String(r.gtin)}</code> },
           { key: 'productName', header: 'Producto' },
           { key: 'dataPool', header: 'Data Pool' },
           { key: 'recipient', header: 'Destinatario' },
           { key: 'status', header: 'Estado', render: (r) => <StatusTag status={String(r.status)} /> },
           { key: 'actions', header: 'Acciones', render: (r) => canWriteGdsn ? <div className="flex gap-3"><button type="button" className="text-sm font-medium text-accent transition-colors hover:text-accent-hover" onClick={() => handleEdit(r as GdsnItem)}>Editar</button><button type="button" className="text-sm font-medium text-danger transition-colors hover:opacity-80" onClick={() => { setEditingPublication(r as GdsnItem); setConfirmDeleteOpen(true); }}>Eliminar</button></div> : '—' },
         ]}
       />
      <FormModal open={open} title="Nueva publicación" onClose={() => setOpen(false)} onSubmit={(e) => { e.preventDefault(); create.mutate(form); }} loading={create.isPending}>
        <FormField label="GTIN"><input className={inputClass} value={form.gtin} onChange={(e) => setForm({ ...form, gtin: e.target.value })} required /></FormField>
        <FormField label="Producto"><input className={inputClass} value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} required /></FormField>
        <FormField label="Destinatario"><input className={inputClass} value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} required /></FormField>
      </FormModal>
      <FormModal open={editOpen} title={editingPublication ? `Editar ${editingPublication.gtin}` : 'Editar publicación'} onClose={() => { setEditOpen(false); setEditingPublication(null); }} onSubmit={(e) => { e.preventDefault(); if (editingPublication) update.mutate({ id: editingPublication.id, body: editForm }); }} loading={update.isPending} submitLabel="Guardar cambios">
        <FormField label="GTIN"><input className={inputClass} value={editForm.gtin} onChange={(e) => setEditForm({ ...editForm, gtin: e.target.value })} required /></FormField>
        <FormField label="Producto"><input className={inputClass} value={editForm.productName} onChange={(e) => setEditForm({ ...editForm, productName: e.target.value })} required /></FormField>
        <FormField label="Destinatario"><input className={inputClass} value={editForm.recipient} onChange={(e) => setEditForm({ ...editForm, recipient: e.target.value })} required /></FormField>
        <FormField label="Estado"><select className={inputClass} value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}><option value="pending">Pendiente</option><option value="sent">Enviado</option><option value="rejected">Rechazado</option></select></FormField>
      </FormModal>
      <ConfirmDialog open={confirmDeleteOpen} title="Eliminar publicación" message={`Se eliminará ${editingPublication?.gtin ?? 'esta publicación'} de GDSN.`} confirmLabel="Eliminar" loading={remove.isPending} onClose={() => { setConfirmDeleteOpen(false); setEditingPublication(null); }} onConfirm={() => { if (editingPublication) remove.mutate(editingPublication.id); }} />
    </div>
  );
}
