import { OrderItem } from "@/entities/OrderItem";

export const getTotalOrderPrice = (orderItems: OrderItem[]) => {
  return orderItems.reduce((sum, item) => {
    const start = new Date(item.startsAt);
    const end = new Date(item.endsAt);
    const durationHours =
      Math.round(end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return sum + item.pricePerHour * durationHours * item.quantity;
  }, 0);
};
