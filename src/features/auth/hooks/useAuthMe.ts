import { useAuthMeQuery } from '../queries';
export type { AuthUser } from '../types';

export function useAuthMe() {
  return useAuthMeQuery();
}
