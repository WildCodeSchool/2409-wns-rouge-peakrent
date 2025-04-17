export type CategoryType = {
  id: number;
  name: string;
  description?: string;
  children?: CategoryType[];
  urlImage?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type VariantType = {
  id: number;
  size?: string;
  color?: string;
  pricePerHour: number;
  discount?: number;
};

export type ProductType = {
  id: number;
  name: string;
  description: string;
  discount: number;
  urlImage: string;
  isPublished: boolean;
  sku: string;
  categories: CategoryType[];
  variants: VariantType[];
  createdAt: Date;
  updatedAt: Date;
};

export enum RoleType {
  user = "user",
  admin = "admin",
  superadmin = "superadmin",
}
