import { OrderItem } from "@/entities/OrderItem";

export function getDurationInDays(
  start: Date | string,
  end: Date | string,
  options: { floor?: boolean } = { floor: true }
): number {
  if (!start || !end) return 0;

  const startDate = new Date(start);
  const endDate = new Date(end);

  const msInDay = 1000 * 60 * 60 * 24;
  const diffInMs = endDate.getTime() - startDate.getTime();
  const rawDays = diffInMs / msInDay + 1;

  if (options?.floor) {
    return Math.max(Math.floor(rawDays), 0);
  }

  const rounded = parseFloat(rawDays.toFixed(2));
  return Math.max(rounded, 0);
}

export const getItemPriceByDates = (orderItem: OrderItem) => {
  return (
    orderItem.pricePerDay *
    orderItem.quantity *
    getDurationInDays(orderItem.startsAt, orderItem.endsAt)
  );
};

export const getTotalOrderPrice = (orderItems: OrderItem[]): number => {
  return orderItems.reduce((sum: number, item: OrderItem) => {
    return sum + getItemPriceByDates(item);
  }, 0);
};
