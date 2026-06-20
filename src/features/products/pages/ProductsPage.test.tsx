import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import { ProductsPage } from './ProductsPage';

const { hasPermissionMock, mutateMock } = vi.hoisted(() => ({
  hasPermissionMock: vi.fn(),
  mutateMock: vi.fn(),
}));

vi.mock('@/shared/hooks/usePermissions', () => ({
  usePermissions: () => ({ hasPermission: hasPermissionMock }),
}));

vi.mock('../queries', () => ({
  productsKeys: { all: ['products'], list: () => ['products', 'list'] },
  useProductsQuery: () => ({
    data: { data: [{ id: '1', code: 'PRD-001', name: 'Producto demo', status: 'draft' }] },
    isLoading: false,
    isError: false,
  }),
}));

vi.mock('../api', () => ({
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
}));

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query');
  return {
    ...actual,
    useMutation: () => ({ mutate: mutateMock, isPending: false }),
  };
});

describe('ProductsPage', () => {
  it('abre edición y confirmación de borrado', async () => {
    hasPermissionMock.mockReturnValue(true);

    renderWithProviders(<ProductsPage />);

    await userEvent.click(screen.getByRole('button', { name: 'Editar' }));
    expect(screen.getByText('Editar PRD-001')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(screen.getByText('Eliminar producto')).toBeInTheDocument();
  });
});
