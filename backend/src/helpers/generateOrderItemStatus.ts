import { OrderItemStatusType, OrderStatusType } from "@/types";

const statusMap: Record<OrderStatusType, OrderItemStatusType> = {
  pending: OrderItemStatusType.pending,
  in_progress: OrderItemStatusType.distributed,
  confirmed: OrderItemStatusType.confirmed,
  cancelled: OrderItemStatusType.cancelled,
  refunded: OrderItemStatusType.refunded,
  completed: OrderItemStatusType.recovered,
  failed: OrderItemStatusType.cancelled,
};

export const generateOrderItemStatusFromOrderStatus = (
  status: OrderStatusType
): OrderItemStatusType => {
  const itemStatus = statusMap[status];
  if (!itemStatus) {
    throw new Error(`No matching item status for order status: ${status}`);
  }
  return itemStatus;
};
