import { http } from '@/shared/api/http';
import type { WorkflowForm, WorkflowTaskItem, WorkflowsResponse } from './types';

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
