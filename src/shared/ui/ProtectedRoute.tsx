import { Navigate, Outlet } from 'react-router-dom';
import { useAuthMe } from '@/features/auth/hooks/useAuthMe';
import { isAuthSessionError } from '@/shared/api/http';
import { ErrorState, LoadingState } from './LoadingState';

export function ProtectedRoute() {
  const { data: user, error, isPending, isError } = useAuthMe();

  if (isPending) {
    return <LoadingState />;
  }

  if (isError && isAuthSessionError(error)) {
    return <Navigate to="/login" replace />;
  }

  if (isError) {
    return <ErrorState message="No pudimos validar tu sesion. Revisa la conexion con el backend e intentalo de nuevo." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
