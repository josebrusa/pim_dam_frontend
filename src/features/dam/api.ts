import { http } from '@/shared/api/http';
import type { AssetForm, DamResponse } from './types';

export async function getAssets() {
  const { data } = await http.get<DamResponse>('/assets');
  return data;
}

export async function createAsset(body: AssetForm) {
  return http.post('/assets', body);
}
