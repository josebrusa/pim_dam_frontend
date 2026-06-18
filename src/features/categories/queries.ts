import { useQuery } from '@tanstack/react-query';
import { getCategories } from './api';

export const categoriesKeys = {
  all: ['categories'] as const,
};

export function useCategoriesQuery() {
  return useQuery({ queryKey: categoriesKeys.all, queryFn: getCategories });
}
