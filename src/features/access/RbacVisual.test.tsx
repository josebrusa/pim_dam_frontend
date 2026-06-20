import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { CategoriesPage } from '@/features/categories/pages/CategoriesPage';
import { ImportExportPage } from '@/features/importExport/pages/ImportExportPage';

const { hasPermissionMock } = vi.hoisted(() => ({
  hasPermissionMock: vi.fn(),
}));

vi.mock('@/shared/hooks/usePermissions', () => ({
  usePermissions: () => ({ hasPermission: hasPermissionMock }),
}));

vi.mock('@/features/categories/queries', () => ({
  categoriesKeys: { all: ['categories'] },
  useCategoriesQuery: () => ({
    data: { data: [{ id: '1', code: 'CAT-001', name: 'Calzado', level: 1 }] },
    isLoading: false,
    isError: false,
  }),
}));

vi.mock('@/features/categories/api', () => ({
  createCategory: vi.fn(),
  importCategoryTree: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
}));

vi.mock('@/features/importExport/queries', () => ({
  importExportKeys: { imports: ['imports'], exports: ['exports'] },
  useImportsQuery: () => ({
    data: { data: [{ id: '1', code: 'IMP-001', type: 'CSV', status: 'completed', rowCount: 12 }] },
    isLoading: false,
    isError: false,
  }),
  useExportsQuery: () => ({
    data: { data: [{ id: '2', code: 'EXP-001', type: 'products', status: 'completed', rowCount: 12 }] },
    isLoading: false,
    isError: false,
  }),
}));

vi.mock('@/features/importExport/api', () => ({
  createImportJob: vi.fn(),
  createExportJob: vi.fn(),
  updateImportJob: vi.fn(),
  updateExportJob: vi.fn(),
  deleteImportJob: vi.fn(),
  deleteExportJob: vi.fn(),
}));

describe('RBAC visual', () => {
  it('deshabilita acciones de categorías sin rol permitido', () => {
    hasPermissionMock.mockReturnValue(false);

    renderWithProviders(<CategoriesPage />);

    expect(screen.getByRole('button', { name: 'Importar árbol' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '+ Nueva categoría' })).toBeDisabled();
  });

  it('deshabilita acciones de import/export sin permiso de escritura', () => {
    hasPermissionMock.mockReturnValue(false);

    renderWithProviders(<ImportExportPage />);

    expect(screen.getByRole('button', { name: 'Exportar' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '+ Nueva importación' })).toBeDisabled();
  });
});
