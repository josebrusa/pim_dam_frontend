export type WorkflowStats = {
  active: number;
  pending: number;
  completed: number;
  blocked: number;
};

export type WorkflowTaskItem = {
  id: string;
  workflow?: { name?: string };
  productName: string;
  stage: string;
  priority: string;
  status: string;
};

export type WorkflowsResponse = {
  stats: WorkflowStats;
  tasks: { data: WorkflowTaskItem[] };
};

export type WorkflowForm = {
  name: string;
};
