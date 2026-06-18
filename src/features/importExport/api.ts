import { http } from '@/shared/api/http';
import type { JobsResponse } from './types';

export async function getImports() {
  const { data } = await http.get<JobsResponse>('/imports');
  return data;
}

export async function getExports() {
  const { data } = await http.get<JobsResponse>('/exports');
  return data;
}

export async function createImportJob() {
  return http.post('/imports', { type: 'CSV' });
}

export async function createExportJob() {
  return http.post('/exports', { type: 'products' });
}
