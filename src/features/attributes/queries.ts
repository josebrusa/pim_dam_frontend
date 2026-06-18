import { useQuery } from '@tanstack/react-query';
import { getAttributes } from './api';

export const attributesKeys = {
  all: ['attributes'] as const,
};

export function useAttributesQuery() {
  return useQuery({ queryKey: attributesKeys.all, queryFn: getAttributes });
}
