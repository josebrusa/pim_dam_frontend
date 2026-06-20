import { http } from '@/shared/api/http';
import type { GdsnForm, GdsnResponse, GdsnUpdateForm } from './types';

export async function getGdsnPublications() {
  const { data } = await http.get<GdsnResponse>('/gdsn/publications');
  return data;
}

export async function createGdsnPublication(body: GdsnForm) {
  return http.post('/gdsn/publications', body);
}

export async function updateGdsnPublication(id: string, body: GdsnUpdateForm) {
  return http.patch(`/gdsn/publications/${id}`, body);
}

export async function deleteGdsnPublication(id: string) {
  return http.delete(`/gdsn/publications/${id}`);
}
