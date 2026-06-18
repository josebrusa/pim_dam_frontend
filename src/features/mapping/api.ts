import { http } from '@/shared/api/http';
import type { MappingRuleForm, MappingProfile } from './types';

export async function getMappings() {
  const { data } = await http.get<MappingProfile[]>('/mappings');
  return data;
}

export async function createMappingRule(body: MappingRuleForm) {
  return http.post('/mappings/rules', body);
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
