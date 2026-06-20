import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import { UsersPage } from './UsersPage';

const { hasPermissionMock, mutateMock } = vi.hoisted(() => ({
  hasPermissionMock: vi.fn(),
  mutateMock: vi.fn(),
}));

vi.mock('@/shared/hooks/usePermissions', () => ({
  usePermissions: () => ({ hasPermission: hasPermissionMock }),
}));

vi.mock('../queries', () => ({
  usersKeys: { all: ['users'], roles: ['roles'] },
  useUsersQuery: () => ({
    data: { data: [{ id: '1', name: 'Ana Perez', email: 'ana@test.com', role: 'MARKETING', status: 'active' }], meta: { total: 1 } },
    isLoading: false,
    isError: false,
  }),
  useRolesQuery: () => ({
    data: [{ code: 'MARKETING', name: 'Marketing' }, { code: 'PIM_MANAGER', name: 'PIM Manager' }],
    isLoading: false,
    isError: false,
  }),
}));

vi.mock('../api', () => ({
  inviteUser: vi.fn(),
  exportUsersJob: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
}));

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query');
  return {
    ...actual,
    useMutation: () => ({ mutate: mutateMock, isPending: false }),
  };
});

describe('UsersPage', () => {
  it('abre acciones de editar y eliminar para usuarios', async () => {
    hasPermissionMock.mockReturnValue(true);

    renderWithProviders(<UsersPage />);

    await userEvent.click(screen.getByRole('button', { name: 'Editar' }));
    expect(screen.getByText('Editar Ana Perez')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(screen.getByText('Eliminar usuario del tenant')).toBeInTheDocument();
  });
});
