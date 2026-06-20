import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import { MappingPage } from './MappingPage';

const { hasPermissionMock, mutateMock } = vi.hoisted(() => ({
  hasPermissionMock: vi.fn(),
  mutateMock: vi.fn(),
}));

vi.mock('@/shared/hooks/usePermissions', () => ({
  usePermissions: () => ({ hasPermission: hasPermissionMock }),
}));

vi.mock('../queries', () => ({
  mappingKeys: { all: ['mappings'] },
  useMappingsQuery: () => ({
    data: [{ id: 'p1', rules: [{ id: '1', name: 'Title to Name', sourceField: 'title', targetField: 'name', transform: 'direct' }] }],
    isLoading: false,
    isError: false,
  }),
}));

vi.mock('../api', () => ({
  createMappingRule: vi.fn(),
  testMappingRule: vi.fn(),
  updateMappingRule: vi.fn(),
  deleteMappingRule: vi.fn(),
}));

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query');
  return {
    ...actual,
    useMutation: () => ({ mutate: mutateMock, isPending: false }),
  };
});

describe('MappingPage', () => {
  it('abre edición y confirmación de borrado', async () => {
    hasPermissionMock.mockReturnValue(true);

    renderWithProviders(<MappingPage />);

    await userEvent.click(screen.getByRole('button', { name: 'Editar' }));
    expect(screen.getByText('Editar Title to Name')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(screen.getByText('Eliminar regla')).toBeInTheDocument();
  });
});
