import { http } from '@/shared/api/http';
import { z } from 'zod';
import type { ProductForm, ProductListParams, ProductsResponse, ProductUpdateForm } from './types';

const productSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  category: z.object({ name: z.string().optional() }).optional(),
  status: z.string(),
});

const productsResponseSchema = z.object({
  data: z.array(productSchema),
});

export async function getProducts(params: ProductListParams) {
  const { data } = await http.get<ProductsResponse>('/products', { params: { status: params.status || undefined } });
  return productsResponseSchema.parse(data);
}

export async function createProduct(body: ProductForm) {
  return http.post('/products', body);
}

export async function updateProduct(id: string, body: ProductUpdateForm) {
  return http.patch(`/products/${id}`, body);
}

export async function deleteProduct(id: string) {
  return http.delete(`/products/${id}`);
}
