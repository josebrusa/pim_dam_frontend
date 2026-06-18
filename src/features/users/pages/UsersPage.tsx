import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { PageHeader } from '@/shared/ui/PageHeader';
import { DataTable } from '@/shared/ui/DataTable';
import { StatusTag } from '@/shared/ui/StatusTag';
import { StatChip } from '@/shared/ui/StatChip';
import { FormModal, FormField, inputClass } from '@/shared/ui/FormModal';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';
import { ActionButton } from '@/shared/ui/ActionButton';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { exportUsersJob, inviteUser } from '../api';
import { useRolesQuery, useUsersQuery } from '../queries';
import type { UserInviteForm } from '../types';

export function UsersPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<UserInviteForm>({ email: '', roleCode: 'MARKETING' });
  const { hasPermission } = usePermissions();

  const { data, isLoading, isError } = useUsersQuery();

  const roles = useRolesQuery();

  const invite = useMutation({
    mutationFn: inviteUser,
    onSuccess: () => { setOpen(false); },
  });

  const exportUsers = useMutation({
    mutationFn: exportUsersJob,
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!data) return <LoadingState />;

  const canReadUsers = hasPermission('users:read');
  const canInviteUsers = hasPermission('users:invite');

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
    </div>
  );
}
