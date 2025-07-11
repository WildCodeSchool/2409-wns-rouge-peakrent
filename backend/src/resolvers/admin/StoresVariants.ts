import {
  StoreVariant,
  StoreVariantCreateInputAdmin,
  StoreVariantUpdateInputAdmin,
} from "@/entities/StoreVariant";
import { RoleType } from "@/types";
import { Arg, Authorized, Mutation, Resolver } from "type-graphql";

@Resolver()
export class StoreVariantResolverAdmin {
  @Authorized([RoleType.admin, RoleType.superadmin])
  @Mutation(() => StoreVariant)
  async createStoreVariant(
    @Arg("data") data: StoreVariantCreateInputAdmin
  ): Promise<StoreVariant> {
    const newStoreVariant = new StoreVariant();
    Object.assign(newStoreVariant, data);
    await newStoreVariant.save();
    return newStoreVariant;
  }

  @Authorized([RoleType.admin, RoleType.superadmin])
  @Mutation(() => StoreVariant)
  async updateStoreVariant(
    @Arg("data") data: StoreVariantUpdateInputAdmin
  ): Promise<StoreVariant> {
    const storeVariant = await StoreVariant.findOneBy({
      storeId: data.storeId,
      variantId: data.variantId,
    });

    if (!storeVariant) throw new Error("StoreVariant not found");

    Object.assign(storeVariant, data);
    await storeVariant.save();
    return storeVariant;
  }

  @Authorized([RoleType.admin, RoleType.superadmin])
  @Mutation(() => Boolean)
  async deleteStoreVariant(
    @Arg("storeId") storeId: number,
    @Arg("variantId") variantId: number
  ): Promise<boolean> {
    const storeVariant = await StoreVariant.findOneBy({ storeId, variantId });
    if (!storeVariant) return false;

    await storeVariant.remove();
    return true;
  }
}
