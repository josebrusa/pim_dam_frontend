import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/shared/ui/PageHeader';
import { DataTable } from '@/shared/ui/DataTable';
import { FormModal, FormField, inputClass } from '@/shared/ui/FormModal';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';
import { ActionButton } from '@/shared/ui/ActionButton';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { surfacePanelClass } from '@/shared/ui/buttonStyles';
import { createMappingRule, testMappingRule } from '../api';
import { mappingKeys, useMappingsQuery } from '../queries';
import type { MappingRuleForm } from '../types';

export function MappingPage() {
  const [open, setOpen] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [form, setForm] = useState<MappingRuleForm>({ name: '', sourceField: '', targetField: '', transform: 'direct' });
  const qc = useQueryClient();
  const { hasPermission } = usePermissions();

  const { data, isLoading, isError } = useMappingsQuery();

  const createRule = useMutation({
    mutationFn: createMappingRule,
    onSuccess: () => { qc.invalidateQueries({ queryKey: mappingKeys.all }); setOpen(false); },
  });

  const testMapping = useMutation({
    mutationFn: testMappingRule,
    onSuccess: (res) => setTestResult(JSON.stringify(res, null, 2)),
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!data) return <LoadingState />;

  const rules = data.flatMap((p) => p.rules ?? []);
  const canManageMappings = hasPermission({ roles: ['PIM_MANAGER', 'IT_ADMIN'] });

  return (
    <div>
      <PageHeader
        title="Mapping & Transformaciones"
        subtitle="Motor de mapeo y transformación de campos entre sistemas"
        actions={
          <>
            <ActionButton variant="secondary" onClick={() => testMapping.mutate()} disabled={!canManageMappings}>Probar mapeo</ActionButton>
            <ActionButton onClick={() => setOpen(true)} disabled={!canManageMappings}>+ Nueva regla</ActionButton>
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
