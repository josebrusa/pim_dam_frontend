import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { PageHeader } from '@/shared/ui/PageHeader';
import { DataTable } from '@/shared/ui/DataTable';
import { StatusTag } from '@/shared/ui/StatusTag';
import { StatChip } from '@/shared/ui/StatChip';
import { FormModal, FormField, inputClass } from '@/shared/ui/FormModal';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';
import { primaryButtonClass, secondaryButtonClass, surfacePanelClass } from '@/shared/ui/buttonStyles';

export function DamPage() {
  const [gallery, setGallery] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'image', sizeBytes: 1024000, channel: 'E-Commerce' });
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['assets'],
    queryFn: async () => (await http.get('/assets')).data,
  });

  const create = useMutation({
    mutationFn: (body: typeof form) => http.post('/assets', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['assets'] }); setOpen(false); },
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  const formatSize = (bytes: number) => bytes > 1e6 ? `${(bytes / 1e6).toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;

  return (
    <div>
      <PageHeader
        title="DAM — Gestión de Activos Digitales"
        subtitle="Biblioteca centralizada de imágenes, vídeos y documentos"
        actions={
          <>
             <button type="button" onClick={() => setGallery(!gallery)} className={secondaryButtonClass}>
               {gallery ? 'Vista tabla' : 'Vista galería'}
             </button>
             <button type="button" onClick={() => setOpen(true)} className={primaryButtonClass}>↑ Subir activos</button>
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
    </div>
  );
}
