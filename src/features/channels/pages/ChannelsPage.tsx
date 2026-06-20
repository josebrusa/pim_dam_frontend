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
import { channelsKeys, useChannelsQuery } from '../queries';
import { createChannel, deleteChannel, syncAllChannels, updateChannel } from '../api';
import type { ChannelForm, ChannelItem, ChannelUpdateForm } from '../types';

const channelFormSchema = z.object({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  connector: z.string().trim().min(2, 'El conector debe tener al menos 2 caracteres.'),
});

export function ChannelsPage() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmSyncOpen, setConfirmSyncOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [form, setForm] = useState<ChannelForm>({ name: '', connector: '' });
  const [formError, setFormError] = useState('');
  const [editingChannel, setEditingChannel] = useState<ChannelItem | null>(null);
  const [editForm, setEditForm] = useState<ChannelUpdateForm>({ name: '', connector: '', status: 'pending' });
  const [editError, setEditError] = useState('');
  const qc = useQueryClient();
  const { hasPermission } = usePermissions();

  const { data, isLoading, isError } = useChannelsQuery();

  const syncAll = useMutation({
    mutationFn: syncAllChannels,
    onSuccess: () => qc.invalidateQueries({ queryKey: channelsKeys.all }),
  });

  const create = useMutation({
    mutationFn: createChannel,
    onSuccess: () => { qc.invalidateQueries({ queryKey: channelsKeys.all }); setOpen(false); setFormError(''); },
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: ChannelUpdateForm }) => updateChannel(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: channelsKeys.all });
      setEditOpen(false);
      setEditingChannel(null);
      setEditError('');
    },
  });

  const remove = useMutation({
    mutationFn: deleteChannel,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: channelsKeys.all });
      setConfirmDeleteOpen(false);
      setEditingChannel(null);
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = channelFormSchema.safeParse(form);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Revisa los campos del formulario.');
      return;
    }
    setFormError('');
    create.mutate(parsed.data);
  };

  const handleEdit = (channel: ChannelItem) => {
    setEditingChannel(channel);
    setEditForm({ name: channel.name, connector: channel.connector, status: channel.status });
    setEditError('');
    setEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChannel) return;

    const parsed = channelFormSchema.extend({ status: z.string().trim().min(1, 'Selecciona un estado.') }).safeParse(editForm);
    if (!parsed.success) {
      setEditError(parsed.error.issues[0]?.message ?? 'Revisa los campos del formulario.');
      return;
    }

    setEditError('');
    update.mutate({ id: editingChannel.id, body: parsed.data });
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!data) return <LoadingState />;

  const canWriteChannels = hasPermission('channels:write');

  return (
    <div>
      <PageHeader
        title="Canales & Conectividad"
        subtitle="Módulo 09 — Gestión de canales de publicación y conectores"
        actions={
          <>
            <ActionButton variant="secondary" onClick={() => setConfirmSyncOpen(true)} disabled={!canWriteChannels}>
              Sincronizar todos
            </ActionButton>
            <ActionButton onClick={() => setOpen(true)} disabled={!canWriteChannels}>+ Nuevo canal</ActionButton>
           </>
          }
        />
      <DataTable
        data={data.data}
        columns={[
          { key: 'name', header: 'Canal' },
          { key: 'connector', header: 'Conector' },
           { key: 'productCount', header: 'Productos', render: (r) => Number(r.productCount).toLocaleString('es-ES') },
           { key: 'lastSyncAt', header: 'Última sync', render: (r) => r.lastSyncAt ? new Date(String(r.lastSyncAt)).toLocaleString('es-ES') : '—' },
           { key: 'status', header: 'Estado', render: (r) => <StatusTag status={String(r.status)} label={r.status === 'connected' ? 'Conectado' : String(r.status)} /> },
           {
             key: 'actions',
             header: 'Acciones',
             render: (r) => canWriteChannels ? (
               <div className="flex gap-3">
                 <button type="button" className="text-sm font-medium text-accent transition-colors hover:text-accent-hover" onClick={() => handleEdit(r as ChannelItem)}>Editar</button>
                 <button type="button" className="text-sm font-medium text-danger transition-colors hover:opacity-80" onClick={() => { setEditingChannel(r as ChannelItem); setConfirmDeleteOpen(true); }}>Eliminar</button>
               </div>
             ) : '—',
           },
         ]}
       />
      <FormModal open={open} title="Nuevo canal" onClose={() => { setOpen(false); setFormError(''); }} onSubmit={handleCreate} loading={create.isPending}>
        <FormField label="Nombre"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></FormField>
        <FormField label="Conector"><input className={inputClass} value={form.connector} onChange={(e) => setForm({ ...form, connector: e.target.value })} required /></FormField>
        {formError && <p className="text-sm text-danger">{formError}</p>}
      </FormModal>
      <FormModal open={editOpen} title={editingChannel ? `Editar ${editingChannel.name}` : 'Editar canal'} onClose={() => { setEditOpen(false); setEditingChannel(null); setEditError(''); }} onSubmit={handleUpdate} loading={update.isPending} submitLabel="Guardar cambios">
        <FormField label="Nombre"><input className={inputClass} value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required /></FormField>
        <FormField label="Conector"><input className={inputClass} value={editForm.connector} onChange={(e) => setEditForm({ ...editForm, connector: e.target.value })} required /></FormField>
        <FormField label="Estado">
          <select className={inputClass} value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
            <option value="pending">Pendiente</option><option value="connected">Conectado</option><option value="paused">Pausado</option>
          </select>
        </FormField>
        {editError && <p className="text-sm text-danger">{editError}</p>}
      </FormModal>
      <ConfirmDialog
        open={confirmSyncOpen}
        title="Sincronizar todos los canales"
        message="Se lanzará una sincronización global de conectores y publicaciones. Esta acción puede tardar unos minutos."
        confirmLabel="Iniciar sincronización"
        loading={syncAll.isPending}
        onClose={() => setConfirmSyncOpen(false)}
        onConfirm={() => {
          syncAll.mutate(undefined, { onSuccess: () => setConfirmSyncOpen(false) });
        }}
      />
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Eliminar canal"
        message={`Se eliminará ${editingChannel?.name ?? 'este canal'} de forma permanente.`}
        confirmLabel="Eliminar"
        loading={remove.isPending}
        onClose={() => { setConfirmDeleteOpen(false); setEditingChannel(null); }}
        onConfirm={() => {
          if (editingChannel) remove.mutate(editingChannel.id);
        }}
      />
    </div>
  );
}
