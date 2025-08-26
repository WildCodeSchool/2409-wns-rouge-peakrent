import { OrderItem as OrderItemType } from "@/gql/graphql";
import { getDurationInDays } from "./getDurationInDays";

export const getTotalOrderPrice = (
  orderItems: OrderItemType[],
  filterCancelled: boolean = false
) => {
  const orderItemsFiltered = filterCancelled
    ? orderItems.filter((item) => item.status !== "cancelled")
    : orderItems;

  return orderItemsFiltered
    .reduce(
      (acc, item) =>
        acc +
        (item.pricePerHour *
          item.quantity *
          getDurationInDays(item.startsAt, item.endsAt)) /
          100,
      0
    )
    ?.toFixed(2);
};
