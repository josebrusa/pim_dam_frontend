import { useQuery } from '@tanstack/react-query';
import { http } from '@/shared/api/http';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  initials: string;
  role: string;
  tenantId: string;
  tenantName: string;
  permissions: string[];
};

export function useAuthMe() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const { data } = await http.get<{ user: AuthUser }>('/auth/me');
      return data.user;
    },
    retry: false,
  });
}
