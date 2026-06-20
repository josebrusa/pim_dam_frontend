import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import { GdsnPage } from './GdsnPage';

const { hasPermissionMock, mutateMock } = vi.hoisted(() => ({
  hasPermissionMock: vi.fn(),
  mutateMock: vi.fn(),
}));

vi.mock('@/shared/hooks/usePermissions', () => ({
  usePermissions: () => ({ hasPermission: hasPermissionMock }),
}));

vi.mock('../queries', () => ({
  gdsnKeys: { all: ['gdsn'] },
  useGdsnQuery: () => ({
    data: {
      stats: { registered: 1, sentToday: 0, pending: 1, rejected: 0 },
      data: [{ id: '1', gtin: '12345678', productName: 'Producto GS1', dataPool: '1WorldSync', recipient: 'Cliente A', status: 'pending' }],
    },
    isLoading: false,
    isError: false,
  }),
}));

vi.mock('../api', () => ({
  createGdsnPublication: vi.fn(),
  updateGdsnPublication: vi.fn(),
  deleteGdsnPublication: vi.fn(),
}));

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query');
  return {
    ...actual,
    useMutation: () => ({ mutate: mutateMock, isPending: false }),
  };
});

describe('GdsnPage', () => {
  it('abre edición y confirmación de borrado', async () => {
    hasPermissionMock.mockReturnValue(true);

    renderWithProviders(<GdsnPage />);

    await userEvent.click(screen.getByRole('button', { name: 'Editar' }));
    expect(screen.getByText('Editar 12345678')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(screen.getByText('Eliminar publicación')).toBeInTheDocument();
  });
});
