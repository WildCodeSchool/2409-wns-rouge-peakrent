import { GraphQLError } from "graphql";
import {
  FindOperator,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
} from "typeorm";
import { OrderItem } from "../entities/OrderItem";
import { StoreVariant } from "../entities/StoreVariant";
import { OrderStatusType } from "../types";

export const checkStockByVariantAndStore = async (
  storeId: number,
  variantId: number,
  startingDate?: Date | null,
  endingDate?: Date | null
) => {
  interface WhereClause {
    variant: {
      id: number;
    };
    order: {
      id: number | FindOperator<any>;
      status: OrderStatusType | FindOperator<any>;
    };
    endsAt?: Date | FindOperator<Date>;
    startsAt?: Date | FindOperator<Date>;
  }
  const storeVariant = await StoreVariant.findOne({
    where: {
      storeId,
      variantId,
    },
  });

  if (!storeVariant) {
    throw new GraphQLError("Store Variant not found", {
      extensions: {
        code: "NOT_FOUND",
        entity: "StoreVariant",
      },
    });
  }

  const where: WhereClause = {
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

  const totalOrderItemsQuantity = await OrderItem.sum("quantity", where);

  const availableQuantity =
    Number(storeVariant.quantity) - totalOrderItemsQuantity;
  return availableQuantity > 0 ? availableQuantity : 0;
};
