export type JobItem = {
  id: string;
  code: string;
  type: string;
  status: string;
  rowCount?: number;
};

export type JobsResponse = {
  data: JobItem[];
};
