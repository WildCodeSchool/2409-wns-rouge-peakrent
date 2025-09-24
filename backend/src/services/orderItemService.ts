import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { OrderItemStatusType, OrderStatusType } from "../types";

export const updateOrderStatusFromOrderItem = async (
  updatedOrderItem: OrderItem
): Promise<void> => {
  if (!updatedOrderItem.orderId) {
    return;
  }

  const order = await Order.findOne({
    where: { id: updatedOrderItem.orderId },
    relations: ["orderItems"],
  });

  if (!order || !order.orderItems || order.orderItems.length === 0) {
    return;
  }

  const items = order.orderItems;

  const itemsWithThis = items.map((it) => {
    if (it.id === updatedOrderItem.id) {
      return { ...it, ...updatedOrderItem };
    }
    return it;
  });

  const allRecovered = itemsWithThis.every(
    (it) => it.status === OrderItemStatusType.recovered
  );
  const allCancelled = itemsWithThis.every(
    (it) => it.status === OrderItemStatusType.cancelled
  );
  const allRefunded = itemsWithThis.every(
    (it) => it.status === OrderItemStatusType.refunded
  );
  const anyPending = itemsWithThis.some(
    (it) => it.status === OrderItemStatusType.pending
  );
  const anyInProgress = itemsWithThis.some(
    (it) => it.status === OrderItemStatusType.distributed
  );
  const allPending = itemsWithThis.every(
    (it) => it.status === OrderItemStatusType.pending
  );

  let nextStatus: OrderStatusType;
  if (allRecovered) {
    nextStatus = OrderStatusType.completed;
  } else if (allCancelled) {
    nextStatus = OrderStatusType.cancelled;
  } else if (allRefunded) {
    nextStatus = OrderStatusType.refunded;
  } else if (anyPending) {
    nextStatus = OrderStatusType.pending;
  } else if (anyInProgress) {
    nextStatus = OrderStatusType.inProgress;
  } else {
    nextStatus = OrderStatusType.confirmed;
  }

  // A vérifier
  if (allPending) {
    order.paidAt = null;
    await order.save();
  }

  if (order.status !== nextStatus) {
    order.status = nextStatus;
    await order.save();
  }
};
