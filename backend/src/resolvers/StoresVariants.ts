import { StoreVariant } from "@/entities/StoreVariant";
import { checkStockByVariantAndStore } from "@/helpers/checkStockByVariantAndStore";
import { Arg, Query, Resolver } from "type-graphql";

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
