import { http } from '@/shared/api/http';
import type { MappingRuleForm, MappingProfile } from './types';

export async function getMappings() {
  const { data } = await http.get<MappingProfile[]>('/mappings');
  return data;
}

export async function createMappingRule(body: MappingRuleForm) {
  return http.post('/mappings/rules', body);
}

export async function updateMappingRule(id: string, body: MappingRuleForm) {
  return http.patch(`/mappings/rules/${id}`, body);
}

export async function deleteMappingRule(id: string) {
  return http.delete(`/mappings/rules/${id}`);
}

export async function testMappingRule() {
  const { data } = await http.post('/mappings/test', {
    sourceField: 'title',
    targetField: 'name',
    value: '<p>Test product</p>',
    transform: 'strip_html',
  });
  return data;
}
