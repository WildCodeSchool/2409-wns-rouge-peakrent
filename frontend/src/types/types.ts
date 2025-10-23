import { Variant } from "@/gql/graphql";

export enum RoleType {
  user = "user",
  admin = "admin",
  superadmin = "superadmin",
}

export type VariantWithQuantityType = Variant & {
  quantity: number;
};
