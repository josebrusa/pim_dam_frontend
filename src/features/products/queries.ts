import { useQuery } from '@tanstack/react-query';
import { getProducts } from './api';
import type { ProductListParams } from './types';

export const productsKeys = {
  all: ['products'] as const,
  list: (params: ProductListParams) => [...productsKeys.all, 'list', params] as const,
};

export function useProductsQuery(params: ProductListParams) {
  return useQuery({ queryKey: productsKeys.list(params), queryFn: () => getProducts(params) });
}
