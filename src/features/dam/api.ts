import { http } from '@/shared/api/http';
import type { AssetForm, AssetUpdateForm, DamResponse } from './types';

export async function getAssets() {
  const { data } = await http.get<DamResponse>('/assets');
  return data;
}

export async function createAsset(body: AssetForm) {
  return http.post('/assets', body);
}

export async function updateAsset(id: string, body: AssetUpdateForm) {
  return http.patch(`/assets/${id}`, body);
}

export async function deleteAsset(id: string) {
  return http.delete(`/assets/${id}`);
}
