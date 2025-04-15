import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { IsNull, LessThanOrEqual, MoreThanOrEqual, Not } from "typeorm";
import { OrderItem } from "../entities/OrderItem";
import {
  StoreVariant,
  StoreVariantCreateInput,
  StoreVariantUpdateInput,
} from "../entities/StoreVariant";
import { OrderStatusType } from "../types";

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
    // Récupérer tous les order items des dates indiquées
    const numberOfOrderItems = await OrderItem.count({
      where: {
        variant: { id: variantId },
        startsAt: LessThanOrEqual(endingDate),
        endsAt: MoreThanOrEqual(startingDate),
        order: {
          id: Not(IsNull()),
          status: OrderStatusType.confirmed,
        },
      },
      relations: ["variant", "order"],
    });

    // Récupérer les stocks pour un Magasin
    const storeVariantQuantity = await StoreVariant.findOne({
      where: {
        storeId,
        variantId,
      },
      select: ["quantity"],
    });

    const quantity = storeVariantQuantity ?? 0;
    const variantQuantity = Number(quantity) - numberOfOrderItems;

    return variantQuantity > 0 ? variantQuantity : 0;
  }
}
