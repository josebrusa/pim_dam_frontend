export type ProductForm = {
  code: string;
  name: string;
};

export type ProductItem = {
  id: string;
  code: string;
  name: string;
  category?: { name?: string };
  status: string;
};

export type ProductsResponse = {
  data: ProductItem[];
};

export type ProductListParams = {
  status?: string;
};
