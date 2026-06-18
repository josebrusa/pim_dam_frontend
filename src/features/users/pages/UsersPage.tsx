import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { PageHeader } from '@/shared/ui/PageHeader';
import { DataTable } from '@/shared/ui/DataTable';
import { StatusTag } from '@/shared/ui/StatusTag';
import { StatChip } from '@/shared/ui/StatChip';
import { FormModal, FormField, inputClass } from '@/shared/ui/FormModal';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';

export function UsersPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: '', roleCode: 'MARKETING' });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await http.get('/users')).data,
  });

  const roles = useQuery({
    queryKey: ['roles'],
    queryFn: async () => (await http.get('/roles')).data,
  });

  const invite = useMutation({
    mutationFn: (body: typeof form) => http.post('/users/invitations', body),
    onSuccess: () => { setOpen(false); },
  });

  const exportUsers = useMutation({
    mutationFn: () => http.post('/exports', { type: 'users' }),
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  return (
    <div>
      <PageHeader
        title="Usuarios, Roles & Permisos"
        subtitle="Módulo 07/08 — Control de acceso y gestión de equipo"
        actions={
          <>
            <button type="button" onClick={() => exportUsers.mutate()} className="rounded-[10px] border border-border px-4 py-2 text-sm text-text-secondary hover:bg-white/4">Exportar usuarios</button>
            <button type="button" onClick={() => setOpen(true)} className="rounded-[10px] bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover">+ Invitar usuario</button>
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
