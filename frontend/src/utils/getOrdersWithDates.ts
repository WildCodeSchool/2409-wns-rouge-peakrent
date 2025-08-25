import { Order as OrderType } from "@/gql/graphql";

export const getOrdersWithDates = (orders: OrderType[]) => {
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

    return {
      ...order,
      startsAt,
      endsAt,
    };
  });
};
