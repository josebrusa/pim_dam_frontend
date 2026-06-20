import { useQuery } from '@tanstack/react-query';
import { getAuthMe } from './api';

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

export function useAuthMeQuery(enabled = true) {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: getAuthMe,
    enabled,
    retry: false,
  });
}
