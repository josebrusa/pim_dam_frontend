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
import { surfacePanelClass } from '@/shared/ui/buttonStyles';
import { createAsset, deleteAsset, updateAsset } from '../api';
import { damKeys, useAssetsQuery } from '../queries';
import type { AssetForm, AssetItem, AssetUpdateForm } from '../types';

export function DamPage() {
  const [gallery, setGallery] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [form, setForm] = useState<AssetForm>({ name: '', type: 'image', sizeBytes: 1024000, channel: 'E-Commerce' });
  const [editingAsset, setEditingAsset] = useState<AssetItem | null>(null);
  const [editForm, setEditForm] = useState<AssetUpdateForm>({ name: '', type: 'image', sizeBytes: 1024000, channel: 'E-Commerce' });
  const qc = useQueryClient();
  const { hasPermission } = usePermissions();

  const { data, isLoading, isError } = useAssetsQuery();

  const create = useMutation({
    mutationFn: createAsset,
    onSuccess: () => { qc.invalidateQueries({ queryKey: damKeys.all }); setOpen(false); },
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: AssetUpdateForm }) => updateAsset(id, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: damKeys.all }); setEditOpen(false); setEditingAsset(null); },
  });

  const remove = useMutation({
    mutationFn: deleteAsset,
    onSuccess: () => { qc.invalidateQueries({ queryKey: damKeys.all }); setConfirmDeleteOpen(false); setEditingAsset(null); },
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!data) return <LoadingState />;

  const formatSize = (bytes: number) => bytes > 1e6 ? `${(bytes / 1e6).toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
  const canWriteDam = hasPermission('dam:write');

  const handleEdit = (asset: AssetItem) => {
    setEditingAsset(asset);
    setEditForm({ name: asset.name, type: asset.type, sizeBytes: asset.sizeBytes, channel: asset.channel });
    setEditOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="DAM — Gestión de Activos Digitales"
        subtitle="Biblioteca centralizada de imágenes, vídeos y documentos"
        actions={
          <>
            <ActionButton variant="secondary" onClick={() => setGallery(!gallery)}>
                {gallery ? 'Vista tabla' : 'Vista galería'}
            </ActionButton>
            <ActionButton onClick={() => setOpen(true)} disabled={!canWriteDam}>↑ Subir activos</ActionButton>
            </>
          }
        />
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <StatChip label="Activos totales" value={data.stats.total} color="text-accent" />
        <StatChip label="Almacenamiento" value={`${data.stats.storageGb} GB`} color="text-info" />
        <StatChip label="Vinculados" value={data.stats.linked} color="text-success" />
        <StatChip label="Sin asignar" value={data.stats.unassigned} color="text-warning" />
      </div>
      {gallery ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {data.data.map((a: { id: string; name: string; type: string }) => (
            <div key={a.id} className={`${surfacePanelClass} p-4`}>
              <div className="mb-3 flex h-24 items-center justify-center rounded-2xl bg-bg-surface text-2xl text-brand-deep">⊡</div>
              <div className="truncate text-sm font-medium text-brand-deep">{a.name}</div>
              <StatusTag status={a.type} label={a.type} />
            </div>
          ))}
        </div>
      ) : (
        <DataTable
          data={data.data}
          columns={[
            { key: 'name', header: 'Nombre' },
            { key: 'type', header: 'Tipo', render: (r) => <StatusTag status={String(r.type)} label={String(r.type)} /> },
             { key: 'sizeBytes', header: 'Peso', render: (r) => formatSize(Number(r.sizeBytes)) },
             { key: 'product', header: 'Producto', render: (r) => (r.product as { code?: string })?.code ?? '—' },
             { key: 'channel', header: 'Canal' },
             { key: 'actions', header: 'Acciones', render: (r) => canWriteDam ? <div className="flex gap-3"><button type="button" className="text-sm font-medium text-accent transition-colors hover:text-accent-hover" onClick={() => handleEdit(r as AssetItem)}>Editar</button><button type="button" className="text-sm font-medium text-danger transition-colors hover:opacity-80" onClick={() => { setEditingAsset(r as AssetItem); setConfirmDeleteOpen(true); }}>Eliminar</button></div> : '—' },
           ]}
         />
       )}
      <FormModal open={open} title="Subir activo" onClose={() => setOpen(false)} onSubmit={(e) => { e.preventDefault(); create.mutate(form); }} loading={create.isPending}>
        <FormField label="Nombre"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></FormField>
        <FormField label="Tipo">
          <select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="image">Imagen</option><option value="pdf">PDF</option><option value="video">Vídeo</option>
          </select>
        </FormField>
      </FormModal>
      <FormModal open={editOpen} title={editingAsset ? `Editar ${editingAsset.name}` : 'Editar activo'} onClose={() => { setEditOpen(false); setEditingAsset(null); }} onSubmit={(e) => { e.preventDefault(); if (editingAsset) update.mutate({ id: editingAsset.id, body: editForm }); }} loading={update.isPending} submitLabel="Guardar cambios">
        <FormField label="Nombre"><input className={inputClass} value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required /></FormField>
        <FormField label="Tipo"><select className={inputClass} value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}><option value="image">Imagen</option><option value="pdf">PDF</option><option value="video">Vídeo</option></select></FormField>
        <FormField label="Canal"><input className={inputClass} value={editForm.channel} onChange={(e) => setEditForm({ ...editForm, channel: e.target.value })} required /></FormField>
      </FormModal>
      <ConfirmDialog open={confirmDeleteOpen} title="Eliminar activo" message={`Se eliminará ${editingAsset?.name ?? 'este activo'}.`} confirmLabel="Eliminar" loading={remove.isPending} onClose={() => { setConfirmDeleteOpen(false); setEditingAsset(null); }} onConfirm={() => { if (editingAsset) remove.mutate(editingAsset.id); }} />
    </div>
  );
}
