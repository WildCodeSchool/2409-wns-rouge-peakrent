export type AdType = {
  category: Category;
  created_at: Date;
  id: number;
  location: string;
  owner: string;
  picture: string;
  price: number;
  tags: Tag[];
  description?: string;
  title: string;
  author: string;
};

export type Category = {
  id: number;
  name: string;
  ads?: AdType[];
};

export type Tag = {
  id: number;
  name: string;
  ads?: AdType[];
};

export type ProductType = {
  id: number;
  name: string;
  description: string;
  urlImage: string;
  isPublished: boolean;
  sku: string;
  categories: Category[];
  createdAt: Date;
  updatedAt: Date;
};

export enum RoleType {
  USER = "user",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}
