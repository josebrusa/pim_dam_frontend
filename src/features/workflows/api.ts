import { http } from '@/shared/api/http';
import type { WorkflowForm, WorkflowTaskItem, WorkflowsResponse, WorkflowUpdateForm } from './types';

export async function getWorkflows() {
  const { data } = await http.get<WorkflowsResponse>('/workflows');
  return data;
}

export async function getMyWorkflowTasks() {
  const { data } = await http.get<WorkflowTaskItem[]>('/workflow-tasks/my');
  return data;
}

export async function createWorkflow(body: WorkflowForm) {
  return http.post('/workflows', body);
}

export async function updateWorkflow(id: string, body: WorkflowUpdateForm) {
  return http.patch(`/workflows/${id}`, body);
}

export async function deleteWorkflow(id: string) {
  return http.delete(`/workflows/${id}`);
}
