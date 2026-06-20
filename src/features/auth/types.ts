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

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export type AuthMeApiResponse = {
  user: Omit<AuthUser, 'id'> & { userId: string };
};

export type AuthMeResponse = {
  user: AuthUser;
};
