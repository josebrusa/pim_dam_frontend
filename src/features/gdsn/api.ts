import { http } from '@/shared/api/http';
import type { GdsnForm, GdsnResponse } from './types';

export async function getGdsnPublications() {
  const { data } = await http.get<GdsnResponse>('/gdsn/publications');
  return data;
}

export async function createGdsnPublication(body: GdsnForm) {
  return http.post('/gdsn/publications', body);
}
