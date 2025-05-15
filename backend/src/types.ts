import { IncomingMessage, ServerResponse } from "http";
import { registerEnumType } from "type-graphql";

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

export enum OrderItemStatusType {
  pending = "pending",
  canceled = "canceled",
  refunded = "refunded",
  distributed = "distributed",
  recovered = "recovered",
}

registerEnumType(OrderItemStatusType, {
  name: "OrderItemStatusType",
  description: "Status of order Items",
});

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
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
