import { OrderItem } from "@/gql/graphql";

export function totalPrice(orderItems : OrderItem[]) 
{ return orderItems.reduce(
    (acc, item) =>
      acc +
      (item.pricePerHour / 100) *
        item.quantity *
        getDurationInDays(item.startsAt, item.endsAt),
    0
  );
}