export type CategoryForm = {
  code: string;
  name: string;
  level: number;
};

export type CategoryItem = {
  id: string;
  code: string;
  name: string;
  level: number;
  parent?: { name?: string };
};

export type CategoriesResponse = {
  data: CategoryItem[];
};
