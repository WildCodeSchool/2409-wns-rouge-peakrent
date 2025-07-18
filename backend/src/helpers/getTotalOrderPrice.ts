import { OrderItem } from "@/entities/OrderItem";

export const getTotalOrderPrice = (orderItems: OrderItem[]): number => {
  return orderItems.reduce((sum, item) => {
    const start = new Date(item.startsAt);
    const end = new Date(item.endsAt);
    const durationDays = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    const effectiveDays = durationDays > 0 ? durationDays : 1;

    return sum + effectiveDays * item.pricePerHour * item.quantity;
  }, 0);
};
