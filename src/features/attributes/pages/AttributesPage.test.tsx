import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import { AttributesPage } from './AttributesPage';

const { hasPermissionMock, mutateMock } = vi.hoisted(() => ({
  hasPermissionMock: vi.fn(),
  mutateMock: vi.fn(),
}));

vi.mock('@/shared/hooks/usePermissions', () => ({
  usePermissions: () => ({ hasPermission: hasPermissionMock }),
}));

vi.mock('../queries', () => ({
  attributesKeys: { all: ['attributes'] },
  useAttributesQuery: () => ({
    data: { data: [{ id: '1', code: 'ATR-001', name: 'Color', type: 'text', status: 'draft', channels: [] }] },
    isLoading: false,
    isError: false,
  }),
}));

vi.mock('../api', () => ({
  createAttribute: vi.fn(),
  exportAttributes: vi.fn(),
  updateAttribute: vi.fn(),
  deleteAttribute: vi.fn(),
}));

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query');
  return {
    ...actual,
    useMutation: () => ({ mutate: mutateMock, isPending: false }),
  };
});

describe('AttributesPage', () => {
  it('abre edición y confirmación de borrado', async () => {
    hasPermissionMock.mockReturnValue(true);

    renderWithProviders(<AttributesPage />);

    await userEvent.click(screen.getByRole('button', { name: 'Editar' }));
    expect(screen.getByText('Editar ATR-001')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(screen.getByText('Eliminar atributo')).toBeInTheDocument();
  });
});
