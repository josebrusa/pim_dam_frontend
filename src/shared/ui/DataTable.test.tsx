import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { DataTable } from './DataTable';
import { renderWithProviders } from '@/test/test-utils';

describe('DataTable', () => {
  it('renderiza columnas y filas de datos', () => {
    renderWithProviders(
      <DataTable
        data={[{ id: '1', code: 'PRD-001', name: 'Producto demo' }]}
        columns={[
          { key: 'code', header: 'Código' },
          { key: 'name', header: 'Nombre' },
        ]}
      />,
    );

    expect(screen.getByText('Código')).toBeInTheDocument();
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('PRD-001')).toBeInTheDocument();
    expect(screen.getByText('Producto demo')).toBeInTheDocument();
  });
});
