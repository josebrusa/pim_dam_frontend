import { useAuthMeQuery } from '../queries';
export type { AuthUser } from '../types';

export function useAuthMe(enabled = true) {
  return useAuthMeQuery(enabled);
}
