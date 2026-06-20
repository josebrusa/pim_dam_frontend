import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { PublicRoute } from './PublicRoute';

const { useAuthMeMock, isAuthSessionErrorMock } = vi.hoisted(() => ({
  useAuthMeMock: vi.fn(),
  isAuthSessionErrorMock: vi.fn(),
}));

vi.mock('@/shared/api/http', () => ({
  isAuthSessionError: isAuthSessionErrorMock,
}));

vi.mock('@/features/auth/hooks/useAuthMe', () => ({
  useAuthMe: useAuthMeMock,
}));

describe('PublicRoute', () => {
  beforeEach(() => {
    useAuthMeMock.mockReset();
    useAuthMeMock.mockReturnValue({ data: undefined, isPending: false, isError: false });
    isAuthSessionErrorMock.mockReset();
    isAuthSessionErrorMock.mockReturnValue(false);
  });

  it('muestra login cuando no hay token', () => {
    useAuthMeMock.mockReturnValue({ data: undefined, error: { response: { status: 401 } }, isPending: false, isError: true });
    isAuthSessionErrorMock.mockReturnValue(true);

    renderWithProviders(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<div>Login screen</div>} />
          </Route>
          <Route path="/app/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login screen')).toBeInTheDocument();
  });

  it('redirige al dashboard cuando la sesion ya existe', () => {
    useAuthMeMock.mockReturnValue({
      data: { id: '1', role: 'PIM_MANAGER', permissions: ['*'] },
      isPending: false,
      isError: false,
    });

    renderWithProviders(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<div>Login screen</div>} />
          </Route>
          <Route path="/app/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
