export type CategoryType = {
  id: number;
  name: string;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductType = {
  id: number;
  name: string;
  description: string;
  urlImage: string;
  isPublished: boolean;
  sku: string;
  categories: CategoryType[];
  createdAt: Date;
  updatedAt: Date;
};

export enum RoleType {
  USER = "user",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

export type ProfileType = {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CartType = {
  id: number;
  profile?: ProfileType;
  address1: string;
  address2: string;
  country: string;
  city: string;
  zipCode: string;
  createdAt: Date;
  updatedAt: Date;
};

export type StoreType = {
  id: number;
  name: string;
  phoneNumber: string;
  address1: string;
  address2?: string;
  city: string;
  zipCode: string;
  country: string;
  reference: string;
  createdAt: Date;
  updatedAt: Date;
  storeVariants: any[];
};

export type OrderType = any;
export type OrderItemType = any;
