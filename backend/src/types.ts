import { IncomingMessage, ServerResponse } from "http";
import { registerEnumType } from "type-graphql";

export type AdType = {
  id: number;
  title: string;
  description?: string;
  owner: string;
  price: number;
  picture: string;
  location: string;
  createdAt: string;
};

export type OrderItemType = {
  id: number;
  order: number | null;
  cart: number | null;
  variant: number | null;
  quantity: number;
  pricePerHour: number;
  startsAt: Date;
  endsAt: Date;
  createdAt: Date;
  updatedAt: Date | null;
};

export type Category = {
  id: number;
  name: string;
};

export type TagType = {
  id: number;
  name: string;
};

export type UserType = {
  id: number;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role: RoleType;
};

export type ProfileType = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: RoleType;
  createdAt: Date;
  updatedAt?: Date | null;
};

export type ContextType = {
  req: IncomingMessage;
  res: ServerResponse<IncomingMessage>;
  user: ProfileType | null | undefined;
};

export type AuthContextType = ContextType & { user: ProfileType };

// export type Role = "admin" | "moderator" | "user";

export enum RoleType {
  user = "user",
  admin = "admin",
  superadmin = "superadmin",
}

registerEnumType(RoleType, {
  name: "RoleType",
  description: "The role of the user",
});

export enum OrderStatusType {
  confirmed = "confirmed",
}

export enum OrderPaymentType {
  card = "card",
}

registerEnumType(OrderStatusType, {
  name: "OrderStatusType",
});

registerEnumType(OrderPaymentType, {
  name: "orderPaymentType",
});
