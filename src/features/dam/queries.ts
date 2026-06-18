import { useQuery } from '@tanstack/react-query';
import { getAssets } from './api';

export const damKeys = {
  all: ['assets'] as const,
};

export function useAssetsQuery() {
  return useQuery({ queryKey: damKeys.all, queryFn: getAssets });
}
