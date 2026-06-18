import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';
import { renderWithProviders } from '@/test/test-utils';

describe('Pagination', () => {
  it('cambia de página con los botones', async () => {
    const onPageChange = vi.fn();

    renderWithProviders(<Pagination page={2} totalPages={4} onPageChange={onPageChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Anterior' }));
    expect(onPageChange).toHaveBeenCalledWith(1);

    await userEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
