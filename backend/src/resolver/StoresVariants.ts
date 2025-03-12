import { Resolver, Query, Mutation, Arg } from "type-graphql";
import {
  StoreVariant,
  StoreVariantCreateInput,
  StoreVariantUpdateInput,
} from "../entities/StoreVariant";

@Resolver()
export class StoreVariantResolver {
  @Query(() => [StoreVariant])
  async storeVariants(): Promise<StoreVariant[]> {
    return await StoreVariant.find();
  }

  @Query(() => StoreVariant, { nullable: true })
  async storeVariant(
    @Arg("store_id") store_id: number,
    @Arg("variant_id") variant_id: number
  ): Promise<StoreVariant | null> {
    return await StoreVariant.findOneBy({ store_id, variant_id });
  }

  @Mutation(() => StoreVariant)
  async createStoreVariant(
    @Arg("data") data: StoreVariantCreateInput
  ): Promise<StoreVariant> {
    const newStoreVariant = new StoreVariant();
    Object.assign(newStoreVariant, data);
    await newStoreVariant.save();
    return newStoreVariant;
  }

  @Mutation(() => StoreVariant)
  async updateStoreVariant(
    @Arg("data") data: StoreVariantUpdateInput
  ): Promise<StoreVariant> {
    const storeVariant = await StoreVariant.findOneBy({
      store_id: data.store_id,
      variant_id: data.variant_id,
    });

    if (!storeVariant) throw new Error("StoreVariant not found");

    Object.assign(storeVariant, data);
    await storeVariant.save();
    return storeVariant;
  }

  @Mutation(() => Boolean)
  async deleteStoreVariant(
    @Arg("store_id") store_id: number,
    @Arg("variant_id") variant_id: number
  ): Promise<boolean> {
    const storeVariant = await StoreVariant.findOneBy({ store_id, variant_id });
    if (!storeVariant) return false;

    await storeVariant.remove();
    return true;
  }
}
