import { useQuery } from '@tanstack/react-query';
import { getExports, getImports } from './api';

export const importExportKeys = {
  imports: ['imports'] as const,
  exports: ['exports'] as const,
};

export function useImportsQuery() {
  return useQuery({ queryKey: importExportKeys.imports, queryFn: getImports });
}

export function useExportsQuery() {
  return useQuery({ queryKey: importExportKeys.exports, queryFn: getExports });
}
