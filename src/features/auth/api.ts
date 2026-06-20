import { http } from '@/shared/api/http';
import { z } from 'zod';
import type { AuthMeApiResponse, LoginPayload, LoginResponse } from './types';

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

const authMeUserSchema = z.object({
  userId: z.string(),
  email: z.email(),
  name: z.string(),
  initials: z.string(),
  role: z.string(),
  tenantId: z.string(),
  tenantName: z.string(),
  permissions: z.array(z.string()),
});

const loginResponseSchema = z.object({
  user: authUserSchema,
});

const authMeResponseSchema = z.object({
  user: authMeUserSchema,
});

export async function login(body: LoginPayload) {
  const { data } = await http.post<LoginResponse>('/auth/login', body);
  return loginResponseSchema.parse(data);
}

export async function getAuthMe() {
  const { data } = await http.get<AuthMeApiResponse>('/auth/me');
  const user = authMeResponseSchema.parse(data).user;
  return {
    id: user.userId,
    email: user.email,
    name: user.name,
    initials: user.initials,
    role: user.role,
    tenantId: user.tenantId,
    tenantName: user.tenantName,
    permissions: user.permissions,
  };
}

export async function logout() {
  await http.post('/auth/logout');
}
