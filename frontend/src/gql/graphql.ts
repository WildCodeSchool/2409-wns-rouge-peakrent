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

export type ActivitiesWithCount = {
  __typename?: 'ActivitiesWithCount';
  activities: Array<Activity>;
  pagination?: Maybe<Pagination>;
};

export type Activity = {
  __typename?: 'Activity';
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy: User;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  normalizedName: Scalars['String']['output'];
  products?: Maybe<Array<Product>>;
  updatedAt: Scalars['DateTimeISO']['output'];
  urlImage: Scalars['String']['output'];
  variant: Scalars['String']['output'];
};

export type ActivityCreateInputAdmin = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  urlImage: Scalars['String']['input'];
  variant: Scalars['String']['input'];
};

export type ActivityPaginationInput = {
  onPage?: Scalars['Int']['input'];
  order?: Scalars['String']['input'];
  page?: Scalars['Int']['input'];
  sort?: Scalars['String']['input'];
};

export type ActivityUpdateInputAdmin = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  urlImage: Scalars['String']['input'];
  variant: Scalars['String']['input'];
};

export type Cart = {
  __typename?: 'Cart';
  address1?: Maybe<Scalars['String']['output']>;
  address2?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  orderItems?: Maybe<Array<OrderItem>>;
  profile?: Maybe<Profile>;
  updatedAt: Scalars['DateTimeISO']['output'];
  zipCode?: Maybe<Scalars['String']['output']>;
};

export type CartUpdateInput = {
  address1?: InputMaybe<Scalars['String']['input']>;
  address2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type CartUpdateInputAdmin = {
  address1?: InputMaybe<Scalars['String']['input']>;
  address2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  profileId?: InputMaybe<Scalars['Int']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type CategoriesWithCount = {
  __typename?: 'CategoriesWithCount';
  categories: Array<Category>;
  pagination?: Maybe<Pagination>;
};

export type Category = {
  __typename?: 'Category';
  childrens?: Maybe<Array<Category>>;
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy: User;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  normalizedName: Scalars['String']['output'];
  parentCategory?: Maybe<Category>;
  products?: Maybe<Array<Product>>;
  updatedAt: Scalars['DateTimeISO']['output'];
  variant: Scalars['String']['output'];
};

export type CategoryCreateInputAdmin = {
  childrens?: InputMaybe<Array<CategoryCreateInputAdmin>>;
  id?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  variant: Scalars['String']['input'];
};

export type CategoryPaginationInput = {
  onPage?: Scalars['Int']['input'];
  onlyParent?: Scalars['Boolean']['input'];
  order?: Scalars['String']['input'];
  page?: Scalars['Int']['input'];
  sort?: Scalars['String']['input'];
};

export type CategoryUpdateInputAdmin = {
  childrens?: InputMaybe<Array<CategoryCreateInputAdmin>>;
  id?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  variant: Scalars['String']['input'];
};

export type CreateUserInputAdmin = {
  email: Scalars['String']['input'];
  firstname: Scalars['String']['input'];
  lastname: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role?: InputMaybe<RoleType>;
};

export type DateRangeInput = {
  from: Scalars['DateTimeISO']['input'];
  to: Scalars['DateTimeISO']['input'];
};

export type IdInput = {
  id: Scalars['ID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  cancelOrderItemForOrderAdmin?: Maybe<OrderItem>;
  createActivityAdmin: Activity;
  createCategoryAdmin: Category;
  createOrderAdmin: Order;
  createOrderItems: OrderItem;
  createOrderItemsAdmin: OrderItem;
  createOrderWithItemsAdmin: Order;
  createProductAdmin: Product;
  createProductWithVariantsAdmin: Product;
  createStoreAdmin: Store;
  createStoreVariant: StoreVariant;
  createUser: User;
  createUserByAdmin: Profile;
  deleteActivitiesAdmin?: Maybe<Array<Scalars['ID']['output']>>;
  deleteActivityAdmin?: Maybe<Activity>;
  deleteCategoriesAdmin?: Maybe<Array<Scalars['ID']['output']>>;
  deleteCategoryAdmin?: Maybe<Category>;
  deleteOrderAdmin?: Maybe<Order>;
  deleteOrderItemForCart?: Maybe<OrderItem>;
  deleteOrderItemsCart?: Maybe<Array<Scalars['ID']['output']>>;
  deleteProductAdmin?: Maybe<Product>;
  deleteStore?: Maybe<Store>;
  deleteStoreVariant: Scalars['Boolean']['output'];
  signIn?: Maybe<User>;
  signOut: Scalars['Boolean']['output'];
  updateActivityAdmin?: Maybe<Activity>;
  updateCart?: Maybe<Cart>;
  updateCartAdmin: Cart;
  updateCategoryAdmin?: Maybe<Category>;
  updateOrderAdmin?: Maybe<Order>;
  updateOrderItem?: Maybe<OrderItem>;
  updateOrderItemAdmin?: Maybe<OrderItem>;
  updateProductAdmin?: Maybe<Product>;
  updateStore: Store;
  updateStoreVariant: StoreVariant;
  updateUserByAdmin: Profile;
  updateUserProfile: Profile;
  validateCart?: Maybe<Order>;
};


export type MutationCancelOrderItemForOrderAdminArgs = {
  orderId: Scalars['ID']['input'];
  orderItemId: Scalars['ID']['input'];
};


export type MutationCreateActivityAdminArgs = {
  data: ActivityCreateInputAdmin;
};


export type MutationCreateCategoryAdminArgs = {
  data: CategoryCreateInputAdmin;
};


export type MutationCreateOrderAdminArgs = {
  data: OrderCreateInputAdmin;
};


export type MutationCreateOrderItemsArgs = {
  data: OrderItemsCreateInput;
};


export type MutationCreateOrderItemsAdminArgs = {
  data: OrderItemsCreateInputAdmin;
};


export type MutationCreateOrderWithItemsAdminArgs = {
  data: OrderCreateInputAdmin;
  items: Array<OrderItemsFormInputAdmin>;
};


export type MutationCreateProductAdminArgs = {
  data: ProductCreateInputAdmin;
};


export type MutationCreateProductWithVariantsAdminArgs = {
  productData: ProductCreateInputAdmin;
  variants?: InputMaybe<Array<VariantCreateNestedInputAdmin>>;
};


export type MutationCreateStoreAdminArgs = {
  data: StoreCreateInputAdmin;
};


export type MutationCreateStoreVariantArgs = {
  data: StoreVariantCreateInputAdmin;
};


export type MutationCreateUserArgs = {
  data: UserCreateInput;
};


export type MutationCreateUserByAdminArgs = {
  data: CreateUserInputAdmin;
};


export type MutationDeleteActivitiesAdminArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteActivityAdminArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCategoriesAdminArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteCategoryAdminArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOrderAdminArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOrderItemForCartArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductAdminArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteStoreArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteStoreVariantArgs = {
  storeId: Scalars['Float']['input'];
  variantId: Scalars['Float']['input'];
};


export type MutationSignInArgs = {
  datas: SignInInput;
};


export type MutationUpdateActivityAdminArgs = {
  data: ActivityUpdateInputAdmin;
  id: Scalars['ID']['input'];
};


export type MutationUpdateCartArgs = {
  data: CartUpdateInput;
};


export type MutationUpdateCartAdminArgs = {
  data: CartUpdateInputAdmin;
  id: Scalars['ID']['input'];
};


export type MutationUpdateCategoryAdminArgs = {
  data: CategoryUpdateInputAdmin;
  id: Scalars['ID']['input'];
};


export type MutationUpdateOrderAdminArgs = {
  data: OrderUpdateInputAdmin;
  id: Scalars['ID']['input'];
};


export type MutationUpdateOrderItemArgs = {
  data: OrderItemsUpdateInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateOrderItemAdminArgs = {
  data: OrderItemsUpdateInputAdmin;
  id: Scalars['ID']['input'];
};


export type MutationUpdateProductAdminArgs = {
  data: ProductUpdateInputAdmin;
  id: Scalars['String']['input'];
};


export type MutationUpdateStoreArgs = {
  data: StoreUpdateInputAdmin;
  id: Scalars['ID']['input'];
};


export type MutationUpdateStoreVariantArgs = {
  data: StoreVariantUpdateInputAdmin;
};


export type MutationUpdateUserByAdminArgs = {
  data: UpdateUserInputAdmin;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUserProfileArgs = {
  data: UserUpdateProfileInput;
};


export type MutationValidateCartArgs = {
  data: ValidateCartInput;
};

export type Order = {
  __typename?: 'Order';
  address1: Scalars['String']['output'];
  address2?: Maybe<Scalars['String']['output']>;
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  date: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  orderItems?: Maybe<Array<OrderItem>>;
  paidAt?: Maybe<Scalars['DateTimeISO']['output']>;
  paymentMethod: OrderPaymentType;
  phone?: Maybe<Scalars['String']['output']>;
  profile: Profile;
  reference: Scalars['String']['output'];
  status: OrderStatusType;
  updatedAt: Scalars['DateTimeISO']['output'];
  zipCode: Scalars['String']['output'];
};

export type OrderCreateInputAdmin = {
  address1: Scalars['String']['input'];
  address2?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  date: Scalars['DateTimeISO']['input'];
  paidAt?: InputMaybe<Scalars['DateTimeISO']['input']>;
  paymentMethod: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  profileId: Scalars['Int']['input'];
  reference?: InputMaybe<Scalars['String']['input']>;
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
  status: OrderItemStatusType;
  updatedAt: Scalars['DateTimeISO']['output'];
  variant: Variant;
};

/** Status of order Items */
export enum OrderItemStatusType {
  Cancelled = 'cancelled',
  Distributed = 'distributed',
  Pending = 'pending',
  Recovered = 'recovered',
  Refunded = 'refunded'
}

export type OrderItemsCreateInput = {
  cartId?: InputMaybe<Scalars['Int']['input']>;
  endsAt: Scalars['DateTimeISO']['input'];
  orderId?: InputMaybe<Scalars['Int']['input']>;
  pricePerHour: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
  startsAt: Scalars['DateTimeISO']['input'];
  variantId: Scalars['Int']['input'];
};

export type OrderItemsCreateInputAdmin = {
  cartId?: InputMaybe<Scalars['Int']['input']>;
  endsAt: Scalars['DateTimeISO']['input'];
  orderId?: InputMaybe<Scalars['Int']['input']>;
  pricePerHour: Scalars['Int']['input'];
  profileId: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
  startsAt: Scalars['DateTimeISO']['input'];
  variantId: Scalars['Int']['input'];
};

export type OrderItemsFormInputAdmin = {
  date_range: DateRangeInput;
  pricePerHour: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
  status?: InputMaybe<OrderItemStatusType>;
  variant: Scalars['Int']['input'];
};

export type OrderItemsUpdateInput = {
  endsAt?: InputMaybe<Scalars['DateTimeISO']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  startsAt?: InputMaybe<Scalars['DateTimeISO']['input']>;
};

export type OrderItemsUpdateInputAdmin = {
  cartId?: InputMaybe<Scalars['Int']['input']>;
  endsAt?: InputMaybe<Scalars['DateTimeISO']['input']>;
  orderId?: InputMaybe<Scalars['Int']['input']>;
  pricePerHour?: InputMaybe<Scalars['Int']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  startsAt?: InputMaybe<Scalars['DateTimeISO']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  variantId?: InputMaybe<Scalars['Int']['input']>;
};

export enum OrderStatusType {
  Cancelled = 'cancelled',
  Completed = 'completed',
  Confirmed = 'confirmed',
  Pending = 'pending',
  Refunded = 'refunded'
}

export type OrderUpdateInputAdmin = {
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
  activities?: Maybe<Array<Activity>>;
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

export type ProductCreateInputAdmin = {
  activities?: InputMaybe<Array<IdInput>>;
  categories?: InputMaybe<Array<IdInput>>;
  description?: InputMaybe<Scalars['String']['input']>;
  isPublished: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  sku: Scalars['String']['input'];
  urlImage: Scalars['String']['input'];
};

export type ProductUpdateInputAdmin = {
  activities?: InputMaybe<Array<IdInput>>;
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
  checkVariantStock: Scalars['Float']['output'];
  getActivities: ActivitiesWithCount;
  getActivityById?: Maybe<Activity>;
  getActivityByNormalizedName?: Maybe<Activity>;
  getCart?: Maybe<Cart>;
  getCartByIdAdmin: Cart;
  getCarts: Array<Cart>;
  getCategories: CategoriesWithCount;
  getCategoryById?: Maybe<Category>;
  getMyOrders: Array<Order>;
  getMyProfile?: Maybe<Profile>;
  getOrderById: Order;
  getOrderItems: Array<OrderItem>;
  getOrderItemsByCartId: Array<OrderItem>;
  getOrderItemsById: OrderItem;
  getOrderItemsByOrderIdAdmin: Array<OrderItem>;
  getOrdersAdmin: Array<Order>;
  getProductById?: Maybe<Product>;
  getProductByVariantId?: Maybe<Product>;
  getProducts: ProductWithCount;
  getProductsAndCategories: Search;
  getProfile?: Maybe<Profile>;
  getProfileByUserId?: Maybe<Profile>;
  getProfilesAdmin?: Maybe<Array<Profile>>;
  getStoreById?: Maybe<Store>;
  getStores: Array<Store>;
  getVariantById?: Maybe<Variant>;
  getVariants: Array<Variant>;
  storeVariant?: Maybe<StoreVariant>;
  storeVariants: Array<StoreVariant>;
  whoami?: Maybe<Profile>;
};


export type QueryCheckVariantStockArgs = {
  endingDate: Scalars['DateTimeISO']['input'];
  startingDate: Scalars['DateTimeISO']['input'];
  storeId: Scalars['Float']['input'];
  variantId: Scalars['Float']['input'];
};


export type QueryGetActivitiesArgs = {
  data: ActivityPaginationInput;
};


export type QueryGetActivityByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetActivityByNormalizedNameArgs = {
  normalizedName: Scalars['String']['input'];
};


export type QueryGetCartArgs = {
  withOrderItems?: Scalars['Boolean']['input'];
};


export type QueryGetCartByIdAdminArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetCategoriesArgs = {
  data: CategoryPaginationInput;
};


export type QueryGetCategoryByIdArgs = {
  id: Scalars['ID']['input'];
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


export type QueryGetOrderItemsByOrderIdAdminArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetProductByIdArgs = {
  param: Scalars['String']['input'];
};


export type QueryGetProductByVariantIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetProductsArgs = {
  activityIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  categoryIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  endingDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
  onPage?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  startingDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
};


export type QueryGetProductsAndCategoriesArgs = {
  searchTerm: Scalars['String']['input'];
};


export type QueryGetProfileByUserIdArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetProfilesAdminArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
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

/** The role of the user */
export enum RoleType {
  Admin = 'admin',
  Superadmin = 'superadmin',
  User = 'user'
}

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

export type StoreCreateInputAdmin = {
  address1: Scalars['String']['input'];
  address2?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  reference: Scalars['String']['input'];
  zipCode: Scalars['String']['input'];
};

export type StoreUpdateInputAdmin = {
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

export type StoreVariantCreateInputAdmin = {
  quantity?: Scalars['Int']['input'];
  storeId: Scalars['Int']['input'];
  variantId: Scalars['Int']['input'];
};

export type StoreVariantUpdateInputAdmin = {
  quantity?: InputMaybe<Scalars['Int']['input']>;
  storeId: Scalars['Int']['input'];
  variantId: Scalars['Int']['input'];
};

export type UpdateUserInputAdmin = {
  email: Scalars['String']['input'];
  firstname: Scalars['String']['input'];
  lastname: Scalars['String']['input'];
  role: RoleType;
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

export type UserUpdateProfileInput = {
  firstname: Scalars['String']['input'];
  lastname: Scalars['String']['input'];
};

export type ValidateCartInput = {
  paymentMethod: Scalars['String']['input'];
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

export type VariantCreateNestedInputAdmin = {
  color?: InputMaybe<Scalars['String']['input']>;
  pricePerHour: Scalars['Int']['input'];
  size?: InputMaybe<Scalars['String']['input']>;
};

export enum OrderPaymentType {
  Card = 'card',
  OnSite = 'onSite'
}

export type WhoamiQueryVariables = Exact<{ [key: string]: never; }>;


export type WhoamiQuery = { __typename?: 'Query', whoami?: { __typename?: 'Profile', id: string } | null };


export const WhoamiDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Whoami"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"whoami"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<WhoamiQuery, WhoamiQueryVariables>;