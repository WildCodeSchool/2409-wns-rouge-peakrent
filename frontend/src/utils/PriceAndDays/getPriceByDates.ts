import { OrderItem } from "@/gql/graphql";
import { getDurationInDays } from "./getDurationInDays";

export const getItemPriceByDates = (orderItem: OrderItem) => {
  return (
    (orderItem.pricePerDay *
      orderItem.quantity *
      getDurationInDays(orderItem.startsAt, orderItem.endsAt)) /
    100
  );
};
