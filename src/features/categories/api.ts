import { http } from '@/shared/api/http';
import type { CategoriesResponse, CategoryForm, CategoryUpdateForm } from './types';

export async function getCategories() {
  const { data } = await http.get<CategoriesResponse>('/categories');
  return data;
}

export async function createCategory(body: CategoryForm) {
  return http.post('/categories', body);
}

export async function updateCategory(id: string, body: CategoryUpdateForm) {
  return http.patch(`/categories/${id}`, body);
}

export async function deleteCategory(id: string) {
  return http.delete(`/categories/${id}`);
}

export async function importCategoryTree() {
  return http.post('/categories/import-tree', {
    nodes: [
      { code: 'CAT-100', name: 'Nueva rama', level: 0 },
      { code: 'CAT-101', name: 'Subcategoría', parentCode: 'CAT-100', level: 1 },
    ],
  });
}
