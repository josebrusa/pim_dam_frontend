import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { ProtectedRoute } from './ProtectedRoute';
import { renderWithProviders } from '@/test/test-utils';

const { getTokenMock } = vi.hoisted(() => ({
  getTokenMock: vi.fn(),
}));

vi.mock('@/shared/api/http', () => ({
  authStorage: {
    getToken: getTokenMock,
  },
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    getTokenMock.mockReset();
  });

  it('redirige a login cuando no hay token', () => {
    getTokenMock.mockReturnValue(null);

    renderWithProviders(
      <MemoryRouter initialEntries={['/app/dashboard']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/app/dashboard" element={<div>Dashboard</div>} />
          </Route>
          <Route path="/login" element={<div>Login screen</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login screen')).toBeInTheDocument();
  });
});
