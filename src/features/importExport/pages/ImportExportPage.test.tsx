import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import { ImportExportPage } from './ImportExportPage';

const { hasPermissionMock, mutateMock } = vi.hoisted(() => ({
  hasPermissionMock: vi.fn(),
  mutateMock: vi.fn(),
}));

vi.mock('@/shared/hooks/usePermissions', () => ({
  usePermissions: () => ({ hasPermission: hasPermissionMock }),
}));

vi.mock('../queries', () => ({
  importExportKeys: { imports: ['imports'], exports: ['exports'] },
  useImportsQuery: () => ({
    data: { data: [{ id: '1', code: 'IMP-001', type: 'CSV', status: 'pending', rowCount: 12 }] },
    isLoading: false,
    isError: false,
  }),
  useExportsQuery: () => ({
    data: { data: [{ id: '2', code: 'EXP-001', type: 'products', status: 'completed' }] },
    isLoading: false,
    isError: false,
  }),
}));

vi.mock('../api', () => ({
  createImportJob: vi.fn(),
  createExportJob: vi.fn(),
  updateImportJob: vi.fn(),
  updateExportJob: vi.fn(),
  deleteImportJob: vi.fn(),
  deleteExportJob: vi.fn(),
}));

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query');
  return {
    ...actual,
    useMutation: () => ({ mutate: mutateMock, isPending: false }),
  };
});

describe('ImportExportPage', () => {
  it('abre edición y confirmación de borrado', async () => {
    hasPermissionMock.mockReturnValue(true);

    renderWithProviders(<ImportExportPage />);

    await userEvent.click(screen.getAllByRole('button', { name: 'Editar' })[0]!);
    expect(screen.getByText('Editar importación IMP-001')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    await userEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0]!);
    expect(screen.getByText('Eliminar importación')).toBeInTheDocument();
  });
});
