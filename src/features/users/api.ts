import { http } from '@/shared/api/http';
import type { RoleItem, UserInviteForm, UserUpdateForm, UsersResponse } from './types';

export async function getUsers() {
  const { data } = await http.get<UsersResponse>('/users');
  return data;
}

export async function getRoles() {
  const { data } = await http.get<RoleItem[]>('/roles');
  return data;
}

export async function inviteUser(body: UserInviteForm) {
  return http.post('/users/invitations', body);
}

export async function updateUser(id: string, body: UserUpdateForm) {
  return http.patch(`/users/${id}`, body);
}

export async function deleteUser(id: string) {
  return http.delete(`/users/${id}`);
}

export async function exportUsersJob() {
  return http.post('/exports', { type: 'users' });
}
