/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any; }
};

export type Cart = {
  __typename?: 'Cart';
  address1?: Maybe<Scalars['String']['output']>;
  address2?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  profile?: Maybe<Profile>;
  updatedAt: Scalars['DateTimeISO']['output'];
  zipCode?: Maybe<Scalars['String']['output']>;
};

export type CartCreateInput = {
  address1?: InputMaybe<Scalars['String']['input']>;
  address2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  profileId: Scalars['Int']['input'];
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type CartUpdateInput = {
  address1?: InputMaybe<Scalars['String']['input']>;
  address2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  profileId?: InputMaybe<Scalars['Int']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type Category = {
  __typename?: 'Category';
  children?: Maybe<Array<Category>>;
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy: User;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  normalizedName: Scalars['String']['output'];
  parentCategory?: Maybe<Category>;
  products?: Maybe<Array<Product>>;
  updatedAt: Scalars['DateTimeISO']['output'];
  urlImage: Scalars['String']['output'];
};

export type CategoryCreateInput = {
  name: Scalars['String']['input'];
  urlImage: Scalars['String']['input'];
};

export type CategoryUpdateInput = {
  name: Scalars['String']['input'];
  urlImage: Scalars['String']['input'];
};

export type CategoryWithCount = {
  __typename?: 'CategoryWithCount';
  category: Category;
  pagination: Pagination;
  products: Array<Product>;
};

export type IdInput = {
  id: Scalars['ID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCart: Cart;
  createCategory: Category;
  createOrder: Order;
  createOrderItems: OrderItem;
  createProduct: Product;
  createStore: Store;
  createStoreVariant: StoreVariant;
  createUser: User;
  createVariant: Variant;
  deleteCart?: Maybe<Cart>;
  deleteCategory?: Maybe<Category>;
  deleteOrder?: Maybe<Order>;
  deleteOrderItems?: Maybe<OrderItem>;
  deleteProduct?: Maybe<Product>;
  deleteStore?: Maybe<Store>;
  deleteStoreVariant: Scalars['Boolean']['output'];
  deleteVariant?: Maybe<Variant>;
  signIn?: Maybe<User>;
  signOut: Scalars['Boolean']['output'];
  updateCart?: Maybe<Cart>;
  updateCategory?: Maybe<Category>;
  updateOrder?: Maybe<Order>;
  updateOrderItems?: Maybe<OrderItem>;
  updateProduct: Product;
  updateStore: Store;
  updateStoreVariant: StoreVariant;
  updateVariant?: Maybe<Variant>;
  validateCart?: Maybe<Cart>;
};


export type MutationCreateCartArgs = {
  data: CartCreateInput;
};


export type MutationCreateCategoryArgs = {
  data: CategoryCreateInput;
};


export type MutationCreateOrderArgs = {
  data: OrderCreateInput;
};


export type MutationCreateOrderItemsArgs = {
  data: OrderItemsCreateInput;
};


export type MutationCreateProductArgs = {
  data: ProductCreateInput;
};


export type MutationCreateStoreArgs = {
  data: StoreCreateInput;
};


export type MutationCreateStoreVariantArgs = {
  data: StoreVariantCreateInput;
};


export type MutationCreateUserArgs = {
  data: UserCreateInput;
};


export type MutationCreateVariantArgs = {
  data: VariantCreateInput;
};


export type MutationDeleteCartArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOrderItemsArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteStoreArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteStoreVariantArgs = {
  storeId: Scalars['Float']['input'];
  variantId: Scalars['Float']['input'];
};


export type MutationDeleteVariantArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSignInArgs = {
  datas: SignInInput;
};


export type MutationUpdateCartArgs = {
  data: CartUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateCategoryArgs = {
  data: CategoryUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateOrderArgs = {
  data: OrderUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateOrderItemsArgs = {
  data: OrderItemsUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateProductArgs = {
  data: ProductUpdateInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateStoreArgs = {
  data: StoreUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateStoreVariantArgs = {
  data: StoreVariantUpdateInput;
};


export type MutationUpdateVariantArgs = {
  data: VariantUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationValidateCartArgs = {
  data: ValidateCartInput;
  id: Scalars['ID']['input'];
};

export type Order = {
  __typename?: 'Order';
  address1: Scalars['String']['output'];
  address2?: Maybe<Scalars['String']['output']>;
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  paidAt?: Maybe<Scalars['DateTimeISO']['output']>;
  paymentMethod: OrderPaymentType;
  profile: Profile;
  reference: Scalars['String']['output'];
  status: OrderStatusType;
  updatedAt: Scalars['DateTimeISO']['output'];
  zipCode: Scalars['String']['output'];
};

export type OrderCreateInput = {
  address1: Scalars['String']['input'];
  address2?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  paidAt?: InputMaybe<Scalars['DateTimeISO']['input']>;
  paymentMethod: Scalars['String']['input'];
  profileId: Scalars['Int']['input'];
  reference: Scalars['String']['input'];
  zipCode: Scalars['String']['input'];
};

export type OrderItem = {
  __typename?: 'OrderItem';
  cart?: Maybe<Cart>;
  createdAt: Scalars['DateTimeISO']['output'];
  endsAt: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  order?: Maybe<Order>;
  pricePerHour: Scalars['Float']['output'];
  quantity: Scalars['Float']['output'];
  startsAt: Scalars['DateTimeISO']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  variant?: Maybe<Variant>;
};

export type OrderItemsCreateInput = {
  cartId?: InputMaybe<Scalars['Int']['input']>;
  endsAt: Scalars['DateTimeISO']['input'];
  orderId?: InputMaybe<Scalars['Int']['input']>;
  pricePerHour: Scalars['Int']['input'];
  profileId: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
  startsAt: Scalars['DateTimeISO']['input'];
  variantId: Scalars['Int']['input'];
};

export type OrderItemsUpdateInput = {
  cartId?: InputMaybe<Scalars['Int']['input']>;
  endsAt?: InputMaybe<Scalars['DateTimeISO']['input']>;
  orderId?: InputMaybe<Scalars['Int']['input']>;
  pricePerHour?: InputMaybe<Scalars['Int']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  startsAt?: InputMaybe<Scalars['DateTimeISO']['input']>;
  variantId?: InputMaybe<Scalars['Int']['input']>;
};

export enum OrderStatusType {
  Confirmed = 'confirmed'
}

export type OrderUpdateInput = {
  address1?: InputMaybe<Scalars['String']['input']>;
  address2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  paidAt?: InputMaybe<Scalars['DateTimeISO']['input']>;
  paymentMethod?: InputMaybe<Scalars['String']['input']>;
  profileId?: InputMaybe<Scalars['Int']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type Pagination = {
  __typename?: 'Pagination';
  currentPage: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Product = {
  __typename?: 'Product';
  categories?: Maybe<Array<Category>>;
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy: User;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isPublished: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  normalizedName: Scalars['String']['output'];
  sku: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  urlImage: Scalars['String']['output'];
  variants?: Maybe<Array<Variant>>;
};

export type ProductCreateInput = {
  categories?: InputMaybe<Array<IdInput>>;
  description?: InputMaybe<Scalars['String']['input']>;
  isPublished: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  sku: Scalars['String']['input'];
  urlImage: Scalars['String']['input'];
};

export type ProductUpdateInput = {
  categories?: InputMaybe<Array<IdInput>>;
  description?: InputMaybe<Scalars['String']['input']>;
  isPublished: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  sku: Scalars['String']['input'];
  urlImage: Scalars['String']['input'];
};

export type ProductWithCount = {
  __typename?: 'ProductWithCount';
  pagination: Pagination;
  products: Array<Product>;
};

export type Profile = {
  __typename?: 'Profile';
  createdAt: Scalars['DateTimeISO']['output'];
  email: Scalars['String']['output'];
  firstname: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastname: Scalars['String']['output'];
  role: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type Query = {
  __typename?: 'Query';
  getCart: Array<Cart>;
  getCartById: Cart;
  getCartByProfile?: Maybe<Cart>;
  getCarts: Array<Cart>;
  getCategories: Array<Category>;
  getCategoryById?: Maybe<CategoryWithCount>;
  getOrderById: Order;
  getOrderItems: Array<OrderItem>;
  getOrderItemsByCartId: Array<OrderItem>;
  getOrderItemsById: OrderItem;
  getOrderItemsByOrderId: Array<OrderItem>;
  getOrders: Array<Order>;
  getProductById?: Maybe<Product>;
  getProducts: ProductWithCount;
  getProductsAndCategories: Search;
  getProfile?: Maybe<Profile>;
  getProfileByUserId?: Maybe<Profile>;
  getProfiles?: Maybe<Array<Profile>>;
  getStoreById?: Maybe<Store>;
  getStores: Array<Store>;
  getVariantById?: Maybe<Variant>;
  getVariants: Array<Variant>;
  storeVariant?: Maybe<StoreVariant>;
  storeVariants: Array<StoreVariant>;
  whoami?: Maybe<Profile>;
};


export type QueryGetCartByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetCartByProfileArgs = {
  profileId: Scalars['Int']['input'];
};


export type QueryGetCategoryByIdArgs = {
  onPage?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
  param: Scalars['String']['input'];
};


export type QueryGetOrderByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetOrderItemsByCartIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetOrderItemsByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetOrderItemsByOrderIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetProductByIdArgs = {
  param: Scalars['String']['input'];
};


export type QueryGetProductsArgs = {
  onPage?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
};


export type QueryGetProductsAndCategoriesArgs = {
  searchTerm: Scalars['String']['input'];
};


export type QueryGetProfileByUserIdArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetStoreByIdArgs = {
  param: Scalars['String']['input'];
};


export type QueryGetVariantByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStoreVariantArgs = {
  storeId: Scalars['Float']['input'];
  variantId: Scalars['Float']['input'];
};

export type Search = {
  __typename?: 'Search';
  categories: Array<Category>;
  products: Array<Product>;
};

export type SignInInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Store = {
  __typename?: 'Store';
  address1: Scalars['String']['output'];
  address2?: Maybe<Scalars['String']['output']>;
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  reference: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  zipCode: Scalars['String']['output'];
};

export type StoreCreateInput = {
  address1: Scalars['String']['input'];
  address2?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  reference: Scalars['String']['input'];
  zipCode: Scalars['String']['input'];
};

export type StoreUpdateInput = {
  address1: Scalars['String']['input'];
  address2?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  reference: Scalars['String']['input'];
  zipCode: Scalars['String']['input'];
};

export type StoreVariant = {
  __typename?: 'StoreVariant';
  quantity: Scalars['Int']['output'];
  storeId: Scalars['Int']['output'];
  variantId: Scalars['Int']['output'];
};

export type StoreVariantCreateInput = {
  quantity?: Scalars['Int']['input'];
  storeId: Scalars['Int']['input'];
  variantId: Scalars['Int']['input'];
};

export type StoreVariantUpdateInput = {
  quantity?: InputMaybe<Scalars['Int']['input']>;
  storeId: Scalars['Int']['input'];
  variantId: Scalars['Int']['input'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTimeISO']['output'];
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  email: Scalars['String']['output'];
  emailSentAt?: Maybe<Scalars['DateTimeISO']['output']>;
  emailToken?: Maybe<Scalars['String']['output']>;
  emailVerifiedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  firstname: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastname: Scalars['String']['output'];
  recoverSentAt?: Maybe<Scalars['DateTimeISO']['output']>;
  recoverToken?: Maybe<Scalars['String']['output']>;
  role: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type UserCreateInput = {
  confirmPassword: Scalars['String']['input'];
  email: Scalars['String']['input'];
  firstname: Scalars['String']['input'];
  lastname: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type ValidateCartInput = {
  paymentMethod: Scalars['String']['input'];
  reference: Scalars['String']['input'];
};

export type Variant = {
  __typename?: 'Variant';
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy: User;
  id: Scalars['ID']['output'];
  pricePerHour: Scalars['Int']['output'];
  product: Product;
  size?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type VariantCreateInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  pricePerHour: Scalars['Int']['input'];
  productId: Scalars['Int']['input'];
  size?: InputMaybe<Scalars['String']['input']>;
};

export type VariantUpdateInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  pricePerHour?: InputMaybe<Scalars['Int']['input']>;
  productId: Scalars['Int']['input'];
  size?: InputMaybe<Scalars['String']['input']>;
};

export enum OrderPaymentType {
  Card = 'card'
}

export type GetCartByProfileQueryVariables = Exact<{
  profileId: Scalars['Int']['input'];
}>;


export type GetCartByProfileQuery = { __typename?: 'Query', getCartByProfile?: { __typename?: 'Cart', id: string } | null };


export const GetCartByProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCartByProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCartByProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"profileId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profileId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetCartByProfileQuery, GetCartByProfileQueryVariables>;