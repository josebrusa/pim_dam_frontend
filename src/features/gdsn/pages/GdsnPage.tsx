import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/shared/ui/PageHeader';
import { DataTable } from '@/shared/ui/DataTable';
import { StatusTag } from '@/shared/ui/StatusTag';
import { StatChip } from '@/shared/ui/StatChip';
import { FormModal, FormField, inputClass } from '@/shared/ui/FormModal';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';
import { ActionButton } from '@/shared/ui/ActionButton';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { createGdsnPublication } from '../api';
import { gdsnKeys, useGdsnQuery } from '../queries';
import type { GdsnForm } from '../types';

export function GdsnPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<GdsnForm>({ gtin: '', productName: '', dataPool: '1WorldSync', recipient: '' });
  const qc = useQueryClient();
  const { hasPermission } = usePermissions();

  const { data, isLoading, isError } = useGdsnQuery();

  const create = useMutation({
    mutationFn: createGdsnPublication,
    onSuccess: () => { qc.invalidateQueries({ queryKey: gdsnKeys.all }); setOpen(false); },
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!data) return <LoadingState />;

  const canWriteGdsn = hasPermission('gdsn:write');

  return (
    <div>
      <PageHeader
        title="GDSN / GS1 Syndication"
        subtitle="Sincronización global de datos de producto mediante estándares GS1"
        actions={
          <>
            <ActionButton variant="secondary">Ver publicaciones</ActionButton>
            <ActionButton onClick={() => setOpen(true)} disabled={!canWriteGdsn}>+ Enviar al pool</ActionButton>
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
        ]}
      />
      <FormModal open={open} title="Enviar al pool" onClose={() => setOpen(false)} onSubmit={(e) => { e.preventDefault(); create.mutate(form); }} loading={create.isPending}>
        <FormField label="GTIN"><input className={inputClass} value={form.gtin} onChange={(e) => setForm({ ...form, gtin: e.target.value })} required /></FormField>
        <FormField label="Producto"><input className={inputClass} value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} required /></FormField>
        <FormField label="Destinatario"><input className={inputClass} value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} required /></FormField>
      </FormModal>
    </div>
  );
}
