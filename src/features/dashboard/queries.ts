import { useQuery } from '@tanstack/react-query';
import { getDashboardActivity, getDashboardProductsByChannel, getDashboardSummary } from './api';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: () => [...dashboardKeys.all, 'summary'] as const,
  activity: () => [...dashboardKeys.all, 'activity'] as const,
  productsByChannel: () => [...dashboardKeys.all, 'products-by-channel'] as const,
};

export function useDashboardSummaryQuery() {
  return useQuery({ queryKey: dashboardKeys.summary(), queryFn: getDashboardSummary });
}

export function useDashboardActivityQuery() {
  return useQuery({ queryKey: dashboardKeys.activity(), queryFn: getDashboardActivity });
}

export function useDashboardProductsByChannelQuery() {
  return useQuery({ queryKey: dashboardKeys.productsByChannel(), queryFn: getDashboardProductsByChannel });
}
