export function LoadingState() {
  return <div className="py-12 text-center text-sm text-text-secondary">Cargando...</div>;
}

export function ErrorState({ message }: { message?: string }) {
  return <div className="py-12 text-center text-sm text-danger">{message ?? 'Error al cargar datos'}</div>;
}
