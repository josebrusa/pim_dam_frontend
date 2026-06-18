import { useQuery } from '@tanstack/react-query';
import { getMappings } from './api';

export const mappingKeys = {
  all: ['mappings'] as const,
};

export function useMappingsQuery() {
  return useQuery({ queryKey: mappingKeys.all, queryFn: getMappings });
}
