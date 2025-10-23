import { Order as OrderType } from "@/gql/graphql";
import { computeDiscountUI } from "./PriceAndDays/cartTotals";
import { getPriceFixed } from "./PriceAndDays/getPriceFixed";
import { getTotalOrderPrice } from "./PriceAndDays/getTotalOrderPrice";

export const getOrdersWithDatesAndTotalPrice = (orders: OrderType[]) => {
  return orders.map((order) => {
    const dates = order.orderItems?.map((item) => ({
      start: new Date(item.startsAt),
      end: new Date(item.endsAt),
    }));

    if (!dates) {
      return {
        ...order,
        startsAt: null,
        endsAt: null,
      };
    }

    const startsAt = new Date(
      Math.min(
        ...dates.map((d: { start: Date; end: Date }) => d.start.getTime())
      )
    );
    const endsAt = new Date(
      Math.max(...dates.map((d: { start: Date; end: Date }) => d.end.getTime()))
    );

    const totalPriceTTC = Number(
      getTotalOrderPrice(order.orderItems ?? [], true)
    );

    const totalPriceWithVoucher = Number(
      totalPriceTTC - computeDiscountUI(totalPriceTTC, order.voucher, true)
    );

    return {
      ...order,
      startsAt,
      endsAt,
      totalPriceTTC: getPriceFixed(totalPriceTTC),
      totalPriceWithVoucher: getPriceFixed(totalPriceWithVoucher),
    };
  });
};
