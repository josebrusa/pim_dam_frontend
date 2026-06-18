import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from './LoginPage';
import { renderWithProviders } from '@/test/test-utils';

const { navigateMock, loginMock, invalidateQueriesMock, setTokenMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  loginMock: vi.fn(),
  invalidateQueriesMock: vi.fn().mockResolvedValue(undefined),
  setTokenMock: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query');
  return {
    ...actual,
    useQueryClient: () => ({ invalidateQueries: invalidateQueriesMock }),
  };
});

vi.mock('@/shared/api/http', () => ({
  authStorage: { setToken: setTokenMock, clear: vi.fn(), getToken: vi.fn() },
}));

vi.mock('@/features/auth/api', () => ({
  login: loginMock,
}));

describe('LoginPage', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    loginMock.mockReset();
    invalidateQueriesMock.mockClear();
    setTokenMock.mockReset();
  });

  it('envía login y redirige al dashboard', async () => {
    loginMock.mockResolvedValue({ accessToken: 'token-demo', user: {} });

    renderWithProviders(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => expect(loginMock).toHaveBeenCalledWith({
      email: 'admin@lumify.io',
      password: 'lumify2025',
    }));
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/app/dashboard'));
  });
});
