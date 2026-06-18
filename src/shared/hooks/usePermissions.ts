import { useAuthMe } from '@/features/auth/hooks/useAuthMe';

type PermissionCheck = {
  permission?: string;
  anyOf?: string[];
  roles?: string[];
};

export function usePermissions() {
  const { data: user } = useAuthMe();
  const permissions = user?.permissions ?? [];
  const role = user?.role;

  const hasPermission = (check: PermissionCheck | string) => {
    if (permissions.includes('*')) return true;

    if (typeof check === 'string') {
      return permissions.includes(check);
    }

    if (check.permission) {
      return permissions.includes(check.permission);
    }

    if (check.anyOf?.length) {
      return check.anyOf.some((permission) => permissions.includes(permission));
    }

    if (check.roles?.length) {
      return role ? check.roles.includes(role) : false;
    }

    return false;
  };

  return {
    user,
    hasPermission,
  };
}
