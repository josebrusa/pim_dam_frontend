export type DashboardSummary = {
  totalProducts: number;
  activeSkus: number;
  activeWorkflows: number;
  publishedChannels: number;
};

export type DashboardActivityItem = {
  id: string;
  message: string;
  module: string;
};

export type DashboardChannelItem = {
  name: string;
  count: number;
  percentage: number;
};
