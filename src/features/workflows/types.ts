export type WorkflowStats = {
  active: number;
  pending: number;
  completed: number;
  blocked: number;
};

export type WorkflowTaskItem = {
  id: string;
  workflow?: { id?: string; name?: string };
  productName: string;
  stage: string;
  priority: string;
  status: string;
};

export type WorkflowItem = {
  id: string;
  name: string;
  status: string;
  _count?: { tasks?: number };
};

export type WorkflowsResponse = {
  stats: WorkflowStats;
  workflows: { data: WorkflowItem[] };
  tasks: { data: WorkflowTaskItem[] };
};

export type WorkflowForm = {
  name: string;
};

export type WorkflowUpdateForm = {
  name: string;
  status: string;
};
