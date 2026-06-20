import { Navigate, Outlet } from 'react-router-dom';
import { useAuthMe } from '@/features/auth/hooks/useAuthMe';
import { isAuthSessionError } from '@/shared/api/http';
import { LoadingState } from './LoadingState';
import { ErrorState } from './LoadingState';

export function PublicRoute() {
  const { data: user, error, isPending, isError } = useAuthMe();

  if (isPending) {
    return <LoadingState />;
  }

  if (user) {
    return <Navigate to="/app/dashboard" replace />;
  }

  if (isError && isAuthSessionError(error)) {
    return <Outlet />;
  }

  if (isError) {
    return <ErrorState message="No pudimos comprobar tu sesion. Revisa la conexion con el backend e intentalo de nuevo." />;
  }

  return <Outlet />;
}
