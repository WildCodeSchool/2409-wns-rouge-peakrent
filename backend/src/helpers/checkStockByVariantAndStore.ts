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

  const orderItems = await OrderItem.find({
    where,
  });

  const storeVariant = await StoreVariant.findOne({
    where: {
      storeId,
      variantId,
    },
  });

  if (storeVariant === null) {
    throw new Error("Store Variant not found");
  }

  if (orderItems.length === 0) {
    return storeVariant.quantity;
  }

  const totalOrderItemsQuantity = orderItems.reduce(
    (sum, orderItem) => sum + Number(orderItem.quantity),
    0
  );

  const availableQuantity =
    Number(storeVariant.quantity) - totalOrderItemsQuantity;
  return availableQuantity > 0 ? availableQuantity : 0;
};
