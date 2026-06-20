import { http } from '@/shared/api/http';
import type { AttributeForm, AttributesResponse, AttributeUpdateForm } from './types';

export async function getAttributes() {
  const { data } = await http.get<AttributesResponse>('/attributes');
  return data;
}

export async function createAttribute(body: AttributeForm) {
  return http.post('/attributes', body);
}

export async function updateAttribute(id: string, body: AttributeUpdateForm) {
  return http.patch(`/attributes/${id}`, body);
}

export async function deleteAttribute(id: string) {
  return http.delete(`/attributes/${id}`);
}

export async function exportAttributes() {
  return http.post('/exports', { type: 'attributes' });
}
