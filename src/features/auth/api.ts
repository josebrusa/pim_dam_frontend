import { http } from '@/shared/api/http';
import { z } from 'zod';
import type { AuthMeResponse, LoginPayload, LoginResponse } from './types';

const authUserSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  initials: z.string(),
  role: z.string(),
  tenantId: z.string(),
  tenantName: z.string(),
  permissions: z.array(z.string()),
});

const loginResponseSchema = z.object({
  accessToken: z.string(),
  user: authUserSchema,
});

const authMeResponseSchema = z.object({
  user: authUserSchema,
});

export async function login(body: LoginPayload) {
  const { data } = await http.post<LoginResponse>('/auth/login', body);
  return loginResponseSchema.parse(data);
}

export async function getAuthMe() {
  const { data } = await http.get<AuthMeResponse>('/auth/me');
  return authMeResponseSchema.parse(data).user;
}
