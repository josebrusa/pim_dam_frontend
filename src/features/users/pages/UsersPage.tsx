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
import { deleteUser, exportUsersJob, inviteUser, updateUser } from '../api';
import { useRolesQuery, useUsersQuery, usersKeys } from '../queries';
import type { UserInviteForm, UserItem, UserUpdateForm } from '../types';

export function UsersPage() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [form, setForm] = useState<UserInviteForm>({ email: '', roleCode: 'MARKETING' });
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editForm, setEditForm] = useState<UserUpdateForm>({ roleCode: 'MARKETING', status: 'active' });
  const qc = useQueryClient();
  const { hasPermission } = usePermissions();

  const { data, isLoading, isError } = useUsersQuery();

  const roles = useRolesQuery();

  const invite = useMutation({
    mutationFn: inviteUser,
    onSuccess: () => { setOpen(false); qc.invalidateQueries({ queryKey: usersKeys.all }); },
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: UserUpdateForm }) => updateUser(id, body),
    onSuccess: () => {
      setEditOpen(false);
      setEditingUser(null);
      qc.invalidateQueries({ queryKey: usersKeys.all });
    },
  });

  const remove = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      setConfirmDeleteOpen(false);
      setEditingUser(null);
      qc.invalidateQueries({ queryKey: usersKeys.all });
    },
  });

  const exportUsers = useMutation({
    mutationFn: exportUsersJob,
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!data) return <LoadingState />;

  const canReadUsers = hasPermission('users:read');
  const canInviteUsers = hasPermission('users:invite');

  const handleEdit = (user: UserItem) => {
    setEditingUser(user);
    setEditForm({ roleCode: user.role, status: user.status });
    setEditOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Usuarios, Roles & Permisos"
        subtitle="Módulo 07/08 — Control de acceso y gestión de equipo"
        actions={
          <>
             <ActionButton variant="secondary" onClick={() => exportUsers.mutate()} disabled={!canReadUsers}>Exportar usuarios</ActionButton>
             <ActionButton onClick={() => setOpen(true)} disabled={!canInviteUsers}>+ Invitar usuario</ActionButton>
           </>
         }
       />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatChip label="Usuarios activos" value={data.meta.total} color="text-warning" />
        <StatChip label="Roles definidos" value={(roles.data ?? []).length} color="text-accent" />
        <StatChip label="Invitaciones pendientes" value={4} color="text-info" />
      </div>
      <DataTable
        data={data.data}
        columns={[
          { key: 'name', header: 'Usuario', render: (r) => <strong>{String(r.name)}</strong> },
          { key: 'email', header: 'Email' },
          { key: 'role', header: 'Rol', render: (r) => <StatusTag status="active" label={String(r.role)} /> },
          { key: 'status', header: 'Estado', render: (r) => <StatusTag status={String(r.status)} /> },
          {
            key: 'actions',
            header: 'Acciones',
            render: (r) => canInviteUsers ? (
              <div className="flex gap-3">
                <button type="button" className="text-sm font-medium text-accent transition-colors hover:text-accent-hover" onClick={() => handleEdit(r as UserItem)}>Editar</button>
                <button type="button" className="text-sm font-medium text-danger transition-colors hover:opacity-80" onClick={() => { setEditingUser(r as UserItem); setConfirmDeleteOpen(true); }}>Eliminar</button>
              </div>
            ) : '—',
          },
        ]}
      />
      <FormModal open={open} title="Invitar usuario" onClose={() => setOpen(false)} onSubmit={(e) => { e.preventDefault(); invite.mutate(form); }} loading={invite.isPending}>
        <FormField label="Email"><input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></FormField>
        <FormField label="Rol">
          <select className={inputClass} value={form.roleCode} onChange={(e) => setForm({ ...form, roleCode: e.target.value })}>
            {(roles.data ?? []).map((r: { code: string; name: string }) => (
              <option key={r.code} value={r.code}>{r.name}</option>
            ))}
          </select>
        </FormField>
      </FormModal>
      <FormModal open={editOpen} title={editingUser ? `Editar ${editingUser.name}` : 'Editar usuario'} onClose={() => { setEditOpen(false); setEditingUser(null); }} onSubmit={(e) => { e.preventDefault(); if (editingUser) update.mutate({ id: editingUser.id, body: editForm }); }} loading={update.isPending} submitLabel="Guardar cambios">
        <FormField label="Email"><input className={`${inputClass} opacity-70`} value={editingUser?.email ?? ''} disabled /></FormField>
        <FormField label="Rol">
          <select className={inputClass} value={editForm.roleCode} onChange={(e) => setEditForm({ ...editForm, roleCode: e.target.value })}>
            {(roles.data ?? []).map((r: { code: string; name: string }) => (
              <option key={r.code} value={r.code}>{r.name}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Estado">
          <select className={inputClass} value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
            <option value="active">Activo</option>
            <option value="pending">Pendiente</option>
            <option value="inactive">Inactivo</option>
          </select>
        </FormField>
      </FormModal>
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Eliminar usuario del tenant"
        message={`Se quitará ${editingUser?.name ?? 'este usuario'} del tenant actual.`}
        confirmLabel="Eliminar"
        loading={remove.isPending}
        onClose={() => { setConfirmDeleteOpen(false); setEditingUser(null); }}
        onConfirm={() => {
          if (editingUser) remove.mutate(editingUser.id);
        }}
      />
    </div>
  );
}
