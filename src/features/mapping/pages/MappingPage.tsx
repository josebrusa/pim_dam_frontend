import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/shared/ui/PageHeader';
import { DataTable } from '@/shared/ui/DataTable';
import { FormModal, FormField, inputClass } from '@/shared/ui/FormModal';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { LoadingState, ErrorState } from '@/shared/ui/LoadingState';
import { ActionButton } from '@/shared/ui/ActionButton';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { surfacePanelClass } from '@/shared/ui/buttonStyles';
import { createMappingRule, deleteMappingRule, testMappingRule, updateMappingRule } from '../api';
import { mappingKeys, useMappingsQuery } from '../queries';
import type { MappingRule, MappingRuleForm } from '../types';

export function MappingPage() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [form, setForm] = useState<MappingRuleForm>({ name: '', sourceField: '', targetField: '', transform: 'direct' });
  const [editingRule, setEditingRule] = useState<MappingRule | null>(null);
  const [editForm, setEditForm] = useState<MappingRuleForm>({ name: '', sourceField: '', targetField: '', transform: 'direct' });
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

  const updateRule = useMutation({ mutationFn: ({ id, body }: { id: string; body: MappingRuleForm }) => updateMappingRule(id, body), onSuccess: () => { qc.invalidateQueries({ queryKey: mappingKeys.all }); setEditOpen(false); setEditingRule(null); } });
  const removeRule = useMutation({ mutationFn: deleteMappingRule, onSuccess: () => { qc.invalidateQueries({ queryKey: mappingKeys.all }); setConfirmDeleteOpen(false); setEditingRule(null); } });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!data) return <LoadingState />;

  const rules = data.flatMap((p) => p.rules ?? []);
  const canManageMappings = hasPermission({ roles: ['PIM_MANAGER', 'IT_ADMIN'] });

  const handleEdit = (rule: MappingRule) => {
    setEditingRule(rule);
    setEditForm({ name: rule.name, sourceField: rule.sourceField, targetField: rule.targetField, transform: rule.transform });
    setEditOpen(true);
  };

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
         { key: 'actions', header: 'Acciones', render: (r) => canManageMappings ? <div className="flex gap-3"><button type="button" className="text-sm font-medium text-accent transition-colors hover:text-accent-hover" onClick={() => handleEdit(r as MappingRule)}>Editar</button><button type="button" className="text-sm font-medium text-danger transition-colors hover:opacity-80" onClick={() => { setEditingRule(r as MappingRule); setConfirmDeleteOpen(true); }}>Eliminar</button></div> : '—' },
       ]} />
      <FormModal open={open} title="Nueva regla" onClose={() => setOpen(false)} onSubmit={(e) => { e.preventDefault(); createRule.mutate(form); }} loading={createRule.isPending}>
        <FormField label="Nombre"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></FormField>
        <FormField label="Campo origen"><input className={inputClass} value={form.sourceField} onChange={(e) => setForm({ ...form, sourceField: e.target.value })} required /></FormField>
        <FormField label="Campo destino"><input className={inputClass} value={form.targetField} onChange={(e) => setForm({ ...form, targetField: e.target.value })} required /></FormField>
      </FormModal>
      <FormModal open={editOpen} title={editingRule ? `Editar ${editingRule.name}` : 'Editar regla'} onClose={() => { setEditOpen(false); setEditingRule(null); }} onSubmit={(e) => { e.preventDefault(); if (editingRule) updateRule.mutate({ id: editingRule.id, body: editForm }); }} loading={updateRule.isPending} submitLabel="Guardar cambios">
        <FormField label="Nombre"><input className={inputClass} value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required /></FormField>
        <FormField label="Campo origen"><input className={inputClass} value={editForm.sourceField} onChange={(e) => setEditForm({ ...editForm, sourceField: e.target.value })} required /></FormField>
        <FormField label="Campo destino"><input className={inputClass} value={editForm.targetField} onChange={(e) => setEditForm({ ...editForm, targetField: e.target.value })} required /></FormField>
      </FormModal>
      <ConfirmDialog open={confirmDeleteOpen} title="Eliminar regla" message={`Se eliminará ${editingRule?.name ?? 'esta regla'} de mapeo.`} confirmLabel="Eliminar" loading={removeRule.isPending} onClose={() => { setConfirmDeleteOpen(false); setEditingRule(null); }} onConfirm={() => { if (editingRule) removeRule.mutate(editingRule.id); }} />
    </div>
  );
}
