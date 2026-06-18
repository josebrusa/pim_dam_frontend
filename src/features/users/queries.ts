import { useQuery } from '@tanstack/react-query';
import { getRoles, getUsers } from './api';

export const usersKeys = {
  all: ['users'] as const,
  roles: ['roles'] as const,
};

export function useUsersQuery() {
  return useQuery({ queryKey: usersKeys.all, queryFn: getUsers });
}

export function useRolesQuery() {
  return useQuery({ queryKey: usersKeys.roles, queryFn: getRoles });
}
