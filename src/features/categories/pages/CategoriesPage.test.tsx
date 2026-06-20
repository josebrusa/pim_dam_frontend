import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import { CategoriesPage } from './CategoriesPage';

const { hasPermissionMock, mutateMock } = vi.hoisted(() => ({
  hasPermissionMock: vi.fn(),
  mutateMock: vi.fn(),
}));

vi.mock('@/shared/hooks/usePermissions', () => ({
  usePermissions: () => ({ hasPermission: hasPermissionMock }),
}));

vi.mock('../queries', () => ({
  categoriesKeys: { all: ['categories'] },
  useCategoriesQuery: () => ({
    data: { data: [{ id: '1', code: 'CAT-001', name: 'Calzado', level: 1 }] },
    isLoading: false,
    isError: false,
  }),
}));

vi.mock('../api', () => ({
  createCategory: vi.fn(),
  importCategoryTree: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
}));

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query');
  return {
    ...actual,
    useMutation: () => ({ mutate: mutateMock, isPending: false }),
  };
});

describe('CategoriesPage', () => {
  it('abre edición y confirmación de borrado', async () => {
    hasPermissionMock.mockReturnValue(true);

    renderWithProviders(<CategoriesPage />);

    await userEvent.click(screen.getByRole('button', { name: 'Editar' }));
    expect(screen.getByText('Editar CAT-001')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(screen.getByText('Eliminar categoría')).toBeInTheDocument();
  });
});
