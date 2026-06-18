import { useQuery } from '@tanstack/react-query';
import { getGdsnPublications } from './api';

export const gdsnKeys = {
  all: ['gdsn'] as const,
};

export function useGdsnQuery() {
  return useQuery({ queryKey: gdsnKeys.all, queryFn: getGdsnPublications });
}
