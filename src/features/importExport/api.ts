import { http } from '@/shared/api/http';
import type { JobsResponse, JobUpdateForm } from './types';

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

export async function updateImportJob(id: string, body: JobUpdateForm) {
  return http.patch(`/imports/${id}`, body);
}

export async function deleteImportJob(id: string) {
  return http.delete(`/imports/${id}`);
}

export async function createExportJob() {
  return http.post('/exports', { type: 'products' });
}

export async function updateExportJob(id: string, body: JobUpdateForm) {
  return http.patch(`/exports/${id}`, body);
}

export async function deleteExportJob(id: string) {
  return http.delete(`/exports/${id}`);
}
