import { http } from '@/shared/api/http';
import { z } from 'zod';
import type { DashboardActivityItem, DashboardChannelItem, DashboardSummary } from './types';

const dashboardSummarySchema = z.object({
  totalProducts: z.number(),
  activeSkus: z.number(),
  activeWorkflows: z.number(),
  publishedChannels: z.number(),
});

const dashboardActivitySchema = z.array(z.object({
  id: z.string(),
  message: z.string(),
  module: z.string(),
}));

const dashboardChannelSchema = z.array(z.object({
  name: z.string(),
  count: z.number(),
  percentage: z.number(),
}));

export async function getDashboardSummary() {
  const { data } = await http.get<DashboardSummary>('/dashboard/summary');
  return dashboardSummarySchema.parse(data);
}

export async function getDashboardActivity() {
  const { data } = await http.get<DashboardActivityItem[]>('/dashboard/activity');
  return dashboardActivitySchema.parse(data);
}

export async function getDashboardProductsByChannel() {
  const { data } = await http.get<DashboardChannelItem[]>('/dashboard/products-by-channel');
  return dashboardChannelSchema.parse(data);
}
