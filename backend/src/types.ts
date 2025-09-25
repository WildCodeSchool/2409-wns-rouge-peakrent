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
  confirmed = "confirmed",
  cancelled = "cancelled",
  refunded = "refunded",
  distributed = "distributed",
  recovered = "recovered",
}

export enum OrderStatusType {
  pending = "pending",
  inProgress = "in_progress",
  confirmed = "confirmed",
  cancelled = "cancelled",
  refunded = "refunded",
  completed = "completed",
  failed = "failed",
}

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

registerEnumType(RoleType, {
  name: "RoleType",
  description: "The role of the user",
});

export enum OrderPaymentType {
  card = "card",
  onSite = "onSite",
}

export enum StripePaymentStatusType {
  RequiresPaymentMethod = "requires_payment_method",
  RequiresConfirmation = "requires_confirmation",
  RequiresAction = "requires_action",
  Processing = "processing",
  RequiresCapture = "requires_capture",
  Canceled = "canceled",
  Succeeded = "succeeded",
  ToBePaid = "ToBePaid",
}

registerEnumType(StripePaymentStatusType, {
  name: "StripePaymentStatusType",
});

registerEnumType(OrderStatusType, {
  name: "OrderStatusType",
});

registerEnumType(OrderPaymentType, {
  name: "orderPaymentType",
});

registerEnumType(OrderItemStatusType, {
  name: "OrderItemStatusType",
  description: "Status of order Items",
});
