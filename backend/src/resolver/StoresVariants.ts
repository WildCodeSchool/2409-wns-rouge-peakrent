import { Arg, Mutation, Query, Resolver } from "type-graphql";
import {
  StoreVariant,
  StoreVariantCreateInput,
  StoreVariantUpdateInput,
} from "../entities/StoreVariant";
import { checkStockByVariantAndStore } from "../helpers/checkStockByVariantAndStore";

@Resolver()
export class StoreVariantResolver {
  @Query(() => [StoreVariant])
  async storeVariants(): Promise<StoreVariant[]> {
    return await StoreVariant.find();
  }

  @Query(() => StoreVariant, { nullable: true })
  async storeVariant(
    @Arg("storeId") storeId: number,
    @Arg("variantId") variantId: number
  ): Promise<StoreVariant | null> {
    return await StoreVariant.findOneBy({ storeId, variantId });
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
      storeId: data.storeId,
      variantId: data.variantId,
    });

    if (!storeVariant) throw new Error("StoreVariant not found");

    Object.assign(storeVariant, data);
    await storeVariant.save();
    return storeVariant;
  }

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

  @Query(() => Number)
  async checkVariantStock(
    @Arg("storeId") storeId: number,
    @Arg("variantId") variantId: number,
    @Arg("startingDate") startingDate: Date,
    @Arg("endingDate") endingDate: Date
  ): Promise<number> {
    const availableQuantity = checkStockByVariantAndStore(
      storeId,
      variantId,
      startingDate,
      endingDate
    );

    return availableQuantity;
  }
}
