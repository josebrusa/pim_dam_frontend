import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmDialog } from './ConfirmDialog';
import { renderWithProviders } from '@/test/test-utils';

describe('ConfirmDialog', () => {
  it('permite cancelar y confirmar', async () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    renderWithProviders(
      <ConfirmDialog
        open
        title="Eliminar elemento"
        message="Esta acción no se puede deshacer."
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onClose).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
