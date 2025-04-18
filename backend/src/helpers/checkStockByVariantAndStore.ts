import { IsNull, LessThanOrEqual, MoreThanOrEqual, Not } from "typeorm";
import { OrderItem } from "../entities/OrderItem";
import { StoreVariant } from "../entities/StoreVariant";
import { OrderStatusType } from "../types";

export const checkStockByVariantAndStore = async (
  storeId: number,
  variantId: number,
  startingDate?: Date | null,
  endingDate?: Date | null
) => {
  const where: any = {
    variant: { id: variantId },
    order: {
      id: Not(IsNull()),
      status: OrderStatusType.confirmed,
    },
  };

  if (startingDate) {
    where.endsAt = MoreThanOrEqual(startingDate);
  }

  if (endingDate) {
    where.startsAt = LessThanOrEqual(endingDate);
  }

  const orderItemsQuantity = await OrderItem.find({
    where,
    relations: {
      variant: true,
      order: true,
    },
    select: {
      quantity: true,
    },
  });

  const totalOrderItemsQuantity = orderItemsQuantity.reduce(
    (sum, quantity) => sum + Number(quantity),
    0
  );

  const storeVariantQuantity = await StoreVariant.findOne({
    where: {
      storeId,
      variantId,
    },
  });

  const availableQuantity =
    Number(storeVariantQuantity.quantity) - totalOrderItemsQuantity;
  return availableQuantity > 0 ? availableQuantity : 0;
};
