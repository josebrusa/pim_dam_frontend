import { useQuery } from '@tanstack/react-query';
import { getMyWorkflowTasks, getWorkflows } from './api';

export const workflowsKeys = {
  all: ['workflows'] as const,
  myTasks: ['workflow-tasks', 'my'] as const,
};

export function useWorkflowsQuery() {
  return useQuery({ queryKey: workflowsKeys.all, queryFn: getWorkflows });
}

export function useMyWorkflowTasksQuery(enabled: boolean) {
  return useQuery({ queryKey: workflowsKeys.myTasks, queryFn: getMyWorkflowTasks, enabled });
}
