import { OrderItem as OrderItemType } from "@/gql/graphql";
import { getDurationInDays } from "./getDurationInDays";

export const getTotalOrderPrice = (orderItems: OrderItemType[]) => {
  return (
    orderItems
      .reduce(
        (acc, item) =>
          acc +
          (item.pricePerHour *
            item.quantity *
            getDurationInDays(item.startsAt, item.endsAt)) /
            100,
        0
      )
      ?.toFixed(2) ?? "0.00"
  );
};
