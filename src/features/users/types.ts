export type UserInviteForm = {
  email: string;
  roleCode: string;
};

export type UserItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

export type UsersResponse = {
  meta: { total: number };
  data: UserItem[];
};

export type RoleItem = {
  code: string;
  name: string;
};
