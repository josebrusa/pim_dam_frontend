import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import { PageHeader } from '@/shared/ui/PageHeader';
import { DataTable } from '@/shared/ui/DataTable';
import { FormModal, FormField, inputClass } from '@/shared/ui/FormModal';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';
import { primaryButtonClass, secondaryButtonClass, surfacePanelClass } from '@/shared/ui/buttonStyles';

export function MappingPage() {
  const [open, setOpen] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', sourceField: '', targetField: '', transform: 'direct' });
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['mappings'],
    queryFn: async () => (await http.get('/mappings')).data,
  });

  const createRule = useMutation({
    mutationFn: (body: typeof form) => http.post('/mappings/rules', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['mappings'] }); setOpen(false); },
  });

  const testMapping = useMutation({
    mutationFn: () => http.post('/mappings/test', { sourceField: 'title', targetField: 'name', value: '<p>Test product</p>', transform: 'strip_html' }),
    onSuccess: (res) => setTestResult(JSON.stringify(res.data, null, 2)),
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  const rules = (data as { rules?: Record<string, unknown>[] }[]).flatMap((p) => p.rules ?? []);

  return (
    <div>
      <PageHeader
        title="Mapping & Transformaciones"
        subtitle="Motor de mapeo y transformación de campos entre sistemas"
        actions={
          <>
             <button type="button" onClick={() => testMapping.mutate()} className={secondaryButtonClass}>Probar mapeo</button>
             <button type="button" onClick={() => setOpen(true)} className={primaryButtonClass}>+ Nueva regla</button>
           </>
         }
       />
      {testResult && <pre className={`${surfacePanelClass} mb-4 overflow-x-auto bg-bg-surface p-4 text-xs text-text-secondary`}>{testResult}</pre>}
      <DataTable data={rules} columns={[
        { key: 'name', header: 'Regla' }, { key: 'sourceField', header: 'Origen' },
        { key: 'targetField', header: 'Destino' }, { key: 'transform', header: 'Transform' },
      ]} />
      <FormModal open={open} title="Nueva regla" onClose={() => setOpen(false)} onSubmit={(e) => { e.preventDefault(); createRule.mutate(form); }} loading={createRule.isPending}>
        <FormField label="Nombre"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></FormField>
        <FormField label="Campo origen"><input className={inputClass} value={form.sourceField} onChange={(e) => setForm({ ...form, sourceField: e.target.value })} required /></FormField>
        <FormField label="Campo destino"><input className={inputClass} value={form.targetField} onChange={(e) => setForm({ ...form, targetField: e.target.value })} required /></FormField>
      </FormModal>
    </div>
  );
}
