import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import { WorkflowsPage } from './WorkflowsPage';

const { hasPermissionMock, mutateMock } = vi.hoisted(() => ({
  hasPermissionMock: vi.fn(),
  mutateMock: vi.fn(),
}));

vi.mock('@/shared/hooks/usePermissions', () => ({
  usePermissions: () => ({ hasPermission: hasPermissionMock }),
}));

vi.mock('../queries', () => ({
  workflowsKeys: { all: ['workflows'], myTasks: ['workflow-tasks', 'my'] },
  useWorkflowsQuery: () => ({
    data: {
      stats: { active: 1, pending: 0, completed: 0, blocked: 0 },
      workflows: { data: [{ id: '1', name: 'Aprobación catálogo', status: 'active', _count: { tasks: 2 } }] },
      tasks: { data: [] },
    },
    isLoading: false,
    isError: false,
  }),
  useMyWorkflowTasksQuery: () => ({ data: [], isLoading: false, isError: false }),
}));

vi.mock('../api', () => ({
  createWorkflow: vi.fn(),
  updateWorkflow: vi.fn(),
  deleteWorkflow: vi.fn(),
}));

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query');
  return {
    ...actual,
    useMutation: () => ({ mutate: mutateMock, isPending: false }),
  };
});

describe('WorkflowsPage', () => {
  it('muestra workflows y permite abrir edición', async () => {
    hasPermissionMock.mockReturnValue(true);

    renderWithProviders(<WorkflowsPage />);

    expect(screen.getByText('Aprobación catálogo')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Editar' }));
    expect(screen.getByText('Editar Aprobación catálogo')).toBeInTheDocument();
  });
});
