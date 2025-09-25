import { OrderItem as OrderItemType } from "@/gql/graphql";
import { getItemPriceByDates } from "./getPriceByDates";

export const getTotalOrderPrice = (
  orderItems: OrderItemType[],
  filterCancelled: boolean = false
) => {
  const orderItemsFiltered = filterCancelled
    ? orderItems.filter((item) => item.status !== "cancelled")
    : orderItems;

  return orderItemsFiltered
    .reduce((acc, item) => acc + getItemPriceByDates(item), 0)
    ?.toFixed(2);
};
